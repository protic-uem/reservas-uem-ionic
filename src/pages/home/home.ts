import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { format, getHours, getMinutes } from 'date-fns';

//Páginas
import { ReservaView } from '../../model/ReservaView';
import { Login } from '../../model/Login';


//Provedores
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  reservas:Array<ReservaView>;
  departamentoDIN:number = 1;
  hoje:string;
  periodo:string;
  periodoCorrente:number;
  reservasNaoEncontrada:boolean = false;
  login:Login;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl:AlertController, private storage:Storage, private loadingCtrl:LoadingController,
    private reservaService:ReservaServiceProvider) {

      this.reservas = new Array<ReservaView>();
      this.hoje = format(new Date(), 'YYYY-MM-DD');
      this.calcularPeriodoCorrente();
      this.login = this.navParams.get('login');

  }


  ionViewDidEnter(){
    if(this.login != undefined && this.login.id != undefined)
      this.carregarReservasHome();
    else
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
  }

  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          this.carregarReservasHome();
        } else {
          this.login = new Login();
        }
      });
  }

  //Calcula o período corrente
    calcularPeriodoCorrente(){

       var horaCorrente = getHours(new Date());
       var minutoCorrente = getMinutes(new Date());
       minutoCorrente += horaCorrente*60;

       if(minutoCorrente > 465 && minutoCorrente <= 565)
       {
        this.periodoCorrente = 1;
        this.periodo = "7:45-9:25";
      }
       else if(minutoCorrente > 565 && minutoCorrente <= 720)
       {
        this.periodoCorrente = 2;
        this.periodo = "9:40-12:00";
      }
       else if(minutoCorrente > 720  && minutoCorrente <= 910)
       {
         this.periodoCorrente = 3;
         this.periodo = "13:30-15:10";
       }
       else if(minutoCorrente > 910  && minutoCorrente <= 1080)
       {
         this.periodoCorrente = 4;
          this.periodo = "15:30-18:00";
        }
        else if(minutoCorrente > 1080  && minutoCorrente <= 1270)
        {
          this.periodoCorrente = 5;
           this.periodo = "19:30-21:10";
         }
        else if(minutoCorrente > 1270 && minutoCorrente <= 1380)
        {
          this.periodoCorrente = 6;
          this.periodo = "21:20-23:00";
        }
        else
        {
            this.periodoCorrente = 0;
            this.periodo = "Fora do intervalo";
        }



        }

  carregarReservasHome(){

    let loading = this.loadingCtrl.create({
      content: 'Carregando reservas...'
    });
    loading.present();

    this.reservaService.
    carregarReservasTelaHome(this.departamentoDIN, this.hoje, this.periodoCorrente)
    .then((reservas:Array<ReservaView>) => {
      if(reservas.length > 0){
        this.reservas = reservas;
        this.storage.set("reservas", reservas);
        this.reservasNaoEncontrada = false;
        loading.dismiss();
      }else{
        this.reservas  = new Array<ReservaView>();
        loading.dismiss();
        this.reservasNaoEncontrada = true;
        this.apresentarErro("Nenhuma reserva ativa foi encontrada");
      }

      } )
    .catch((error) => {
      this.reservas  = new Array<ReservaView>();
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
