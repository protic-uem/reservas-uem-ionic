import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//Páginas
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
//Provedores
import {CompleteServiceProvider} from '../../providers/complete-service/complete-service';
import {AutoCompleteComponent} from 'ionic2-auto-complete';

@IonicPage()
@Component({
  selector: 'page-reserva-list',
  templateUrl: 'reserva-list.html',
})
export class ReservaListPage {

  @ViewChild('searchbar') searchbar: AutoCompleteComponent;

  private reservas:Array<CustomReserva>;
  private reservasCarregadas:Array<CustomReserva>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private complete:CompleteServiceProvider) {
  }

  ionViewDidLoad() {
    this.reservas = [new CustomReserva('LIN 1', false, 'DIN','Alan Lopes'), new CustomReserva('LIN 2', false, 'DIN','Maria da Silva'),
      new CustomReserva('121', false, 'DIN','Ricardo da Silva'), new CustomReserva('112', false, 'DIN','Rodrigo Ferrari'), new CustomReserva('02', false, 'DIN'),
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

      this.reservasCarregadas = this.reservas;
  }


  openReserva(event, reserva:CustomReserva){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }

  itemSelecionadoPeloAutocomplete(evento:any){
    let dado = this.searchbar.getValue();//pega a descricao da reserva selecionada e coloca em dado
    this.reservas = this.reservasCarregadas.filter(item => item.descricao.toLowerCase().startsWith(dado.toLowerCase()));
  }


}

export class CustomReserva{
  descricao: string;
  dept: string;
  ativo: boolean;
  usuario: string;

  constructor(descricao?:string, ativo?:boolean, dept?:string, usuario?:string){
    this.descricao = descricao;
    this.ativo = ativo;
    this.dept = dept;
    this.usuario = usuario;
  }
}
