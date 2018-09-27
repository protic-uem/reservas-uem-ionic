import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import {CustomReserva} from '../reserva-list/reserva-list';
@IonicPage()
@Component({
  selector: 'page-reserva-create',
  templateUrl: 'reserva-create.html',
})
export class ReservaCreatePage {

  reserva:CustomReserva;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController) {

      this.reserva = new CustomReserva;

  }

  ionViewDidLoad() {

  }

  reservaCreate(){
    this.reservaConfirm();
  }

  reservaConfirm(){
    const alert = this.alertCtrl.create({
      title:'Tem certeza?',
      message: '<b>Departamento:</b> '+this.reserva.dept +'<br/>'+
                '<b>Sala:</b> '+this.reserva.sala+'<br/>'+
                '<b>Disciplina:</b> '+this.reserva.disciplina+'<br/>'+
                '<b>Data:</b> '+this.reserva.data+'<br/>'+
                '<b>Período:</b> '+this.reserva.periodo+'<br/>'+
                '<b>Uso:</b> '+this.reserva.uso+'<br/>'+
                '<b>Tipo:</b> '+this.reserva.tipo,

      buttons: [
        {
          text: 'Cancelar',
          handler: () => {

          }
        },
        {
          text: 'Sim',
          handler: () => {
            //retorar um objeto de sucesso, e mostrat toast de reserva realizada com sucesso
            //na página principal de reservas
              this.navCtrl.pop();
              let toast = this.toastCtrl.create({
                message: 'Reserva feita com sucesso',
                duration: 3000
              });
              toast.present();
          }
        }
      ]
    });

    alert.present();
  }


  reservaCanceled(){
    let toast = this.toastCtrl.create({
      message: 'Reserva cancelada',
      duration: 3000
    });
    toast.present();
        this.navCtrl.pop();
  }

  alertaPresent(){

  }

}
