import { AlertController }  from 'ionic-angular';
import { Storage } from '@ionic/storage';


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


 //verifica e recupera o usuário do storage
 export const getLogin = (storage:Storage) =>{
    
 };
 