export const getSalasPorDepartamento = (departamentoID: number) => {
  return {
    query: `query getSalasPorDepartamento($departamentoID: ID!, $first: Int, $offset: Int) {
            salasPorDepartamento(departamentoID: $departamentoID, first: $first, offset: $offset) {
              id
              numero
              descricao
              tipo
              status
              capacidade
              departamento{
                id
                nome
                descricao
                status
              }
            }
          }`,
    variables: {
      departamentoID: departamentoID
    }
  };
};

export const getSalasDisponiveisDepartamentoDiaPeriodoTipo = (
  departamentoID: number,
  data: string,
  periodo: number,
  tipo?: string
) => {
  return {
    query: `query getSalasDisponiveisDepartamentoDiaPeriodo($departamentoID: ID!, $data: String!, $periodo: Int!, $tipo: String) {
                  salasDisponiveisPorDepartamentoDiaPeriodo(departamentoID: $departamentoID, data: $data, periodo: $periodo, tipo: $tipo) {
                    id
                    numero
                    descricao
                    tipo
                    status
                    capacidade
                    departamento{
                      descricao
                    }
                  }
                }`,
    variables: {
      departamentoID: departamentoID,
      data: data,
      periodo: periodo,
      tipo: tipo
    }
  };
};
