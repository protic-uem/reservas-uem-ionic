import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConexaoProvider } from "../conexao/conexao";
import { UsuarioGraphql } from "../../model/Usuario.graphql";
import {
  getUsuariosPorDepartamento,
  updateUsuario,
  updateUsuarioPassword
} from "../../graphql/usuario/usuario-json";
import {
  usuarioUpdateInput,
  usuarioUpdatePasswordInput
} from "../../graphql/usuario/usuarioInput";

@Injectable()
export class UsuarioServiceProvider extends ConexaoProvider {
  usuarios: Array<UsuarioGraphql>;

  constructor(public http: HttpClient) {
    super();
    this.usuarios = new Array<UsuarioGraphql>();
  }

  //retorna todos usuários Docentes da base de dados
  async carregarTodosDocentesPorDepartamento(id_departamento: number) {
    //zera a lista sempre que fazer a busca para evitar valores duplicados
    this.usuarios = new Array<UsuarioGraphql>();

    id_departamento = parseInt(id_departamento + "");

    return await new Promise((resolve, reject) => {
      this.http
        .post(this.baseUri, getUsuariosPorDepartamento(id_departamento), {
          headers: ConexaoProvider.headersToken
        })
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            this.usuarios = result.data.usuariosPorDepartamento;
            resolve(this.usuarios);
          }
        });
    });
  }

  //atualiza o usuário
  async atualizarUsuario(usuario: UsuarioGraphql) {
    return await new Promise((resolve, reject) => {
      this.http
        .post(
          this.baseUri,
          updateUsuario(usuario.id, usuarioUpdateInput(usuario)),
          {
            headers: ConexaoProvider.headersToken
          }
        )
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            let usuarioAtualizado: UsuarioGraphql = result.data.updateUsuario;
            resolve(usuarioAtualizado);
          }
        });
    });
  }

  //atualiza o usuário
  async atualizarSenhaUsuario(senha: string) {
    return await new Promise((resolve, reject) => {
      this.http
        .post(
          this.baseUri,
          updateUsuarioPassword(usuarioUpdatePasswordInput(senha)),
          {
            headers: ConexaoProvider.headersToken
          }
        )
        .subscribe((result: any) => {
          if (result.errors) {
            reject(result.errors[0].message);
          } else {
            let senhaAtalizada: boolean = result.data.updateUsuarioPassword;
            resolve(senhaAtalizada);
          }
        });
    });
  }
}
