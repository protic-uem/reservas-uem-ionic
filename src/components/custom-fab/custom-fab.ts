import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';

import { ReservaCreatePage } from '../../pages/reserva-create/reserva-create';
import { ReservaMyPage } from '../../pages/reserva-my/reserva-my';

@Component({
  selector: 'custom-fab',
  templateUrl: 'custom-fab.html'
})
export class CustomFabComponent {

  constructor(private navCtrl:NavController) {
  }

  addReserva(){
    this.navCtrl.push(ReservaCreatePage);
  }

  searchReserva(){
    console.log("consulta de reserva clicaldo");
  }

  myReserva(){
    this.navCtrl.push(ReservaMyPage);
  }

}
