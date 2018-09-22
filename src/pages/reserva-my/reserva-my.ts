import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { CustomReserva } from '../reserva-list/reserva-list';

@IonicPage()
@Component({
  selector: 'page-reserva-my',
  templateUrl: 'reserva-my.html',
})
export class ReservaMyPage {

  private reservas:Array<CustomReserva>;
  private reservasCarregadas:Array<CustomReserva>;

  statusSelecionado:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.reservas = [new CustomReserva('Estrutura de dados', 'Sala 10', 'DIN','25/09/2018', 'ACEITO', 'Alan Lopes', 'Prática', 'Eventual', '07:45-08:20,08:20-09:10,19:30-21:10,21:10-22:00 ', 'C56'),
  new CustomReserva('Estrutura de dados', 'Sala 02', 'DIN','15/09/2018', 'CANCELADO', 'Alisson Lopes', 'Teórica', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('Fundamentos de Algoritmos', 'LIN 1', 'DIN','05/09/2018', 'PENDENTE', 'Wesley Romão', 'Defesa', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('Grafos', 'Sala 105', 'DIN','20/09/2018', 'REJEITADO', 'Mamoru' , 'Prática', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('Análise de Algoritmos', 'Sala 102', 'DIN','25/09/2018', 'ACEITO', 'Diego Fernandes' , 'Prática', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('Banco de dados 1', 'LIN 2', 'DIN','25/09/2018', 'ACEITO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('Banco de dados 2', 'Sala 04', 'DIN','25/09/2018', 'CANCELADO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('Arquitetura de computadores', 'Sala 101', 'DIN','25/09/2018', 'REJEITADO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'C56'),
  new CustomReserva('PAA', 'Sala 200', 'DIN','25/09/2018', 'REJEITADO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'C56')];

  this.reservasCarregadas = this.reservas;

  }

  ionViewDidLoad() {

  }

  statusMudado(event){
    if(event == 'TODOS'){
      this.reservas = this.reservasCarregadas;
    }
    else{
      this.reservas = this.reservasCarregadas.filter(item => item.status.toLowerCase().startsWith(event.toString().toLowerCase()))
    }
  }

}
