import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Login } from '../../model/Login';
import { ReservaView } from '../../model/ReservaView';
import { Usuario } from '../../model/Usuario';

import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { ReservaServiceProvider } from './../../providers/reserva-service/reserva-service';



@Component({
  selector: 'page-reserva-my',
  templateUrl: 'reserva-my.html',
})
export class ReservaMyPage {

   reservas:Array<ReservaView>;
   usuarios:Array<Usuario>;
   reservasCarregadas:Array<ReservaView>;
   login:Login;
   reservasNaoEncontrada:boolean = false;
   departamentoDIN:number = 1;

   statusSelecionado:string;
   usuarioSelecionado:Usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservaService:ReservaServiceProvider, private storage:Storage,
    private menuCtrl:MenuController, private usuarioService:UsuarioServiceProvider, private alertCtrl:AlertController) {

      this.reservas = new Array<ReservaView>();
      this.reservasCarregadas = new Array<ReservaView>();
      this.usuarios = new Array<Usuario>();
      this.usuarioSelecionado = new Usuario();

      this.login = this.navParams.get('login');
      this.menuCtrl.enable(true);
      this.reservasNaoEncontrada = true;

      if(this.login.privilegio == 'Secretário')
        this.carregarTodosUsuariosDocentesPorDepartamento(this.departamentoDIN);

  }


  ionViewDidEnter(){
    if(this.login != undefined && this.login.privilegio == 'Docente' && this.login.id != undefined)
      this.atualizarMinhasReservas();
    else
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
  }

  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          if(this.login.privilegio == 'Docente')
            this.atualizarMinhasReservas();
        } else {
          this.login = new Login();
        }
      });
  }

  carregarTodosUsuariosDocentesPorDepartamento(id_departamento: number){

          this.usuarioService.carregarTodosDocentesPorDepartamento(id_departamento)
            .then( (usuarios:Array<Usuario>) => {
              if(usuarios.length > 0){
                this.usuarios = usuarios;
                this.storage.set("usuarios", usuarios);
              }else{
                this.apresentarErro("Nenhum usuario docente foi encontrado");
              }
              } )
            .catch( (error) => {
              this.apresentarErro(error.message);
            });
  }


  usuarioChange(usuario:Usuario){
    if(usuario!= undefined && usuario.id != undefined){
        this.carregarReservasPorUsuario(usuario);
     }
  }

  atualizarMinhasReservas(){

    this.reservaService.carregarMinhasReservas(this.login.id)
      .then( (reservas:Array<ReservaView>) => {
        if(reservas.length > 0){
          this.reservas = reservas;
          this.reservasNaoEncontrada = false;
          this.storage.set("minhasReservas", reservas);
        }else{
          this.reservas  = new Array<ReservaView>();
          this.reservasNaoEncontrada = true;
        }
      } )
      .catch( () => "Erro na requisição de minhas reservas" );
  }

  carregarReservasPorUsuario(usuario:Usuario){
    this.reservaService.carregarReservaPorUsuario(usuario.id)
      .then( (reservas:Array<ReservaView>) => {
        if(reservas.length > 0){
          this.reservas = reservas;
          this.reservasNaoEncontrada = false;
          this.storage.set("minhasReservas", reservas);
        }else{
          this.reservas  = new Array<ReservaView>();
          this.reservasNaoEncontrada = true;
        }
      })
      .catch( () => "Erro na requisição de reservas por usuário");

  }

  //apresenta o alerta sobre o erro
  apresentarErro(msg:string){
        const alertError = this.alertCtrl.create({
          title:'Atenção!',
          message: msg,
          buttons: [
            {
              text: 'Entendi',
            }
          ]
        });
        alertError.setMode("ios");
        alertError.present();
  }

}
