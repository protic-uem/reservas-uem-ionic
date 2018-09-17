import { NgModule } from '@angular/core';
import { CustomFabComponent } from './custom-fab/custom-fab';
import { IoncardReservaComponent } from './ioncard-reserva/ioncard-reserva';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [CustomFabComponent,
    IoncardReservaComponent],
	imports: [IonicModule],
	exports: [CustomFabComponent,
    IoncardReservaComponent]
})
export class ComponentsModule {}
