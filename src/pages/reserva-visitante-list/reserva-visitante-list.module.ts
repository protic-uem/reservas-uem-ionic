import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaVisitanteListPage } from './reserva-visitante-list';

@NgModule({
  declarations: [
    ReservaVisitanteListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaVisitanteListPage),
  ],
})
export class ReservaVisitanteListPageModule {}
