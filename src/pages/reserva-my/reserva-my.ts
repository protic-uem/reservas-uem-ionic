import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { ReservaServiceProvider } from './../../providers/reserva-service/reserva-service';
import { Login } from '../../model/Login';
import { Storage } from '@ionic/storage';
import { ReservaUsuario } from '../../model/ReservaUsuario';




@IonicPage()
@Component({
  selector: 'page-reserva-my',
  templateUrl: 'reserva-my.html',
})
export class ReservaMyPage {

  private reservas:Array<ReservaUsuario>;
  private reservasCarregadas:Array<ReservaUsuario>;
  private login:Login;

  statusSelecionado:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private menuCtrl:MenuController) {
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
        this.menuCtrl.enable(true);

  }

  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          this.atualizarMinhasReservas();
        } else {
          this.login = new Login();
        }
      });
  }


  atualizarMinhasReservas(){
    this.reservaService.carregarReservaPorUsuario(this.login.id)
      .then( (reservas:Array<ReservaUsuario>) => {
        this.storage.set("reservas", reservas);
        this.reservas = reservas;
        this.reservasCarregadas = reservas;
      } )
      .catch( () => "Erro na requisição de minhas reservas" );

  }

  statusMudado(event){
    if(event == -1){
      this.reservas = this.reservasCarregadas;
    }
    else{
      this.reservas = this.reservasCarregadas.filter(item => item.status == event);
    }
  }

}
