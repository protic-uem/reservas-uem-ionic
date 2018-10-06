export class Usuario {
  id: number;
  id_departamento: number;
  nome: string;
  email: string;
  telefone: string;
  privilegio: string;

  constructor(id?: number, id_departamento?: number, nome?: string, email?:string,
     telefone?: string, privilegio?: string) {

        this.id = id;
        this.id_departamento = id_departamento;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.privilegio = privilegio;
    
      }
}
