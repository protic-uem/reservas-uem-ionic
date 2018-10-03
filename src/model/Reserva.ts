export class Reserva {
  id:number;
  id_departamento:number;
  id_usuario:number;
  id_disciplina:number;
  tipo_uso: string;
  tipo_reserva: string;
  data_solicitacao:string;
  data_reserva: string;
  periodo: number;
  id_sala:number;
  status: number;

  nome_departamento:string;
  nome_usuario:string;
  nome_disciplina:string;
  numero_sala:string;

  constructor(id?:number, id_departamento?:number, id_usuario?:number,
    id_disciplina?:number,  tipo_uso?: string,
    tipo_reserva?: string, data_solicitacao?:string, data_reserva?: string, periodo?: number,
    id_sala?:number, status?: number,
    nome_departamento?:string, nome_usuario?:string, nome_disciplina?:string, numero_sala?:string) {

        this.id = id;
        this.id_departamento = id_departamento;
        this.id_usuario = id_usuario;
        this.id_disciplina = id_disciplina;
        this.tipo_uso = tipo_uso;
        this.tipo_reserva = tipo_reserva;
        this.data_solicitacao = data_solicitacao;
        this.data_reserva = data_reserva;
        this.periodo = periodo;
        this.id_sala = id_sala;
        this.status = status;

        this.nome_departamento = nome_departamento;
        this.nome_usuario = nome_usuario;
        this.nome_disciplina = nome_disciplina;
        this.numero_sala = numero_sala;

    }
}
