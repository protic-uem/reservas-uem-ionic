import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, Events, AlertController } from 'ionic-angular';
import { ReservaMyPage } from '../reserva-my/reserva-my';
import { ReservaVisitanteListPage } from '../reserva-visitante-list/reserva-visitante-list';
import { Storage } from '@ionic/storage';
import { LoginServiceProvider } from './../../providers/login-service/login-service';
import { Login } from '../../model/Login';
import { Validators, FormBuilder } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  senha: string;
  loginForm:any;
  errorEmail = false;
  errorSenha = false;
  messageEmail = "";
  messageSenha = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private menuCtrl: MenuController, private storage:Storage, private loginService:LoginServiceProvider,
  private ev:Events, private loadingCtrl: LoadingController,
  private alertCtrl:AlertController, private formBuilder: FormBuilder) {

    this.storage.get("login")
        .then( (value) => {
          if (value) { this.senha = '' } });

          //Criar o formulário de validação
          this.loginForm = formBuilder.group({
            senha:['',Validators.required],
            email:['', Validators.compose([
          		Validators.required,
          		Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          	])]
          });

  }

  ionViewCanEnter(){
    this.senha = '';
    this.menuCtrl.enable(false);
  }

  //Realiza o login
  login(){
    this.validarLogin();

    if(!this.errorEmail && !this.errorSenha){
      let loading = this.loadingCtrl.create({
        content: 'Por favor, aguarde...'
      });

      loading.present();
      this.loginService.confirmLogin(this.email.toLowerCase(), this.senha)
        .then( (login:Login) => {
          if(login.id !== undefined){
            console.log("login nome:"+login.nome);
            this.ev.publish("userloggedin", login);
            this.storage.set("login", login);
            loading.dismiss().then(() => {
                this.navCtrl.setRoot(ReservaMyPage);
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
