import { identifierModuleUrl } from "@angular/compiler";

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
                            senha
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

export const verificarSenha = (id: number, senha: string) => {
  return {
    query: `query verificarSenha($id: ID!, $senha: String! ) {
      verificarSenha (id: $id, senha: $senha) 
    }`,
    variables: {
      id: id,
      senha: senha
    }
  };
};

export const updateUsuario = (id: number, input: any) => {
  return {
    query: `mutation updateUsuario($id: ID!, $usuarioInput: UsuarioUpdateInput!) {
              updateUsuario(id: $id, input: $usuarioInput) {
                                  nome
                                  email
                                  telefone
                                  privilegio
              }
            }`,
    variables: {
      id: id,
      usuarioInput: input
    }
  };
};

export const updateUsuarioPassword = (input: any) => {
  return {
    query: `mutation updateUsuarioPassword($usuarioInput: UsuarioUpdatePasswordInput!) {
      updateUsuarioPassword(input: $usuarioInput)
    }`,
    variables: {
      usuarioInput: input
    }
  };
};
