export class Encapsular {
  campo1: string;
  campo2: string;
  campo3: string;

  constructor(campo1: string, campo2: string, campo3:string) {
    if (campo3) {
      this.campo1 = campo1;
      this.campo2 = campo2;
      this.campo3 = campo3;
    } else {
      this.campo1 = campo1;
      this.campo2 = campo2;
    }
  }

}
