import { Component, Input } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';

//Páginas
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { Periodo } from '../../model/Periodo';
import { UsuarioGraphql } from '../../model/Usuario.graphql';
import { apresentarErro, apresentarToast } from '../../util/util';


@Component({
  selector: 'ioncard-reserva-my',
  templateUrl: 'ioncard-reserva-my.html'
})
export class IoncardReservaMyComponent {

 @Input() reserva:ReservaGraphql;
 @Input() periodo:Periodo = new Periodo();
 @Input() login:UsuarioGraphql;

  constructor(private navCtrl:NavController, private alertCtrl:AlertController, private loadingCtrl:LoadingController,
    private reservaService:ReservaServiceProvider, private toastCtrl:ToastController) {


  }


  openReserva(event, reserva:ReservaGraphql){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva,
      login: this.login
    });
  }

  confirmarCancelarReserva(reserva:ReservaGraphql){

    const alertConfirm = this.alertCtrl.create({
      title:'Atenção!',
      message: "Quer realmente cancelar essa reserva?",
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
  cancelarReserva(reserva:ReservaGraphql){

      let loading = this.loadingCtrl.create({
        content: 'Cancelando reserva...'
      });


        loading.present();

        this.reservaService.cancelarReserva(reserva)
          .then((result:any) => {
            if(result){
              loading.dismiss().then(() => {
                apresentarToast(this.toastCtrl, 'Reserva cancelada com sucesso!');
              });
            }else{
              loading.dismiss();
              apresentarErro(this.alertCtrl, "Houve um problema ao cancelar a reserva");
            }

            } )
          .catch((error) => {
            loading.dismiss();
            apresentarErro(this.alertCtrl, error.message);
          });

  }
}
