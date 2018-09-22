import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaMyPage } from './reserva-my';

@NgModule({
  declarations: [
    ReservaMyPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaMyPage),
  ],
})
export class ReservaMyPageModule {}
