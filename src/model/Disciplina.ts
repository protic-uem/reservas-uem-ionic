export class Disciplina {
  id: number;
  id_departamento: number;
  id_curso: number;
  codigo: number;
  periodo: number;
  turma: number;
  nome: string;
  classificacao: number;
  status: number;

  constructor(id?: number, id_departamento?: number, id_curso?: number,
    codigo?: number, periodo?: number, turma?: number, nome?: string,
    classificacao?: number, status?: number) {

      if (id) {
        this.id = id;
        this.id_departamento = id_departamento;
        this.id_curso = id_curso;
        this.codigo = codigo;
        this.periodo = periodo;
        this.turma = turma;
        this.nome = nome;
        this.classificacao = classificacao;
        this.status = status;
      } else {
        this.id = -1;
        this.status = 0;
      }
  }
}
