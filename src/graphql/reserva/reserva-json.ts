export const minhasReservas = (usuarioID: number) => {
  return {
    query: `query getMinhasReservas($usuarioID: ID!) {
                    minhasReservas(usuarioID: $usuarioID) {
                        id
                        tipo_uso
                        tipo_reserva
                        data_solicitacao
                        data_reserva
                        periodo
                        status
                        dia_semana_reserva
                        departamento{
                            id
                            nome
                            descricao
                        }
                        disciplina{
                            id
                            codigo
                            nome
                            turma
                            tipo
                        }
                        sala{
                            id
                            numero
                            descricao
                            tipo
                        }
                        usuario{
                            id
                            nome
                            email
                            privilegio
                        }
                    }
                }`,
    variables: {
      usuarioID: usuarioID
    }
  };
};

export const reservasTelaHome = (
  departamentoID: number,
  data_reserva: string,
  periodo: number
) => {
  return {
    query: `query getReservasHome($departamentoID: ID!, $data_reserva: String!, $periodo: Int!) {
            reservasTelaHome(departamentoID: $departamentoID, data_reserva:$data_reserva, periodo:$periodo) {
                id
                tipo_uso
                tipo_reserva
                data_solicitacao
                data_reserva
                periodo
                status
                dia_semana_reserva
                departamento{
                    id
                    nome
                    descricao
                }
                disciplina{
                    id
                    codigo
                    nome
                    turma
                    tipo
                }
                sala{
                    id
                    numero
                    descricao
                    tipo
                }
                usuario{
                    id
                    nome
                    email
                    privilegio
                }
            }
        }`,
    variables: {
      departamentoID: departamentoID,
      data_reserva: data_reserva,
      periodo: periodo
    }
  };
};

export const reservasTelaSearch = (
  departamentoID: number,
  salaID: number,
  data_reserva: string
) => {
  return {
    query: `query getReservasSeach($departamentoID: ID!, $salaID: ID!, $data_reserva: String!) {
            reservasTelaSearch(departamentoID: $departamentoID, salaID:$salaID ,data_reserva:$data_reserva) {
                id
                tipo_uso
                tipo_reserva
                data_solicitacao
                data_reserva
                periodo
                status
                dia_semana_reserva
                departamento{
                    id
                    nome
                    descricao
                }
                disciplina{
                    id
                    codigo
                    nome
                    turma
                    tipo
                }
                sala{
                    id
                    numero
                    descricao
                    tipo
                }
                usuario{
                    id
                    nome
                    email
                    privilegio
                }
            }
        }`,
    variables: {
      departamentoID: departamentoID,
      salaID: salaID,
      data_reserva: data_reserva
    }
  };
};

export const cadastrarReserva = (input: any) => {
  return {
    query: `mutation createNewReserva($reservaInput: ReservaInput!) {
                        createReserva(input: $reservaInput) {
                            id
                            tipo_uso
                            tipo_reserva
                            data_solicitacao
                            data_reserva
                            periodo
                            status
                            departamento {
                                id
                                nome
                                descricao
                            }
                            usuario{
                                id
                                nome
                            }
                            disciplina{
                                id
                                nome
                                codigo
                                turma
                            }
                            sala {
                                id
                                numero
                            }
                        }
                    }`,
    variables: {
      reservaInput: input
    }
  };
};

export const cancelarReserva = (id: number) => {
  return {
    query: `mutation cancelarReserva($id: ID!) {
            cancelarReserva(id: $id) 
        }`,
    variables: {
      id: id
    }
  };
};

export const validarReservaMesmoHorario = (
  usuarioID: number,
  data_reserva: string,
  periodo: number
) => {
  return {
    query: `query validarReservaMesmoHorario($usuarioID: ID!, $data_reserva: String!, $periodo: Int!) {
            validarReservaMesmoHorario(usuarioID: $usuarioID, data_reserva:$data_reserva, periodo:$periodo) 
        }`,
    variables: {
      usuarioID: usuarioID,
      data_reserva: data_reserva,
      periodo: periodo
    }
  };
};
export const reservasPorDepartamentoDisciplina = (
  departamentoID: number,
  disciplinaID: number
) => {
  return {
    query: `query getReservasDepartamentoDisciplina($departamentoID: ID!, $disciplinaID: ID!) {
            reservasPorDepartamentoDisciplina(departamentoID: $departamentoID, disciplinaID:$disciplinaID) {
                            id
                            tipo_uso
                            tipo_reserva
                            data_solicitacao
                            data_reserva
                            periodo
                            status
                            departamento {
                                id
                                descricao
                            }
                            usuario{
                                id
                                nome
                            }
                            disciplina{
                                id
                                nome
                            }
                            sala {
                                id
                                numero
                            }
            }
        }`,
    variables: {
      departamentoID: departamentoID,
      disciplinaID: disciplinaID
    }
  };
};
