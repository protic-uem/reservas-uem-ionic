import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { UsuarioGraphql } from '../../model/Usuario.graphql';
import { Periodo } from '../../model/Periodo';
import { apresentarErro, apresentarToast } from '../../util/util';
import { ReservaMyPage } from '../reserva-my/reserva-my';


@Component({
  selector: 'page-reserva-detail',
  templateUrl: 'reserva-detail.html',
})
export class ReservaDetailPage {

   reserva:ReservaGraphql;
   login:UsuarioGraphql;
   periodo:Periodo;
   page:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private reservaService:ReservaServiceProvider, private loadingCtrl:LoadingController,
    private toastCtrl:ToastController, private alertCtrl:AlertController) {
    this.reserva = this.navParams.get('item');
    this.login = this.navParams.get('login');
    this.page = this.navParams.get('page');

    this.periodo = new Periodo();

    if(this.page == "visitante"){
      this.login = new UsuarioGraphql();
      this.login.id = -1;
    }
    else if( this.login == undefined )
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
          this.login = new UsuarioGraphql();
        }
      });
  }

  /**
   * Show the alert to cancel a reserva
   * @param reserva reserva 
   */
  confirmarCancelarReserva(reserva:ReservaGraphql){
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
  cancelarReserva(reserva:ReservaGraphql){

      let loading = this.loadingCtrl.create({
        content: 'Cancelando reserva...'
      });

      loading.present();

      this.reservaService.cancelarReserva(reserva)
        .then((result:any) => {
            loading.dismiss().then(() => {
                apresentarToast(this.toastCtrl, 'Reserva cancelada com sucesso!');
            });
            this.voltarTela();
          } )
        .catch((error) => {
          loading.dismiss();
          apresentarErro(this.alertCtrl, error.message);
        });

  }

  /**
   * Redirect the user to previous screen
   */
  voltarTela(){
    if(this.page == "create-reserva")
      this.navCtrl.setRoot(ReservaMyPage, {
        login:this.login,
        item:this.reserva
      }, {animate: true, animation:'ios-transition', direction: 'back', duration:1000});
    else
      this.navCtrl.pop();
  }

}
