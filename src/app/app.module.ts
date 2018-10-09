import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { ReservaListPage } from '../pages/reserva-list/reserva-list';
import { ReservaCreatePage } from '../pages/reserva-create/reserva-create';
import { ReservaDetailPage } from '../pages/reserva-detail/reserva-detail';
import { ReservaMyPage } from '../pages/reserva-my/reserva-my';
import { LoginPage } from '../pages/login/login';
import { ReservaVisitanteListPage } from '../pages/reserva-visitante-list/reserva-visitante-list';
import { AjudaUsuarioPage } from '../pages/ajuda-usuario/ajuda-usuario';
import { ReservaSearchPage } from '../pages/reserva-search/reserva-search';
import { ReservaCreate2Page } from '../pages/reserva-create2/reserva-create2';
import { ReservaCreateSearchPage } from '../pages/reserva-create-search/reserva-create-search';EsqueceuSenhaPage
import { EsqueceuSenhaPage } from '../pages/esqueceu-senha/esqueceu-senha';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//componentes criados
import { ComponentsModule } from '../components/components.module';

//compoentes baixados
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { CompleteServiceProvider } from '../providers/complete-service/complete-service';
import { ConexaoProvider } from '../providers/conexao/conexao';
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { UsuarioServiceProvider } from '../providers/usuario-service/usuario-service';
import { ReservaServiceProvider } from '../providers/reserva-service/reserva-service';
import { ReservaVisitanteServiceProvider } from '../providers/reserva-visitante-service/reserva-visitante-service';
import { DisciplinaServiceProvider } from '../providers/disciplina-service/disciplina-service';
import { DepartamentoServiceProvider } from '../providers/departamento-service/departamento-service';
import { SalaServiceProvider } from '../providers/sala-service/sala-service';

import { CalendarModule } from "ion2-calendar";



@NgModule({
  declarations: [
    MyApp,
    ReservaListPage,
    ReservaCreatePage,
    ReservaDetailPage,
    ReservaMyPage,
    LoginPage,
    ReservaVisitanteListPage,
    AjudaUsuarioPage,
    ReservaSearchPage,
    ReservaCreate2Page,
    ReservaCreateSearchPage,
    EsqueceuSenhaPage
  ],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: true,
      autoFocusAssist: true,
      iconMode: 'ios',
      pageTransition: 'ios-transition',
      toastEnter: 'toast-slide-in',
      toastLeave: 'toast-slide-out'
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule,
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReservaListPage,
    ReservaCreatePage,
    ReservaDetailPage,
    ReservaMyPage,
    LoginPage,
    ReservaVisitanteListPage,
    AjudaUsuarioPage,
    ReservaSearchPage,
    ReservaCreate2Page,
    ReservaCreateSearchPage,
    EsqueceuSenhaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CompleteServiceProvider,
    ConexaoProvider,
    LoginServiceProvider,
    UsuarioServiceProvider,
    ReservaServiceProvider,
    ReservaVisitanteServiceProvider,
    DisciplinaServiceProvider,
    DepartamentoServiceProvider,
    SalaServiceProvider
  ]
})
export class AppModule {}
