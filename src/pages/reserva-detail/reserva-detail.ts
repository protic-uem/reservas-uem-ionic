import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CustomReserva} from '../reserva-list/reserva-list';
@IonicPage()
@Component({
  selector: 'page-reserva-detail',
  templateUrl: 'reserva-detail.html',
})
export class ReservaDetailPage {

  private reserva:CustomReserva;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.reserva = this.navParams.get('item');
  }


  ionViewDidLoad() {

  }

}
