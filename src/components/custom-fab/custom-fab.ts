import { Component} from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';

import { ReservaCreatePage } from '../../pages/reserva-create/reserva-create';
import { ReservaMyPage } from '../../pages/reserva-my/reserva-my';

@Component({
  selector: 'custom-fab',
  templateUrl: 'custom-fab.html'
})
export class CustomFabComponent {

  constructor(private navCtrl:NavController) {


  }

  addReserva(fab: FabContainer){
    fab.close();
    this.navCtrl.push(ReservaCreatePage);
  }

  myReserva(fab: FabContainer){
    fab.close();
    this.navCtrl.push(ReservaMyPage);
  }

}
