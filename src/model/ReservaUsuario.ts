/**
* Reserva pertencente a um determiando usuário
*/
export class ReservaUsuario {
    id: number;
    data_reserva:string;
    periodo:number;
    id_sala:number;
    status:number;
    codigo_disciplina:number;
    nome_disciplina:string;
    numero_sala:number;


    constructor(id?: number, data_reserva?:string, periodo?:number, id_sala?:number,
        status?:number, codigo_disciplina?:number, nome_disciplina?:string, numero_sala?:number) {
            this.id = id;
            this.data_reserva = data_reserva;
            this.periodo = periodo;
            this.id_sala = id_sala;
            this.status = status;
            this.codigo_disciplina = codigo_disciplina;
            this.nome_disciplina = nome_disciplina;
            this.numero_sala = numero_sala;
    }
}
