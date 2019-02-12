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

  /*return new Promise((resolve, reject) => {

    let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

    this.http.get(this.baseUri+'reserva/buscaPorUsuario/?id_usuario='
              +btoa(id_usuario+""), {headers: headers}).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaView());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            /*this.reservas.push(new ReservaView(
                              result.dados[i].id,
                              result.dados[i].nome_departamento,
                              result.dados[i].id_usuario,
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
  });*/
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

  /*return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

    this.http.get(this.baseUri+'reserva/minhasReservas/?id_usuario='
              +btoa(id_usuario+""), {headers: headers}).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaView());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.reservas.push(new ReservaView(
                              result.dados[i].id,
                              result.dados[i].nome_departamento,
                              result.dados[i].id_usuario,
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
  });*/
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
  
    /*return new Promise((resolve, reject) => {

    let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

    this.http.get(this.baseUri+'reserva/carregarReservasTelaHome/?id_departamento='
              +btoa(id_departamento+"")+'&data='+btoa(data)+'&periodo='+btoa(periodo+""), {headers: headers}).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaGraphql());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.reservas.push(new ReservaView(
                              result.dados[i].id,
                              result.dados[i].nome_departamento,
                              result.dados[i].id_usuario,
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
        console.log("carregarReservasTelaHome error");
        reject(error);

      });
  });*/
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
              /*this.reservas.push(new ReservaView(
                                result.dados[i].id,
                                result.dados[i].nome_departamento,
                                result.dados[i].id_usuario,
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
                                ));*/
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
              /*this.reservas.push(new ReservaView(
                                result.dados[i].id,
                                result.dados[i].nome_departamento,
                                result.dados[i].id_usuario,
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
                                ));*/
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

    /*return new Promise((resolve, reject) => {
        let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

      this.http.get(this.baseUri+'reserva/carregarReservasTelaSearch/?data='
                +btoa(data+"")+'&id_departamento='+btoa(id_dept+"")+'&id_sala='+btoa(id_sala+""), {headers: headers}).subscribe((result:any) => {
        if(result.retorno == "false"){
          resolve(new ReservaView());
        }
        else{
          if(result.dados.length>0){
            let tamanho = result.dados.length;
            for(var i = 0;i<tamanho;i++){
              /*this.reservas.push(new ReservaView(
                                result.dados[i].id,
                                result.dados[i].nome_departamento,
                                result.dados[i].id_usuario,
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
        });*/
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


    /*return new Promise((resolve, reject) => {
        let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

      this.http.get(this.baseUri+'reserva/validarReservaMesmoHorario/?id_usuario='+btoa(id_usuario+"")+
      '&data='+btoa(data+"")+'&periodo='+btoa(periodo+""), {headers: headers}).subscribe((result:any) => {
        if(result.retorno == false){
            resolve(false);
        }
        else{
            resolve(true);
          }
        },
        (error) => {
          console.log("validarReservaMesmoHorario error");
          reject(error);

            });
        });*/
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



      /*return new Promise((resolve, reject) => {

        var item = {
          id_departamento: reserva.id_departamento,
          id_usuario: reserva.id_usuario,
          id_disciplina: reserva.id_disciplina,
          tipo_uso: reserva.tipo_uso,
          tipo_reserva: reserva.tipo_reserva,
          data_solicitacao: reserva.data_solicitacao,
          data_reserva: reserva.data_reserva,
          periodo: reserva.periodo,
          id_sala: reserva.id_sala,
          status: reserva.status
        };


        let headers = new HttpHeaders({'Content-Type':'application/json', 'x-access-token':ConexaoProvider.token});

        this.http.post(this.baseUri+'reserva/solicitarReserva/', JSON.stringify(item),
        { headers: headers})
          .subscribe((result:any) => {

            resolve(result.retorno);

          },
          (error) => {
            console.log("cadastrarReserva error");
            reject(error);

          });
      });*/
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

      /*return new Promise((resolve, reject) => {
        var item = {
          id: reserva.id
        };
        let headers = new HttpHeaders({'Content-Type':'application/json', 'x-access-token':ConexaoProvider.token});
        
        this.http.put(this.baseUri+'reserva/cancelarReserva/', JSON.stringify(item),
        { headers: headers})
          .subscribe((result:any) => {
            resolve(result);
          },
          (error) => {
            console.log("cancelarReserva error");
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
