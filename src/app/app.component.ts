import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ReservaListPage } from '../pages/reserva-list/reserva-list';
import { Login } from '../model/Login';
import { LoginPage } from '../pages/login/login';
import { AjudaUsuarioPage } from '../pages/ajuda-usuario/ajuda-usuario';
import { ReservaSearchPage } from '../pages/reserva-search/reserva-search';
import { ReservaCreatePage } from '../pages/reserva-create/reserva-create';
import { ReservaMyPage } from '../pages/reserva-my/reserva-my';
import { CreateSegmentPage } from '../pages/create-segment/create-segment';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //LoginPage
  rootPage: any = LoginPage;
  pages: Array<{icon: string, title: string, component: any}>;
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
      { icon: 'add', title: 'Solicitar Reserva', component: ReservaCreatePage },
      { icon: 'search', title: 'Consultar Reservas', component: ReservaSearchPage },
      { icon: 'filing', title: 'Minhas Reservas', component: ReservaMyPage },
      { icon: 'help-buoy', title: 'Ajuda Usuários', component: AjudaUsuarioPage }

    ];

  }


  async verificarUsuarioLogado(){
    await this.storage.get("login").then((login: Login) => {
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
    this.storage.set("login", new Login());
    this.nav.setRoot(LoginPage);
    this.events.publish("userloggedin", new Login());
  }



}
