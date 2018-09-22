import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';

/*
  Classe responsável pela comunicação com a API referente ao serviço de login
*/


@Injectable()
export class LoginServiceProvider extends ConexaoProvider{

  constructor(public http: HttpClient) {
    super();
  }

  //realiza o login do usuário na aplicação
  login(email:string, senha:string) {
    return new Promise((resolve, reject) => {
      var login = {
         email:email,
         senha:senha
      };
      this.http.post(this.baseUri+'/login', login)
        .subscribe((result:any) => {
          resolve(result.json());
        },
        (error) => {
          reject(error.json());
          });
        });
      }

}
