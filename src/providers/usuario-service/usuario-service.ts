import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { UsuarioGraphql } from '../../model/Usuario.graphql';
import { getUsuariosPorDepartamento } from '../../graphql/usuario/usuario-json';



@Injectable()
export class UsuarioServiceProvider extends ConexaoProvider{


  usuarios:Array<UsuarioGraphql>;

  constructor(public http: HttpClient) {
    super();
    this.usuarios = new Array<UsuarioGraphql>();
  }

  //retorna todos usuários Docentes da base de dados
  async carregarTodosDocentesPorDepartamento(id_departamento: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.usuarios = new Array<UsuarioGraphql>();

    id_departamento = parseInt(id_departamento+"");

    return await new Promise((resolve, reject) => {
        this.http.post(this.baseUri+'graphql', getUsuariosPorDepartamento(id_departamento), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.usuarios = result.data.usuariosPorDepartamento;
            resolve(this.usuarios);
          }
      });
    });

        /*return new Promise((resolve, reject) => {

          let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

          this.http.get(this.baseUri+'usuario/todosPorDepartamento/?id_departamento='+btoa(id_deprtamento+""), {headers: headers})
          .subscribe((result:any) => {
            if(result.retorno == "false"){
              resolve(new UsuarioGraphql());
            }
            else{
              if(result.dados.length>0){
                let tamanho = result.dados.length;
                for(var i = 0;i<tamanho;i++){
                  this.usuarios.push(new UsuarioGraphql(
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
        });*/
  }

}
