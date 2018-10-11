import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { Departamento } from '../../model/Departamento';

@Injectable()
export class DepartamentoServiceProvider extends ConexaoProvider{


  private departamentos:Array<Departamento>;

  constructor(public http: HttpClient) {
    super();
    this.departamentos = new Array<Departamento>();
  }

  //Busca todos os departamentos da base de dados
  carregarTodosDepartamentos(){
    this.departamentos = new Array<Departamento>();
    var url = this.baseUri+'departamento/todos/'+this.hash;

  return new Promise((resolve, reject) => {
    this.http.get(url).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new Departamento());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            console.log("nome:"+result.dados[i].nome);
            this.departamentos.push(new Departamento(
                              result.dados[i].id,
                              result.dados[i].nome,
                              result.dados[i].descricao,
                              result.dados[i].status
                              ));
                            }
        }


              resolve(this.departamentos);
        }
      },
      (error) => {
        console.log("carregarTodosDepartamentos error");
        reject(error);

          });
      });
      }
}
