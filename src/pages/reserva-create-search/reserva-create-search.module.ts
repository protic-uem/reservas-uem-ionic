import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaCreateSearchPage } from './reserva-create-search';

@NgModule({
  declarations: [
    ReservaCreateSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaCreateSearchPage),
  ],
})
export class ReservaCreateSearchPageModule {}
