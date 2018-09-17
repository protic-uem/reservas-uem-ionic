import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AutoCompleteService} from 'ionic2-auto-complete';
import { Reserva } from '../../model/Reserva';
import { CustomReserva } from '../../pages/reserva-list/reserva-list';
@Injectable()
export class CompleteServiceProvider implements AutoCompleteService{
  labelAttribute = "descricao";

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

    this.reservas = this.reservasCarregadas.filter(item => item.descricao.toLowerCase().startsWith(searchbar.toLowerCase()))
  }

  getReservas(){
    return this.reservas;
  }

  updateReservas(){
  if(this.reservasCarregadas.length == 0)
    this.reservasCarregadas = [new CustomReserva('LIN 1', false, 'DIN'), new CustomReserva('LIN 2', false, 'DIN'),
      new CustomReserva('121', false, 'DIN'), new CustomReserva('112', false, 'DIN'), new CustomReserva('02', false, 'DIN'),
      new CustomReserva('10', false, 'DIN'), new CustomReserva('04', false, 'DIN'),
      new CustomReserva('Lab. 03', false, 'DIN'), new CustomReserva('Reserva9', false, 'DIN'),
      new CustomReserva('Reserva10', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),
      new CustomReserva('Reserva1', false, 'DIN'), new CustomReserva('Reserva2', false, 'DIN'),];
  }

}
