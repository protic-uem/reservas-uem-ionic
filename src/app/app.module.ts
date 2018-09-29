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


@NgModule({
  declarations: [
    MyApp,
    ReservaListPage,
    ReservaCreatePage,
    ReservaDetailPage,
    ReservaMyPage,
    LoginPage,
    ReservaVisitanteListPage
  ],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule
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
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CompleteServiceProvider,
    ConexaoProvider,
    LoginServiceProvider,
    UsuarioServiceProvider,
    ReservaServiceProvider
  ]
})
export class AppModule {}
