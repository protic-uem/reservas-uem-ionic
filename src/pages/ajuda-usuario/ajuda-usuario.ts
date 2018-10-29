import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Login } from '../../model/Login';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-ajuda-usuario',
  templateUrl: 'ajuda-usuario.html',
})
export class AjudaUsuarioPage {

  login:Login;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {

    this.login = new Login();
    this.login = this.navParams.get('login');
    if(this.login.nome == undefined)
      this.loadResources();//pegar o usuário logado e depois carregar as reservas

  }

  //Busca o login do storage
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
