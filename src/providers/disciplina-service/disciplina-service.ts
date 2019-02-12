import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { disciplinasPorUsuario, disciplinasPorDepartamento } from '../../graphql/disciplina/disciplina-json';
import { DisciplinaGraphql } from '../../model/Disciplina.grapqhql';



@Injectable()
export class DisciplinaServiceProvider extends ConexaoProvider{

  private disciplinas:Array<DisciplinaGraphql>;

  constructor(public http: HttpClient) {
    super();
  }


  //Buscar as disciplinas de acordo com o departamentoSelecionado
  async carregarDisciplinasPorDepartamento(id_departamento:number){
    this.disciplinas = new Array<DisciplinaGraphql>();
  
    id_departamento = parseInt(id_departamento+"");

    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, disciplinasPorDepartamento(id_departamento), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.disciplinas = result.data.disciplinasPorDepartamento;
            resolve(this.disciplinas);
          }
      });
    });

  }


  //Buscar as disciplinas de acordo com o usuario
  async carregarDisciplinasPorUsuario(id_usuario:number){
    this.disciplinas = new Array<DisciplinaGraphql>();
  
    return await new Promise((resolve, reject) => {
      this.http.post(this.baseUri, disciplinasPorUsuario(id_usuario), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
          if(result.errors){
            reject(result.errors[0].message);
          }else{
            this.disciplinas = result.data.disciplinasPorUsuario;
            resolve(this.disciplinas);
          }
      });
    });
  }
}
