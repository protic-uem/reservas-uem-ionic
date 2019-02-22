import { Component, Input } from "@angular/core";
import { NavController, FabContainer } from "ionic-angular";

import { ReservaSearchPage } from "../../pages/reserva-search/reserva-search";
import { CreateSegmentPage } from "../../pages/create-segment/create-segment";
import { UsuarioGraphql } from "../../model/Usuario.graphql";

@Component({
  selector: "custom-fab",
  templateUrl: "custom-fab.html"
})
export class CustomFabComponent {
  @Input() login: UsuarioGraphql;

  constructor(private navCtrl: NavController) {}

  addReserva(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(CreateSegmentPage, { login: this.login });
  }

  searchReserva(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(ReservaSearchPage, { login: this.login });
  }
}
