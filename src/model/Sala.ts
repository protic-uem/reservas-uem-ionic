export class Sala {
  
  id: number;
  id_departamento: number;
  numero: number;
  descricao: string;
  tipo:string;
  status: number;
  capacidade:number;

  constructor(id?: number, id_departamento?: number, numero?: number,
    descricao?: string, tipo?: string,  status?: number, capacidade?:number) {

        this.id = id;
        this.id_departamento = id_departamento;
        this.numero = numero;
        this.descricao = descricao;
        this.tipo = tipo;
        this.status = status;
        this.capacidade = capacidade;

    }
}
