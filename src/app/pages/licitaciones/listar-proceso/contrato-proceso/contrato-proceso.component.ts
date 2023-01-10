import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { DatosContratoProcesos } from '@data/interface/Response/Agrupados/Licitaciones.interface';
import { EstructuraDatosListaContratoProceso } from '@data/interface/Response/EstructuraListaContratoProceso.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contrato-proceso',
  templateUrl: './contrato-proceso.component.html',
  styleUrls: ['./contrato-proceso.component.css']
})
export class ContratoProcesoComponent implements OnInit,OnDestroy {
  IdProceso:number;
  subcripcion : Subscription
  form:FormGroup;
  DeshabilitarBoton:boolean=true;
  ListadoProgramacioncontrato:FormGroup;
  listaContradosProceso: DatosContratoProcesos[] = [];
  flagLoading: boolean = false;
  messagerNgxTable = {
    'emptyMessage': 'No se ha encontrado procesos',
    'totalMessage': 'Procesos'
  }
  
  constructor(private _router: Router,
              private _LicitacionesServices:LicitacionesService,
              private toastr: ToastrService,
              private _fb: FormBuilder,
              private activeroute:ActivatedRoute) {

    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.IdProceso=params["idproceso"];
  });
   }

  ngOnInit(): void {  
    this.CrearFormulario()
    this.Listar();
  }

  CrearFormulario(){
   this.ListadoProgramacioncontrato = this._fb.group({
    ContratoArray: this._fb.array([]),
   })
 }


  Listar(){
    this._LicitacionesServices.ListarContratoProceso(this.IdProceso).subscribe(
        (resp)=>
        {
          this.listaContradosProceso = resp
            // resp.length>0 ? this.DeshabilitarBoton=false : this.DeshabilitarBoton=true;
            // this.ProgramacionContratoProceso(resp);
        }
    )
  }
  ProgramacionContratoProceso(ListadoProceso)
  {
    const ArrayItem = this.ListadoProgramacioncontrato.controls.ContratoArray as FormArray;
    ArrayItem.controls = [];

    ListadoProceso.forEach((itemRow:EstructuraDatosListaContratoProceso)=>{
          const ItemFilaForm = this._fb.group({
            idproceso: [itemRow.idproceso],
            tipodeusuario: [itemRow.tipodeusuario],
            numeroitem: [itemRow.numeroitem],
            descripcionitem: [itemRow.descripcionitem],
            numeroContrato: [itemRow.numeroContrato],
          });
      this.Programacioncontrato.push(ItemFilaForm);
    })    
  }

  get Programacioncontrato(){
    return this.ListadoProgramacioncontrato.controls['ContratoArray'] as FormArray;
  }

  Guardar(){
    this._LicitacionesServices.RegistrarContratoProceso(this.ListadoProgramacioncontrato.controls['ContratoArray'].value).subscribe(
      (resp)=>{
          if(resp["success"]){
              this.toastr.success(resp["content"])
          }
      })
    
  }


  Salir(){
    this._router.navigate(['Licitaciones', 'proceso','listar-proceso'])
  }
  

  ngOnDestroy(){
    this.subcripcion.unsubscribe();
  }

  updateValue(event, rowIndex) {
    this.listaContradosProceso[rowIndex].numeroContrato = event.target.value ?? "";
  }

  listarcontratos()
  {
    console.log(this.listaContradosProceso);
  }

  guardarContratos(){
    console.log(this.listaContradosProceso);
    
  }

}
