export class DepartamentoGraphql {
  id: number;
  nome: string;
  descricao: string;
  status: number;

  constructor(id?: number, nome?: string, descricao?: string, status?: number) {
      this.id = id;
      this.nome = nome;
      this.descricao = descricao;
      this.status = status;
  }
  
}
