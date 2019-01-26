import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder } from '@angular/forms';

//Pages
import { EsqueceuSenhaPage } from '../esqueceu-senha/esqueceu-senha';
import { HomePage } from '../home/home';
import { ReservaVisitanteListPage } from '../reserva-visitante-list/reserva-visitante-list';
//Providers
import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { ReservaServiceProvider } from './../../providers/reserva-service/reserva-service';
import { SalaServiceProvider } from './../../providers/sala-service/sala-service';
//Models
import { apresentarErro } from '../../util/util';
import { UsuarioGraphql } from '../../model/Usuario.graphql';
import { SalaGraphql } from '../../model/Sala.graphql';
import { ReservaGraphql } from '../../model/Reserva.graphql';

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


  salas:Array<SalaGraphql>;
  minhasReservas:Array<ReservaGraphql>;
  usuario:UsuarioGraphql;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private menuCtrl: MenuController, private storage:Storage, private loginService:LoginServiceProvider,
  private ev:Events, private loadingCtrl: LoadingController, private salaService:SalaServiceProvider,
  private reservaService:ReservaServiceProvider, private alertCtrl:AlertController, private formBuilder: FormBuilder) {


    this.salas = new Array<SalaGraphql>();
    this.minhasReservas = new Array<ReservaGraphql>();
    this.usuario = new UsuarioGraphql();


    //Check the option 'keepConnected' is marked
    this.storage.get("keepConnected").then( (value) =>{
      this.keepConnected = value;
      if(value == true){
        this.storage.get("clicouSair").then((clicouSair) => {
          //Only fill login field and password field on login screen
          if(clicouSair == true){
            this.storage.get("email").then((res) => {
              this.email = res;
            });
            this.storage.get("senha").then((res) => {
              this.senha = res;
            });
          }
          else{
            //To do automatic login
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

    //Create the validation form
    this.loginForm = this.formBuilder.group({
      senha:['',Validators.required],
      email:['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-. ]+$')
      ])]
    });


  }

  /**
   * Save user state, if him clicked on "Matenha-me conectado"
   */
  saveConnected(event) {
    this.keepConnected = event.checked;
  }

  /**
   * Show password for user or hide password for user
   */
  toggleSenha(){
      if(this.senhaShow){
        this.senhaShow = false;
        this.senhaType = 'password';
      } else{
        this.senhaShow = true;
        this.senhaType = 'text';
      }
  }

  /**
   * Capture keyboard event 
   * when user to press key 'Enter', to do login
   * @param event keyboard event, show which keys the user is clicking
   */
  handleKeyboardEvents(event: KeyboardEvent){
    var key = event.which || event.keyCode;
    if(key == 13)
      this.login();
  }

  /**
   * 
   */
  ionViewCanEnter(){
    this.senha = '';
    this.menuCtrl.enable(true);
  }

  /**
   * Do automatic login
   */
  loginAutomatico(){
    let loading = this.loadingCtrl.create({
      content: 'Acessando sua conta...'
    });

    loading.present();
    this.loginService.confirmLogin(this.email.toLowerCase().trim(), this.senha.trim())
      .then( (usuario:UsuarioGraphql) => {
          this.ev.publish("userloggedin", usuario);
          this.storage.set("login", usuario);
          this.usuario = usuario;
          this.storage.set("keepConnected", this.keepConnected);
          this.storage.set("senha", this.senha);
          this.storage.set("email", this.email);
          this.storage.set("clicouSair", false);
          this.carregarSalasPorDepartamento(this.usuario.departamento.id, loading);
       
        } )
      .catch( (error) => {
        loading.dismiss();
        apresentarErro(this.alertCtrl,error);
      });
  }

  /**
   * Do login
   */
  login(){
   this.validarLogin();

    if(!this.errorEmail && !this.errorSenha){

      let loading = this.loadingCtrl.create({
        content: 'Acessando a sua conta...'
      });

      loading.present();
      this.loginService.confirmLogin(this.email.toLowerCase().trim(), this.senha.trim())
        .then( (usuario:UsuarioGraphql) => {
            this.ev.publish("userloggedin", usuario);
            this.storage.set("login", usuario);
            this.usuario = usuario;
            this.storage.set("keepConnected", this.keepConnected);
            this.storage.set("senha", this.senha);
            this.storage.set("email", this.email);
            this.storage.set("clicouSair", false);
            this.carregarSalasPorDepartamento(this.usuario.departamento.id, loading);
          } )
        .catch( (error) => {
          loading.dismiss();
          apresentarErro(this.alertCtrl,error);
        });
    }

  }

  /**
   * Load all the rooms of a specific department
   * @param id_departamento solicited department
   * @param loading loadin component
   */
  carregarSalasPorDepartamento(id_departamento:number, loading:any){

      loading.setContent("Sincronizando com o banco...");
      this.salaService.carregarSalaPorDepartamento(id_departamento)
        .then( (salas:Array<SalaGraphql>) => {
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
          apresentarErro(this.alertCtrl,error.message);
        });
  }

  /**
   * Update the user's reservation list
   * @param loading loading component
   */
  atualizarMinhasReservas(loading:any){
    this.reservaService.carregarMinhasReservas(this.usuario.id)
      .then( (reservas:Array<ReservaGraphql>) => {
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

  /**
   * Validate the email and password
   */
  validarLogin(){
        let{email, senha} = this.loginForm.controls;

        if(!this.loginForm.valid){
          if(!email.valid){
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

  /**
   * Redirect the user to page of change password  
   */
  irParaAlterarSenha(){
    this.navCtrl.push(EsqueceuSenhaPage);
  }

  /**
   * Redirect the user to visitor page 
   */
  entrarVisitante(){
    this.navCtrl.push(ReservaVisitanteListPage);
  }

}
