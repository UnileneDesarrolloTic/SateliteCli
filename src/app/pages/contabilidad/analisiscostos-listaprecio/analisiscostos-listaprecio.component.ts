import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoProductoCostoBaseModel } from '@data/interface/Response/DatosFormatoProductoCostoBase.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-analisiscostos-listaprecio',
  templateUrl: './analisiscostos-listaprecio.component.html',
  styleUrls: ['./analisiscostos-listaprecio.component.css']
})
export class AnalisiscostosListaprecioComponent implements OnInit {
  ListarProductoCostoBase:DatosFormatoProductoCostoBaseModel[]=[];
  ConsultarForm:FormGroup;
  displayButton:boolean=true;
  base64string:string="";
  activarCampo:boolean=true;

  @ViewChild("archivo", {
    read: ElementRef
  }) 
  archivo: ElementRef;
  
  constructor(private  _ContabilidadService:ContabilidadService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.ConsultarForm= new FormGroup({
        CodProducto: new FormControl(''),
        NumeroCotizacion: new FormControl(''),
        Opcion:new FormControl(true),
        base64:new FormControl('')
    });
  }

  Buscar(){
    if(this.activarCampo){
          this.Filtrar();
    }else{
          this.FiltrarMasivo();
         
    }
  }

  Filtrar(){
      this._ContabilidadService.ConsultarProductoCostoBase(this.ConsultarForm.value).subscribe(
          (resp:any)=>{
                    this.ListarProductoCostoBase=resp;
          },
          (error)=>{
            this.toastr.info("Comunicarse con sistemas");
          }
      )
  }

  FiltrarMasivo(){

    this.ConsultarForm.get("base64").patchValue(this.base64string);
    
    this._ContabilidadService.ProcesarProductoExcel(this.ConsultarForm.value).subscribe(
      (resp:any)=>{
              this.ListarProductoCostoBase=resp;
        },
        (error)=>{
          this.toastr.info("Comunicarse con sistemas");
        }
    )
  }

  ActivaDesactiva(){
      this.activarCampo=!this.activarCampo;
      this.ConsultarForm.get("Opcion").patchValue(this.activarCampo);

      if(!this.activarCampo){
          this.ConsultarForm.get("CodProducto").patchValue('');
      }else{
          this.ConsultarForm.get("base64").patchValue('');
          this.archivo.nativeElement.value="";
      }

      console.log(this.ConsultarForm.value);
  }
  
  handleUpload(event) {
   
    const file = event.target.files[0];
    if(file){
      this.convertFile(event.target.files[0]).subscribe(base64 => {
          this.base64string=base64
      });
      this.displayButton=false;
    }
  }
  

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

}
