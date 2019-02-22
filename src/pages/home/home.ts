import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { format, getHours, getMinutes } from "date-fns";

//Models
import { ReservaGraphql } from "../../model/Reserva.graphql";
import { UsuarioGraphql } from "../../model/Usuario.graphql";

//Providers
import { ReservaServiceProvider } from "../../providers/reserva-service/reserva-service";
import { apresentarErro } from "../../util/util";
import { Periodo } from "../../model/Periodo";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  reservas: Array<ReservaGraphql>;
  hoje: string;
  periodo: string;
  periodoCorrente: number;
  p: Periodo;
  reservasNaoEncontrada: string = undefined;
  login: UsuarioGraphql;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private storage: Storage,
    private reservaService: ReservaServiceProvider
  ) {
    this.p = new Periodo();
    this.reservas = new Array<ReservaGraphql>();
    this.hoje = format(new Date(), "YYYY-MM-DD");
    this.calcularPeriodoCorrente();
    this.login = this.navParams.get("login");
  }

  ionViewDidEnter() {
    if (this.login != undefined && this.login.id != undefined)
      this.carregarReservasHome();
    else this.loadResources(); //pegar o usuário logado e depois carregar as reservas
  }

  /**
   * Load resources
   * Check is the login is on storage
   */
  async loadResources() {
    await this.storage.get("login").then(login => {
      if (login) {
        this.login = login;
        this.carregarReservasHome();
      } else {
        this.login = new UsuarioGraphql();
      }
    });
  }

  /**
   * Calculates the current period
   */
  calcularPeriodoCorrente() {
    var horaCorrente = getHours(new Date());
    var minutoCorrente = getMinutes(new Date());
    minutoCorrente += horaCorrente * 60;

    if (minutoCorrente > 465 && minutoCorrente <= 565) {
      this.periodoCorrente = 1;
      this.periodo = this.p.um;
    } else if (minutoCorrente > 565 && minutoCorrente <= 720) {
      this.periodoCorrente = 2;
      this.periodo = this.p.dois;
    } else if (minutoCorrente > 720 && minutoCorrente <= 910) {
      this.periodoCorrente = 3;
      this.periodo = this.p.tres;
    } else if (minutoCorrente > 910 && minutoCorrente <= 1080) {
      this.periodoCorrente = 4;
      this.periodo = this.p.quatro;
    } else if (minutoCorrente > 1080 && minutoCorrente <= 1270) {
      this.periodoCorrente = 5;
      this.periodo = this.p.cinco;
    } else if (minutoCorrente > 1270 && minutoCorrente <= 1380) {
      this.periodoCorrente = 6;
      this.periodo = this.p.seis;
    } else {
      this.periodoCorrente = 0;
      this.periodo = "Fora do intervalo";
    }
  }

  /**
   * Loads today's reservations according
   */
  carregarReservasHome() {
    this.reservaService
      .carregarReservasTelaHome(
        this.login.departamento.id,
        this.hoje,
        this.periodoCorrente
      )
      .then((reservas: Array<ReservaGraphql>) => {
        if (reservas.length > 0) {
          this.reservas = reservas;
          this.storage.set("reservas", reservas);
          this.reservasNaoEncontrada = "encontrada";
        } else {
          this.reservas = new Array<ReservaGraphql>();
          this.reservasNaoEncontrada = "naoEncontrada";
        }
      })
      .catch(error => {
        this.reservas = new Array<ReservaGraphql>();
        apresentarErro(this.alertCtrl, error.message);
      });
  }
}
