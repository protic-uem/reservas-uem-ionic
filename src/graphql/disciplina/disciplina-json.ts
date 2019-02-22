export const disciplinasPorUsuario = (usuarioID: number) => {
  return {
    query: `query getDisciplinasPorUsuario($usuarioID:ID!, $first: Int, $offset: Int) {
                    disciplinasPorUsuario(usuarioID:$usuarioID, first: $first, offset: $offset) {
                        id
                        codigo
                        nome
                        periodo
                        turma
                        status
                        tipo
                        departamento{
                            descricao
                        }
                        usuario{
                            nome
                        }
                    }
                }`,
    variables: {
      usuarioID: usuarioID
    }
  };
};

export const disciplinasPorDepartamento = (departamentoID: number) => {
  return {
    query: `query getDisciplinasPorDepartamento($departamentoID:ID!) {
            disciplinasPorDepartamento(departamentoID:$departamentoID) {
                id
                codigo
                nome
                periodo
                turma
                status
                tipo
                departamento{
                    descricao
                }
                usuario{
                    nome
                }
            }
        }`,
    variables: {
      departamentoID: departamentoID
    }
  };
};
