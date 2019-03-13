import { DepartamentoGraphql } from "./Departamento.graphql";

export class UsuarioGraphql {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  privilegio: string;
  ultimo_acesso: string;
  status: number;
  tipo: number;
  departamento: DepartamentoGraphql;

  constructor(
    id?: number,
    nome?: string,
    email?: string,
    senha?: string,
    telefone?: string,
    privilegio?: string,
    ultimo_acesso?: string,
    status?: number,
    tipo?: number,
    departamento?: DepartamentoGraphql
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.privilegio = privilegio;
    this.ultimo_acesso = ultimo_acesso;
    this.status = status;
    this.tipo = tipo;
    this.departamento = departamento;
  }
}
