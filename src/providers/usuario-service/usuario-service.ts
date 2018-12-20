import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { Usuario } from '../../model/Usuario';



@Injectable()
export class UsuarioServiceProvider extends ConexaoProvider{


  usuarios:Array<Usuario>;

  constructor(public http: HttpClient) {
    super();
    this.usuarios = new Array<Usuario>();
  }

  //retorna todos usuários Docentes da base de dados
  carregarTodosDocentesPorDepartamento(id_deprtamento: number){
  //zera a lista sempre que fazer a busca para evitar valores duplicados
  this.usuarios = new Array<Usuario>();
        return new Promise((resolve, reject) => {

          let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

          this.http.get(this.baseUri+'usuario/todosPorDepartamento/?id_departamento='+btoa(id_deprtamento+""), {headers: headers})
          .subscribe((result:any) => {
            if(result.retorno == "false"){
              resolve(new Usuario());
            }
            else{
              if(result.dados.length>0){
                let tamanho = result.dados.length;
                for(var i = 0;i<tamanho;i++){
                  this.usuarios.push(new Usuario(
                                    result.dados[i].id,
                                    result.dados[i].id_departamento,
                                    result.dados[i].nome,
                                    result.dados[i].email,
                                    result.dados[i].telefone,
                                    result.dados[i].privilegio
                                    ));
                                  }
              }


                    resolve(this.usuarios);
              }
            },
            (error) => {
              console.log("retornarTodosDocente error");
              reject(error);

            });
        });
  }

}
