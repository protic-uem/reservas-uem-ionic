import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { Reserva} from '../../model/Reserva';
import { Validators, FormBuilder } from '@angular/forms';
import { parse, format, isSunday, isSaturday, addWeeks, addMonths } from 'date-fns';
import { Storage } from '@ionic/storage';
import { ReservaCreate2Page } from '../reserva-create2/reserva-create2';

//Modelos
import { Disciplina } from '../../model/Disciplina';
import { Departamento } from '../../model/Departamento';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { Periodo } from '../../model/Periodo';
import { Usuario } from '../../model/Usuario';

//Provedores
import { ReservaVisitanteServiceProvider } from '../../providers/reserva-visitante-service/reserva-visitante-service';
import { DepartamentoServiceProvider } from '../../providers/departamento-service/departamento-service';
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';



@IonicPage()
@Component({
  selector: 'page-reserva-create',
  templateUrl: 'reserva-create.html',
})
export class ReservaCreatePage {

   reserva:Reserva;

   //variáveis para a validação de erros nos input's
   reservaForm:any;
   usuarios:Array<Usuario>;

   usuarioSelecionado:Usuario;

   departamentoDIN:number = 1;

   login:Login;
   dataDocente:string;
   hoje:string;

   periodo:Periodo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
    private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
    private formBuilder:FormBuilder, private departamentoService:DepartamentoServiceProvider,
    private salaService:SalaServiceProvider, private reservaService:ReservaServiceProvider,
    private usuarioService:UsuarioServiceProvider) {

      this.reserva = new Reserva;
      this.login = new Login();
      this.usuarioSelecionado = new Usuario();

      this.hoje = format(new Date(), 'YYYY-MM-DD');


      //Criar o formulário de validação
      this.reservaForm = formBuilder.group({
        data:['',Validators.required],
        periodo:['',Validators.required],
        usuario:['',Validators.nullValidator]
      });

      //pegando usuário
      this.login = this.navParams.get('login');
      if(this.login.nome == undefined)
        this.loadResources();//pegar o usuário logado e depois carregar as reservas

        //Caso seja docente, só podera realizar reservas de 3 semanas a referente
        //Caso seja secretário, poderá 1 mês a frente
        if(this.login.nome != undefined){
          if(this.login.privilegio == 'Docente')
            this.dataDocente = format(addWeeks(new Date(), 3), 'YYYY-MM-DD');
          else {
            this.dataDocente = format(addMonths(new Date(), 1), 'YYYY-MM-DD');
            this.carregarTodosUsuariosDocentesPorDepartamento(this.departamentoDIN);
          }
      }

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

  avancarCreate(){
      if(this.usuarioSelecionado.nome != undefined)
        this.reserva.id_usuario = this.usuarioSelecionado.id;

      this.navCtrl.push(ReservaCreate2Page, {
        item: this.reserva,
        login: this.login
      }, {animate: true, animation:'ios-transition', direction: 'forward', duration:1000});
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
          loading.dismiss().then(() => {
              //this.navCtrl.setRoot(ReservaListPage);
          });
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


  //validar se todos os campos foram preenchidos
  validarReserva(){
    let{data, periodo} = this.reservaForm.controls;
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
