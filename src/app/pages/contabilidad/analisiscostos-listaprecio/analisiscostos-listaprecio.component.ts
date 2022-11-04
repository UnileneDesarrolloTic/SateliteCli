import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoProductoCostoBaseModel } from '@data/interface/Response/DatosFormatoProductoCostoBase.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { GenericoService } from '../../../../../src/app/shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { SubFamiliaModel } from '@data/interface/Response/DatosSubFamilia.interface';

@Component({
  selector: 'app-analisiscostos-listaprecio',
  templateUrl: './analisiscostos-listaprecio.component.html',
  styleUrls: ['./analisiscostos-listaprecio.component.css']
})
export class AnalisiscostosListaprecioComponent implements OnInit {
  ListarProductoCostoBase:DatosFormatoProductoCostoBaseModel[]=[];
  Tmp_ListarProductoCostoBase:any[]=[];
  FamiliaMaestro:ListaFamiliaMaestroItem[]=[];
  SubFamilias:SubFamiliaModel[]=[];
  ConsultarForm:FormGroup;
  displayButton:boolean=true;
  base64string:string="";
  activarCampo:boolean=true;

  @ViewChild("archivo", {
    read: ElementRef
  }) 
  archivo: ElementRef;
  
  constructor(private  _ContabilidadService:ContabilidadService,
              private toastr: ToastrService,
              private _GenericoService: GenericoService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.ListarFamilia();
    this.instanciarObservadoresfamilia();
    this.instanciarObservadoresExcel();
    this.Buscar();
  }

  crearFormulario(){
    this.ConsultarForm= new FormGroup({
        CodProducto: new FormControl(''),
        NumeroCotizacion: new FormControl(''),
        idfamilia: new FormControl('MC'),
        idSubFamilia: new FormControl('NN'),
        Opcion:new FormControl(true),
        base64:new FormControl(''),
        BusquedaExcel:new FormControl(false),
    });
  }


  Buscar(){
    if(!this.ConsultarForm.controls.BusquedaExcel.value)
      this.Filtrar();
    else  
      this.FiltrarMasivo();
  }

  ListarFamilia(){
    this._GenericoService.ListarFamiliaMaestroItem('P').subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.FamiliaMaestro=resp["content"];
          this.SubFamilia('P',this.FamiliaMaestro[0].familia)
        }
      }
    )
  }

  instanciarObservadoresfamilia(){
    this.ConsultarForm.get("idfamilia").valueChanges.subscribe(idfamilia=>{
        this.SubFamilia('P',idfamilia);
    })
  }

  instanciarObservadoresExcel(){
    this.ConsultarForm.get("BusquedaExcel").valueChanges.subscribe(check=>{
          this.ConsultarForm.get("CodProducto").patchValue('');
          this.ConsultarForm.get("NumeroCotizacion").patchValue('');
    })
  }

  SubFamilia(idlinea,idFamilia){
    this._GenericoService.ListarSubFamilia(idlinea,idFamilia).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.SubFamilias=resp["content"];
          this.ConsultarForm.get("idSubFamilia").patchValue(this.SubFamilias[0].subFamilia)
        }
      }
    );
  }

  Filtrar(){
      this._ContabilidadService.ConsultarProductoCostoBase(this.ConsultarForm.value).subscribe(
          (resp:any)=>{
                if(resp.length>0){
                  this.ListarProductoCostoBase=resp;
                  this.Tmp_ListarProductoCostoBase=resp;
                }else{
                  this.toastr.info("No hay elemento");
                }
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
          if(resp.length>0){
            this.ListarProductoCostoBase=resp;
            this.Tmp_ListarProductoCostoBase=resp;
          }else{
            this.toastr.info("No hay elemento");
          }
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
          this.ConsultarForm.get("NumeroCotizacion").patchValue('');
          // this.archivo.nativeElement.value="";
      }
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

  Refrescar(valor){
    this.Buscar();
  }
}
