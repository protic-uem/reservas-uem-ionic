import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { ReservaUsuario } from '../../model/ReservaUsuario';
/*

*/
@Injectable()
export class ReservaServiceProvider extends ConexaoProvider{

  private reservas:Array<ReservaUsuario>;

  constructor(public http: HttpClient) {
    super();
    this.reservas = new Array<ReservaUsuario>();
  }

  //carrega todas as reservas refereten a um determinado usuário
  carregarReservaPorUsuario(id_usuario: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaUsuario>();

  return new Promise((resolve, reject) => {
    this.http.get(this.baseUri+'GetMinhasReservas/'+this.hash+'&id_usuario='
              +btoa(id_usuario+"")).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaUsuario());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.reservas.push(new ReservaUsuario(result.dados[i].id,
                              result.dados[i].data_reserva,
                              result.dados[i].periodo,
                              result.dados[i].id_sala,
                              result.dados[i].status,
                              result.dados[i].codigo_disciplina,
                              result.dados[i].nome_disciplina,
                              result.dados[i].numero_sala,
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
  carregarReservaPorDia(dia:string, id_dept: number){
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUri+'/reserva/carregarReservaPorDia/'+dia+'/'+id_dept)
        .subscribe((result:any) => {
          resolve(result.json());
        },
        (error) => {
          reject(error.json());
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
