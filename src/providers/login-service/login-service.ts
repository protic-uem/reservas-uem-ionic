import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { Login } from '../../model/Login';

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

      confirmLogin(email: string, senha: string){
        console.log("usuario:"+btoa(email));
        console.log("senha:"+btoa(senha));
        return new Promise((resolve, reject) => {
          this.http.get(this.baseUri+'VerificarUsuario/'+this.hash+'&email='
                    +btoa(email)+'&senha='+btoa(senha)).subscribe((result:any) => {
            if(result.retorno == false){
              resolve(new Login());
            }
            else{
              resolve(new Login(result.dados[0].id,
                                result.dados[0].nome,
                                result.dados[0].telefone,
                                result.dados[0].id_departamento,
                                result.dados[0].privilegio,
                                result.dados[0].status));
              }
            },
            (error) => {
              console.log("Login error");
              reject(error);

            });
        });
      }

}
