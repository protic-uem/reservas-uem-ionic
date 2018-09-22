import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
/*

*/
@Injectable()
export class ReservaServiceProvider extends ConexaoProvider{

  constructor(public http: HttpClient) {
    super();
  }

  //carrega todas as reservas refereten a um determinado usuário
  carregarReservaPorUsuario(id_usuario: number){
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUri+'/reserva/carregarReservaPorUsuario/'+id_usuario.toString())
        .subscribe((result:any) => {
          resolve(result.json());
        },
        (error) => {
          reject(error.json());
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
