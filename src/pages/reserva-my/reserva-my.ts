import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { ReservaServiceProvider } from './../../providers/reserva-service/reserva-service';
import { Login } from '../../model/Login';
import { Storage } from '@ionic/storage';
import { ReservaView } from '../../model/ReservaView';




@IonicPage()
@Component({
  selector: 'page-reserva-my',
  templateUrl: 'reserva-my.html',
})
export class ReservaMyPage {

  private reservas:Array<ReservaView>;
  private reservasCarregadas:Array<ReservaView>;
  private login:Login;

  statusSelecionado:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private menuCtrl:MenuController) {
      
      this.reservas = new Array<ReservaView>();
      this.reservasCarregadas = new Array<ReservaView>();

        this.login = this.navParams.get('login');
        if(this.login == undefined)
          this.loadResources();//pegar o usuário logado e depois carregar as reservas
        else
          this.atualizarMinhasReservas();

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
      .then( (reservas:Array<ReservaView>) => {
        this.storage.set("reservas", reservas);
        this.reservas = reservas;
        console.log("reserva:"+reservas[0].nome_usuario);
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
