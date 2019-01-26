import { AlertController, ToastController }  from 'ionic-angular';
import { isSaturday, isSunday, format, parse, isFriday, addDays } from 'date-fns';


//Apresenta o mensagem de erro ao usuário
export const apresentarErro = (alertCtrl:AlertController, msg:string) => {
    const alertError = alertCtrl.create({
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
 };

 export const apresentarToast = (toastCtrl:ToastController, msg:string) => {
    let toast = toastCtrl.create({
      message: msg,
      duration: 3000,    
      cssClass: 'changeToast'  
    });
    toast.present();
 };

/**
  * Validate if date isn't saturday or sunday
  */
export const validarData =  (dataSelecionada:string) => {
  return (isSaturday(parse(dataSelecionada)) || isSunday(parse(dataSelecionada)));
};

 /**
  * Check if today is friday or saturday
  * If today is friday, update default day of calendar component to Monday
  * If today is saturday, update default day of calendar component to Monday
  */
 export const calcularDiaDefaultCalendar = ():string =>{

  let hoje = format(new Date(), 'YYYY-MM-DD');

  if(isFriday(hoje))
     return format(addDays(new Date(), 3), 'YYYY-MM-DD');
  else if(isSaturday(hoje))
     return format(addDays(new Date(), 2), 'YYYY-MM-DD');
  else
     return format(addDays(new Date(), 1), 'YYYY-MM-DD');
};


 