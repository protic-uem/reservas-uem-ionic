import { DepartamentoGraphql } from "./Departamento.graphql";
import { DisciplinaGraphql } from "./Disciplina.grapqhql";
import { UsuarioGraphql } from "./Usuario.graphql";
import { SalaGraphql } from "./Sala.graphql";
import { Periodo } from "./Periodo";

export class ReservaGraphql {

    id:number;
    tipo_uso: string;
    tipo_reserva: string;
    data_solicitacao:string;
    data_reserva: string;
    dia_semana_reserva: number;
    periodo: number;
    status: string;
    departamento: DepartamentoGraphql;
    disciplina: DisciplinaGraphql;
    usuario: UsuarioGraphql;
    sala: SalaGraphql;

  constructor(id?:number, tipo_uso?: string,
    tipo_reserva?: string, data_solicitacao?:string, data_reserva?: string, dia_semana_reserva?: number,periodo?: number,
    status?: string, departamento?:DepartamentoGraphql, disciplina?:DisciplinaGraphql,
    usuario?:UsuarioGraphql, sala?:SalaGraphql) {

        this.id = id;
        this.tipo_uso = tipo_uso;
        this.tipo_reserva = tipo_reserva;
        this.data_solicitacao = data_solicitacao;
        this.data_reserva = data_reserva;
        this.dia_semana_reserva = dia_semana_reserva;
        this.periodo = periodo;
        this.status = status;
        this.departamento = departamento;
        this.disciplina = disciplina;
        this.usuario = usuario;
        this.sala = sala;

    }


    public getPeriodo():string{

        var p:Periodo = new Periodo();

        if(this.periodo == 1)
            return p.um;
        else if(this.periodo == 2)
            return p.dois;
        else if(this.periodo == 3)
            return p.tres;
        else if(this.periodo == 4)
            return p.quatro;
        else if(this.periodo == 5)
            return p.cinco;
        else if(this.periodo == 6)
            return p.seis;
        return "";

    }
}
