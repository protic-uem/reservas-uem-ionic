import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, MenuController, Platform, App, Events  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { Login } from '../../model/Login';
import { ReservaListPage } from '../../pages/reserva-list/reserva-list';

@Component({
  selector: 'modal-login',
  templateUrl: 'modal-login.html'
})
export class ModalLoginComponent {

  keepConnected:boolean;
  email: string;
  senha: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private menuCtrl: MenuController, private platform:Platform,
  private app:App, private storage:Storage, private loginService:LoginServiceProvider,
  private viewCtrl:ViewController, private ev:Events) {

    this.storage.get("login")
        .then( (value) => {
          if (value) { this.senha = '' } });

      this.storage.get("keepConnected").then( (value) => this.keepConnected = value );

  }


  ionViewCanEnter(){
    this.senha = '';
  }

  saveConnected(event) {
    this.keepConnected = event.checked;
  }

  login(){
    this.loginService.confirmLogin(this.email.toLowerCase(), this.senha)
      .then( (login:Login) => {
        console.log("login nome:"+login.nome);
        this.ev.publish("userloggedin", login);
        this.storage.set("login", login);
        this.storage.set("keepConnected", this.keepConnected);
      } )
      .catch( () => "Erro na requisição de login" );

    this.viewCtrl.dismiss();
  }

}
