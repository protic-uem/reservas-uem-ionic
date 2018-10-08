import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReservaView } from '../../model/ReservaView';
import { ConexaoProvider } from '../conexao/conexao';

@Injectable()
export class ReservaVisitanteServiceProvider extends ConexaoProvider{

  private reservas:Array<ReservaView>;

  constructor(public http: HttpClient) {
    super();
    this.reservas = new Array<ReservaView>();
  }

  //carrega todas as reservas referente a um determinado usuário
  carregarReservaVisitante(id_departamento:number, id_disciplina:number){
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaView>();

    var url = this.getUrl(id_departamento, id_disciplina);

  return new Promise((resolve, reject) => {
    this.http.get(url).subscribe((result:any) => {
      if(result.retorno == "false"){
        resolve(new ReservaView());
      }
      else{
        if(result.dados.length>0){
          let tamanho = result.dados.length;
          for(var i = 0;i<tamanho;i++){
            this.reservas.push(new ReservaView(
                              result.dados[i].nome_departamento,
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
  });


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
