import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Reserva} from '../../model/Reserva';
import { parse, format, isSunday, isSaturday, isFriday, addWeeks, addMonths, getHours, getMinutes, addDays } from 'date-fns';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ReservaMyPage } from '../reserva-my/reserva-my';
//Modelos
import { Disciplina } from '../../model/Disciplina';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { Periodo } from '../../model/Periodo';
import { Usuario } from '../../model/Usuario';

//Provedores
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";


@Component({
  selector: 'page-create-segment',
  templateUrl: 'create-segment.html',
})
export class CreateSegmentPage {



  reserva:Reserva;

  dataSelecionada:string;
  showDate:string;


  usuarios:Array<Usuario>;
  disciplinas:Array<Disciplina>;
  salas:Array<Sala>;

  disciplinaSelecionada:Disciplina;
  salaSelecionada:Sala;
  usuarioSelecionado:Usuario;

  departamentoDIN:number = 1;

  login:Login;
  dataDocente:string;
  hoje:string;
  dataDefault:string;


  periodo:Periodo;
  periodoCorrente:number;

  etapas:string;
  classe:string = "docente";

 constructor(public navCtrl: NavController, public navParams: NavParams,
   private toastCtrl:ToastController, private alertCtrl:AlertController, private storage:Storage,
   private loadingCtrl:LoadingController, private disciplinaService:DisciplinaServiceProvider,
   private salaService:SalaServiceProvider, private reservaService:ReservaServiceProvider,
   private usuarioService:UsuarioServiceProvider, private modalCtrl:ModalController, private zone: NgZone) {


         this.etapas = "etp1";
         this.reserva = new Reserva;
         this.login = new Login();
         this.disciplinaSelecionada = new Disciplina();
         this.salaSelecionada = new Sala();
         this.usuarioSelecionado = new Usuario();

         this.hoje = format(new Date(), 'YYYY-MM-DD');
         //this.dataSelecionada = format(addDays(new Date(), 1), 'YYYY-MM-DD');
         //this.showDate = format(addDays(new Date(), 1), 'DD/MM/YY');

         //pegando usuário
         this.login = this.navParams.get('login');
         if(this.login.nome == undefined)
           this.loadResources();//pegar o usuário logado e depois carregar as reservas

           //Caso seja docente, só podera realizar reservas de 3 semanas a referente
           //Caso seja secretário, poderá 1 mês a frente
           if(this.login.nome != undefined){
             if(this.login.privilegio == 'Docente'){
               this.reserva.id_usuario = this.login.id;
               this.dataDocente = format(addWeeks(new Date(), 3), 'YYYY-MM-DD');
               this.calcularDiaDefaultCalendar();
               this.dataSelecionada = this.dataDefault;
               this.showDate = format(this.dataDefault, 'DD/MM/YY');

             }
             else {
               this.classe = "secretario";
               this.dataDefault = format(addDays(new Date(), 1), 'YYYY-MM-DD');
               this.dataDocente = format(addMonths(new Date(), 1), 'YYYY-MM-DD');
               this.carregarTodosUsuariosDocentesPorDepartamento(this.departamentoDIN);
               this.showDate = format(this.dataDefault, 'DD/MM/YY');
               this.dataSelecionada =  this.dataDefault;
             }

         }

 }

 calcularDiaDefaultCalendar(){
   if(isFriday(this.hoje))
      this.dataDefault = format(addDays(new Date(), 3), 'YYYY-MM-DD');
   else if(isSaturday(this.hoje))
      this.dataDefault = format(addDays(new Date(), 2), 'YYYY-MM-DD');
   else
      this.dataDefault = format(addDays(new Date(), 1), 'YYYY-MM-DD');
 }

  validarPeriodo(){
    if(this.hoje == this.dataSelecionada){
       var horaCorrente = getHours(new Date());
       var minutoCorrente = getMinutes(new Date());
       minutoCorrente += horaCorrente*60;

       if(minutoCorrente < 465)//07:45
        this.periodoCorrente = 0;
       else if(minutoCorrente < 580)
        this.periodoCorrente = 1;
       else if(minutoCorrente < 810)
         this.periodoCorrente = 2;
       else if(minutoCorrente < 930)
          this.periodoCorrente = 3;
        else if(minutoCorrente < 1170)
           this.periodoCorrente = 4;
        else if(minutoCorrente < 1280)//21:20
              this.periodoCorrente = 5;

          return this.reserva.periodo > this.periodoCorrente;
        }
        else {
          return true;
        }

 }

//Busca o login do storage
 async loadResources() {
   await this.storage.get("login")
     .then((login) => {
       if (login) {
         this.login = login;
       } else {
         this.login = new Login();
       }
     });
 }


 //É executado sempre que o usuário muda de segmento
 segmentChanged(segmento){

 }

 avancarCreate(){
       if(this.usuarioSelecionado.id != undefined)
         this.reserva.id_usuario = this.usuarioSelecionado.id;

       if(this.validarReserva()){
         if(this.validarPeriodo()){
           if(!this.validarData() || this.login.privilegio == "Secretário"){
             this.reservaService.validarReservaMesmoHorario(this.reserva.id_usuario, this.dataSelecionada, this.reserva.periodo)
              .then((result:boolean) => {
                if(result){
                  this.reserva.data_reserva = this.dataSelecionada;

                  this.zone.run(() => {
                    this.etapas = "etp2";
                    if(this.disciplinas == undefined || this.disciplinas.length == 0)
                      this.apresentarErro("Nenhuma disciplina foi encontrada para esse usuário");
                  });

                }else{
                  this.apresentarErro("Já existe uma reserva na mesma data e horário para esse usuário. Por favor,"+
                          " escolha outra data e/ou periodo.");
                }
              })
              .catch( (error)=> {
                this.apresentarErro(""+error);
              });

           }else{
             this.apresentarErro('Não é permitido reserva no sábado ou domingo.');
           }
         }else{
            this.apresentarErro('Não é permitido reservar com o horário inferior ao horário atual');
         }
       }
 }

 openCalendar() {

         var diasNaoPermitidos = [];
         if(this.login.privilegio == "Docente")
           diasNaoPermitidos = [0, 6];

         const options: CalendarModalOptions = {
           from: new Date(),
           to: parse(this.dataDocente),
           title: '',
           defaultDate: this.dataDefault,
           closeLabel: "CANCELAR",
           doneLabel: "",
           monthFormat: "MMM YYYY",
           weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
           disableWeeks: diasNaoPermitidos

         };
         let myCalendar =  this.modalCtrl.create(CalendarModal, {
           options: options
         });

         myCalendar.present();


         myCalendar.onDidDismiss((date: CalendarResult) => {
           if(date != null && date != undefined){
             this.dataSelecionada = date.string;
             this.showDate = format(date.string, 'DD/MM/YY');

             //this.carregarReservasPorDataSala(this.dataSelecionada, this.departamentoDIN, this.salaSelecionada.id);
           }
         })
 }


 carregarTodosUsuariosDocentesPorDepartamento(id_departamento: number){

         let loading = this.loadingCtrl.create({
           content: 'Carregando usuarios...'
         });
         loading.present();

         this.usuarioService.carregarTodosDocentesPorDepartamento(id_departamento)
           .then( (usuarios:Array<Usuario>) => {
             if(usuarios.length > 0){
               this.usuarios = usuarios;
               this.storage.set("usuarios", usuarios);
               loading.dismiss();
             }else{
               loading.dismiss();
               this.apresentarErro("Nenhum usuario docente foi encontrado");
             }
             } )
           .catch( (error) => {
             loading.dismiss();
             this.apresentarErro(error.message);
           });
 }


 //validar se todos os campos foram preenchidos
 validarReserva(){
   if(this.login.privilegio == "Docente"){//se for docente, valide somente data e periodo
     if(this.dataSelecionada == undefined || this.reserva.periodo == undefined || this.reserva.tipo_uso == undefined){
         this.apresentarErro('Por favor, preencha todos os campos para continuar');
       return false;
     }else
       return true;
     }
   else{//se for secretário, valide usuario, data, periodo e tipo de uso
     if(this.usuarioSelecionado.id == undefined || this.dataSelecionada == undefined || this.reserva.periodo == undefined
      || this.reserva.tipo_uso == undefined){
         this.apresentarErro('Por favor, preencha todos os campos para continuar');
       return false;
     }else
       return true;
     }

 }

 //validar se a data não é sábado ou domingo
 validarData(){
   return (isSaturday(parse(this.dataSelecionada)) || isSunday(parse(this.dataSelecionada)));

 }

     //apresenta o Toast de reserva cancelada
   reservaCanceled(){
       this.navCtrl.push(HomePage, {
         login: this.login,
       }, {animate: true, animation:'ios-transition', direction: 'back', duration:1000});
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

     //Executado toda vez que um usuário é selecionado
     //Atualiza o id_usuario da reserva com o id do usuario selecionado
     usuarioChange(usuario:Usuario){
       if(usuario!= undefined && usuario.id != undefined){
        this.reserva.id_usuario = usuario.id;
          this.carregarDisciplinasPorUsuario(usuario.id);
      }

     }

     //Executado toda vez que um periodo é selecinado
     //Carrega todas as salas disponiveis por departamento, periodo e tipo de uso
     periodoChange(valor){
        this.salaSelecionada = new Sala();
        if(this.validarPeriodo()){
          if(this.reserva.tipo_uso != undefined)
            this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso);
        }else{
          this.apresentarErro('Não é permitido reservar com o horário inferior ao horário atual');
        }
     }


     //Carrega todas as sala disponiveis daquele departamento de acordo com o hoŕario e período selecionados
     carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(id_departamento: number, data_reserva: string, periodo:number, tipo_uso:string){

       let loading = this.loadingCtrl.create({
         content: 'Carregando salas...'
       });
       loading.present();
       this.salaService.carregarDisponiveisPorDepartamentoDiaPeriodoTipo(id_departamento, data_reserva, periodo, tipo_uso)
         .then( (salas:Array<Sala>) => {
           if(salas.length > 0){
             this.salas = salas;
             this.storage.set("salas", salas);
             loading.dismiss();
           }else{
             loading.dismiss();
             this.apresentarErro("Nenhuma sala disponivel foi encontrada para essa data e periodo");
           }

           } )
         .catch( (error) => {
           loading.dismiss();
           this.apresentarErro(error.message);
         });


     }



//METODOS DA SEGUNDA ETAPA DO CADASTRO DA RESERVA

     //Carrega as disciplinas de acordo com o privilégio do usuário
     carregarDisciplinaPorPrivilegio(privilegio:string){
       if(privilegio == "Docente"){//Se o usuário for docente, carregue apenas as disciplinas dele
         if(this.usuarioSelecionado.id!= undefined){
           this.carregarDisciplinasPorUsuario(this.usuarioSelecionado.id);
           }
         else{
           this.carregarDisciplinasPorUsuario(this.login.id);
           }
         }
       else if(privilegio == "Secretário"){//Se não, carregue todas as disciplinas do departamento
         this.carregarDisciplinasPorDepartamento(this.departamentoDIN);
       }
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
                   this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso);
                 });
               }else{
                 loading.dismiss().then(() => {
                   this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso);
                 });;
                 //this.apresentarErro("Nenhuma disciplina foi encontrada para esse usuário");
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
                   this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso);
                 });
               }else{
                 loading.dismiss().then(() => {
                   this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso);
                 });;
                 //this.apresentarErro("Nenhuma disciplina foi encontrada para reste usuário");
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
                 loading.dismiss();
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


       //Ativa o input de disciplina, depedendo do tipo de uso escolhido
       changeUso(valor){
         if(this.usuarioSelecionado.id!= undefined){//se o usuário selecionado não for undefined
           //só carrega as disciplinas, caso o tipo de uso for prática ou teórica
           if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
            this.carregarDisciplinaPorPrivilegio(this.usuarioSelecionado.privilegio);
         }
         else
          if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
           this.carregarDisciplinaPorPrivilegio(this.login.privilegio);

        }


       changeSala(sala:Sala){
         if(sala != undefined)
           this.storage.set("salaSelecionada", sala);
       }

     //cria uma reserva
     reservaCreate(){

       if(this.validarReservaEtapa2()){

           this.reserva.id_departamento = this.departamentoDIN;
           this.reserva.id_sala = this.salaSelecionada.id;

           if(this.reserva.tipo_uso == "Teórica" || this.reserva.tipo_uso == "Prática")
             this.reserva.id_disciplina = this.disciplinaSelecionada.id;

           if(this.usuarioSelecionado.id == undefined)
             this.reserva.id_usuario = this.login.id;
           else
             this.reserva.id_usuario = this.usuarioSelecionado.id;

           this.reserva.data_solicitacao = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
           this.reserva.status = 1;

           if(this.login.privilegio == "Docente")
             this.reserva.tipo_reserva = "Eventual";

           this.reservaConfirm();
         }

     }

     //validar se todos os campos foram preenchidos
     validarReservaEtapa2(){
             if(this.login.privilegio == "Docente"){
               if( this.salaSelecionada.id == undefined || this.reserva.tipo_uso == undefined || this.disciplinaSelecionada.id == undefined){
                   this.apresentarErro('Por favor, preencha todos os campos');
                 return false;
               }else{
                 return true;
               }
             }else{
               if( this.reserva.tipo_uso == undefined
                    || this.reserva.tipo_reserva == undefined){
                   this.apresentarErro('Por favor, preencha todos os campos');
                 return false;
               }else{
                 return true;
               }
             }

     }

     //validar se a data não é sábado ou domingo
     validarDataEtapa2(){
       return (isSaturday(parse(this.reserva.data_reserva)) || isSunday(parse(this.reserva.data_reserva)));

     }

     prevCreate(){
       this.etapas = "etp1";
     }

     //apresenta o alerta para a confirmação dos dados da reserva
     reservaConfirm(){

     let msg: string;
     var ptLocale = require('date-fns/locale/pt')


     if(this.login.privilegio == "Docente")
      msg =  '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
       '<b>Disciplina:</b> '+(this.disciplinaSelecionada.codigo == undefined?'':this.disciplinaSelecionada.codigo+'-'+this.disciplinaSelecionada.turma)+'<br/>'+
       '<b>Data:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY, ddd', {locale: ptLocale })+'<br/>'+
       '<b>Horário:</b> '+Periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
       '<b>Tipo de uso:</b> '+this.reserva.tipo_uso;
    else
      msg =  '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
       ''+(this.disciplinaSelecionada.codigo == undefined?'':'<b>Disciplina:</b> '+this.disciplinaSelecionada.codigo+'-'+this.disciplinaSelecionada.turma+'<br/>')+''+
       '<b>Data:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY, ddd',{locale: ptLocale })+'<br/>'+
       '<b>Horário:</b> '+Periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
       '<b>Tipo de uso:</b> '+this.reserva.tipo_uso+'<br/>'+
       '<b>Tipo de reserva:</b> '+this.reserva.tipo_reserva;


       const alert = this.alertCtrl.create({
         title:'Confirmar Reserva?',
         message:msg ,

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
                 this.cadastrarReserva(this.reserva);
             }
           }
         ]
       });

       alert.setMode("ios");
       alert.present();
     }

     //cadastrar uma reserva na base de dados
     cadastrarReserva(reserva:Reserva){

     let loading = this.loadingCtrl.create({
       content: 'Solicitando reserva...'
     });

       loading.present();


       this.reservaService.cadastrarReserva(reserva)
         .then((result:any) => {
           if(result){
             loading.dismiss().then(() => {
                 this.navCtrl.setRoot(ReservaMyPage);
                 let toast = this.toastCtrl.create({
                   message: result,
                   duration: 5000
                 });
                 toast.present();
             });
           }else{
             loading.dismiss();
             this.apresentarErro("Houve um problema ao solicitar a reserva");
           }

           } )
         .catch((error) => {
           loading.dismiss();
           this.apresentarErro(error.message);
         });
     }



}
