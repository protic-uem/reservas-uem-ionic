import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { UsuarioGraphql } from '../../model/Usuario.graphql';


@Component({
  selector: 'page-ajuda-usuario',
  templateUrl: 'ajuda-usuario.html',
})
export class AjudaUsuarioPage {

  login:UsuarioGraphql;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {

    this.login = new UsuarioGraphql();
    this.login = this.navParams.get('login');
    if(this.login.nome == undefined)
      this.loadResources();

  }

  /**
   * load the login from storage
   */
   async loadResources() {
     await this.storage.get("login")
       .then((login) => {
         if (login) {
           this.login = login;
         } else {
           this.login = new UsuarioGraphql();
         }
       });
   }



}
