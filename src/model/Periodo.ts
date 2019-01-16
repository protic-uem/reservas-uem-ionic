export class Periodo {

  um:string = "7:40-9:20";
  dois:string = "9:40-12:10";
  tres:string = "13:25-15:05";
  quatro:string = "15:20-17:50";
  cinco:string = "19:30-21:10";
  seis:string = "21:20-23:00";

  retornarPeriodo(periodo:number):string {
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
