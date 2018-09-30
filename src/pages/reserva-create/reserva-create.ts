import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import {CustomReserva} from '../reserva-list/reserva-list';
import { Validators, FormBuilder } from '@angular/forms';
import { parse, isSunday, isSaturday } from 'date-fns';

@IonicPage()
@Component({
  selector: 'page-reserva-create',
  templateUrl: 'reserva-create.html',
})
export class ReservaCreatePage {

  reserva:CustomReserva;

  //variáveis para a validação de erros nos input's
  reservaForm:any;
  //caso verdadeiro, desativa o input de disciplina
  disciplinaDisabled = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController,
    private formBuilder:FormBuilder) {

      this.reserva = new CustomReserva;

      //Criar o formulário de validação
      this.reservaForm = formBuilder.group({
        departamento:['',Validators.required],
        sala:['',Validators.required],
        disciplina:['',],
        data:['',Validators.required],
        periodo:['',Validators.required],
        uso:['',Validators.required],
        tipoReserva:['',Validators.required]
      });


  }

  //cria uma reserva
  reservaCreate(){
    if(this.validarReserva()){
      if(!this.validarData()){
        this.reservaConfirm();
      }else{
        this.apresentarErro('Não é permitido reserva no sábado ou domingo.');
      }
    }
  }

  //validar se todos os campos foram preenchidos
  validarReserva(){
    let{departamento, sala, disciplina, data, periodo, uso, tipoReserva} = this.reservaForm.controls;
    if(!this.reservaForm.valid){
        this.apresentarErro('Por favor, preencha todos os campos');
      return false;
    }else{
      return true;
    }

  }

  //validar se a data não é sábado ou domingo
  validarData(){
    console.log(this.reserva.data);
    return (isSaturday(parse(this.reserva.data)) || isSunday(parse(this.reserva.data)));

  }


  //Ativa o input de disciplina, depedendo do tipo de uso escolhido
  usoMudado(event){
    if(event == 'Prática'){
      this.disciplinaDisabled = false;
    }else if(event == 'Teórica'){
      this.disciplinaDisabled = false;
    }
    else{
      this.disciplinaDisabled = true;
    }
  }

  //apresenta o alerta para a confirmação dos dados da reserva
  reservaConfirm(){
    const alert = this.alertCtrl.create({
      title:'Tem certeza?',
      message: '<b>Departamento:</b> '+this.reserva.dept +'<br/>'+
                '<b>Sala:</b> '+this.reserva.sala+'<br/>'+
                '<b>Disciplina:</b> '+(this.reserva.disciplina == undefined?'':this.reserva.disciplina)+'<br/>'+
                '<b>Data:</b> '+this.reserva.data+'<br/>'+
                '<b>Período:</b> '+this.reserva.periodo+'<br/>'+
                '<b>Uso:</b> '+this.reserva.uso+'<br/>'+
                '<b>Tipo:</b> '+this.reserva.tipo,

      buttons: [
        {
          text: 'Cancelar',
          handler: () => {

          }
        },
        {
          text: 'Sim',
          handler: () => {
            //retorar um objeto de sucesso, e mostrat toast de reserva realizada com sucesso
            //na página principal de reservas
              this.navCtrl.pop();
              let toast = this.toastCtrl.create({
                message: 'Reserva feita com sucesso',
                duration: 3000
              });
              toast.present();
          }
        }
      ]
    });

    alert.present();
  }

  //apresenta o Toast de reserva cancelada
  reservaCanceled(){
    let toast = this.toastCtrl.create({
      message: 'Reserva cancelada',
      duration: 3000
    });
    toast.present();
        this.navCtrl.pop();

  }


  //apresenta o alerta sobre o erro
  apresentarErro(msg:string){
  const alertError = this.alertCtrl.create({
    title:'Atenção!',
    message: msg,
    buttons: [
      {
        text: 'Okay',
      }
    ]
  });
  alertError.present();
  }

}
