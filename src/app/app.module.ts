import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ReservaListPage } from '../pages/reserva-list/reserva-list';
import { ReservaCreatePage } from '../pages/reserva-create/reserva-create';
import { ReservaDetailPage } from '../pages/reserva-detail/reserva-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//componentes criados
import { ComponentsModule } from '../components/components.module';

//compoentes baixados
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { CompleteServiceProvider } from '../providers/complete-service/complete-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ReservaListPage,
    ReservaCreatePage,
    ReservaDetailPage
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
    HomePage,
    ListPage,
    ReservaListPage,
    ReservaCreatePage,
    ReservaDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CompleteServiceProvider
  ]
})
export class AppModule {}
