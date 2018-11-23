import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Páginas
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { ReservaView } from '../../model/ReservaView';
import { Disciplina } from '../../model/Disciplina';
//Provedores
import { ReservaVisitanteServiceProvider } from '../../providers/reserva-visitante-service/reserva-visitante-service';
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';


@Component({
  selector: 'page-reserva-visitante-list',
  templateUrl: 'reserva-visitante-list.html',
})
export class ReservaVisitanteListPage {

   reservas:Array<ReservaView>;
   disciplinas:Array<Disciplina>;

  departamentoSelecionado:number = 1;
  disciplinaSelecionada = undefined;
  reservasNaoEncontrada:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl:MenuController,
    private alertCtrl:AlertController, private storage:Storage, private loadingCtrl:LoadingController,
    private reservaVisitanteService:ReservaVisitanteServiceProvider,
    private disciplinaService:DisciplinaServiceProvider) {


    this.menuCtrl.enable(false);
    this.reservas = new Array<ReservaView>();
    this.disciplinas = new Array<Disciplina>();
    this.carregarDisciplinasPorDepartamento(this.departamentoSelecionado);

  }

  //Carrega todas as dicipinas referente a um determinado departamento
  carregarDisciplinasPorDepartamento(id_departamento:number){

      let loading = this.loadingCtrl.create({
        content: 'Carregando disciplinas...'
      });

      this.storage.get("disciplinasDIN").then( (disciplinasDIN:Array<Disciplina>) => {

        if(disciplinasDIN != null && disciplinasDIN.length > 0){
          this.disciplinas = disciplinasDIN;
          loading.dismiss();
        }else{
            this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
              .then( (disciplinas:Array<Disciplina>) => {
                if(disciplinas.length > 0){
                  this.disciplinas = disciplinas;
                  this.storage.set("disciplinasDIN", disciplinas);
                  loading.dismiss();
                }else{
                  loading.dismiss();
                  this.presentConfirm("Nenhuma disciplina foi encontrada");
                }

                } )
              .catch( (error) => {
                loading.dismiss();
                this.presentConfirm(error.message);
              });
        }

        }).catch( (error) => {
          loading.dismiss();
          this.presentConfirm(error.message);
        });


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
      alert.setMode("ios");
      alert.present();
    }


  openReserva(event, reserva:ReservaView){
      this.navCtrl.push(ReservaDetailPage, {
        item: reserva
      });
  }

 changeDisciplina(valor){
   this.disciplinaSelecionada = valor;

   let loading = this.loadingCtrl.create({
     content: 'Carregando reservas...'
   });

   loading.present();
   this.reservaVisitanteService.
   carregarReservaVisitante(this.departamentoSelecionado, this.disciplinaSelecionada)
   .then((reservas:Array<ReservaView>) => {
     if(reservas != null && reservas.length > 0){
       this.reservas = reservas;
       this.storage.set("reservas", reservas);
       this.reservasNaoEncontrada = false;
       loading.dismiss();
     }else{
       this.reservas  = new Array<ReservaView>();
       loading.dismiss();
       this.presentConfirm("Nenhuma reserva ativa foi encontrada");
       this.reservasNaoEncontrada = true;
     }

     } )
   .catch((error) => {
     this.reservas  = new Array<ReservaView>();
     loading.dismiss();
     this.presentConfirm(error.message);
      this.reservasNaoEncontrada = true;
   });

 }




}
