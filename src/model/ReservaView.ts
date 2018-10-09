import { Periodo } from './Periodo';

export class ReservaView {
  id: number;
  //dados departamento
  nome_departamento: string;
  //dados usuário
  id_usuario: number;
  nome_usuario: string;
  //dados disciplina
  nome_disciplina: string;
  codigo_disciplina: number; //código da disciplinaSelecionada
  turma_disciplina: number;
  //dados sala
  numero_sala: number;
  tipo_sala: string; //Projeção, Laboratório, Simples
  //dados reserva
  tipo_uso: string;
  tipo_reserva: string;
  data_reserva: string;
  periodo: string;
  status: number;

  constructor(id?:number, nome_departamento?:string,id_usuario?:number, nome_usuario?:string, nome_disciplina?:string,
    codigo_disciplina?:number, turma_disciplina?:number,
    numero_sala?:number, tipo_sala?:string,
    tipo_uso?: string, tipo_reserva?: string,
    data_reserva?: string, periodo?: number, status?: number) {
        this.id = id;
        this.nome_departamento = nome_departamento;
        this.id_usuario = id_usuario;
        this.nome_usuario = nome_usuario;
        this.nome_disciplina = nome_disciplina;
        this.codigo_disciplina = codigo_disciplina;
        this.turma_disciplina = turma_disciplina;
        this.numero_sala = numero_sala;
        this.tipo_sala = tipo_sala;
        this.tipo_uso = tipo_uso;
        this.tipo_reserva = tipo_reserva;
        this.data_reserva = data_reserva;
        this.status = status;

        if(periodo == 1)
          this.periodo = Periodo.um;
        else if(periodo == 2)
          this.periodo = Periodo.dois;
        else if(periodo == 3)
          this.periodo = Periodo.tres;
        else if(periodo == 4)
          this.periodo = Periodo.quatro;
        else if(periodo == 5)
          this.periodo = Periodo.cinco;
        else if(periodo == 6)
          this.periodo = Periodo.seis;


    }
}
