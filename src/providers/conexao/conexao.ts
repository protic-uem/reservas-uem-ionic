import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Classe reponsável pela conexão com a API
*/
@Injectable()
export class ConexaoProvider {

   protected baseUri: string = "http://din.uem.br/appsmoveis/webresources/reserva/";

  constructor() {

  }

}
