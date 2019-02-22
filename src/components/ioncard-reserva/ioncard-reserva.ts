import { Component, Input } from "@angular/core";
import { NavController } from "ionic-angular";

//Páginas
import { ReservaDetailPage } from "../../pages/reserva-detail/reserva-detail";
import { ReservaGraphql } from "../../model/Reserva.graphql";

@Component({
  selector: "ioncard-reserva",
  templateUrl: "ioncard-reserva.html"
})
export class IoncardReservaComponent {
  @Input() reserva: ReservaGraphql;
  @Input() page: string;
  constructor(private navCtrl: NavController) {}

  openReserva(event, reserva: ReservaGraphql, page) {
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva,
      page: page
    });
  }
}
