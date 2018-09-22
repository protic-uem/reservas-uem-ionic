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

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.reservas = [new CustomReserva('Estrutura de dados', 'Sala 10', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Alan Lopes'),
    new CustomReserva('Estrutura de dados', 'Sala 02', 'DIN','15/09/2018 19:30-21:10', 'CANCELADO', 'Alisson Lopes'),
    new CustomReserva('Fundamentos de Algoritmos', 'LIN 1', 'DIN','05/09/2018 19:30-21:10', 'PENDENTE', 'Wesley Romão'),
    new CustomReserva('Grafos', 'Sala 105', 'DIN','20/09/2018 19:30-21:10', 'REJEITADO', 'Mamoru'),
    new CustomReserva('Análise de Algoritmos', 'Sala 102', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Diego Fernandes'),
    new CustomReserva('Banco de dados 1', 'LIN 2', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Alan Lopes'),
    new CustomReserva('Banco de dados 2', 'Sala 04', 'DIN','25/09/2018 19:30-21:10', 'CANCELADO', 'Alan Lopes'),
    new CustomReserva('Arquitetura de computadores', 'Sala 101', 'DIN','25/09/2018 19:30-21:10', 'REJEITADO', 'Alan Lopes'),
    new CustomReserva('PAA', 'Sala 200', 'DIN','25/09/2018 19:30-21:10', 'REJEITADO', 'Alan Lopes')];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservaMyPage');
  }

}
