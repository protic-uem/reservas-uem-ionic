import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { ReservaView } from '../../model/ReservaView';
/*

*/
@Injectable()
export class ReservaServiceProvider extends ConexaoProvider{

  private reservas:Array<ReservaView>;

  constructor(public http: HttpClient) {
    super();
    this.reservas = new Array<ReservaView>();
  }

  //carrega todas as reservas refereten a um determinado usuário
  carregarReservaPorUsuario(id_usuario: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaView>();

  return new Promise((resolve, reject) => {
    this.http.get(this.baseUri+'reserva/buscaPorUsuario/'+this.hash+'&id_usuario='
              +btoa(id_usuario+"")).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaView());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.reservas.push(new ReservaView(
                              result.dados[i].nome_departamento,
                              result.dados[i].nome_usuario,
                              result.dados[i].nome_disciplina,
                              result.dados[i].codigo_disciplina,
                              result.dados[i].turma_disciplina,
                              result.dados[i].numero_sala,
                              result.dados[i].tipo_sala,
                              result.dados[i].tipo_uso,
                              result.dados[i].tipo_reserva,
                              result.dados[i].data_reserva,
                              result.dados[i].periodo,
                              result.dados[i].status
                              ));
                            }
        }


              resolve(this.reservas);
        }
      },
      (error) => {
        console.log("carregarReservaPorUsuario error");
        reject(error);

      });
  });
  }

  //carrega todas as reservas com base no dia
  carregarReservaPorData(data:string, id_dept: number){
  //zera a lista sempre que fazer a busca para evitar valores duplicados
  this.reservas = new Array<ReservaView>();

return new Promise((resolve, reject) => {
  this.http.get(this.baseUri+'reserva/buscaPorDepartamentoData/'+this.hash+'&data='
            +btoa(data+"")+'&id_departamento='+btoa(id_dept+"")).subscribe((result:any) => {
    if(result.retorno == "false"){
      resolve(new ReservaView());
    }
    else{
      if(result.dados.length>0){
        let tamanho = result.dados.length;
        for(var i = 0;i<tamanho;i++){
          this.reservas.push(new ReservaView(
                            result.dados[i].nome_departamento,
                            result.dados[i].nome_usuario,
                            result.dados[i].nome_disciplina,
                            result.dados[i].codigo_disciplina,
                            result.dados[i].turma_disciplina,
                            result.dados[i].numero_sala,
                            result.dados[i].tipo_sala,
                            result.dados[i].tipo_uso,
                            result.dados[i].tipo_reserva,
                            result.dados[i].data_reserva,
                            result.dados[i].periodo,
                            result.dados[i].status
                            ));
                          }
      }

            resolve(this.reservas);
      }
    },
    (error) => {
      console.log("carregarReservaPorData error");
      reject(error);

        });
    });
  }

  //atualiza uma determianda reserva
  atualizarReserva(encapsula){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    /*return new Promise((resolve, reject) => {
      this.http.put(this.baseUri+'reserva/alterarReserva', JSON.stringify(encapsula), { headers: headers })
        .subscribe((result:any) => {
          resolve(result.json());
        },
        (error) => {
          reject(error.json());
          });
        });*/

  }

}
