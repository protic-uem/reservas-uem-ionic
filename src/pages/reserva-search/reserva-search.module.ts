import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservaSearchPage } from './reserva-search';

@NgModule({
  declarations: [
    ReservaSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservaSearchPage),
  ],
})
export class ReservaSearchPageModule {}
