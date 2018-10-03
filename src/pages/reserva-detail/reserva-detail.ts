import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ReservaView} from '../../model/ReservaView';
import { Login } from '../../model/Login';
import { Storage } from '@ionic/storage';
import { ReservaUsuario } from '../../model/ReservaUsuario';


@IonicPage()
@Component({
  selector: 'page-reserva-detail',
  templateUrl: 'reserva-detail.html',
})
export class ReservaDetailPage {

  private reserva:ReservaView;
  private login:Login;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage) {
    this.reserva = this.navParams.get('item');
    this.login = new Login();
    this.loadResources();

  }


  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
        } else {
          this.login = new Login();
        }
      });
  }

}
