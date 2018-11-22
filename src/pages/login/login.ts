import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, Events, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ReservaVisitanteListPage } from '../reserva-visitante-list/reserva-visitante-list';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { SalaServiceProvider } from './../../providers/sala-service/sala-service';
import { ReservaServiceProvider } from './../../providers/reserva-service/reserva-service';


import { Sala } from '../../model/Sala';
import { ReservaView } from '../../model/ReservaView';
import { Login } from '../../model/Login';


import { Validators, FormBuilder } from '@angular/forms';
import { EsqueceuSenhaPage } from '../esqueceu-senha/esqueceu-senha';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class LoginPage {


  email: string;
  senha: string;
  loginForm:any;
  errorEmail = false;
  errorSenha = false;
  messageEmail = "";
  messageSenha = "";

  senhaType:string = 'password';
  senhaShow:boolean = false;
  keepConnected:boolean;
  departamentoDIN:number = 1;


  salas:Array<Sala>;
  minhasReservas:Array<ReservaView>;
  usuario:Login;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private menuCtrl: MenuController, private storage:Storage, private loginService:LoginServiceProvider,
  private ev:Events, private loadingCtrl: LoadingController, private salaService:SalaServiceProvider,
  private reservaService:ReservaServiceProvider, private alertCtrl:AlertController, private formBuilder: FormBuilder) {


    this.salas = new Array<Sala>();
    this.minhasReservas = new Array<ReservaView>();
    this.usuario = new Login();

    this.storage.get("login")
        .then( (value) => {
          if (value.id != undefined) {
            this.senha = ''
          } });

    //verifica se a opção manterConectado está marcada
    this.storage.get("keepConnected").then( (value) =>{
      this.keepConnected = value;
      if(value == true){
        this.storage.get("clicouSair").then((clicouSair) => {
          //Apenas preenche os campos de login e senha da tela de Login
          if(clicouSair == true){
            this.storage.get("email").then((res) => {
              this.email = res;
            });
            this.storage.get("senha").then((res) => {
              this.senha = res;
            });
          }
          else{
            //Faça o login automático
            this.storage.get("email").then((res) => {
              this.email = res;
              if(this.email != '' && this.senha != ''){
                this.loginAutomatico();
              }
            });
            this.storage.get("senha").then((res) => {
              this.senha = res;
              if(this.email != '' && this.senha != ''){
                this.loginAutomatico();
              }
            });
          }
        });
      }
    });

          //Criar o formulário de validação
          this.loginForm = this.formBuilder.group({
            senha:['',Validators.required],
            email:['', Validators.compose([
          		Validators.required,
          		Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-. ]+$')
          	])]
          });


  }

  saveConnected(event) {
    this.keepConnected = event.checked;
  }

  public toggleSenha(){
      if(this.senhaShow){
        this.senhaShow = false;
        this.senhaType = 'password';
      } else{
        this.senhaShow = true;
        this.senhaType = 'text';
      }
  }

  handleKeyboardEvents(event: KeyboardEvent){
    var key = event.which || event.keyCode;
    if(key == 13)
      this.login();
  }

  ionViewCanEnter(){
    this.senha = '';
    this.menuCtrl.enable(true);
  }

  //Realiza o login automatico
  loginAutomatico(){
    let loading = this.loadingCtrl.create({
      content: 'Acessando sua conta...'
    });

    loading.present();
    this.loginService.confirmLogin(this.email.toLowerCase().trim(), this.senha.trim())
      .then( (login:Login) => {
        if(login.id !== undefined){
          this.ev.publish("userloggedin", login);
          this.storage.set("login", login);
          this.usuario = login;
          this.storage.set("keepConnected", this.keepConnected);
          this.storage.set("senha", this.senha);
          this.storage.set("email", this.email);
          this.storage.set("clicouSair", false);
            this.carregarSalasPorDepartamento(this.departamentoDIN, loading);
        }else{
          loading.dismiss();
          this.presentConfirm("usuário e/ou senha incorreto");
        }

        } )
      .catch( (error) => {
        loading.dismiss();
        this.presentConfirm(error);
      });
  }

  //Realiza o login debugger;
  login(){
   this.validarLogin();

    if(!this.errorEmail && !this.errorSenha){
      let loading = this.loadingCtrl.create({
        content: 'Acessando a sua conta...'
      });

      loading.present();
      this.loginService.confirmLogin(this.email.toLowerCase().trim(), this.senha.trim())
        .then( (login:Login) => {
          if(login.id !== undefined){
            this.ev.publish("userloggedin", login);
            this.storage.set("login", login);
            this.usuario = login;
            this.storage.set("keepConnected", this.keepConnected);
            this.storage.set("senha", this.senha);
            this.storage.set("email", this.email);
            this.storage.set("clicouSair", false);
              this.carregarSalasPorDepartamento(this.departamentoDIN, loading);
          }else{
            loading.dismiss();
            this.presentConfirm("usuário e/ou senha incorreto");
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          this.presentConfirm(error);
        });
    }

  }

  //Carrega todas as salas referente a um determinado departamento
  carregarSalasPorDepartamento(id_departamento:number, loading:any){

      loading.setContent("Sincronizando com o banco...");
      this.salaService.carregarSalaPorDepartamento(id_departamento)
        .then( (salas:Array<Sala>) => {
          if(salas.length > 0){
            this.salas = salas;
            this.storage.set("salasDepartamento", salas);
              this.atualizarMinhasReservas(loading);
          }else{
            loading.dismiss();
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          this.presentConfirm(error.message);
        });
  }

  atualizarMinhasReservas(loading:any){
    this.reservaService.carregarMinhasReservas(this.usuario.id)
      .then( (reservas:Array<ReservaView>) => {
        if(reservas.length > 0){
          this.storage.set("minhasReservas", reservas);
          loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage, {
              login: this.storage.get("login")
            });
          });
        }else{
          loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage, {
              login: this.storage.get("login")
            });
          });
        }
      } )
      .catch( () => "Erro na requisição de minhas reservas" );
  }

  //Validar se o email e senha foram digitados corretamente
  validarLogin(){
        let{email, senha} = this.loginForm.controls;

        if(!this.loginForm.valid){
          if(!email.valid){
            console.log("Email inválido");
            this.errorEmail = true;
            this.messageEmail = "Email inválido";
          }else{
            this.messageEmail = '';
          }

          if(!senha.valid){
            this.errorSenha = true;
            this.messageSenha = "Senha é obrigatório";
          }else{
            this.messageSenha = '';
          }
        }else{
          this.errorEmail = false;
          this.errorSenha = false;
        }
  }

  //redireciona o usuário para a página de alteração de senha
  irParaAlterarSenha(){
    this.navCtrl.push(EsqueceuSenhaPage);
  }

//Caso ocorrar algum erro, apresente o erro ao usuário
  presentConfirm(error:string) {
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Houve um erro na requisição de login: '+error,
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

  //Acessa a aplicação como visitante, sem privilégios
  entrarVisitante(){
    this.navCtrl.push(ReservaVisitanteListPage);
  }

}
