import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Select, ModalController} from 'ionic-angular';
import { parse, format,addDays, subDays, isBefore, isAfter, addWeeks, addMonths } from 'date-fns';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { Storage } from '@ionic/storage';
import { Periodo } from '../../model/Periodo';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { ReservaCreateSearchPage } from '../reserva-create-search/reserva-create-search';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { SalaGraphql } from '../../model/Sala.graphql';
import { UsuarioGraphql } from '../../model/Usuario.graphql';
import { validarData, apresentarErro } from '../../util/util';


@Component({
  selector: 'page-reserva-search',
  templateUrl: 'reserva-search.html',
})
export class ReservaSearchPage {

@ViewChild('selectionSala') selectRef:Select;

  reserva:ReservaGraphql;
  periodo:Periodo;

  dataSelecionada:string;
  showDate:string;
  salaSelecionada:SalaGraphql;
  salas:Array<SalaGraphql>;


  reservas:Array<ReservaGraphql>;
  reservaPeriodo01:ReservaGraphql;
  reservaPeriodo02:ReservaGraphql;
  reservaPeriodo03:ReservaGraphql;
  reservaPeriodo04:ReservaGraphql;
  reservaPeriodo05:ReservaGraphql;
  reservaPeriodo06:ReservaGraphql;
  login:UsuarioGraphql;
  dataDocente: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private loadingCtrl:LoadingController, private alertCtrl:AlertController,
    private modalCtrl:ModalController, private cdr:ChangeDetectorRef) {

    this.reservas = new Array<ReservaGraphql>();
    this.salaSelecionada = new SalaGraphql();
    this.reserva = new ReservaGraphql();
    this.periodo = new Periodo();

    this.reservaPeriodo01 = new ReservaGraphql();
    this.reservaPeriodo02 = new ReservaGraphql();
    this.reservaPeriodo03 = new ReservaGraphql();
    this.reservaPeriodo04 = new ReservaGraphql();
    this.reservaPeriodo05 = new ReservaGraphql();
    this.reservaPeriodo06 = new ReservaGraphql();

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
      this.carregarSalasPorDepartamento(this.login.departamento.id);

  }

 //Executa toda vez que a tela é aberta
  ionViewDidEnter(){
    //if(this.dataSelecionada != undefined && this.salaSelecionada != undefined && this.salaSelecionada.id != undefined)
      //this.carregarReservasPorDataSala(this.dataSelecionada, this.login.departamento.id ,this.salaSelecionada.id);
  }


  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
        } else {
          this.login = new UsuarioGraphql();
        }
      });
  }


  //Abre a pagina de cadastro de uma reserva
  cadastrarReserva(periodo:number){

    let prosseguir = true;

    if(this.login.privilegio == 'Docente')
      prosseguir = !validarData(this.dataSelecionada);
    
    if(prosseguir){
        if(this.salaSelecionada.id != undefined && this.dataSelecionada != undefined){

          this.reserva.sala = this.salaSelecionada;
          this.reserva.periodo = periodo;
          this.reserva.data_reserva = this.dataSelecionada;

          if(this.login.privilegio == "Docente"){
            this.reserva.usuario = this.login;
            this.reserva.departamento = this.login.departamento;
          }

          this.navCtrl.push(ReservaCreateSearchPage, {
            login: this.login,
            item: this.reserva,
            sala: this.salaSelecionada,
          });

        }else{
          apresentarErro(this.alertCtrl, "Por favor, selecione uma sala");
        }
      }
      else{
        apresentarErro(this.alertCtrl, 'Não é permitido reservas no sábado ou domingo.');
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
        this.carregarReservasPorDataSala(this.dataSelecionada, this.login.departamento.id, this.salaSelecionada.id);
      }
    })
  }

  //Carrega as reservas por data e sala
  changeSala(valor){
    if(valor != undefined && this.dataSelecionada != undefined)
      this.carregarReservasPorDataSala(this.dataSelecionada, this.login.departamento.id, valor.id);
  }

    //Carrega todas as salas referente a um determinado departamento
    carregarSalasPorDepartamento(id_departamento:number){
        let loading = this.loadingCtrl.create({
          content: 'Carregando salas...'
        });
        loading.present();
           this.storage.get("salasDepartamento").then((salas:Array<SalaGraphql>) => {
            if(salas.length > 0){
                this.salas = salas;
                this.cdr.detectChanges();
                this.selectRef.open();
              }
            else
              this.salas = new Array<SalaGraphql>();
            loading.dismiss();
          }).catch( (error) => {
            loading.dismiss();
            this.salas = new Array<SalaGraphql>();
            apresentarErro(this.alertCtrl,error.message);
          });
    }

 //carrega todas as reservas de uma determinada data
  carregarReservasPorDataSala(data:string, id_departamento:number, id_sala:number){


    this.reservaPeriodo01 = new ReservaGraphql();
    this.reservaPeriodo02 = new ReservaGraphql();
    this.reservaPeriodo03 = new ReservaGraphql();
    this.reservaPeriodo04 = new ReservaGraphql();
    this.reservaPeriodo05 = new ReservaGraphql();
    this.reservaPeriodo06 = new ReservaGraphql();


    this.reservaService.
    carregarReservasTelaSearch(data, id_departamento, id_sala)
    .then((reservas:Array<ReservaGraphql>) => {
      if(reservas.length > 0){
        this.reservas = reservas;
        this.storage.set("reservas", reservas);
          this.filtragemReservas(reservas).then( () =>
            {
            }
          );

      }else{
        this.reservas  = new Array<ReservaGraphql>();
      }

      } )
    .catch((error) => {
      this.reservas  = new Array<ReservaGraphql>();
      this.presentConfirm(error.message);
    });

  }

  filtragemReservas(reservas:Array<ReservaGraphql>){
    return new Promise((resolve, reject) => {
        let r01 = reservas.filter(item => item.periodo == 1);
        let r02 = reservas.filter(item => item.periodo == 2);
        let r03 = reservas.filter(item => item.periodo == 3);
        let r04 = reservas.filter(item => item.periodo == 4);
        let r05 = reservas.filter(item => item.periodo == 5);
        let r06 = reservas.filter(item => item.periodo == 6);

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
  openReserva(reserva:ReservaGraphql){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva,
      login: this.login
    });
  }


  //Atualiza o dia e carrega as reservas de arcordo com a data e a sala
  proximoDia(){
    if(!isAfter(this.dataSelecionada, this.dataDocente))
      this.dataSelecionada = format(addDays(parse(this.dataSelecionada),1), 'YYYY-MM-DD');

      this.showDate = format(this.dataSelecionada, 'DD/MM/YYYY');
      this.carregarReservasPorDataSala(this.dataSelecionada, this.login.departamento.id, this.salaSelecionada.id);
  }

  anteriorDia(){

    if(!isBefore(this.dataSelecionada, new Date()))
      this.dataSelecionada = format(subDays(parse(this.dataSelecionada),1), 'YYYY-MM-DD');

    this.showDate = format(this.dataSelecionada, 'DD/MM/YYYY');
    this.carregarReservasPorDataSala(this.dataSelecionada, this.login.departamento.id, this.salaSelecionada.id);
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

}
