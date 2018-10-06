import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Select, ModalController} from 'ionic-angular';
import { parse, format,addDays, subDays } from 'date-fns';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { ReservaView } from '../../model/ReservaView';
import { Storage } from '@ionic/storage';
import { Periodo } from '../../model/Periodo';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";



@IonicPage()
@Component({
  selector: 'page-reserva-search',
  templateUrl: 'reserva-search.html',
})
export class ReservaSearchPage {

@ViewChild('sectionSelect') sectionSelect: Select;

  dataSelecionada:string;
  showDate:string;
  salaSelecionada:Sala;
  salas:Array<Sala>;


  reservas:Array<ReservaView>;
  reservaPeriodo01:ReservaView;
  reservaPeriodo02:ReservaView;
  reservaPeriodo03:ReservaView;
  reservaPeriodo04:ReservaView;
  reservaPeriodo05:ReservaView;
  reservaPeriodo06:ReservaView;
  departamentoDIN:number = 1;
  login:Login;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private loadingCtrl:LoadingController, private alertCtrl:AlertController,
    private salaService:SalaServiceProvider, private modalCtrl:ModalController) {

    this.reservas = new Array<ReservaView>();
    this.salas = new Array<Sala>();
    this.salaSelecionada = new Sala();

    this.reservaPeriodo01 = new ReservaView();
    this.reservaPeriodo02 = new ReservaView();
    this.reservaPeriodo03 = new ReservaView();
    this.reservaPeriodo04 = new ReservaView();
    this.reservaPeriodo05 = new ReservaView();
    this.reservaPeriodo06 = new ReservaView();

    this.login = this.navParams.get('login');

    this.dataSelecionada = format(new Date(), 'YYYY-MM-DD');
    this.showDate = format(new Date(), 'DD/MM/YYYY');
    this.carregarSalasPorDepartamento(this.departamentoDIN);

    if(this.salaSelecionada.id == undefined)
      this.apresentarErro("Por favor, selecione uma sala");

  }

  openCalendar() {

    const options: CalendarModalOptions = {
      title: 'Data da reserva',
      defaultDate: new Date(),
      closeLabel: "CANCELAR",
      doneLabel: "SELECIONAR",
      monthFormat: "MMM YYYY",
      weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date != null && date != undefined){
        this.dataSelecionada = date.string;
        this.showDate = format(date.string, 'DD/MM/YYYY');
        this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN, this.salaSelecionada.id);
      }
    })
  }

  changeSala(valor){
    if(valor != undefined && this.dataSelecionada != undefined)
      this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN, valor.id);
  }



    //Carrega todas as salas referente a um determinado departamento
    carregarSalasPorDepartamento(id_departamento:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando salas...'
        });
        loading.present();
        this.salaService.carregarSalaPorDepartamento(id_departamento)
          .then( (salas:Array<Sala>) => {
            if(salas.length > 0){
              this.salas = salas;
              this.storage.set("salas", salas);
              loading.dismiss().then(() => {
              });
            }else{
              loading.dismiss();
              this.apresentarErro("Nenhuma sala foi encontrada");
            }

            } )
          .catch( (error) => {
            loading.dismiss();
            this.apresentarErro(error.message);
          });


    }

 //carrega todas as reservas de uma determinada data
  carregarReservasPorDataSala(data:string, id_departamento:number, id_sala:number){

    let loading = this.loadingCtrl.create({
      content: 'Carregando reservas...'
    });

    loading.present();
    this.reservaPeriodo01 = new ReservaView();
    this.reservaPeriodo02 = new ReservaView();
    this.reservaPeriodo03 = new ReservaView();
    this.reservaPeriodo04 = new ReservaView();
    this.reservaPeriodo05 = new ReservaView();
    this.reservaPeriodo06 = new ReservaView();


    this.reservaService.
    carregarReservaPorDataSala(data, id_departamento, id_sala)
    .then((reservas:Array<ReservaView>) => {
      if(reservas.length > 0){
        this.reservas = reservas;
        this.storage.set("reservas", reservas);
          loading.dismiss();
          this.filtragemReservas(reservas).then( () =>
            {
            }
          );

      }else{
        this.reservas  = new Array<ReservaView>();
        loading.dismiss();
        //this.presentConfirm("Nenhuma reserva ativa foi encontrada");
      }

      } )
    .catch((error) => {
      this.reservas  = new Array<ReservaView>();
      loading.dismiss();
      this.presentConfirm(error.message);
    });

  }

  filtragemReservas(reservas:Array<ReservaView>){
    return new Promise((resolve, reject) => {
        let r01 = reservas.filter(item => item.periodo == Periodo.um);
        let r02 = reservas.filter(item => item.periodo == Periodo.dois);
        let r03 = reservas.filter(item => item.periodo == Periodo.tres);
        let r04 = reservas.filter(item => item.periodo == Periodo.quatro);
        let r05 = reservas.filter(item => item.periodo == Periodo.cinco);
        let r06 = reservas.filter(item => item.periodo == Periodo.seis);

        if(r01[0] != null && r01[0] != undefined && r01[0].periodo != undefined)
          this.reservaPeriodo01 =  r01[0];
        if(r02[0] != null && r02[0] != undefined && r02[0].periodo != undefined)
          this.reservaPeriodo02 =  r02[0];
        if(r03[0] != null && r03[0] != undefined && r03[0].periodo != undefined)
          this.reservaPeriodo03 =  r03[0];
        if(r04[0] != null && r04[0] != undefined && r04[0].periodo != undefined)
          this.reservaPeriodo04 =  r04[0];
        if(r05[0] != null && r05[0] != undefined && r05[0].periodo != undefined)
          this.reservaPeriodo05 =  r05[0];
        if(r06[0] != null && r06[0] != undefined && r06[0].periodo != undefined)
          this.reservaPeriodo06 =  r06[0];

        });


  }

  openReserva(reserva:ReservaView){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }


  proximoDia(){
      this.dataSelecionada = format(addDays(parse(this.dataSelecionada),1), 'YYYY-MM-DD');
      this.showDate = format(this.dataSelecionada, 'DD/MM/YYYY');
      this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN, this.salaSelecionada.id);
  }

  anteriorDia(){
    this.dataSelecionada = format(subDays(parse(this.dataSelecionada),1), 'YYYY-MM-DD');
    this.showDate = format(this.dataSelecionada, 'DD/MM/YYYY');
    this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN, this.salaSelecionada.id);
  }

  //Caso ocorrar algum erro, apresente o erro ao usuário
    presentConfirm(msg:string) {
      let alert = this.alertCtrl.create({
        title: 'Atenção',
        message: msg,
        buttons: [
          {
            text: 'Okay',
            handler: () => {

            }
          }
        ]
      });
      alert.present();
    }

    //apresenta o alerta sobre o erro
    apresentarErro(msg:string){
    const alertError = this.alertCtrl.create({
      title:'Atenção!',
      message: msg,
      buttons: [
        {
          text: 'Okay',
        }
      ]
    });
    alertError.setMode("ios");
    alertError.present();
    }

}
