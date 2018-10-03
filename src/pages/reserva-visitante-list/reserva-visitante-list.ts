import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Páginas
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { ReservaView } from '../../model/ReservaView';
import { Disciplina } from '../../model/Disciplina';
import { Departamento } from '../../model/Departamento';

//Provedores
import { ReservaVisitanteServiceProvider } from '../../providers/reserva-visitante-service/reserva-visitante-service';
import { DepartamentoServiceProvider } from '../../providers/departamento-service/departamento-service';
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';


@IonicPage()
@Component({
  selector: 'page-reserva-visitante-list',
  templateUrl: 'reserva-visitante-list.html',
})
export class ReservaVisitanteListPage {

  private reservas:Array<ReservaView>;
  private disciplinas:Array<Disciplina>;
  private departamentos:Array<Departamento>;

  departamentoSelecionado = undefined;
  disciplinaSelecionada = undefined;
  reservasNaoEncontrada:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl:MenuController,
    private alertCtrl:AlertController, private storage:Storage, private loadingCtrl:LoadingController,
    private reservaVisitanteService:ReservaVisitanteServiceProvider,
    private departamentoService:DepartamentoServiceProvider,
    private disciplinaService:DisciplinaServiceProvider) {


    this.menuCtrl.enable(false);
    this.reservas = new Array<ReservaView>();
    this.disciplinas = new Array<Disciplina>();
    this.departamentos = new Array<Departamento>();
    this.carregarTodosDepartamentos();
  }

  //Carrega todos os departamentos do banco de dados
  carregarTodosDepartamentos(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando departamentos...'
    });

    this.departamentoService.carregarTodosDepartamentos()
      .then( (departamentos:Array<Departamento>) => {
        if(departamentos.length > 0){
          this.departamentos = departamentos;
          this.storage.set("departamentos", departamentos);
          loading.dismiss().then(() => {
              //this.navCtrl.setRoot(ReservaListPage);
          });
        }else{
          loading.dismiss();
          this.presentConfirm("Nenhum departamento foi encontrado");
        }

        } )
      .catch( (error) => {
        loading.dismiss();
        this.presentConfirm(error.message);
      });

  }

  //Carrega todas as dicipinas referente a um determinado departamento
  carregarDisciplinasPorDepartamento(id_departamento:number){

      let loading = this.loadingCtrl.create({
        content: 'Carregando disciplinas...'
      });

      this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
        .then( (disciplinas:Array<Disciplina>) => {
          if(disciplinas.length > 0){
            this.disciplinas = disciplinas;
            this.storage.set("disciplinas", disciplinas);
            loading.dismiss().then(() => {
                //this.navCtrl.setRoot(ReservaListPage);
            });
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


  openReserva(event, reserva:ReservaView){
      this.navCtrl.push(ReservaDetailPage, {
        item: reserva
      });
  }

 //Caso o usuário selecione algum departamento
 //carregar todas disciplinas referente ao departamento
 changeDepartamento(valor){
   this.departamentoSelecionado = valor;

   if(valor != undefined)
    this.carregarDisciplinasPorDepartamento(valor);

 }

 changeDisciplina(valor){
   this.disciplinaSelecionada = valor;

   let loading = this.loadingCtrl.create({
     content: 'Carregando reservas...'
   });

   this.reservaVisitanteService.
   carregarReservaVisitante(this.departamentoSelecionado, this.disciplinaSelecionada)
   .then((reservas:Array<ReservaView>) => {
     if(reservas.length > 0){
       this.reservas = reservas;
       this.storage.set("reservas", reservas);
       this.reservasNaoEncontrada = false;
       loading.dismiss().then(() => {
           //this.navCtrl.setRoot(ReservaListPage);
       });
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
