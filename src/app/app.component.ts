import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ReservaListPage } from '../pages/reserva-list/reserva-list';
import { Login } from '../model/Login';
import { LoginPage } from '../pages/login/login';
import { AjudaUsuarioPage } from '../pages/ajuda-usuario/ajuda-usuario';
import { ReservaSearchPage } from '../pages/reserva-search/reserva-search';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //LoginPage
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  login: Login;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private storage:Storage, private menuCtrl:MenuController, private events:Events) {
    this.login = new Login();
    this.verificarUsuarioLogado();
    this.initializeApp();

    this.events.subscribe("userloggedin", (user:Login) => {
        this.login = user;
    });

    this.pages = [
      { title: 'Reservas', component: ReservaListPage },
      { title: 'Ajuda Usuários', component: AjudaUsuarioPage }

    ];

  }


  async verificarUsuarioLogado(){
    await this.storage.get("login").then((login: Login) => {
      this.login = login;
    } );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.storage.set("login", new Login());
    this.nav.setRoot(LoginPage);
    this.events.publish("userloggedin", new Login());
  }



}
