import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  AlertController
} from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { compareValidator } from "../../util/compare-validator.directive";
import { Storage } from "@ionic/storage";
import { HomePage } from "../home/home";
import { UsuarioGraphql } from "../../model/Usuario.graphql";
import { UsuarioServiceProvider } from "../../providers/usuario-service/usuario-service";
import { apresentarToast, apresentarErro } from "../../util/util";

@Component({
  selector: "page-alterar-senha",
  templateUrl: "alterar-senha.html"
})
export class AlterarSenhaPage {
  reactiveForm: FormGroup;
  usuario: UsuarioGraphql;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private usuarioService: UsuarioServiceProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.createForm();
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

  createForm() {
    this.reactiveForm = new FormGroup({
      senha: new FormControl("", Validators.required),
      confirmSenha: new FormControl("", [
        Validators.required,
        compareValidator("senha")
      ])
    });
  }

  atualizar() {
    let loading = this.loadingCtrl.create({
      content: "Atualizando senha..."
    });

    loading.present();

    this.usuarioService
      .atualizarSenhaUsuario(this.reactiveForm.get("senha").value)
      .then((result: any) => {
        if (result) {
          loading.dismiss().then(() => {
            this.navCtrl.setRoot(HomePage, {
              login: this.usuario
            });
            apresentarToast(this.toastCtrl, "Senha Atualizada com sucesso!");
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

  get senha() {
    return this.reactiveForm.get("senha");
  }

  get confirmSenha() {
    return this.reactiveForm.get("confirmSenha");
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
}
