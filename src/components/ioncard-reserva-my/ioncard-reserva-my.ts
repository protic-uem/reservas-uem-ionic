import { Component, Input } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, Events } from 'ionic-angular';

//Páginas
import { ReservaView } from '../../model/ReservaView';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';


@Component({
  selector: 'ioncard-reserva-my',
  templateUrl: 'ioncard-reserva-my.html'
})
export class IoncardReservaMyComponent {

 @Input() reserva:ReservaView;
  constructor(private navCtrl:NavController, private alertCtrl:AlertController, private loadingCtrl:LoadingController,
    private reservaService:ReservaServiceProvider, private toastCtrl:ToastController, private ev:Events) {
  }


  openReserva(event, reserva:ReservaView){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }

  confirmarCancelarReserva(reserva:ReservaView){

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
