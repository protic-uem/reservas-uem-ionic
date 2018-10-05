import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { parse, format,addDays, subDays } from 'date-fns';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { ReservaView } from '../../model/ReservaView';
import { Storage } from '@ionic/storage';
import { Periodo } from '../../model/Periodo';
import { ReservaDetailPage } from '../../pages/reserva-detail/reserva-detail';
import { Login } from '../../model/Login';


@IonicPage()
@Component({
  selector: 'page-reserva-search',
  templateUrl: 'reserva-search.html',
})
export class ReservaSearchPage {

  dataSelecionada:string;
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
    private loadingCtrl:LoadingController, private alertCtrl:AlertController) {

    this.reservas = new Array<ReservaView>();

    this.login = this.navParams.get('login');
    
    this.dataSelecionada = new Date().toISOString();
    this.carregarReservasPorData(format(new Date(), 'YYYY-MM-DD'), 1);
  }

  //quando o usuaŕio muda de data
  changeData(valor){
    if(valor != undefined)
     this.carregarReservasPorData(format(valor, 'YYYY-MM-DD'), this.departamentoDIN);
  }

  carregarReservasPorData(data:string, id_departamento:number){

    let loading = this.loadingCtrl.create({
      content: 'Carregando reservas...'
    });

    this.reservaPeriodo01 = new ReservaView();
    this.reservaPeriodo02 = new ReservaView();
    this.reservaPeriodo03 = new ReservaView();
    this.reservaPeriodo04 = new ReservaView();
    this.reservaPeriodo05 = new ReservaView();
    this.reservaPeriodo06 = new ReservaView();


    this.reservaService.
    carregarReservaPorData(data, id_departamento)
    .then((reservas:Array<ReservaView>) => {
      if(reservas.length > 0){
        this.reservas = reservas;
        this.storage.set("reservas", reservas);
          this.filtragemReservas(reservas).then( () =>
            {
              loading.dismiss();
            }
          );

      }else{
        this.reservas  = new Array<ReservaView>();
        loading.dismiss();
        this.presentConfirm("Nenhuma reserva ativa foi encontrada");
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

        if(r01[0] != null && r01[0] != undefined && r01[0].codigo_disciplina != undefined)
          this.reservaPeriodo01 =  r01[0];
        if(r02[0] != null && r02[0] != undefined && r02[0].codigo_disciplina != undefined)
          this.reservaPeriodo02 =  r02[0];
        if(r03[0] != null && r03[0] != undefined && r03[0].codigo_disciplina != undefined)
          this.reservaPeriodo03 =  r03[0];
        if(r04[0] != null && r04[0] != undefined && r04[0].codigo_disciplina != undefined)
          this.reservaPeriodo04 =  r04[0];
        if(r05[0] != null && r05[0] != undefined && r05[0].codigo_disciplina != undefined)
          this.reservaPeriodo05 =  r05[0];
        if(r06[0] != null && r06[0] != undefined && r06[0].codigo_disciplina != undefined)
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
      this.carregarReservasPorData(this.dataSelecionada, this.departamentoDIN);
  }

  anteriorDia(){
    console.log("dia anterior");
    this.dataSelecionada = format(subDays(parse(this.dataSelecionada),1), 'YYYY-MM-DD');
    this.carregarReservasPorData(this.dataSelecionada, this.departamentoDIN);
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

}
