import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, App } from 'ionic-angular';
import { ReservaListPage } from '../reserva-list/reserva-list';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  keepConnected:boolean;
  email: string;
  senha: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private menuCtrl: MenuController, private platform:Platform,
  private app:App) {
  }

  ionViewCanEnter(){
    this.senha = '';
    this.menuCtrl.enable(false);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  saveConnected(event) {
    this.keepConnected = event.checked;
  }

  login(){
    this.platform.ready().then( () => {
        this.app.getRootNav().setRoot(ReservaListPage);
        //this.navCtrl.setRoot(ReservaListPage);
       });
    //this.navCtrl.pop();
  }

}
