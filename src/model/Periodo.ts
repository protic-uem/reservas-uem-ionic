export class Periodo {

  static um:string = "7:45-9:25";
  static dois:string = "9:40-12:00";
  static tres:string = "13:30-15:10";
  static quatro:string = "15:30-18:00";
  static cinco:string = "19:30-21:10";
  static seis:string = "21:20-23:00";


  static retornarPeriodo(periodo:number):string {
      if(periodo == 1)
        return this.um;
      else if(periodo == 2)
        return this.dois;
      else if(periodo == 3)
        return this.tres;
      else if(periodo == 4)
        return this.quatro;
      else if(periodo == 5)
          return this.cinco;
      else if(periodo == 6)
            return this.seis;
     return "";
  }

}
