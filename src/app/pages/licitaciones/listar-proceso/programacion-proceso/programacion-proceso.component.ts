import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-programacion-proceso',
  templateUrl: './programacion-proceso.component.html',
  styleUrls: ['./programacion-proceso.component.css']
})
export class ProgramacionProcesoComponent implements OnInit {
  ListaProgramadaProceso:Object[]=[];
  
  constructor() { }
  form:FormGroup;

  ngOnInit(): void {
    this.form=new FormGroup({
      NumeroEntrega: new FormControl('',Validators.required),
      FechaInicial:new FormControl('',Validators.required),
      FechaVencimiento:new FormControl('',Validators.required),
    })
  }

  Agregar(){
      console.log(this.form.value);
      this.ListaProgramadaProceso.push(this.form.value);
      this.form.reset();
  }

  EliminarRegistro(index:number){
    this.ListaProgramadaProceso.splice(index,1);
  }

  trackbyFn(index:number,item:any):number{
    return index;
  }
}
