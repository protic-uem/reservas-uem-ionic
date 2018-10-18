import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, Events, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ReservaVisitanteListPage } from '../reserva-visitante-list/reserva-visitante-list';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from './../../providers/login-service/login-service';

import { Login } from '../../model/Login';
import { Validators, FormBuilder } from '@angular/forms';
import { EsqueceuSenhaPage } from '../esqueceu-senha/esqueceu-senha';



@IonicPage()
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private menuCtrl: MenuController, private storage:Storage, private loginService:LoginServiceProvider,
  private ev:Events, private loadingCtrl: LoadingController,
  private alertCtrl:AlertController, private formBuilder: FormBuilder) {


    this.storage.get("login")
        .then( (value) => {
          if (value.id != undefined) {
            this.senha = ''
          } });


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
      content: 'Por favor, aguarde...'
    });

    loading.present();
    this.loginService.confirmLogin(this.email.toLowerCase().trim(), this.senha.trim())
      .then( (login:Login) => {
        if(login.id !== undefined){
          this.ev.publish("userloggedin", login);
          this.storage.set("login", login);
          this.storage.set("keepConnected", this.keepConnected);
          this.storage.set("senha", this.senha);
          this.storage.set("email", this.email);
          this.storage.set("clicouSair", false);
          loading.dismiss().then(() => {
              this.navCtrl.setRoot(HomePage, {
                login: login
              });
          });
        }else{
          loading.dismiss();
          this.presentConfirm("usuário e/ou senha incorreto");
        }

        } )
      .catch( (error) => {
        loading.dismiss();
        this.presentConfirm(error.message);
      });
  }


  //Realiza o login
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
            this.storage.set("keepConnected", this.keepConnected);
            this.storage.set("senha", this.senha);
            this.storage.set("email", this.email);
            this.storage.set("clicouSair", false);
            loading.dismiss().then(() => {
                this.navCtrl.setRoot(HomePage, {
                  login: login
                });
            });
          }else{
            loading.dismiss();
            this.presentConfirm("usuário e/ou senha incorreto");
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          this.presentConfirm(error.message);
        });
    }

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
