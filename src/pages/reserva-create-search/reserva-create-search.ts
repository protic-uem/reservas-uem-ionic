import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { parse, format, isSunday, isSaturday } from 'date-fns';
import { Storage } from '@ionic/storage';
import { ReservaMyPage } from '../reserva-my/reserva-my';

//Modelos
import { Disciplina } from '../../model/Disciplina';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { Periodo } from '../../model/Periodo';
import { Usuario } from '../../model/Usuario';
import { Reserva} from '../../model/Reserva';


//Provedores
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';



@Component({
  selector: 'page-reserva-create-search',
  templateUrl: 'reserva-create-search.html',
})
export class ReservaCreateSearchPage {

reserva:Reserva;

 //caso verdadeiro, desativa o input de disciplina
 disciplinaDisabled = true;

  disciplinas:Array<Disciplina>;
  usuarios:Array<Usuario>;


  disciplinaSelecionada:Disciplina;
  salaSelecionada:Sala;
  usuarioSelecionado:Usuario;


  departamentoDIN:number = 1;

  login:Login;
  hoje:string;

  classe:string = "docente";
  classeIonCard:string = "ionCardDocente";

  etapas:string = "etp2";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
    private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
    private reservaService:ReservaServiceProvider, private usuarioService:UsuarioServiceProvider) {


      this.reserva = new Reserva;
      this.usuarios = new Array<Usuario>();
      this.disciplinas = new Array<Disciplina>();
      this.login = new Login();
      this.disciplinaSelecionada = new Disciplina();
      this.usuarioSelecionado = new Usuario();
      this.salaSelecionada = new Sala();


      this.reserva =  this.navParams.get('item');
      this.salaSelecionada = this.navParams.get('sala');


      //pegando usuário
      this.login = this.navParams.get('login');
      if(this.login.nome == undefined)
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
      else{
        if(this.login.privilegio == "Secretário")
          this.classe = "secretario";
          this.classeIonCard = "ionCardSecretario";
          this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
        }





  }


  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          if(this.login.privilegio == "Secretário"){
            this.classe = "secretario";
            this.classeIonCard = "ionCardSecretario";
          }
          if(this.login.id!= undefined)
              this.carregarDisciplinaPorPrivilegio(this.login.privilegio);

        } else {
          this.login = new Login();
        }
      });
  }


  //Carrega as disciplinas de acordo com o privilégio do usuário
  carregarDisciplinaPorPrivilegio(privilegio:string){
    if(privilegio == "Docente"){
        this.reserva.id_usuario = this.login.id;
        this.carregarDisciplinasPorUsuario(this.login.id);
        }
    else if(privilegio == "Secretário"){
      this.carregarTodosUsuariosDocentesPorDepartamento(this.departamentoDIN);
    }
  }


  carregarTodosUsuariosDocentesPorDepartamento(id_departamento: number){
    let loading = this.loadingCtrl.create({
      content: 'Carregando usuarios...'
    });
    loading.present();

    this.usuarioService.carregarTodosDocentesPorDepartamento(id_departamento)
      .then( (usuarios:Array<Usuario>) => {
        if(usuarios.length > 0){
          this.usuarios = usuarios;
          this.storage.set("usuarios", usuarios);
          loading.dismiss();
        }else{
          loading.dismiss();
          this.apresentarErro("Nenhum usuario docente foi encontrado");
        }
        } )
      .catch( (error) => {
        loading.dismiss();
        this.apresentarErro(error.message);
      });
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
            });
          }else{
            loading.dismiss();
            this.apresentarErro("Nenhuma disciplina foi encontrada para reste usuário");
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          this.apresentarErro(error.message);
        });
  }

  //Toda vez que um usuário é escolhido, suas disciplinas são carregadas
  changeUsuario(usuario){
    if(usuario != undefined)
      this.carregarDisciplinasPorUsuario(usuario.id);

  }


  //cria uma reserva
  reservaCreate(){

    if(this.validarReserva()){

        this.reserva.id_departamento = this.departamentoDIN;

        if(this.reserva.tipo_uso == "Teórica" || this.reserva.tipo_uso == "Prática")
          this.reserva.id_disciplina = this.disciplinaSelecionada.id;

        if(this.usuarioSelecionado.id != undefined)
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
    if(this.login.privilegio == "Docente")
      if(this.reserva.tipo_uso == undefined || this.disciplinaSelecionada.id == undefined){
          this.apresentarErro('Por favor, preencha todos os campos');
        return false;
      }else{
        return true;
      }
    else
      if(this.reserva.tipo_uso == undefined || this.reserva.tipo_reserva == undefined || this.usuarioSelecionado.id == undefined){
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
                '<b>Disciplina:</b> '+(this.disciplinaSelecionada.codigo == undefined?'':this.disciplinaSelecionada.codigo+'-'+this.disciplinaSelecionada.turma)+'<br/>'+
                '<b>Data reservada:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY')+'<br/>'+
                '<b>Horário reservado:</b> '+Periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
                '<b>Tipo de uso:</b> '+this.reserva.tipo_uso,

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

    alert.setMode("ios");
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
                message: result,
                duration: 5000
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
        this.navCtrl.pop();
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
