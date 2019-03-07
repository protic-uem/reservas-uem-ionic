import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConexaoProvider } from "../conexao/conexao";
import { UsuarioGraphql } from "../../model/Usuario.graphql";
import { getUsuariosPorDepartamento } from "../../graphql/usuario/usuario-json";

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
}
