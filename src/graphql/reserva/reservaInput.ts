import { ReservaGraphql } from "../../model/Reserva.graphql";

export const reservaInput = (reserva: ReservaGraphql) => {
  if (reserva.disciplina == undefined)
    return {
      tipo_uso: reserva.tipo_uso,
      tipo_reserva: reserva.tipo_reserva,
      data_solicitacao: reserva.data_solicitacao,
      data_reserva: reserva.data_reserva,
      periodo: reserva.periodo,
      status: reserva.status,
      departamento: reserva.departamento.id,
      disciplina: null,
      usuario: reserva.usuario.id,
      sala: reserva.sala.id
    };

  return {
    tipo_uso: reserva.tipo_uso,
    tipo_reserva: reserva.tipo_reserva,
    data_solicitacao: reserva.data_solicitacao,
    data_reserva: reserva.data_reserva,
    periodo: reserva.periodo,
    status: reserva.status,
    departamento: reserva.departamento.id,
    disciplina: reserva.disciplina.id,
    usuario: reserva.usuario.id,
    sala: reserva.sala.id
  };
};
