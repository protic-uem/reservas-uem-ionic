import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaListPage } from './reserva-list';

@NgModule({
  declarations: [
    ReservaListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaListPage),
  ],
})
export class ReservaListPageModule {}
