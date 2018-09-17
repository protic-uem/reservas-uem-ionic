import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaDetailPage } from './reserva-detail';

@NgModule({
  declarations: [
    ReservaDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaDetailPage),
  ],
})
export class ReservaDetailPageModule {}
