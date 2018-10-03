import { Component, Input} from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';

import { ReservaCreatePage } from '../../pages/reserva-create/reserva-create';
import { ReservaListPage } from '../../pages/reserva-list/reserva-list';
import { Login } from '../../model/Login';


@Component({
  selector: 'custom-fab',
  templateUrl: 'custom-fab.html'
})
export class CustomFabComponent {

  @Input() login:Login;

  constructor(private navCtrl:NavController) {


  }

  addReserva(fab: FabContainer){
    fab.close();
    this.navCtrl.push(ReservaCreatePage, {login:this.login});
  }

  searchReserva(fab: FabContainer){
    fab.close();
    this.navCtrl.push(ReservaListPage, {login:this.login});
  }

}
