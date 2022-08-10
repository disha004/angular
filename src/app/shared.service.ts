import { EventEmitter, Injectable, Output } from "@angular/core";


@Injectable()
export class sharedService {
    data: boolean = false;
  @Output() fire:EventEmitter<any>=new EventEmitter();

  @Output() dataChangeObserver: EventEmitter<any>=new EventEmitter();
  
   constructor(){
   }
 
   change()
   {
     this.fire.emit(false);
   }
   
   getEmittedValue()
   {
     return this.fire;
   }
   
   setData(data:any) {
    this.data = data;
    this.dataChangeObserver.emit(this.data); 
    return this.dataChangeObserver;
  } 
 
} 
