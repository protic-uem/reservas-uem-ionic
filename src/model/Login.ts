export class Login {
  id: number;
  email: string;
  senha: string;
  permissao: number;

  constructor(idLogin?: number, emailLogin?: string, senhaLogin?: string,
      permissaoLogin?: number) {
    if (idLogin) {
      this.id = idLogin;
      this.email = emailLogin;
      this.senha = senhaLogin;
      this.permissao = permissaoLogin;
    } else {
      this.id = -1;
      this.email = "";
      this.senha = "";
      this.permissao = -1;
    }
  }

  public clone(login: Login): void {
    this.id = login.id;
    this.email = login.email;
    this.senha = login.senha;
    this.permissao = login.permissao;
  }
}
