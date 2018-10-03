import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { Reserva} from '../../model/Reserva';
import { Validators, FormBuilder } from '@angular/forms';
import { parse, format, isSunday, isSaturday, addWeeks, addMonths } from 'date-fns';
import { Storage } from '@ionic/storage';

//Modelos
import { Disciplina } from '../../model/Disciplina';
import { Departamento } from '../../model/Departamento';
import { Login } from '../../model/Login';

//Provedores
import { ReservaVisitanteServiceProvider } from '../../providers/reserva-visitante-service/reserva-visitante-service';
import { DepartamentoServiceProvider } from '../../providers/departamento-service/departamento-service';
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';

@IonicPage()
@Component({
  selector: 'page-reserva-create',
  templateUrl: 'reserva-create.html',
})
export class ReservaCreatePage {

  private reserva:Reserva;

  //variáveis para a validação de erros nos input's
  reservaForm:any;
  //caso verdadeiro, desativa o input de disciplina
  disciplinaDisabled = true;

  private disciplinas:Array<Disciplina>;
  private departamentos:Array<Departamento>;

  private login:Login;
  private dataDocente:string;
  private hoje:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
    private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
    private formBuilder:FormBuilder, private departamentoService:DepartamentoServiceProvider) {

      this.reserva = new Reserva;
      this.login = new Login();

      this.hoje = format(new Date(), 'YYYY-MM-DD');


      //Criar o formulário de validação
      this.reservaForm = formBuilder.group({
        departamento:['',Validators.required],
        sala:['',Validators.required],
        disciplina:['',],
        data:['',Validators.required],
        periodo:['',Validators.required],
        uso:['',Validators.required],
        tipoReserva:['',Validators.required],
        usuario:['',Validators.nullValidator]
      });

      //pegando usuário
      this.login = this.navParams.get('login');
      if(this.login.nome == undefined)
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
      else
        this.carregarTodosDepartamentos();

        //Caso seja docente, só podera realizar reservas de 3 semanas a referente
        //Caso seja secretário, poderá 1 mês a frente
        if(this.login.nome != undefined){
          if(this.login.privilegio == 'Docente')
            this.dataDocente = format(addWeeks(new Date(), 3), 'YYYY-MM-DD');
          else
            this.dataDocente = format(addMonths(new Date(), 1), 'YYYY-MM-DD');
      }


  }

  async loadResources() {
    await this.storage.get("login")
      .then((login) => {
        if (login) {
          this.login = login;
          this.carregarTodosDepartamentos();
        } else {
          this.login = new Login();
        }
      });
  }

  //Carrega todos os departamentos do banco de dados
  carregarTodosDepartamentos(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando departamentos...'
    });

    this.departamentoService.carregarTodosDepartamentos()
      .then( (departamentos:Array<Departamento>) => {
        if(departamentos.length > 0){
          this.departamentos = departamentos;
          this.storage.set("departamentos", departamentos);
          loading.dismiss().then(() => {
              //this.navCtrl.setRoot(ReservaListPage);
          });
        }else{
          loading.dismiss();
          this.apresentarErro("Nenhum departamento foi encontrado");
        }

        } )
      .catch( (error) => {
        loading.dismiss();
        this.apresentarErro(error.message);
      });

    }

    //Carrega todas as dicipinas referente a um determinado departamento
    carregarDisciplinasPorDepartamento(id_departamento:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando disciplinas...'
        });

        this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
          .then( (disciplinas:Array<Disciplina>) => {
            if(disciplinas.length > 0){
              this.disciplinas = disciplinas;
              this.storage.set("disciplinas", disciplinas);
              loading.dismiss().then(() => {
                  //this.navCtrl.setRoot(ReservaListPage);
              });
            }else{
              loading.dismiss();
              this.apresentarErro("Nenhuma disciplina foi encontrada");
            }

            } )
          .catch( (error) => {
            loading.dismiss();
            this.apresentarErro(error.message);
          });


    }


    //Caso o usuário selecione algum departamento
    //carregar todas disciplinas referente ao departamento
    changeDepartamento(valor){
      if(valor != undefined)
       this.carregarDisciplinasPorDepartamento(valor);

    }

    //Ativa o input de disciplina, depedendo do tipo de uso escolhido
    changeUso(valor){
      if(valor == 'Prática'){
        this.disciplinaDisabled = false;
      }else if(valor == 'Teórica'){
        this.disciplinaDisabled = false;
      }
      else{
        this.disciplinaDisabled = true;
      }
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
    return (isSaturday(parse(this.reserva.data_reserva)) || isSunday(parse(this.reserva.data_reserva)));

  }




  //apresenta o alerta para a confirmação dos dados da reserva
  reservaConfirm(){
    const alert = this.alertCtrl.create({
      title:'Tem certeza?',
      message: '<b>Departamento:</b> '+this.reserva.nome_departamento +'<br/>'+
                '<b>Sala:</b> '+this.reserva.numero_sala+'<br/>'+
                '<b>Disciplina:</b> '+(this.reserva.nome_disciplina == undefined?'':this.reserva.nome_disciplina)+'<br/>'+
                '<b>Data:</b> '+this.reserva.data_reserva+'<br/>'+
                '<b>Período:</b> '+this.reserva.periodo+'<br/>'+
                '<b>Uso:</b> '+this.reserva.tipo_uso+'<br/>'+
                '<b>Tipo:</b> '+this.reserva.tipo_reserva,

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
