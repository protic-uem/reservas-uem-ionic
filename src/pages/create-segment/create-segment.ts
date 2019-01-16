import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { parse, format, isSunday, isSaturday, isFriday, addWeeks, addMonths, getHours, getMinutes, addDays } from 'date-fns';
import { Storage } from '@ionic/storage';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";

//Pages
import { HomePage } from '../home/home';
import { ReservaMyPage } from '../reserva-my/reserva-my';

//Models
import { Disciplina } from '../../model/Disciplina';
import { Login } from '../../model/Login';
import { Sala } from '../../model/Sala';
import { Periodo } from '../../model/Periodo';
import { Usuario } from '../../model/Usuario';
import { Reserva} from '../../model/Reserva';


//Providers
import { DisciplinaServiceProvider } from '../../providers/disciplina-service/disciplina-service';
import { SalaServiceProvider } from '../../providers/sala-service/sala-service';
import { ReservaServiceProvider } from '../../providers/reserva-service/reserva-service';
import { UsuarioServiceProvider } from '../../providers/usuario-service/usuario-service';
import { ReservaDetailPage } from '../reserva-detail/reserva-detail';


@Component({
  selector: 'page-create-segment',
  templateUrl: 'create-segment.html',
})
export class CreateSegmentPage {

  reserva:Reserva;
  periodo:Periodo;

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


  periodoCorrente:number;

  etapas:string;
  classe:string = "docente";

  mudouPeriodo:boolean = false;
  mudouTipo:boolean = false;
  mudouUsuario:boolean = false;

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
         this.periodo = new Periodo();

         this.hoje = format(new Date(), 'YYYY-MM-DD');
         //this.dataSelecionada = format(addDays(new Date(), 1), 'YYYY-MM-DD');
         //this.showDate = format(addDays(new Date(), 1), 'DD/MM/YY');

         this.login = this.navParams.get('login');
         if(this.login.nome == undefined)
           this.loadResources();//pegar o usuário logado e depois carregar as reservas

           //If it is docente, he just will can to reserve in period of 3 weeks
           //If it is secretary, he will can to reserve in period of 1 month
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

 /**
  * Check if today is friday or saturday
  * If today is friday, update default day of calendar component to Monday
  * If today is saturday, update default day of calendar component to Monday
  */
 calcularDiaDefaultCalendar(){
   if(isFriday(this.hoje))
      this.dataDefault = format(addDays(new Date(), 3), 'YYYY-MM-DD');
   else if(isSaturday(this.hoje))
      this.dataDefault = format(addDays(new Date(), 2), 'YYYY-MM-DD');
   else
      this.dataDefault = format(addDays(new Date(), 1), 'YYYY-MM-DD');
 }

 /**
  * Validate the period
  * Validate if the choosen period is not previous than current hour
  */
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

  /**
   * load the login from storage
   */
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


 /**
  * It is executed always the user change stage
  * @param segmento segment
  */
 segmentChanged(segmento){

 }

  /**
    * Realizes all validations: reservation validation, period validation and date validation
    * If to pass all validations, load disciplines and rooms
    * To go next stage
    */
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
                  if(this.mudouUsuario == true){

                    if(this.usuarioSelecionado.id!= undefined){//if the choosen user is not undefined
                      //Only load the disciplines, if the use type is pratical or theoretical
                      if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
                        this.carregarDisciplinaPorPrivilegio(this.usuarioSelecionado.privilegio);
                      else{
                        let loading = this.loadingCtrl.create({
                          content: 'Carregando dados...'
                        });
                        loading.present();
                      this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);
                      }
                    }
                    else
                      if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
                      this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
                      else{
                        let loading = this.loadingCtrl.create({
                          content: 'Carregando dados...'
                        });
                        loading.present();
                      this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);
                    }
                  }

                  else if(this.mudouPeriodo == true && this.mudouTipo == false){

                    let loading = this.loadingCtrl.create({
                      content: 'Carregando dados...'
                    });
                    loading.present();

                      this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);

                  }
                  else if(this.mudouPeriodo == false && this.mudouTipo == true){

                    if(this.usuarioSelecionado.id!= undefined){//se o usuário selecionado não for undefined
                      //só carrega as disciplinas, caso o tipo de uso for prática ou teórica
                      if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
                        this.carregarDisciplinaPorPrivilegio(this.usuarioSelecionado.privilegio);
                    }
                    else
                      if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
                      this.carregarDisciplinaPorPrivilegio(this.login.privilegio);

                  }else if(this.mudouTipo == true && this.mudouPeriodo == true){

                    if(this.usuarioSelecionado.id!= undefined){//se o usuário selecionado não for undefined
                      //só carrega as disciplinas, caso o tipo de uso for prática ou teórica
                      if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
                        this.carregarDisciplinaPorPrivilegio(this.usuarioSelecionado.privilegio);
                    }
                    else
                      if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
                      this.carregarDisciplinaPorPrivilegio(this.login.privilegio);
                  }
                  else if(this.mudouTipo == false && this.mudouPeriodo == false){
                    this.avancarEtapa2();
                  }


                  this.mudouTipo = false;
                  this.mudouPeriodo = false;
                  this.mudouUsuario = false;

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

  /**
   * To go next two stage
   * We are use 'zone', because without it, happens a bug
   */
 avancarEtapa2(){
       this.zone.run(() => {
         this.etapas = "etp2";
         if(this.reserva.tipo_uso == 'Prática' || this.reserva.tipo_uso == 'Teórica')
           if(this.disciplinas == undefined || this.disciplinas.length == 0)
             this.apresentarErro("Nenhuma disciplina foi encontrada para esse usuário");
       });
 }

 /**
  * Show the calendar component
  */
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

           }
         })
 }

 /**
  * Load all teacher users of specific department
  * @param id_departamento specific department
  */
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


 /**
  * Validate if all field are filled
  */
 validarReserva(){
   if(this.login.privilegio == "Docente"){
     //se for docente, valide somente data, periodo e tipo de uso
     if(this.dataSelecionada == undefined || this.reserva.periodo == undefined || this.reserva.tipo_uso == undefined){
         this.apresentarErro('Por favor, preencha todos os campos para continuar');
       return false;
     }else
       return true;
     }
   else{
     //se for secretário, valide usuario, data, periodo e tipo de uso
     if(this.usuarioSelecionado.id == undefined || this.dataSelecionada == undefined || this.reserva.periodo == undefined
      || this.reserva.tipo_uso == undefined){
         this.apresentarErro('Por favor, preencha todos os campos para continuar');
       return false;
     }else
       return true;
     }

 }

 /**
  * Validate if date isn't saturday or sunday
  */
 validarData(){
   return (isSaturday(parse(this.dataSelecionada)) || isSunday(parse(this.dataSelecionada)));
 }

  /**
   * Shows the toast of canceled reservation
   */
  reservaCanceled(){
      this.navCtrl.push(HomePage, {
        login: this.login,
      }, {animate: true, animation:'ios-transition', direction: 'back', duration:1000});
  }

  /**
   * Shows the erro dialog
   * @param msg 
   */
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

  
  /**
   * Executes every time that an user is selected
   * Updates the reservation's id_usuario with id of choosen user
   * @param usuario choosen user
   */
  usuarioChange(usuario:Usuario){
    this.mudouUsuario = true;
    if(usuario!= undefined && usuario.id != undefined){
    this.reserva.id_usuario = usuario.id;
    }
  }

  //Executado toda vez que um periodo é selecinado
  //Valida se o período selecionado é valido, ou seja, se não é inferior ao período atual
  /**
   * Executes every time that a period is selected
   * Validates if the chosen period is valid, that is, it is if not is inferior than current period
   * @param valor period's value
   */
  periodoChange(valor){
    this.mudouPeriodo = true;
    this.salaSelecionada = new Sala();
    if(!this.validarPeriodo())
      this.apresentarErro('Não é permitido reservar com o horário inferior ao horário atual');
  }


  /**
   * Loads all available rooms of specific department according hour and period chosen
   * @param id_departamento if of department
   * @param data_reserva  reservation's date
   * @param periodo  reservation's period
   * @param tipo_uso reservation's type use
   * @param loading loading component
   */
  carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(id_departamento: number, data_reserva: string, periodo:number, tipo_uso:string, loading:any){

    return this.salaService.carregarDisponiveisPorDepartamentoDiaPeriodoTipo(id_departamento, data_reserva, periodo, tipo_uso)
      .then( (salas:Array<Sala>) => {
        if(salas.length > 0){
          this.salas = salas;
          this.storage.set("salas", salas);
          loading.dismiss().then(() => {
              this.avancarEtapa2();
          });
        }else{
          loading.dismiss().then(() => {
              this.avancarEtapa2();
          });
          this.apresentarErro("Nenhuma sala disponivel foi encontrada para essa data e periodo");
        }

        } )
      .catch( (error) => {
        loading.dismiss();
        this.apresentarErro(error.message);
      });


  }


//Second stage's methods of reservation's register

  /**
   * Loads all disicplines according with user's privilege
   * @param privilegio privilege: teacher or secretary
   */
  carregarDisciplinaPorPrivilegio(privilegio:string){
      if(this.usuarioSelecionado.id!= undefined){
        this.carregarDisciplinasPorUsuario(this.usuarioSelecionado.id);
        }
      else{
        this.carregarDisciplinasPorUsuario(this.login.id);
        }
  }

  /**
   * Loads all disciplines according a specific user
   * @param id_usuario user's id
   */
  carregarDisciplinasPorUsuario(id_usuario:number){

      let loading = this.loadingCtrl.create({
        content: 'Carregando dados...'
      });
      loading.present();
      this.disciplinaService.carregarDisciplinasPorUsuario(id_usuario)
        .then( (disciplinas:Array<Disciplina>) => {
          if(disciplinas.length > 0){
            this.disciplinas = disciplinas;
            this.storage.set("disciplinas", disciplinas);
              this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);
          }else{
              this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          this.apresentarErro(error.message);
        });

  }

  /**
   * Loads all disciplines according a specific department
   * @param id_departamento department's id
   */
  carregarDisciplinasPorDepartamento(id_departamento:number){

      let loading = this.loadingCtrl.create({
        content: 'Carregando dados...'
      });
      loading.present();
      this.disciplinaService.carregarDisciplinasPorDepartamento(id_departamento)
        .then( (disciplinas:Array<Disciplina>) => {
          if(disciplinas.length > 0){
            this.disciplinas = disciplinas;
            this.storage.set("disciplinas", disciplinas);
              this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);
          }else{
              this.carregarSalasDisponiveisPorDepartamentoDataPeriodoTipo(this.departamentoDIN, this.dataSelecionada, this.reserva.periodo, this.reserva.tipo_uso, loading);
          }

          } )
        .catch( (error) => {
          loading.dismiss();
          this.apresentarErro(error.message);
        });
  }

  /**
   * Loads all rooms according a specific department
   * @param id_departamento department's id
   */
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


  /**
   * Executes every time that the user change use type
   * @param valor component's value: Value of select's component
   */
  changeUso(valor){
    this.mudouTipo = true;
  }

  /**
   * Executes every time that the user change room
   * @param sala reservation's room
   */
  changeSala(sala:Sala){
    if(sala != undefined)
      this.storage.set("salaSelecionada", sala);
  }

  /**
   * Creates a reservation
   */
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

  /**
   * Validates if all field are filled
   */
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

  /**
   * Validates if the date isn't saturday or sunday
   */
  validarDataEtapa2(){
    return (isSaturday(parse(this.reserva.data_reserva)) || isSunday(parse(this.reserva.data_reserva)));

  }

  /**
   * Retuns to previous stage: stage one
   */
  prevCreate(){
    this.etapas = "etp1";
  }

  /**
   * Shows the alert for confirmation of reservation's datas
   */
  reservaConfirm(){

  let msg: string;
  var ptLocale = require('date-fns/locale/pt')


  if(this.login.privilegio == "Docente")
    msg =  '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
      '<b>Disciplina:</b> '+(this.disciplinaSelecionada.codigo == undefined?'':this.disciplinaSelecionada.codigo+'-'+this.disciplinaSelecionada.turma)+'<br/>'+
      '<b>Data:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY, ddd', {locale: ptLocale })+'<br/>'+
      '<b>Horário:</b> '+this.periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
      '<b>Tipo de uso:</b> '+this.reserva.tipo_uso;
    else
      msg =  '<b>Sala:</b> '+this.salaSelecionada.numero+'<br/>'+
        ''+(this.disciplinaSelecionada.codigo == undefined?'':'<b>Disciplina:</b> '+this.disciplinaSelecionada.codigo+'-'+this.disciplinaSelecionada.turma+'<br/>')+''+
        '<b>Data:</b> '+format(this.reserva.data_reserva, 'DD/MM/YYYY, ddd',{locale: ptLocale })+'<br/>'+
        '<b>Horário:</b> '+this.periodo.retornarPeriodo(this.reserva.periodo)+'<br/>'+
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
            //Retuns a sucess object, and shows reservation's toast realized with sucess
            //On the main reservation's page
              this.cadastrarReserva(this.reserva);
          }
        }
      ]
    });

    alert.setMode("ios");
    alert.present();
  }

  /**
   * Registers a reservation in database
   * @param reserva reservation
   */
  cadastrarReserva(reserva:Reserva){ 

  let loading = this.loadingCtrl.create({
    content: 'Solicitando reserva...'
  });

    loading.present();


    this.reservaService.cadastrarReserva(reserva)
      .then((result:any) => {
        if(result){
          loading.dismiss().then(() => {
              this.navCtrl.setRoot(ReservaMyPage, {login:this.login});
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
