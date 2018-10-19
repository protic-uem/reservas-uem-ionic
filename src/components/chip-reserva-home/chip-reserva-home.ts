import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


//Páginas
import { ReservaView } from '../../model/ReservaView';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';

@Component({
  selector: 'chip-reserva-home',
  templateUrl: 'chip-reserva-home.html'
})
export class ChipReservaHomeComponent {

  @Input() reserva:ReservaView;
  constructor(private navCtrl:NavController) {

  }

    openReserva(reserva:ReservaView){
      this.navCtrl.push(ReservaDetailPage, {
        item: reserva
      });
    }

}
