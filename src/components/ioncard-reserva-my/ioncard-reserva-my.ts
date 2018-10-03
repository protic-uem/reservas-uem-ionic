import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Páginas
import { ReservaView } from '../../model/ReservaView';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';

@Component({
  selector: 'ioncard-reserva-my',
  templateUrl: 'ioncard-reserva-my.html'
})
export class IoncardReservaMyComponent {

 @Input() reserva:ReservaView;
  constructor(private navCtrl:NavController) {
  }

  openReserva(event, reserva:ReservaView){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }

}
