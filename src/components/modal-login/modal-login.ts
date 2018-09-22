import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
@Component({
  selector: 'modal-login',
  templateUrl: 'modal-login.html'
})
export class ModalLoginComponent {

  text: string;

  constructor(private viewCtrl:ViewController) {

  }

  login(){
    let data = {'foo':'bar'};
    this.viewCtrl.dismiss(data);
  }

}
