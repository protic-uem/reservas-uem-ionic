export class Periodo {
  p1_1: string = "7:45";
  p1_2: string = "9:25";
  p2_1: string = "9:40";
  p2_2: string = "12:10";
  p3_1: string = "13:30";
  p3_2: string = "15:10";
  p4_1: string = "15:20";
  p4_2: string = "17:50";
  p5_1: string = "17:50";
  p5_2: string = "19:30";
  p6_1: string = "19:30";
  p6_2: string = "21:10";
  p7_1: string = "21:20";
  p7_2: string = "23:00";

  um: string = "7:45-9:25";
  dois: string = "9:40-12:10";
  tres: string = "13:30-15:10";
  quatro: string = "15:20-17:50";
  cinco: string = "19:30-21:10";
  seis: string = "21:20-23:00";
  sete: string = "17:50-19:30";

  retornarPeriodo(periodo: number): string {
    if (periodo == 1) return this.um;
    else if (periodo == 2) return this.dois;
    else if (periodo == 3) return this.tres;
    else if (periodo == 4) return this.quatro;
    else if (periodo == 5) return this.cinco;
    else if (periodo == 6) return this.seis;
    else if (periodo == 7) return this.sete;
    return "";
  }
}
