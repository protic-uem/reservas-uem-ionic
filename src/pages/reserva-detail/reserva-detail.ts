import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {ReservaView} from '../../model/ReservaView';
import { Login } from '../../model/Login';
import { Storage } from '@ionic/storage';
import { ReservaUsuario } from '../../model/ReservaUsuario';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';


@IonicPage()
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

  confirmarCancelarReserva(reserva:ReservaView){

    const alertConfirm = this.alertCtrl.create({
      title:'Atenção!',
      message: "Tem certeza disso?",
      buttons: [
        {
          text: 'Sim',
          handler: () => {
                this.cancelarReserva(reserva);
          }
        },
        {
          text: 'Não'
        }
      ]
    });

    alertConfirm.setMode("ios");
    alertConfirm.present();
  }


  //cancela uma reserva na base de dados
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
