import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { parse, format, isSunday, isSaturday, addWeeks, addMonths } from 'date-fns';
import { Storage } from '@ionic/storage';
import { ReservaMyPage } from '../reserva-my/reserva-my';

//Modelos
import { Disciplina } from '../../model/Disciplina';
import { Departamento } from '../../model/Departamento';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { Periodo } from '../../model/Periodo';
import { Usuario } from '../../model/Usuario';
import { Reserva} from '../../model/Reserva';


//Provedores
import { ReservaVisitanteServiceProvider } from '../../providers/reserva-visitante-service/reserva-visitante-service';
import { DepartamentoServiceProvider } from '../../providers/departamento-service/departamento-service';
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';

@IonicPage()
@Component({
  selector: 'page-reserva-create2',
  templateUrl: 'reserva-create2.html',
})
export class ReservaCreate2Page {


  reserva:Reserva;

 //variáveis para a validação de erros nos input's
 reservaForm:any;
 //caso verdadeiro, desativa o input de disciplina
 disciplinaDisabled = true;

  disciplinas:Array<Disciplina>;
  salas:Array<Sala>;
  usuarios:Array<Usuario>;

  disciplinaSelecionada:Disciplina;
  salaSelecionada:Sala;
  usuarioSelecionado:Usuario;

  departamentoDIN:number = 1;

  login:Login;
  hoje:string;

  classe:string = "docente";


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
    private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
    private formBuilder:FormBuilder, private departamentoService:DepartamentoServiceProvider,
    private salaService:SalaServiceProvider, private reservaService:ReservaServiceProvider,
    private usuarioService:UsuarioServiceProvider) {

      this.reserva = new Reserva;
      this.login = new Login();
      this.disciplinaSelecionada = new Disciplina();
      this.salaSelecionada = new Sala();

      this.hoje = format(new Date(), 'YYYY-MM-DD');

      this.reserva =  this.navParams.get('item');
      this.usuarioSelecionado = this.navParams.get('usuario');
      //Criar o formulário de validação
      this.reservaForm = formBuilder.group({
        uso:['',Validators.required],
        sala:['',Validators.required],
        disciplina:['',],
        tipoReserva:['',]
      });

      //pegando usuário
      this.login = this.navParams.get('login');
      if(this.login.nome == undefined)
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
      else{
        if(this.login.privilegio == "Secretário")
          this.classe = "secretario";

        if(this.usuarioSelecionado.id!= undefined)
          this.carregarDisciplinaPorPrivilegio(this.usuarioSelecionado.privilegio);
        else
          this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
        }


  }

  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          if(this.login.privilegio == "Secretário")
            this.classe = "secretario";

          if(this.usuarioSelecionado.id!= undefined)
              this.carregarDisciplinaPorPrivilegio(this.usuarioSelecionado.privilegio);
          else
              this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
        } else {
          this.login = new Login();
        }
      });
  }

  prevCreate(){
    this.navCtrl.pop({animate: true, animation:'ios-transition', direction: 'back'});
  }

  //Carrega as disciplinas de acordo com o privilégio do usuário
  carregarDisciplinaPorPrivilegio(privilegio:string){
    if(privilegio == "Docente"){
      if(this.usuarioSelecionado.id!= undefined){
        this.carregarDisciplinasPorUsuario(this.usuarioSelecionado.id);
        }
      else{
        this.carregarDisciplinasPorUsuario(this.login.id);
        }
      }
    else if(privilegio == "Secretário"){
      this.carregarDisciplinasPorDepartamento(this.departamentoDIN);
    }
  }

    //Carrega todas as dicipinas referente a um determinado usuario
    carregarDisciplinasPorUsuario(id_usuario:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando disciplinas...'
        });
        loading.present();
        this.disciplinaService.carregarDisciplinasPorUsuario(id_usuario)
          .then( (disciplinas:Array<Disciplina>) => {
            if(disciplinas.length > 0){
              this.disciplinas = disciplinas;
              this.storage.set("disciplinas", disciplinas);
              loading.dismiss().then(() => {
                this.carregarSalasPorDepartamento(this.departamentoDIN);
              });
            }else{
              loading.dismiss();
              this.apresentarErro("Nenhuma disciplina foi encontrada para esse usuário");
            }

            } )
          .catch( (error) => {
            loading.dismiss();
            this.apresentarErro(error.message);
          });

    }

    //Carrega todas as dicipinas referente a um determinado departamento
    carregarDisciplinasPorDepartamento(id_departamento:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando disciplinas...'
        });
        loading.present();
        this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
          .then( (disciplinas:Array<Disciplina>) => {
            if(disciplinas.length > 0){
              this.disciplinas = disciplinas;
              this.storage.set("disciplinas", disciplinas);
              loading.dismiss().then(() => {
                this.carregarSalasPorDepartamento(id_departamento);
              });
            }else{
              loading.dismiss();
              this.apresentarErro("Nenhuma disciplina foi encontrada");
            }

            } )
          .catch( (error) => {
            loading.dismiss();
            this.apresentarErro(error.message);
          });


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
                  //this.navCtrl.setRoot(ReservaListPage);
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


    //Ativa o input de disciplina, depedendo do tipo de uso escolhido
    changeUso(valor){
      if(valor == 'Prática'){
        this.disciplinaDisabled = false;
      }else if(valor == 'Teórica'){
        this.disciplinaDisabled = false;
      }
      else{
        this.disciplinaDisabled = true;
        this.disciplinaSelecionada = new Disciplina();
      }
    }


  //cria uma reserva
  reservaCreate(){

    if(this.validarReserva()){
      
        this.reserva.id_departamento = this.departamentoDIN;
        this.reserva.id_sala = this.salaSelecionada.id;

        if(this.reserva.tipo_uso == "Teórica" || this.reserva.tipo_uso == "Prática")
          this.reserva.id_disciplina = this.disciplinaSelecionada.id;

        if(this.usuarioSelecionado.id == undefined)
          this.reserva.id_usuario = this.login.id;
        else
          this.reserva.id_usuario = this.usuarioSelecionado.id;

        this.reserva.data_solicitacao = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        this.reserva.status = 1;

        if(this.login.privilegio == "Docente")
          this.reserva.tipo_reserva = "Eventual";

        this.reservaConfirm();
      }

  }

  //validar se todos os campos foram preenchidos
  validarReserva(){
    let{sala, disciplina, uso, tipoReserva} = this.reservaForm.controls;
    if(!this.reservaForm.valid){
        this.apresentarErro('Por favor, preencha todos os campos');
      return false;
    }else{
      return true;
    }

  }

  //validar se a data não é sábado ou domingo
  validarData(){
    return (isSaturday(parse(this.reserva.data_reserva)) || isSunday(parse(this.reserva.data_reserva)));

  }

  //apresenta o alerta para a confirmação dos dados da reserva
  reservaConfirm(){
    const alert = this.alertCtrl.create({
      title:'Tem certeza?',
      message:
                '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
                '<b>Disciplina:</b> '+(this.disciplinaSelecionada.codigo == undefined?'':this.disciplinaSelecionada.codigo)+'<br/>'+
                '<b>Data reservada:</b> '+this.reserva.data_reserva+'<br/>'+
                '<b>Horário reservado:</b> '+Periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
                '<b>Tipo de uso:</b> '+this.reserva.tipo_uso+'<br/>'+
                '<b>Tipo:</b> '+this.reserva.tipo_reserva,

      buttons: [
        {
          text: 'Cancelar',
          handler: () => {

          }
        },
        {
          text: 'Sim',
          handler: () => {
            //retorar um objeto de sucesso, e mostrat toast de reserva realizada com sucesso
            //na página principal de reservas
              this.cadastrarReserva(this.reserva);
          }
        }
      ]
    });

    alert.present();
  }

  //cadastrar uma reserva na base de dados
  cadastrarReserva(reserva:Reserva){

  let loading = this.loadingCtrl.create({
    content: 'Solicitando reserva...'
  });

    loading.present();


    this.reservaService.cadastrarReserva(reserva)
      .then((result:any) => {
        if(result){
          loading.dismiss().then(() => {
              this.navCtrl.setRoot(ReservaMyPage);
              let toast = this.toastCtrl.create({
                message: 'Reserva solicitada com sucesso',
                duration: 3000
              });
              toast.present();
          });
        }else{
          loading.dismiss();
          this.apresentarErro("Houve um problema ao solicitar a reserva");
        }

        } )
      .catch((error) => {
        loading.dismiss();
        this.apresentarErro(error.message);
      });
  }

  //apresenta o Toast de reserva cancelada
  reservaCanceled(){
    let toast = this.toastCtrl.create({
      message: 'Reserva cancelada',
      duration: 3000
    });
    toast.present();
        this.navCtrl.pop();

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
  alertError.present();
  }

}