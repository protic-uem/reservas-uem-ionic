import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Páginas
import { CustomReserva } from '../../pages/reserva-list/reserva-list';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';

@Component({
  selector: 'ioncard-reserva-my',
  templateUrl: 'ioncard-reserva-my.html'
})
export class IoncardReservaMyComponent {

 @Input() reserva:CustomReserva;
  constructor(private navCtrl:NavController) {
  }

  openReserva(event, reserva:CustomReserva){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }

}
