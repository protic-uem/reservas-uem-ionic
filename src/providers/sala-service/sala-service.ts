import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { Sala } from '../../model/Sala';


@Injectable()
export class SalaServiceProvider extends ConexaoProvider{

  private salas:Array<Sala>;
  constructor(public http: HttpClient) {
    super();

    this.salas = new Array<Sala>();

  }

  //carrega todas as salas refereten a um determinado departamento
  carregarSalaPorDepartamento(id_departamento: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.salas = new Array<Sala>();

  return new Promise((resolve, reject) => {
    this.http.get(this.baseUri+'sala/buscaPorDepartamento/'+this.hash+'&id_departamento='
              +btoa(id_departamento+"")).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new Sala());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.salas.push(new Sala(
                              result.dados[i].id,
                              result.dados[i].id_departamento,
                              result.dados[i].numero,
                              result.dados[i].descricao,
                              result.dados[i].tipo,
                              result.dados[i].status,
                              result.dados[i].capacidade
                              ));
                            }
        }


              resolve(this.salas);
        }
      },
      (error) => {
        console.log("carregarSalaPorDepartamento error");
        reject(error);

      });
  });



  }


}
