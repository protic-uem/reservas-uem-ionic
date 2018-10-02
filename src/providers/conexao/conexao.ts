import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Classe reponsável pela conexão com a API
*/
@Injectable()
export class ConexaoProvider {

   //protected baseUri: string = "http://10.30.8.8:3000/";
   protected hash: string = "?hash=dmARHClbFZmCl5tg6bVNuDYKpb38t";
   protected baseUri: string = "http://localhost:3000/";
  // protected baseUri: string = "http://192.168.100.15:3000/";
  constructor() {

  }

}
