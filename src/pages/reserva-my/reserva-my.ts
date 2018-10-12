import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, Events } from 'ionic-angular';

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

   reservas:Array<ReservaView>;
   reservasCarregadas:Array<ReservaView>;
   login:Login;
   reservasNaoEncontrada:boolean = false;

   statusSelecionado:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private menuCtrl:MenuController, private loadingCtrl:LoadingController,
    private ev:Events) {

      this.reservas = new Array<ReservaView>();
      this.reservasCarregadas = new Array<ReservaView>();

        this.login = this.navParams.get('login');
        if(this.login == undefined)
          this.loadResources();//pegar o usuário logado e depois carregar as reservas



        this.menuCtrl.enable(true);

  }


    ionViewDidEnter(){
      this.atualizarMinhasReservas();
    }

  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          //this.atualizarMinhasReservas();
        } else {
          this.login = new Login();
        }
      });
  }


  atualizarMinhasReservas(){

    console.log("Atualizando minhas reservas");
    let loading = this.loadingCtrl.create({
      content: 'Carregando reservas...'
    });

    loading.present();
    this.reservaService.carregarMinhasReservas(this.login.id)
      .then( (reservas:Array<ReservaView>) => {
        if(reservas.length > 0){
          this.reservas = reservas;
          this.reservasCarregadas = reservas;
          this.reservasNaoEncontrada = false;
          loading.dismiss();
        }else{
          this.reservas  = new Array<ReservaView>();
          this.reservasNaoEncontrada = true;
          loading.dismiss();
        }
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
    if(this.reservas.length > 0)
        this.reservasNaoEncontrada = false;
    else
        this.reservasNaoEncontrada = true;
  }

}
