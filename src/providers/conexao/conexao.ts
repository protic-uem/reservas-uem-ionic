import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

/*
  Classe reponsável pela conexão com a API
*/
@Injectable()
export class ConexaoProvider {

   //protected baseUri: string = "http://10.30.8.8:3000/";
   protected hash: string = "?hash=dmARHClbFZmCl5tg6bVNuDYKpb38t";
   protected baseUri: string = "http://localhost:3000/";
   static token:string;
   //protected baseUri: string = "http://192.168.100.15:3000/";
   //protected baseUri: string = "http://din.uem.br/appsmoveisapi/";
   //protected baseUri: string = "http://ec2-18-228-116-126.sa-east-1.compute.amazonaws.com/";

   protected static headersToken:HttpHeaders;
   protected headers = new HttpHeaders({'Content-Type':'application/json'});


  constructor() {

  }

}
