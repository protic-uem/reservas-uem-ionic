import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { AjudaUsuarioPage } from '../pages/ajuda-usuario/ajuda-usuario';
import { ReservaSearchPage } from '../pages/reserva-search/reserva-search';
import { ReservaMyPage } from '../pages/reserva-my/reserva-my';
import { CreateSegmentPage } from '../pages/create-segment/create-segment';
import { HomePage } from '../pages/home/home';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { ConexaoProvider } from '../providers/conexao/conexao';
import { UsuarioGraphql } from '../model/Usuario.graphql';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //LoginPage
  rootPage: any = LoginPage;
  pages: Array<{icon: string, title: string, component: any}>;
  login: UsuarioGraphql;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private storage:Storage, private events:Events, private loginService:LoginServiceProvider) {
    this.login = new UsuarioGraphql();
    this.verificarUsuarioLogado();
    this.initializeApp();

    this.events.subscribe("userloggedin", (user:UsuarioGraphql) => {
        this.login = user;
    });

    this.pages = [
      { icon: 'home', title:"Inicio", component: HomePage},
      { icon: 'add', title: 'Solicitar Reserva', component: CreateSegmentPage },
      { icon: 'search', title: 'Consultar Reservas', component: ReservaSearchPage },
      { icon: 'filing', title: 'Minhas Reservas', component: ReservaMyPage },
      { icon: 'help-buoy', title: 'Ajuda Usuários', component: AjudaUsuarioPage }

    ];

  }


  async verificarUsuarioLogado(){
    await this.storage.get("login").then((login: UsuarioGraphql) => {
      this.login = login;
    } );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }

  openPage(page) {

      this.nav.setRoot(page.component,
      {login: this.login});

  }

  logout() {
    this.storage.set("login", new UsuarioGraphql());
    this.storage.set("clicouSair", true);
    this.nav.setRoot(LoginPage);
    this.events.publish("userloggedin", new UsuarioGraphql());

    ConexaoProvider.token = null;
    //this.loginService.logout();


  }



}
