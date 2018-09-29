import { NgModule } from '@angular/core';
import { CustomFabComponent } from './custom-fab/custom-fab';
import { IoncardReservaComponent } from './ioncard-reserva/ioncard-reserva';
import { IonicModule } from 'ionic-angular';
import { IoncardReservaMyComponent } from './ioncard-reserva-my/ioncard-reserva-my';

@NgModule({
	declarations: [CustomFabComponent,
    IoncardReservaComponent,
    IoncardReservaMyComponent],
	imports: [IonicModule],
	exports: [CustomFabComponent,
    IoncardReservaComponent,
    IoncardReservaMyComponent]
})
export class ComponentsModule {}
