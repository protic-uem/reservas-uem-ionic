import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AutoCompleteService} from 'ionic2-auto-complete';
import { Reserva } from '../../model/Reserva';
@Injectable()
export class CompleteServiceProvider implements AutoCompleteService{
  labelAttribute = "sala";


  constructor(public http: HttpClient) {



  }

  getResults(keyword:string) {

  }

  getItems(searchbar) {

  }

  getReservas(){
  }



}
