export const getUsuarioPorId = (id: number) => {
  return {
    query: `query getUsuarioPorId($id: ID!) {
                        usuario(id: $id) {
                            id
                            nome
                            email
                            telefone
                            privilegio
                            ultimo_acesso
                            status
                            departamento{
                                id
                                nome
                                descricao
                                status
                            }
                        }
                    }`,
    variables: {
      id: id
    }
  };
};

export const getUsuariosPorDepartamento = (departamentoID: number) => {
  return {
    query: `query getUsuariosPorDepartamento($departamentoID: ID!) {
            usuariosPorDepartamento(departamentoID: $departamentoID) {
                            id
                            nome
                            email
                            telefone
                            privilegio
                            ultimo_acesso
                            status
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

export const getCurrentUsuario = () => {
  return {
    query: `query getCurrentUsuario {
                        currentUsuario {
                            id
                            nome
                            email
                            telefone
                            privilegio
                            ultimo_acesso
                            status
                            departamento{
                                id
                                nome
                                descricao
                                status
                            }
                        }
                    }`
  };
};
