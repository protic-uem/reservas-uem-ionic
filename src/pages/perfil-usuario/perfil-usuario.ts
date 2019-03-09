import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController
} from "ionic-angular";
import { UsuarioGraphql } from "../../model/Usuario.graphql";
import { Storage } from "@ionic/storage";
import { HomePage } from "../home/home";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { apresentarToast, apresentarErro } from "../../util/util";

@Component({
  selector: "page-perfil-usuario",
  templateUrl: "perfil-usuario.html"
})
export class PerfilUsuarioPage {
  usuario: UsuarioGraphql;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private usuarioService: UsuarioServiceProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.usuario = this.navParams.get("login");
    if (this.usuario == undefined) this.loadResources();
  }

  async loadResources() {
    await this.storage.get("login").then(login => {
      if (login) {
        this.usuario = login;
      } else {
        this.usuario = new UsuarioGraphql();
      }
    });
  }

  back() {
    this.navCtrl.push(
      HomePage,
      {
        login: this.usuario
      },
      {
        animate: true,
        animation: "ios-transition",
        direction: "back",
        duration: 1000
      }
    );
  }

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando usuário..."
    });

    loading.present();

    this.usuarioService
      .atualizarUsuario(this.usuario)
      .then((result: any) => {
        if (result) {
          loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage, {
              login: this.usuario
            });
            apresentarToast(this.toastCtrl, "Usuario Atualizado com sucesso!");
          });
        } else {
          loading.dismiss();
          apresentarErro(
            this.alertCtrl,
            "Houve um problema ao atualizar o usuario"
          );
        }
      })
      .catch(error => {
        loading.dismiss();
        apresentarErro(this.alertCtrl, error.message);
      });
  }
}
