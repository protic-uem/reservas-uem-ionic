import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConexaoProvider } from "../conexao/conexao";
import { ReservaGraphql } from "../../model/Reserva.graphql";
import { reservasPorDepartamentoDisciplina } from "../../graphql/reserva/reserva-json";

@Injectable()
export class ReservaVisitanteServiceProvider extends ConexaoProvider {
  private reservas: Array<ReservaGraphql>;

  constructor(public http: HttpClient) {
    super();
    this.reservas = new Array<ReservaGraphql>();
  }

  async carregarReservaVisitante(
    id_departamento: number,
    id_disciplina: number
  ) {
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.reservas = new Array<ReservaGraphql>();

    return await new Promise((resolve, reject) => {
      this.http
        .post(
          this.baseUri,
          reservasPorDepartamentoDisciplina(id_departamento, id_disciplina),
          { headers: ConexaoProvider.headersToken }
        )
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            this.reservas = result.data.reservasPorDepartamentoDisciplina;
            resolve(this.reservas);
          }
        });
    });
  }
}
