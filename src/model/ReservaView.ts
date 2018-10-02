export class ReservaView {
  //dados departamento
  nome_departamento: string;
  //dados usuário
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
  periodo: number;
  status: number;

  constructor(nome_departamento?:string, nome_usuario?:string, nome_disciplina?:string,
    codigo_disciplina?:number, turma_disciplina?:number,
    numero_sala?:number, tipo_sala?:string,
    tipo_uso?: string, tipo_reserva?: string,
    data_reserva?: string, periodo?: number, status?: number) {
        this.nome_departamento = nome_departamento;
        this.nome_usuario = nome_usuario;
        this.nome_disciplina = nome_disciplina;
        this.codigo_disciplina = codigo_disciplina;
        this.turma_disciplina = turma_disciplina;
        this.numero_sala = numero_sala;
        this.tipo_sala = tipo_sala;
        this.tipo_uso = tipo_uso;
        this.tipo_reserva = tipo_reserva;
        this.data_reserva = data_reserva;
        this.periodo = periodo;
        this.status = status;
    }
}
