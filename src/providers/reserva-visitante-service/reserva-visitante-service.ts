import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConexaoProvider } from '../conexao/conexao';
import { ReservaGraphql } from '../../model/Reserva.graphql';
import { reservasPorDepartamentoDisciplina } from '../../graphql/reserva/reserva-json';

@Injectable()
export class ReservaVisitanteServiceProvider extends ConexaoProvider{

  private reservas:Array<ReservaGraphql>;

  constructor(public http: HttpClient) {
    super();
    this.reservas = new Array<ReservaGraphql>();
  }

  async carregarReservaVisitante(id_departamento:number, id_disciplina:number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaGraphql>();

        return await new Promise((resolve, reject) => {
            this.http.post(this.baseUri, reservasPorDepartamentoDisciplina(id_departamento, id_disciplina), { headers: ConexaoProvider.headersToken}).subscribe((result:any) => {
              if(result.errors){
                reject(result.errors[0].message);
              }else{
                this.reservas = result.data.reservasPorDepartamentoDisciplina;
                resolve(this.reservas);
              }
          });
        });

    /*var url = this.getUrl(id_departamento, id_disciplina);

  return new Promise((resolve, reject) => {
    this.http.get(url).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaGraphql());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.reservas.push(new ReservaGraphql(
                                result.dados[i].id,
                                result.dados[i].nome_departamento,
                                result.dados[i].id_usuario,
                                result.dados[i].nome_usuario,
                                result.dados[i].nome_disciplina,
                                result.dados[i].codigo_disciplina,
                                result.dados[i].turma_disciplina,
                                result.dados[i].numero_sala,
                                result.dados[i].tipo_sala,
                                result.dados[i].tipo_uso,
                                result.dados[i].tipo_reserva,
                                result.dados[i].data_reserva,
                                result.dados[i].periodo,
                                result.dados[i].status
                              ));
                            }
        }


              resolve(this.reservas);
        }
      },
      (error) => {
        console.log("carregarReservaVisitante error");
        reject(error);

      });
  });*/


  }

  //Retornar a URL conforme os parâmetros
  getUrl(id_departamento:number, id_disciplina:number):string{
    var url = this.baseUri+'reserva/reservasVisitante'+this.hash;

    if(id_departamento != undefined && id_disciplina != undefined)
      return url+'&id_departamento='+btoa(id_departamento+"")+'&id_disciplina='+btoa(id_disciplina+"");
    else if(id_departamento != undefined)
      return url+'&id_departamento='+btoa(id_departamento+"");
    else if(id_disciplina != undefined)
      return url+'&id_disciplina='+btoa(id_disciplina+"");

    return url;

  }

}
