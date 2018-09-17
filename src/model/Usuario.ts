export class Usuario {
  id: number;
  id_departamento: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  permissao: number;
  id_disciplinas: string;
  problema_locomocao: number;
  status: number;

  constructor(id?: number, id_departamento?: number, nome?: string, email?:string,
    senha?: string, telefone?: string, permissao?: number, disciplinas?: string,
    problemalocomocao?: number, status?: number) {
      if (id) {
        this.id = id;
        this.id_departamento = id_departamento;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.permissao = permissao;
        this.id_disciplinas = disciplinas;
        this.problema_locomocao = problemalocomocao;
        this.status = status;
      } else {
        this.id = -1;
      }
  }
}
