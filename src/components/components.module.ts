import { NgModule } from "@angular/core";
import { CustomFabComponent } from "./custom-fab/custom-fab";
import { IoncardReservaComponent } from "./ioncard-reserva/ioncard-reserva";
import { IonicModule } from "ionic-angular";
import { IoncardReservaMyComponent } from "./ioncard-reserva-my/ioncard-reserva-my";
import { ChipReservaHomeComponent } from "./chip-reserva-home/chip-reserva-home";

@NgModule({
  declarations: [
    CustomFabComponent,
    IoncardReservaComponent,
    IoncardReservaMyComponent,
    ChipReservaHomeComponent
  ],
  imports: [IonicModule],
  exports: [
    CustomFabComponent,
    IoncardReservaComponent,
    IoncardReservaMyComponent,
    ChipReservaHomeComponent
  ]
})
export class ComponentsModule {}
