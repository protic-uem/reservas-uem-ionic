import { Component, Input } from '@angular/core';
import { CustomReserva } from '../../pages/reserva-list/reserva-list';
@Component({
  selector: 'ioncard-reserva',
  templateUrl: 'ioncard-reserva.html'
})
export class IoncardReservaComponent {

 @Input() reserva:CustomReserva;
  constructor() {

  }

}
