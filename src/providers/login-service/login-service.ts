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
    console.log("usuario:" + btoa(email));
    console.log("senha:" + btoa(senha));

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
                console.log("USUARIO", usuario.email);

                resolver(usuario);
              }
            });
        })
        .catch(error => {
          reject(error.message);
        });
    });

    /*let doLogin = new Promise((resolve, reject) => {

            var login = {
               email:btoa(email),
               senha:btoa(senha)
            };
            
          let headers = new HttpHeaders({'Content-Type':'application/json'});

          //JSON.stringify(login) usuario/login
          this.http.post(this.baseUri, createNewToken(email, senha), { headers: headers}).subscribe((result:any) => {
            if(result.errors){
              reject(result.errors[0].message);
            }else{
              ConexaoProvider.token = result.data.createToken.token;
            }
            
            if(result.retorno == false){
              resolve(new Login());
            }
            else{
              ConexaoProvider.token = result.token;
              resolve(new Login(result.dados[0].id,
                                result.dados[0].nome,
                                result.dados[0].email,
                                result.dados[0].telefone,
                                result.dados[0].id_departamento,
                                result.dados[0].privilegio,
                                result.dados[0].status));
              }
            },
            (error) => {
              reject(error.message);

            });
        });

        return this.promiseTimeout.promiseTimeout(60000, doLogin);*/
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

    /*new Promise((resolve, reject) => {
          this.http.get(this.baseUri+'usuario/logout').subscribe((result:any) => {
              resolve();
            },
            (error) => {
              reject(error.message);
            });
          });*/
  }
}
