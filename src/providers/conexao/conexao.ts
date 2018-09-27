import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Classe reponsável pela conexão com a API
*/
@Injectable()
export class ConexaoProvider {

   //protected baseUri: string = "http://din.uem.br/appsmoveis/webresources/reserva/";
   protected hash: string = "?hash=dmARHClbFZmCl5tg6bVNuDYKpb38t";
   protected baseUri: string = "http://localhost:3000/";

  constructor() {

  }

}
