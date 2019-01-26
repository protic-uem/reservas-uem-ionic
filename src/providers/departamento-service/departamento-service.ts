import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { DepartamentoGraphql } from '../../model/Departamento.graphql';
import { getDepartamentos } from '../../graphql/departamento/departamento-json';

@Injectable()
export class DepartamentoServiceProvider extends ConexaoProvider{


  private departamentos:Array<DepartamentoGraphql>;

  constructor(public http: HttpClient) {
    super();
  }

  //Busca todos os departamentos da base de dados
  async carregarTodosDepartamentos(){
    this.departamentos = new Array<DepartamentoGraphql>();

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri+'graphql', getDepartamentos(), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.departamentos = result.data.departamentos;
            resolve(this.departamentos);
          }
      });
    });
  }

}
