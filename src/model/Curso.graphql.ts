import { DepartamentoGraphql } from "./Departamento.graphql";

export class CursoGraphql {

  id: number;
  nome: string;
  tipo: number;
  status: number;
  departamento: DepartamentoGraphql;

  constructor(idCurso?: number,  nomeCurso?: string,
    tipoCurso?: number, statusCurso?: number, departamento?:DepartamentoGraphql) {

        this.id = idCurso;
        this.nome = nomeCurso;
        this.tipo = tipoCurso;
        this.status = statusCurso;
        this.departamento = departamento;
        
  }
}
