import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConexaoProvider } from "../conexao/conexao";
import { SalaGraphql } from "../../model/Sala.graphql";
import {
  getSalasPorDepartamento,
  getSalasDisponiveisDepartamentoDiaPeriodoTipo
} from "../../graphql/sala/sala-json";

@Injectable()
export class SalaServiceProvider extends ConexaoProvider {
  private salas: Array<SalaGraphql>;
  constructor(public http: HttpClient) {
    super();

    this.salas = new Array<SalaGraphql>();
  }

  //carrega todas as salas refereten a um determinado departamento
  async carregarSalaPorDepartamento(id_departamento: number) {
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.salas = new Array<SalaGraphql>();

    return await new Promise((resolve, reject) => {
      this.http
        .post(this.baseUri, getSalasPorDepartamento(id_departamento), {
          headers: ConexaoProvider.headersToken
        })
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            this.salas = result.data.salasPorDepartamento;
            resolve(this.salas);
          }
        });
    });
  }

  //carrega todas as disponiveis para aquele departamento naquele determinado dia e periodo
  async carregarDisponiveisPorDepartamentoDiaPeriodoTipo(
    id_departamento: number,
    data_reserva: string,
    periodo: number,
    tipo_uso: string
  ) {
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.salas = new Array<SalaGraphql>();

    id_departamento = parseInt("" + id_departamento);
    periodo = parseInt("" + periodo);

    return await new Promise((resolve, reject) => {
      this.http
        .post(
          this.baseUri,
          getSalasDisponiveisDepartamentoDiaPeriodoTipo(
            id_departamento,
            data_reserva,
            periodo,
            tipo_uso
          ),
          { headers: ConexaoProvider.headersToken }
        )
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            this.salas = result.data.salasDisponiveisPorDepartamentoDiaPeriodo;
            resolve(this.salas);
          }
        });
    });
  }
}
