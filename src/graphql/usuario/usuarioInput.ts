import { UsuarioGraphql } from "../../model/Usuario.graphql";

export const usuarioUpdateInput = (usuario: UsuarioGraphql) => {
  return {
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    status: 1
  };
};

export const usuarioUpdatePasswordInput = (senha: string) => {
  return {
    senha: senha
  };
};
