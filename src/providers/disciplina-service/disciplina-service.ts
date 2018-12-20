import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { Disciplina } from '../../model/Disciplina';



@Injectable()
export class DisciplinaServiceProvider extends ConexaoProvider{

  private disciplinas:Array<Disciplina>;

  constructor(public http: HttpClient) {
    super();
    this.disciplinas = new Array<Disciplina>();
  }


  //Buscar as disciplinas de acordo com o departamentoSelecionado
  carregarDisciplinasPorDepartamento(id_departamento:number){
    this.disciplinas = new Array<Disciplina>();
    var url = this.baseUri+'disciplina/disciplinaPorDepartamento/?id_departamento='+btoa(id_departamento+"");


  return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});

    this.http.get(url, {headers: headers}).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new Disciplina());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.disciplinas.push(new Disciplina(
                              result.dados[i].id,
                              result.dados[i].id_departamento,
                              result.dados[i].id_curso,
                              result.dados[i].codigo,
                              result.dados[i].nome,
                              result.dados[i].periodo,
                              result.dados[i].turma,
                              result.dados[i].tipo,
                              result.dados[i].id_usuario,
                              result.dados[i].status
                              ));
                            }
        }


              resolve(this.disciplinas);
        }
      },
      (error) => {
        console.log("carregarDisciplinasPorDepartamento error");
        reject(error);

      });
  });

  }


  //Buscar as disciplinas de acordo com o usuario
  carregarDisciplinasPorUsuario(id_usuario:number){
    this.disciplinas = new Array<Disciplina>();
    var url = this.baseUri+'disciplina/disciplinaPorUsuario/?id_usuario='+btoa(id_usuario+"");

  return new Promise((resolve, reject) => {

    let headers = new HttpHeaders({'x-access-token':ConexaoProvider.token});
    
    this.http.get(url, {headers: headers}).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new Disciplina());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.disciplinas.push(new Disciplina(
                              result.dados[i].id,
                              result.dados[i].id_departamento,
                              result.dados[i].id_curso,
                              result.dados[i].codigo,
                              result.dados[i].nome,
                              result.dados[i].periodo,
                              result.dados[i].turma,
                              result.dados[i].tipo,
                              result.dados[i].id_usuario,
                              result.dados[i].status
                              ));
                            }
        }


              resolve(this.disciplinas);
        }
      },
      (error) => {
        console.log("carregarDisciplinasPorUsuario error");
        reject(error);

          });
      });

  }
}
