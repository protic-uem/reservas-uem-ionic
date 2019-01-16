import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {ReservaView} from '../../model/ReservaView';
import { Login } from '../../model/Login';
import { Storage } from '@ionic/storage';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';


@Component({
  selector: 'page-reserva-detail',
  templateUrl: 'reserva-detail.html',
})
export class ReservaDetailPage {

   reserva:ReservaView;
   login:Login;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private reservaService:ReservaServiceProvider, private loadingCtrl:LoadingController,
    private toastCtrl:ToastController, private alertCtrl:AlertController) {
    this.reserva = this.navParams.get('item');
    this.login = new Login();
    this.loadResources();

  }

  /**
   * load resources 
   * recover user from storage
   */
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

  /**
   * Show the alert to cancel a reserva
   * @param reserva reserva 
   */
  confirmarCancelarReserva(reserva:ReservaView){
    const alertConfirm = this.alertCtrl.create({
      title:'Atenção!',
      message: "Tem certeza disso?",
      buttons: [
        {
          text: 'Não'

        },
        {
          text: 'Sim',
          handler: () => {
                this.cancelarReserva(reserva);
          }
        }
      ]
    });

    alertConfirm.setMode("ios");
    alertConfirm.present();
  }


  /**
   * Cancel a reserva from database
   * @param reserva reserva
   */
  cancelarReserva(reserva:ReservaView){

      let loading = this.loadingCtrl.create({
        content: 'Cancelando reserva...'
      });

      loading.present();

      this.reservaService.cancelarReserva(reserva)
        .then((result:any) => {
          if(result){
            loading.dismiss().then(() => {
                let toast = this.toastCtrl.create({
                  message: 'Reserva cancelada com sucesso',
                  duration: 3000
                });
                toast.present();
            });
            this.navCtrl.pop();
          }else{
            loading.dismiss();
            this.apresentarErro("Houve um problema ao cancelar a reserva");
          }

          } )
        .catch((error) => {
          loading.dismiss();
          this.apresentarErro(error.message);
        });

  }

  /**
   * Redirect the user to previous screen
   */
  voltarTela(){
    this.navCtrl.pop();
  }


  //apresenta o alerta sobre o erro
  apresentarErro(msg:string){
    const alertError = this.alertCtrl.create({
      title:'Atenção!',
      message: msg,
      buttons: [
        {
          text: 'Entendi',
        }
      ]
    });

    alertError.setMode("ios");
    alertError.present();
    }


}
