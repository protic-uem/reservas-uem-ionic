export class Periodo {


   p1_1:string = "7:40";
   p1_2:string = "9:20";
   p2_1:string = "9:40";
   p2_2:string = "12:10";
   p3_1:string = "13:25";
   p3_2:string = "15:05";
   p4_1:string = "15:20";
   p4_2:string = "17:50";
   p5_1:string = "19:30";
   p5_2:string = "21:10";
   p6_1:string = "21:20";
   p6_2:string = "23:00";

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
