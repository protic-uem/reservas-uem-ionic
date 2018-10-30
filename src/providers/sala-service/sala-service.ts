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


  //carrega todas as disponiveis para aquele departamento naquele determinado dia e periodo
  carregarDisponiveisPorDepartamentoDiaPeriodoTipo(id_departamento: number, data_reserva: string, periodo: number, tipo_uso:string){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.salas = new Array<Sala>();
    console.log("tipo_uso:"+tipo_uso);
        return new Promise((resolve, reject) => {
          this.http.get(this.baseUri+'sala/bucaDisponiveisPorDepartamentoDiaPeriodoTipo/'+this.hash+'&id_departamento='
                    +btoa(id_departamento+"")+'&data='+btoa(data_reserva+"")+'&periodo='+btoa(periodo+"")+
                  '&tipo='+tipo_uso).subscribe((result:any) => {
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
              console.log("carregarDisponiveisPorDepartamentoDiaPeriodo error");
              reject(error);

            });
        });



  }


}
