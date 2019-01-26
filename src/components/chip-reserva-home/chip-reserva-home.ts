import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


//Páginas
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { UsuarioGraphql } from '../../model/Usuario.graphql';

@Component({
  selector: 'chip-reserva-home',
  templateUrl: 'chip-reserva-home.html'
})
export class ChipReservaHomeComponent {

  @Input() reserva:ReservaGraphql;
  @Input() login:UsuarioGraphql;
  constructor(private navCtrl:NavController) {

  }

    openReserva(reserva:ReservaGraphql){
      this.navCtrl.push(ReservaDetailPage, {
        item: reserva,
        login: this.login,
      });
    }

}
