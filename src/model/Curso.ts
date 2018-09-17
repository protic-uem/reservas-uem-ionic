export class Curso {
  id: number;
  id_departamento: number;
  nome: string;
  tipo: number;
  descricao: string;
  status: number;

  constructor(idCurso?: number, id_departamento?: number, nomeCurso?: string,
    tipoCurso?: number, descricaoCourse?: string, statusCurso?: number) {

      if (idCurso) {
        this.id = idCurso;
        this.id_departamento = id_departamento;
        this.nome = nomeCurso;
        this.tipo = tipoCurso;
        this.descricao = descricaoCourse;
        this.status = statusCurso;
      } else {
        this.id = -1;
      }
  }
}
