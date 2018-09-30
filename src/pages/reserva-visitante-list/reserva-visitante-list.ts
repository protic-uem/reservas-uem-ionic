import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//Páginas
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';
import { CustomReserva } from '../reserva-list/reserva-list';


@IonicPage()
@Component({
  selector: 'page-reserva-visitante-list',
  templateUrl: 'reserva-visitante-list.html',
})
export class ReservaVisitanteListPage {

  private reservas:Array<CustomReserva>;
  private reservasCarregadas:Array<CustomReserva>;

  departamentoSelecionado:string = '';
  blocoSelecionado:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl:MenuController) {

    this.menuCtrl.enable(false);
    
  }


  ionViewDidLoad() {
        this.reservas = [new CustomReserva('Estrutura de dados', 'Sala 10', 'DIN','25/09/2018', 'ACEITO', 'Alan Lopes', 'Prática', 'Eventual', '07:45-08:20,08:20-09:10,19:30-21:10,21:10-22:00 ', 'C56'),
      new CustomReserva('Estrutura de dados', 'Sala 02', 'DIN','15/09/2018', 'CANCELADO', 'Alisson Lopes', 'Teórica', 'Eventual', '19:30-21:10', 'C56'),
      new CustomReserva('Fundamentos de Algoritmos', 'LIN 1', 'DEE','05/09/2018', 'PENDENTE', 'Wesley Romão', 'Defesa', 'Eventual', '19:30-21:10', 'C56'),
      new CustomReserva('Grafos', 'Sala 105', 'DIN','20/09/2018', 'REJEITADO', 'Mamoru' , 'Prática', 'Eventual', '19:30-21:10', 'C56'),
      new CustomReserva('Análise de Algoritmos', 'Sala 102', 'DIN','25/09/2018', 'ACEITO', 'Diego Fernandes' , 'Prática', 'Eventual', '19:30-21:10', 'C56'),
      new CustomReserva('Banco de dados 1', 'LIN 2', 'DIN','25/09/2018', 'ACEITO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'C56'),
      new CustomReserva('Banco de dados 2', 'Sala 04', 'DIN','25/09/2018', 'CANCELADO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'C56'),
      new CustomReserva('Arquitetura de computadores', 'Sala 101', 'DIN','25/09/2018', 'REJEITADO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'D67'),
      new CustomReserva('PAA', 'Sala 200', 'DEE','25/09/2018', 'REJEITADO', 'Alan Lopes', 'Prática', 'Eventual', '19:30-21:10', 'D67')];

          this.reservasCarregadas = this.reservas;

  }


  openReserva(event, reserva:CustomReserva){
      this.navCtrl.push(ReservaDetailPage, {
        item: reserva
      });
  }

  pesquisaMudado(component, event){
    if(component == 'dept')
      this.departamentoSelecionado = event;

    if(component == 'bloco')
      this.blocoSelecionado = event;


    if(this.departamentoSelecionado != '' && this.blocoSelecionado != ''){
      this.reservas = this.reservasCarregadas.filter((item) => {
        return item.dept.toLowerCase().startsWith(this.departamentoSelecionado.toLowerCase()) &&
                item.bloco.toLowerCase().startsWith(this.blocoSelecionado.toLowerCase());
        });
    }
    else if(this.departamentoSelecionado != ''){
      this.reservas = this.reservasCarregadas.filter((item) => {
        return item.dept.toLowerCase().startsWith(this.departamentoSelecionado.toLowerCase());
      });
    }
    else if(this.blocoSelecionado != ''){
      this.reservas = this.reservasCarregadas.filter((item) => {
        return item.bloco.toLowerCase().startsWith(this.blocoSelecionado.toLowerCase());
      });
    }
    else{
      this.reservas =this.reservasCarregadas;
    }

  }


}