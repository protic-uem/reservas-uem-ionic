export class Login {
  id: number;
  nome:string;
  telefone:string;
  privilegio: string;
  id_departamento: number;
  status: number;

  constructor(idLogin?: number, nome?: string, telefone?: string,
       id_departamento?:number, privilegio?: string, status?:number) {
        this.id = idLogin;
        this.nome = nome;
        this.telefone = telefone;
        this.privilegio = privilegio;
        this.id_departamento = id_departamento;
        this.status = status;
  }


}
