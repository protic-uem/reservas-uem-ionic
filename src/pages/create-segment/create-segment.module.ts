import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateSegmentPage } from './create-segment';

@NgModule({
  declarations: [
    CreateSegmentPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateSegmentPage),
  ],
})
export class CreateSegmentPageModule {}
