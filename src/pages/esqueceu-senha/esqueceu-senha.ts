import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-esqueceu-senha',
  templateUrl: 'esqueceu-senha.html',
})
export class EsqueceuSenhaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EsqueceuSenhaPage');
  }

}
