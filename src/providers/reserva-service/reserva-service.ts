import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { minhasReservas, reservasTelaHome, cadastrarReserva, validarReservaMesmoHorario, reservasTelaSearch, cancelarReserva } from '../../graphql/reserva/reserva-json';
import { reservaInput } from '../../graphql/reserva/reservaInput';


@Injectable()
export class ReservaServiceProvider extends ConexaoProvider{

   reservas:Array<ReservaGraphql>;
   reserva:ReservaGraphql;
   
  constructor(public http: HttpClient) {
    super();
    this.reservas = new Array<ReservaGraphql>();
    this.reserva = new ReservaGraphql();
  }

  //carrega todas as reservas refereten a um determinado usuário
  async carregarReservaPorUsuario(id_usuario: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaGraphql>();

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, minhasReservas(id_usuario), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.reservas = result.data.minhasReservas;
            resolve(this.reservas);
          }
      });
    });
  }


  //carrega todas as reservas refereten a um determinado usuário
  async carregarMinhasReservas(id_usuario: number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaGraphql>();

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, minhasReservas(id_usuario), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.reservas = result.data.minhasReservas;
            resolve(this.reservas);
          }
      });
    });
  }

  //carrega todas com base no departamento,  data e periodo
  async carregarReservasTelaHome(id_departamento: number, data:string, periodo:number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaGraphql>();
    id_departamento = parseInt(id_departamento+"");
    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, reservasTelaHome(id_departamento, data, periodo), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.reservas = result.data.reservasTelaHome;
            resolve(this.reservas);
          }
      });
    });
  }



  //carrega todas as reservas com base no dia
  carregarReservaPorData(data:string, id_dept: number){
  //zera a lista sempre que fazer a busca para evitar valores duplicados
  this.reservas = new Array<ReservaGraphql>();

    return new Promise((resolve, reject) => {

        let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

      this.http.get(this.baseUri+'reserva/buscaPorDepartamentoData/'+this.hash+'&data='
                +btoa(data+"")+'&id_departamento='+btoa(id_dept+""), {headers: headers}).subscribe((result:any) => {
        if(result.retorno == "false"){
          resolve(new ReservaGraphql());
        }
        else{
          if(result.dados.length>0){
            let tamanho = result.dados.length;
            for(var i = 0;i<tamanho;i++){
     
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


  carregarReservaPorDataSala(data:string, id_dept: number, id_sala:number){
  //zera a lista sempre que fazer a busca para evitar valores duplicados
  this.reservas = new Array<ReservaGraphql>();

    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

      this.http.get(this.baseUri+'reserva/buscaPorDepartamentoDataSala/?data='
                +btoa(data+"")+'&id_departamento='+btoa(id_dept+"")+'&id_sala='+btoa(id_sala+""), {headers: headers}).subscribe((result:any) => {
        if(result.retorno == "false"){
          resolve(new ReservaGraphql());
        }
        else{
          if(result.dados.length>0){
            let tamanho = result.dados.length;
            for(var i = 0;i<tamanho;i++){
       
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


  //Carrega todas as reservas e preenche a tela de search
  async carregarReservasTelaSearch(data:string, id_departamento: number, id_sala:number){
  //zera a lista sempre que fazer a busca para evitar valores duplicados
  this.reservas = new Array<ReservaGraphql>();

    id_departamento = parseInt(id_departamento+"");
    id_sala = parseInt(id_sala+"");

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, reservasTelaSearch(id_departamento, id_sala, data), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.reservas = result.data.reservasTelaSearch;
            resolve(this.reservas);
          }
      });
    });
  }

  //Valida se já existe uma reserva no mesma data e horário para aquela reserva
  async validarReservaMesmoHorario(id_usuario:number, data:string, periodo:number){

      id_usuario = parseInt(id_usuario+"");
      periodo = parseInt(periodo+"");

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, validarReservaMesmoHorario(id_usuario, data, periodo), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            resolve(result.data.validarReservaMesmoHorario);
          }
      });
    });
  }


  async cadastrarReserva(reserva:ReservaGraphql){

    reserva.departamento.id = parseInt(reserva.departamento.id+"");
    reserva.periodo = parseInt(reserva.periodo+"");
    if(reserva.disciplina != undefined)
      reserva.disciplina.id = parseInt(reserva.disciplina.id+"");
    reserva.usuario.id = parseInt(reserva.usuario.id+"");
    reserva.sala.id = parseInt(reserva.sala.id+"");

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, cadastrarReserva(reservaInput(reserva)), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.reserva = result.data.createReserva;
            resolve(this.reserva);
          }
      });
    });
  }


  async cancelarReserva(reserva:ReservaGraphql){

    var id = parseInt(reserva.id+"");

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, cancelarReserva(id), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            resolve(result.data.cancelarReserva);
          }
      });
    });

  }

}
