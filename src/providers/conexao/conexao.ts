import { Injectable } from '@angular/core';

/*
  Classe reponsável pela conexão com a API
*/
@Injectable()
export class ConexaoProvider {

   //protected baseUri: string = "http://10.30.8.8:3000/";
   protected hash: string = "?hash=dmARHClbFZmCl5tg6bVNuDYKpb38t";
   protected baseUri: string = "http://localhost:3000/";
   protected static token:string;
   //protected baseUri: string = "http://192.168.100.15:3000/";
   //protected baseUri: string = "http://din.uem.br/appsmoveisapi/";
   //protected baseUri: string = "http://ec2-18-228-116-126.sa-east-1.compute.amazonaws.com/";


  constructor() {

  }

}
