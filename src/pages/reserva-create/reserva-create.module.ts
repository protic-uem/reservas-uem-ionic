import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaCreatePage } from './reserva-create';

@NgModule({
  declarations: [
    ReservaCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaCreatePage),
  ],
})
export class ReservaCreatePageModule {}
