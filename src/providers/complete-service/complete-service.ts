import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AutoCompleteService} from 'ionic2-auto-complete';
import { Reserva } from '../../model/Reserva';
import { CustomReserva } from '../../pages/reserva-list/reserva-list';
@Injectable()
export class CompleteServiceProvider implements AutoCompleteService{
  labelAttribute = "sala";

  private reservas:Array<CustomReserva>;
  private reservasCarregadas:Array<CustomReserva>;

  constructor(public http: HttpClient) {

    this.reservas = new Array();
    this.reservasCarregadas = new Array();

  }

  getResults(keyword:string) {
    this.getItems(keyword);
    return this.reservas;
  }

  getItems(searchbar) {
    this.updateReservas();

    this.reservas = this.reservasCarregadas.filter(item => item.sala.toLowerCase().startsWith(searchbar.toLowerCase()))
  }

  getReservas(){
    return this.reservas;
  }

  updateReservas(){
  if(this.reservasCarregadas.length == 0)
    this.reservasCarregadas = [new CustomReserva('Estrutura de dados', 'Sala 10', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Alan Lopes'),
      new CustomReserva('Estrutura de dados', 'Sala 02', 'DIN','15/09/2018 19:30-21:10', 'CANCELADO', 'Alisson Lopes'),
      new CustomReserva('Fundamentos de Algoritmos', 'LIN 1', 'DIN','05/09/2018 19:30-21:10', 'PENDENTE', 'Wesley Romão'),
      new CustomReserva('Grafos', 'Sala 105', 'DIN','20/09/2018 19:30-21:10', 'REJEITADO', 'Mamoru'),
      new CustomReserva('Análise de Algoritmos', 'Sala 102', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Diego Fernandes'),
      new CustomReserva('Banco de dados 1', 'LIN 2', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Alan Lopes'),
      new CustomReserva('Banco de dados 2', 'Sala 04', 'DIN','25/09/2018 19:30-21:10', 'CANCELADO', 'Alan Lopes'),
      new CustomReserva('Arquitetura de computadores', 'Sala 101', 'DIN','25/09/2018 19:30-21:10', 'REJEITADO', 'Alan Lopes'),
      new CustomReserva('PAA', 'Sala 200', 'DIN','25/09/2018 19:30-21:10', 'REJEITADO', 'Alan Lopes')];
  }

}
