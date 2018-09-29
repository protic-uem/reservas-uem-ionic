import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ReservaListPage } from '../pages/reserva-list/reserva-list';
import { Login } from '../model/Login';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;
  login: Login = new Login();

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private storage:Storage, private menuCtrl:MenuController, private events:Events) {
    this.verificarUsuarioLogado();
    this.initializeApp();

    this.events.subscribe("userloggedin", (user:Login) => {
      console.log("evento:"+user.nome);
        this.login = user;
    });

    this.pages = [
      { title: 'Reservas', component: ReservaListPage }

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
