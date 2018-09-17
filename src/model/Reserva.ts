export class Reserva {
  id: number;
  id_departamento: number;
  id_usuario: number;
  tipoaula: number;
  id_disciplina: number;
  tipo: number;
  dataefetuacao: string;
  proximoid: number;
  datareserva: string;
  periodo: number;
  tiposala: number;
  idsala: number;
  status: number;

  constructor(id?: number, id_departamento?: number, id_usuario?: number, tipoaula?: number,
    id_disciplina?: number, tipo?: number, dataefetuacao?: string, proximoid?: number,
    datareserva?: string, periodo?: number, tiposala?: number, idsala?: number, status?: number) {
      if (id) {
        this.id = id;
        this.id_departamento = id_departamento;
        this.id_usuario = id_usuario;
        this.tipoaula = tipoaula;
        this.id_disciplina = id_disciplina;
        this.tipo = tipo;
        this.dataefetuacao = dataefetuacao;
        this.proximoid = proximoid;
        this.datareserva = datareserva;
        this.periodo = periodo;
        this.tiposala = tiposala;
        this.idsala = idsala;
        this.status = status;
      } else {
        this.id = -1;
        this.id_usuario = -1;
        this.tipoaula = 1;
        this.tipo = 1;
        this.dataefetuacao = new Date().toISOString();
        this.proximoid = -1;
        this.datareserva = new Date().toISOString();
        this.tiposala = -1;
        this.status = 0;
      }
    }
}
