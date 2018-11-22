import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Select, ModalController} from 'ionic-angular';
import { parse, format,addDays, subDays, isBefore, isAfter, addWeeks, addMonths } from 'date-fns';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { ReservaView } from '../../model/ReservaView';
import { Storage } from '@ionic/storage';
import { Periodo } from '../../model/Periodo';
import { Reserva } from '../../model/Reserva';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { ReservaCreateSearchPage } from '../reserva-create-search/reserva-create-search';


@Component({
  selector: 'page-reserva-search',
  templateUrl: 'reserva-search.html',
})
export class ReservaSearchPage {

@ViewChild('selectionSala') selectRef:Select;

  reserva:Reserva;

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
  dataDocente: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private loadingCtrl:LoadingController, private alertCtrl:AlertController,
    private salaService:SalaServiceProvider, private modalCtrl:ModalController, private cdr:ChangeDetectorRef) {

    this.reservas = new Array<ReservaView>();
    this.salaSelecionada = new Sala();
    this.reserva = new Reserva();

    this.reservaPeriodo01 = new ReservaView();
    this.reservaPeriodo02 = new ReservaView();
    this.reservaPeriodo03 = new ReservaView();
    this.reservaPeriodo04 = new ReservaView();
    this.reservaPeriodo05 = new ReservaView();
    this.reservaPeriodo06 = new ReservaView();

    this.login = this.navParams.get('login');

    if(this.login.nome == undefined)
      this.loadResources();//pegar o usuário logado e depois carregar as reservas

      //Caso seja docente, só podera realizar reservas de 3 semanas a referente
      //Caso seja secretário, poderá 1 mês a frente
      if(this.login.nome != undefined){
        if(this.login.privilegio == 'Docente')
          this.dataDocente = format(addWeeks(new Date(), 3), 'YYYY-MM-DD');
        else
          this.dataDocente = format(addMonths(new Date(), 1), 'YYYY-MM-DD');
    }

    this.dataSelecionada = format(new Date(), 'YYYY-MM-DD');
    this.showDate = format(new Date(), 'DD/MM/YYYY');

    //atualiza o select da sala, caso o usuário ainda não tenha selecionado nenhuma sala
    if(this.salaSelecionada.id == undefined)
      this.carregarSalasPorDepartamento(this.departamentoDIN);

  }

 //Executa toda vez que a tela é aberta
  ionViewDidEnter(){
    if(this.dataSelecionada != undefined && this.salaSelecionada != undefined && this.salaSelecionada.id != undefined)
      this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN ,this.salaSelecionada.id);
  }


  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
        } else {
          this.login = new Login();
        }
      });
  }


  //Abre a pagina de cadastro de uma reserva
  cadastrarReserva(periodo:number){
    if(this.salaSelecionada.id != undefined && this.dataSelecionada != undefined){

      this.reserva.id_sala = this.salaSelecionada.id;
      this.reserva.periodo = periodo;
      this.reserva.data_reserva = this.dataSelecionada;

      if(this.login.privilegio == "Docente")
        this.reserva.id_usuario = this.login.id;

      this.navCtrl.push(ReservaCreateSearchPage, {
        login: this.login,
        item: this.reserva,
        sala: this.salaSelecionada,
      });

    }else{
      this.apresentarErro("Por favor, selecione uma sala");
    }

  }


  //Abre o modal com o calendário
  openCalendar() {
    const options: CalendarModalOptions = {
      from: new Date(),
      to: parse(this.dataDocente),
      title: '',
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

  //Carrega as reservas por data e sala
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
           this.storage.get("salasDepartamento").then((salas:Array<Sala>) => {
            if(salas.length > 0){
                this.salas = salas;
                this.cdr.detectChanges();
                this.selectRef.open();
              }
            else
              this.salas = new Array<Sala>();
            loading.dismiss();
          }).catch( (error) => {
            loading.dismiss();
            this.salas = new Array<Sala>();
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
    carregarReservasTelaSearch(data, id_departamento, id_sala)
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

  //Vai para a página de reservar
  openReserva(reserva:ReservaView){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }


  //Atualiza o dia e carrega as reservas de arcordo com a data e a sala
  proximoDia(){
    if(!isAfter(this.dataSelecionada, this.dataDocente))
      this.dataSelecionada = format(addDays(parse(this.dataSelecionada),1), 'YYYY-MM-DD');

      this.showDate = format(this.dataSelecionada, 'DD/MM/YYYY');
      this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN, this.salaSelecionada.id);
  }

  anteriorDia(){

    if(!isBefore(this.dataSelecionada, new Date()))
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
            text: 'Entendi',
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
          text: 'Entendi',
        }
      ]
    });
    alertError.setMode("ios");
    alertError.present();
    }

}
