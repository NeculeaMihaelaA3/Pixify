import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  public message:string = "";
  
  setMessage(data:string){
    this.message = data;
  }

  getMessage(){
    return this.message;
  }
}
