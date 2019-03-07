import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

/*
  Classe reponsável pela conexão com a API
*/
@Injectable()
export class ConexaoProvider {
  //protected baseUri: string = "http://localhost:3000/";
  static token: string;
  protected baseUri: string = "https://www.npd.uem.br/graphql";
  protected static headersToken: HttpHeaders;
  protected headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor() {}
}
