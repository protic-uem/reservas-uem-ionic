import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  MenuController,
  AlertController
} from "ionic-angular";
import { Storage } from "@ionic/storage";

import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { ReservaServiceProvider } from "./../../providers/reserva-service/reserva-service";

import { ReservaGraphql } from "../../model/Reserva.graphql";
import { UsuarioGraphql } from "../../model/Usuario.graphql";
import { apresentarErro } from "../../util/util";

@Component({
  selector: "page-reserva-my",
  templateUrl: "reserva-my.html"
})
export class ReservaMyPage {
  reservas: Array<ReservaGraphql>;
  usuarios: Array<UsuarioGraphql>;
  reservasCarregadas: Array<ReservaGraphql>;
  login: UsuarioGraphql;
  reservasNaoEncontrada: string = undefined;

  statusSelecionado: string;
  usuarioSelecionado: UsuarioGraphql;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private reservaService: ReservaServiceProvider,
    private storage: Storage,
    private menuCtrl: MenuController,
    private usuarioService: UsuarioServiceProvider,
    private alertCtrl: AlertController
  ) {
    this.reservas = new Array<ReservaGraphql>();
    this.reservasCarregadas = new Array<ReservaGraphql>();
    this.usuarios = new Array<UsuarioGraphql>();
    this.usuarioSelecionado = new UsuarioGraphql();

    this.login = this.navParams.get("login");
    this.menuCtrl.enable(true);

    if (this.login.privilegio == "Secretário") {
      this.reservasNaoEncontrada = "naoEncontrada";
      this.carregarTodosUsuariosDocentesPorDepartamento(
        this.login.departamento.id
      );
    }
  }

  ionViewDidEnter() {
    if (
      this.login != undefined &&
      this.login.privilegio == "Docente" &&
      this.login.id != undefined
    )
      this.atualizarMinhasReservas();
    else this.loadResources(); //pegar o usuário logado e depois carregar as reservas
  }

  async loadResources() {
    await this.storage.get("login").then(login => {
      if (login) {
        this.login = login;
        if (this.login.privilegio == "Docente") this.atualizarMinhasReservas();
      } else {
        this.login = new UsuarioGraphql();
      }
    });
  }

  carregarTodosUsuariosDocentesPorDepartamento(id_departamento: number) {
    this.usuarioService
      .carregarTodosDocentesPorDepartamento(id_departamento)
      .then((usuarios: Array<UsuarioGraphql>) => {
        if (usuarios.length > 0) {
          this.usuarios = usuarios;
          this.storage.set("usuarios", usuarios);
        } else {
          apresentarErro(
            this.alertCtrl,
            "Nenhum usuario docente foi encontrado"
          );
        }
      })
      .catch(error => {
        apresentarErro(this.alertCtrl, error.message);
      });
  }

  usuarioChange(usuario: UsuarioGraphql) {
    if (usuario != undefined && usuario.id != undefined) {
      this.carregarReservasPorUsuario(usuario);
    }
  }

  atualizarMinhasReservas() {
    this.reservaService
      .carregarMinhasReservas(this.login.id)
      .then((reservas: Array<ReservaGraphql>) => {
        if (reservas.length > 0) {
          this.reservas = reservas;
          this.reservasNaoEncontrada = "econtrada";
          this.storage.set("minhasReservas", reservas);
        } else {
          this.reservas = new Array<ReservaGraphql>();
          this.reservasNaoEncontrada = "naoEncontrada";
        }
      })
      .catch(() => "Erro na requisição de minhas reservas");
  }

  carregarReservasPorUsuario(usuario: UsuarioGraphql) {
    this.reservasNaoEncontrada = undefined;

    this.reservaService
      .carregarReservaPorUsuario(usuario.id)
      .then((reservas: Array<ReservaGraphql>) => {
        if (reservas.length > 0) {
          this.reservas = reservas;
          this.reservasNaoEncontrada = "encontrada";
          this.storage.set("minhasReservas", reservas);
        } else {
          this.reservas = new Array<ReservaGraphql>();
          this.reservasNaoEncontrada = "naoEncontrada";
        }
      })
      .catch(() => "Erro na requisição de reservas por usuário");
  }
}
