import { DepartamentoGraphql } from "./Departamento.graphql";
import { CursoGraphql } from "./Curso.graphql";
import { UsuarioGraphql } from "./Usuario.graphql";

export class DisciplinaGraphql {
  id: number;
  codigo: number;
  nome: string;
  periodo: string;
  turma: number;
  tipo: string;
  status: number;
  departamento: DepartamentoGraphql;
  curso: CursoGraphql;
  usuario: UsuarioGraphql;

  constructor(
    id?: number,
    codigo?: number,
    nome?: string,
    periodo?: string,
    turma?: number,
    tipo?: string,
    status?: number,
    departamento?: DepartamentoGraphql,
    curso?: CursoGraphql,
    usuario?: UsuarioGraphql
  ) {
    this.id = id;
    this.codigo = codigo;
    this.periodo = periodo;
    this.turma = turma;
    this.nome = nome;
    this.tipo = tipo;
    this.status = status;
    this.departamento = departamento;
    this.curso = curso;
    this.usuario = usuario;
  }
}
