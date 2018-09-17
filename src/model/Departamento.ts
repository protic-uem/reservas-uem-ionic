export class Departamento {
  id: number;
  nome: string;
  descricao: string;
  status: number;

  constructor(id?: number, nome?: string, descricao?: string, status?: number) {
    if (id) {
      this.id = id;
      this.nome = nome;
      this.descricao = descricao;
      this.status = status;
    } else {
      this.id = -1;
    }
  }
}
