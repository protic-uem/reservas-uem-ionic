import { DepartamentoGraphql } from "./Departamento.graphql";

export class SalaGraphql {
  
  id: number;
  numero: number;
  descricao: string;
  tipo:string;
  status: number;
  capacidade:number;
  departamento: DepartamentoGraphql;

  constructor(id?: number, numero?: number,
    descricao?: string, tipo?: string,  status?: number, capacidade?:number, departamento?:DepartamentoGraphql) {

        this.id = id;
        this.numero = numero;
        this.descricao = descricao;
        this.tipo = tipo;
        this.status = status;
        this.capacidade = capacidade;
        this.departamento = departamento;

    }
}
