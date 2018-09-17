import { Reserva } from './Reserva';

export class ReservaUsuario extends Reserva {
    public numero: number;
    public descricao: string;
    public nomeMateria: string;

    constructor(id?: number, iddepartamento?: number, idusuario?: number, tipoaula?: number,
        iddisciplina?: number, tipo?: number, dataefetuacao?: string, proximoid?: number,
        datareserva?: string, periodo?: number, tiposala?: number, idsala?: number, status?: number,
        numero?: number, descricao?: string, nomeMateria?: string) {

        super(id, iddepartamento, idusuario, tipoaula, iddisciplina, tipo, dataefetuacao,
            proximoid, datareserva, periodo, tiposala, idsala, status);
        this.numero = numero;
        this.descricao = descricao;
        this.nomeMateria = nomeMateria;
    }
}