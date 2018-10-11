export class Disciplina {
  id: number;
  id_departamento: number;
  id_curso: number;
  codigo: number;
  nome:string;
  periodo: string;
  turma:number;
  tipo:string;
  id_usuario:number;
  status:number;

  constructor(id?: number, id_departamento?: number, id_curso?: number,
    codigo?: number, nome?:string, periodo?: string, turma?: number,
    tipo?: string, id_usuario?:number, status?: number) {
        this.id = id;
        this.id_departamento = id_departamento;
        this.id_curso = id_curso;
        this.codigo = codigo;
        this.periodo = periodo;
        this.turma = turma;
        this.nome = nome;
        this.tipo = tipo;
        this.id_usuario;
        this.status = status;

  }


}
