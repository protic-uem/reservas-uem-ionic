import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
//Páginas
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { LoginPage } from '../login/login';
//Provedores
import {CompleteServiceProvider} from '../../providers/complete-service/complete-service';
import {AutoCompleteComponent} from 'ionic2-auto-complete';
//Componentes
import { PopoverLoginComponent } from '../../components/popover-login/popover-login';
import { ModalLoginComponent } from '../../components/modal-login/modal-login';
//Model
import { Login } from '../../model/Login';


@IonicPage()
@Component({
  selector: 'page-reserva-list',
  templateUrl: 'reserva-list.html',
})
export class ReservaListPage {

  @ViewChild('searchbar') searchbar: AutoCompleteComponent;

  private reservas:Array<CustomReserva>;
  private reservasCarregadas:Array<CustomReserva>;
  private   login: Login = new Login();
  constructor(public navCtrl: NavController, public navParams: NavParams, private complete:CompleteServiceProvider,
    private popoverCtrl:PopoverController, private modalCrl:ModalController) {
  }

  ionViewDidLoad() {
    this.reservas = [new CustomReserva('Estrutura de dados', 'Sala 10', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Alan Lopes'),
  new CustomReserva('Estrutura de dados', 'Sala 02', 'DIN','15/09/2018 19:30-21:10', 'CANCELADO', 'Alisson Lopes'),
  new CustomReserva('Fundamentos de Algoritmos', 'LIN 1', 'DIN','05/09/2018 19:30-21:10', 'PENDENTE', 'Wesley Romão'),
  new CustomReserva('Grafos', 'Sala 105', 'DIN','20/09/2018 19:30-21:10', 'REJEITADO', 'Mamoru'),
  new CustomReserva('Análise de Algoritmos', 'Sala 102', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Diego Fernandes'),
  new CustomReserva('Banco de dados 1', 'LIN 2', 'DIN','25/09/2018 19:30-21:10', 'ACEITO', 'Alan Lopes'),
  new CustomReserva('Banco de dados 2', 'Sala 04', 'DIN','25/09/2018 19:30-21:10', 'CANCELADO', 'Alan Lopes'),
  new CustomReserva('Arquitetura de computadores', 'Sala 101', 'DIN','25/09/2018 19:30-21:10', 'REJEITADO', 'Alan Lopes'),
  new CustomReserva('PAA', 'Sala 200', 'DIN','25/09/2018 19:30-21:10', 'REJEITADO', 'Alan Lopes')];

      this.reservasCarregadas = this.reservas;
  }


  openReserva(event, reserva:CustomReserva){
    this.navCtrl.push(ReservaDetailPage, {
      item: reserva
    });
  }

  itemSelecionadoPeloAutocomplete(evento:any){
    let dado = this.searchbar.getValue();//pega a descricao da reserva selecionada e coloca em dado
    this.reservas = this.reservasCarregadas.filter(item => item.disciplina.toLowerCase().startsWith(dado.toLowerCase()));
  }

  chamaLogin(event) {
    //this.navCtrl.push(LoginPage);
    let loginModal = this.modalCrl.create(ModalLoginComponent);
    loginModal.onDidDismiss(data => {
      console.log(data);
    });
    loginModal.present();

  }


}

export class CustomReserva{
  disciplina: string;
  sala:string;
  status:string;
  dept: string;
  data:string;
  usuario: string;

  constructor(disciplina?:string, sala?:string, dept?:string, data?:string, status?:string, usuario?:string){
    this.disciplina = disciplina;
    this.sala = sala;
    this.status = status;
    this.dept = dept;
    this.data = data;
    this.usuario = usuario;
  }
}
