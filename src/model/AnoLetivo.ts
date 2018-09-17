export class AnoLetivo {
  id: number;
  id_departamento: number;
  iniciop: string;
  fimp: string;
  inicios: string;
  fims: string;
  status: number

  constructor (id?: number, id_departamento?: number, iniciop?: string, fimp?: string,
    inicios?: string, fims?:string, status?: number) {
      if (id) {
        this.id = id;
        this.id_departamento = id_departamento;
        this.iniciop = iniciop;
        this.fimp = fimp;
        this.inicios = inicios;
        this.fims = fims;
        this.status = status;
      } else {
        id = -1;
        this.iniciop = "";
        this.inicios = "";
        this.fimp = "";
        this.fims = "";
        status = 0;
      }
    }
}
