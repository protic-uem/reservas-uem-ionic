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
import { Sala } from '../../model/Sala';
import { Periodo } from '../../model/Periodo';

//Provedores
import { ReservaVisitanteServiceProvider } from '../../providers/reserva-visitante-service/reserva-visitante-service';
import { DepartamentoServiceProvider } from '../../providers/departamento-service/departamento-service';
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';


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

   disciplinas:Array<Disciplina>;
   departamentos:Array<Departamento>;
   salas:Array<Sala>;

   disciplinaSelecionada:Disciplina;
   departamentoSelecionado:Departamento;
   salaSelecionada:Sala;

   departamentoDIN:number = 1;

   login:Login;
   dataDocente:string;
   hoje:string;

   periodo:Periodo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
    private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
    private formBuilder:FormBuilder, private departamentoService:DepartamentoServiceProvider,
    private salaService:SalaServiceProvider) {

      this.reserva = new Reserva;
      this.login = new Login();
      this.disciplinaSelecionada = new Disciplina();
      this.departamentoSelecionado = new Departamento();
      this.salaSelecionada = new Sala();

      this.hoje = format(new Date(), 'YYYY-MM-DD');


      //Criar o formulário de validação
      this.reservaForm = formBuilder.group({
        disciplina:['',],
        sala:['',Validators.required],
        data:['',Validators.required],
        periodo:['',Validators.required],
        tipoReserva:['',],
        uso:['',Validators.required],
        usuario:['',Validators.nullValidator]
      });

      //pegando usuário
      this.login = this.navParams.get('login');
      if(this.login.nome == undefined)
        this.loadResources();//pegar o usuário logado e depois carregar as reservas
      else
        this.carregarDisciplinaPorPrivilegio(this.login.privilegio);

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
          this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
        } else {
          this.login = new Login();
        }
      });
  }

  //Carrega as disciplinas de acordo com o privilégio do usuário
  carregarDisciplinaPorPrivilegio(privilegio:string){
    if(privilegio == "Docente")
      this.carregarDisciplinasPorUsuario(this.login.id);
    else if(privilegio == "Secretário")
      this.carregarDisciplinasPorDepartamento(this.departamentoDIN);
  }

  //Carrega todos os departamentos do banco de dados
  carregarTodosDepartamentos(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando departamentos...'
    });
    loading.present();
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

    //Carrega todas as dicipinas referente a um determinado usuario
    carregarDisciplinasPorUsuario(id_usuario:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando disciplinas...'
        });
        loading.present();
        this.disciplinaService.carregarDisciplinasPorUsuario(id_usuario)
          .then( (disciplinas:Array<Disciplina>) => {
            if(disciplinas.length > 0){
              this.disciplinas = disciplinas;
              this.storage.set("disciplinas", disciplinas);
              loading.dismiss().then(() => {
                this.carregarSalasPorDepartamento(this.departamentoDIN);
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

    //Carrega todas as dicipinas referente a um determinado departamento
    carregarDisciplinasPorDepartamento(id_departamento:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando disciplinas...'
        });
        loading.present();
        this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
          .then( (disciplinas:Array<Disciplina>) => {
            if(disciplinas.length > 0){
              this.disciplinas = disciplinas;
              this.storage.set("disciplinas", disciplinas);
              loading.dismiss().then(() => {
                this.carregarSalasPorDepartamento(id_departamento);
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

    //Carrega todas as salas referente a um determinado departamento
    carregarSalasPorDepartamento(id_departamento:number){

        let loading = this.loadingCtrl.create({
          content: 'Carregando salas...'
        });
        loading.present();
        this.salaService.carregarSalaPorDepartamento(id_departamento)
          .then( (salas:Array<Sala>) => {
            if(salas.length > 0){
              this.salas = salas;
              this.storage.set("salas", salas);
              loading.dismiss().then(() => {
                  //this.navCtrl.setRoot(ReservaListPage);
              });
            }else{
              loading.dismiss();
              this.apresentarErro("Nenhuma sala foi encontrada");
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
      if(valor != undefined){
       //this.carregarDisciplinasPorDepartamento(valor.id);
       this.reserva.id_departamento = valor.id;
     }

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
        this.reserva.id_departamento = this.departamentoDIN;
        this.reserva.id_sala = this.salaSelecionada.id;
        this.reserva.id_disciplina = this.disciplinaSelecionada.id;
        if(this.login.privilegio == "Docente")
          this.reserva.tipo_reserva = "Eventual";
        this.reservaConfirm();
      }else{
        this.apresentarErro('Não é permitido reserva no sábado ou domingo.');
      }
    }
  }

  //validar se todos os campos foram preenchidos
  validarReserva(){
    let{sala, disciplina, data, periodo, uso, tipoReserva} = this.reservaForm.controls;
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
      message:
                '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
                '<b>Disciplina:</b> '+(this.disciplinaSelecionada.codigo == undefined?'':this.disciplinaSelecionada.codigo)+'<br/>'+
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
