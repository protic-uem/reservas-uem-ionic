import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-ajuda-usuario',
  templateUrl: 'ajuda-usuario.html',
})
export class AjudaUsuarioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AjudaUsuarioPage');
  }

}
