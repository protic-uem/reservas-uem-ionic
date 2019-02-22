import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { parse, format, isSunday, isSaturday } from 'date-fns';
import { Storage } from '@ionic/storage';

//Modelos
import { Periodo } from '../../model/Periodo';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { DisciplinaGraphql } from '../../model/Disciplina.grapqhql';
import { UsuarioGraphql } from '../../model/Usuario.graphql';
import { SalaGraphql } from '../../model/Sala.graphql';

//Provedores
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { apresentarErro, apresentarToast } from '../../util/util';
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';




@Component({
  selector: 'page-reserva-create-search',
  templateUrl: 'reserva-create-search.html',
})
export class ReservaCreateSearchPage {

  reserva:ReservaGraphql;
  periodo:Periodo;

 //if true,it desative the discipline input
 disciplinaDisabled = true;

  disciplinas:Array<DisciplinaGraphql>;
  usuarios:Array<UsuarioGraphql>;


  disciplinaSelecionada:DisciplinaGraphql;
  salaSelecionada:SalaGraphql;
  usuarioSelecionado:UsuarioGraphql;


  login:UsuarioGraphql;
  hoje:string;

  classe:string = "docente";
  classeIonCard:string = "ionCardDocente";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
    private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
    private reservaService:ReservaServiceProvider, private usuarioService:UsuarioServiceProvider) {


      this.reserva = new ReservaGraphql();
      this.periodo = new Periodo();
      this.usuarios = new Array<UsuarioGraphql>();
      this.disciplinas = new Array<DisciplinaGraphql>();
      this.login = new UsuarioGraphql();
      this.disciplinaSelecionada = new DisciplinaGraphql();
      this.usuarioSelecionado = new UsuarioGraphql();
      this.salaSelecionada = new SalaGraphql();


      this.reserva =  this.navParams.get('item');
      this.salaSelecionada = this.navParams.get('sala');


      //getting the user
      this.login = this.navParams.get('login');
      if(this.login.nome == undefined)
        this.loadResources();
      else{
        if(this.login.privilegio == "Secretário"){
          this.classe = "secretario";
          this.classeIonCard = "ionCardSecretario";
        }else{
          this.usuarioSelecionado.id = this.login.id;
        }
          this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
        }


  }

  /**
   * Loads resources
   */
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
          this.login = new UsuarioGraphql();
        }
      });
  }


  //Carrega as disciplinas de acordo com o privilégio do usuário
  /**
   * Loads the disciplines according user privilege
   * @param privilegio user's privilege
   */
  carregarDisciplinaPorPrivilegio(privilegio:string){
    if(privilegio == "Docente"){
        this.reserva.usuario = this.login;
        this.carregarDisciplinasPorUsuario(this.login.id);
        }
    else if(privilegio == "Secretário"){
      this.carregarTodosUsuariosDocentesPorDepartamento(this.login.departamento.id);
    }
  }

  /**
   * Loads users according department
   * @param id_departamento department's id
   */
  carregarTodosUsuariosDocentesPorDepartamento(id_departamento: number){
    let loading = this.loadingCtrl.create({
      content: 'Carregando usuarios...'
    });
    loading.present();

    this.usuarioService.carregarTodosDocentesPorDepartamento(id_departamento)
      .then( (usuarios:Array<UsuarioGraphql>) => {
        if(usuarios.length > 0){
          this.usuarios = usuarios;
          this.storage.set("usuarios", usuarios);
          loading.dismiss();
        }else{
          loading.dismiss();
          apresentarErro(this.alertCtrl, "Nenhum usuario docente foi encontrado");
        }
        } )
      .catch( (error) => {
        loading.dismiss();
        apresentarErro(this.alertCtrl, error.message);
      });
  }

  /**
   * Loads all disciplines according a specific user
   * @param id_usuario user's id
   */
  carregarDisciplinasPorUsuario(id_usuario:number){

      let loading = this.loadingCtrl.create({
        content: 'Carregando disciplinas...'
      });
      loading.present();
      this.disciplinaService.carregarDisciplinasPorUsuario(id_usuario)
        .then( (disciplinas:Array<DisciplinaGraphql>) => {
          if(disciplinas.length > 0){
            this.disciplinas = disciplinas;
            this.storage.set("disciplinas", disciplinas);
            loading.dismiss().then(() => {
            });
          }else{
            loading.dismiss();
            apresentarErro(this.alertCtrl, "Nenhuma disciplina foi encontrada para esse usuário");
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          apresentarErro(this.alertCtrl, error.message);
        });

  }

  /**
   * Loads all discipline according a specific department
   * @param id_departamento department's id
   */
  carregarDisciplinasPorDepartamento(id_departamento:number){

      let loading = this.loadingCtrl.create({
        content: 'Carregando disciplinas...'
      });
      loading.present();
      this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
        .then( (disciplinas:Array<DisciplinaGraphql>) => {
          if(disciplinas.length > 0){
            this.disciplinas = disciplinas;
            this.storage.set("disciplinas", disciplinas);
            loading.dismiss().then(() => {
            });
          }else{
            loading.dismiss();
            apresentarErro(this.alertCtrl, "Nenhuma disciplina foi encontrada para reste usuário");
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          apresentarErro(this.alertCtrl, error.message);
        });
  }

  /**
   * Every time that a user is chosen, your disciplines are loaded
   * @param usuario user
   */
  changeUsuario(usuario){
    if(usuario != undefined)
      this.carregarDisciplinasPorUsuario(usuario.id);
  }


  /**
   * Creates a reservation
   */
  reservaCreate(){

    if(this.validarReserva()){
        this.reserva.departamento = this.login.departamento;

        if(this.reserva.tipo_uso == "Teórica" || this.reserva.tipo_uso == "Prática")
          this.reserva.disciplina = this.disciplinaSelecionada;

        if(this.usuarioSelecionado.id != undefined)
          this.reserva.usuario = this.usuarioSelecionado;

        this.reserva.data_solicitacao = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        this.reserva.status = "Aceito";

        if(this.login.privilegio == "Docente")
          this.reserva.tipo_reserva = "Eventual";

        this.reservaConfirm();
      }

  }

  /**
   * Validate if all fields were filled
   */
  validarReserva(){
    if(this.login.privilegio == "Docente")
      if(this.reserva.tipo_uso == undefined || this.disciplinaSelecionada.id == undefined){
          apresentarErro(this.alertCtrl, 'Por favor, preencha todos os campos');
        return false;
      }else{
        return true;
      }
    else
      if(this.reserva.tipo_uso == undefined || this.reserva.tipo_reserva == undefined || this.usuarioSelecionado.id == undefined){
          apresentarErro(this.alertCtrl, 'Por favor, preencha todos os campos');
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

  let msg: string;

  if(this.disciplinaSelecionada != undefined && this.disciplinaSelecionada.id != undefined)
    msg = '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
    '<b>Disciplina:</b> '+(this.disciplinaSelecionada.codigo == undefined?'':this.disciplinaSelecionada.codigo+'-'+this.disciplinaSelecionada.turma)+'<br/>'+
    '<b>Data reservada:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY')+'<br/>'+
    '<b>Horário reservado:</b> '+this.periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
    '<b>Tipo de uso:</b> '+this.reserva.tipo_uso;
  else
    msg = '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
    '<b>Data reservada:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY')+'<br/>'+
    '<b>Horário reservado:</b> '+this.periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
    '<b>Tipo de uso:</b> '+this.reserva.tipo_uso;


    const alert = this.alertCtrl.create({
      title:'Tem certeza?',
      message: msg,
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
  cadastrarReserva(reserva:ReservaGraphql){

  let loading = this.loadingCtrl.create({
    content: 'Solicitando reserva...'
  });

    loading.present();


    this.reservaService.cadastrarReserva(reserva)
      .then((result:any) => {
        if(result){
          loading.dismiss().then(() => {
            this.navCtrl.setRoot(ReservaDetailPage, {
              login:this.login,
              item:result,
              page:"create-reserva"
            });
              apresentarToast(this.toastCtrl, "Reserva Cadastrada com sucesso!");
          });
        }else{
          loading.dismiss();
          apresentarErro(this.alertCtrl, "Houve um problema ao solicitar a reserva");
        }

        } )
      .catch((error) => {
        loading.dismiss();
        apresentarErro(this.alertCtrl, error.message);
      });
  }

  //apresenta o Toast de reserva cancelada
  reservaCanceled(){
        this.navCtrl.pop();
  }






}
