import { Component, Input } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, Events } from 'ionic-angular';


//Páginas
import { ReservaView } from '../../model/ReservaView';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';

@Component({
  selector: 'chip-reserva-home',
  templateUrl: 'chip-reserva-home.html'
})
export class ChipReservaHomeComponent {

  @Input() reserva:ReservaView;
  constructor(private navCtrl:NavController, private alertCtrl:AlertController, private loadingCtrl:LoadingController,
    private reservaService:ReservaServiceProvider, private toastCtrl:ToastController) {

  }

    openReserva(reserva:ReservaView){
      this.navCtrl.push(ReservaDetailPage, {
        item: reserva
      });
    }

}
