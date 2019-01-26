import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { SalaGraphql } from '../../model/Sala.graphql';
import { getSalasPorDepartamento, getSalasDisponiveisDepartamentoDiaPeriodoTipo } from '../../graphql/sala/sala-json';


@Injectable()
export class SalaServiceProvider extends ConexaoProvider{

  private salas:Array<SalaGraphql>;
  constructor(public http: HttpClient) {
    super();

    this.salas = new Array<SalaGraphql>();

  }


  //carrega todas as salas refereten a um determinado departamento
  async carregarSalaPorDepartamento(id_departamento: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.salas = new Array<SalaGraphql>();

        return await new Promise((resolve, reject) => {
            this.http.post(this.baseUri+'graphql', getSalasPorDepartamento(id_departamento), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
              if(result.errors){
                reject(result.errors[0].message);
              }else{
                this.salas = result.data.salasPorDepartamento;
                resolve(this.salas);
              }
          });
        });

          /*this.http.get(this.baseUri+'sala/buscaPorDepartamento/?id_departamento='
                    +btoa(id_departamento+""), {headers: this.headersToken}).subscribe((result:any) => {
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
        });*/

  }


  //carrega todas as disponiveis para aquele departamento naquele determinado dia e periodo
  async carregarDisponiveisPorDepartamentoDiaPeriodoTipo(id_departamento: number, data_reserva: string, periodo: number, tipo_uso:string){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.salas = new Array<SalaGraphql>();

    id_departamento = parseInt(""+id_departamento);
    periodo = parseInt(""+periodo);

    return await new Promise((resolve, reject) => {
        this.http.post(this.baseUri+'graphql', getSalasDisponiveisDepartamentoDiaPeriodoTipo(id_departamento, data_reserva, periodo, tipo_uso), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.salas = result.data.salasDisponiveisPorDepartamentoDiaPeriodo;
            resolve(this.salas);
          }
      });
    });


        /*return new Promise((resolve, reject) => {

            let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});


          this.http.get(this.baseUri+'sala/bucaDisponiveisPorDepartamentoDiaPeriodoTipo/?id_departamento='
                    +btoa(id_departamento+"")+'&data='+btoa(data_reserva+"")+'&periodo='+btoa(periodo+"")+
                  '&tipo='+tipo_uso, {headers: headers}).subscribe((result:any) => {
            if(result.retorno == "false"){
              resolve(new Sala());
            }
            else{
              if(result.dados.length>0){
                let tamanho = result.dados.length;
                for(var i = 0;i<tamanho;i++){
                  /*this.salas.push(new Sala(
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
        });*/



  }


}
