import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, App } from 'ionic-angular';
import { ReservaListPage } from '../reserva-list/reserva-list';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { Login } from '../../model/Login';


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
  private app:App, private storage:Storage, private loginService:LoginServiceProvider) {

    this.storage.get("login")
        .then( (value) => {
          if (value) { this.senha = '' } });

      this.storage.get("keepConnected").then( (value) => this.keepConnected = value );

  }

  ionViewCanEnter(){
    this.senha = '';
    this.menuCtrl.enable(false);
  }

  saveConnected(event) {
    this.keepConnected = event.checked;
  }

  verifyLogin() {
    this.loginService.confirmLogin(this.email.toLowerCase(), this.senha)
      .then( (login:Login) => {
        console.log("login:"+login);
        this.storage.set("login", login);
        this.storage.set("keepConnected", this.keepConnected);
        this.navCtrl.setRoot('ReservaPage');
      } )
      .catch( () => "Erro na requisição de login" );
  }

  login(){
    this.platform.ready().then( () => {
        this.app.getRootNav().setRoot(ReservaListPage);
        //this.navCtrl.setRoot(ReservaListPage);
       });
    //this.navCtrl.pop();
  }

}
