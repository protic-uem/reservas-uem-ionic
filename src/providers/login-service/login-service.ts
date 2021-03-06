import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConexaoProvider } from "../conexao/conexao";
import { TimeoutPromise } from "../../util/timeout-promise";
import { createNewToken, deleteToken } from "../../graphql/token/token-json";
import { getCurrentUsuario } from "../../graphql/usuario/usuario-json";
import { UsuarioGraphql } from "../../model/Usuario.graphql";

/*
  Classe responsável pela comunicação com a API referente ao serviço de login
*/

@Injectable()
export class LoginServiceProvider extends ConexaoProvider {
  constructor(public http: HttpClient, private promiseTimeout: TimeoutPromise) {
    super();
  }

  //realiza o login do usuário na aplicação
  login(email: string, senha: string) {
    let doLogin = new Promise((resolve, reject) => {
      var login = {
        email: email,
        senha: senha
      };
      this.http.post(this.baseUri + "/login", login).subscribe(
        (result: any) => {
          resolve(result.json());
        },
        error => {
          reject(error.json());
        }
      );
    });

    return this.promiseTimeout.promiseTimeout(doLogin, 60000);
  }

  async confirmLogin(email: string, senha: string) {
    return await new Promise((resolver, reject) => {
      this.getToken(email, senha)
        .then(() => {
          let headers = new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: "Bearer " + ConexaoProvider.token
          });
          this.http
            .post(this.baseUri, getCurrentUsuario(), { headers: headers })
            .subscribe((result: any) => {
              if (result.errors) {
                reject(result.errors[0].message);
              } else {
                var usuario: UsuarioGraphql = result.data.currentUsuario;
                resolver(usuario);
              }
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  async getToken(email: string, senha: string) {
    return await new Promise((resolve, reject) => {
      this.http
        .post(this.baseUri, createNewToken(email, senha), {
          headers: this.headers
        })
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            ConexaoProvider.token = result.data.createToken.token;
            console.log("TOKEN", ConexaoProvider.token);
            ConexaoProvider.headersToken = new HttpHeaders({
              "Content-Type": "application/json",
              Authorization: "Bearer " + ConexaoProvider.token
            });
            resolve(ConexaoProvider.token);
          }
        });
    });
  }

  async logout() {
    return await new Promise((resolve, reject) => {
      this.http
        .post(this.baseUri, deleteToken(), { headers: this.headers })
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            ConexaoProvider.token = result.data.deleteToken.token;
            ConexaoProvider.headersToken = new HttpHeaders({
              "Content-Type": "application/json",
              Authorization: "Bearer " + ConexaoProvider.token
            });
            resolve(ConexaoProvider.token);
          }
        });
    });
  }
}
