import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { DatosListarProgramacionMuestraLIP } from '@data/interface/Response/DatosListarProgramacionMuestraLIP.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, filter, pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-proceso-muestra-ensayo',
  templateUrl: './proceso-muestra-ensayo.component.html',
  styleUrls: ['./proceso-muestra-ensayo.component.css']
})
export class ProcesoMuestraEnsayoComponent implements OnInit {
  IdProceso:number;
  form:FormGroup;
  DeshabilitarBoton:boolean=true;
  ListadoProgramacionMuestras:FormGroup;
  ListarProgramaMuestraLIP:DatosListarProgramacionMuestraLIP[]=[];

  
  constructor(
              private _router: Router,
              private _activatedRoute:ActivatedRoute,
              private _LicitacionesServices:LicitacionesService,
              private _ServiceGenerico:GenericoService,
              private toastr: ToastrService,
              private _fb: FormBuilder,) { 
  }

  ngOnInit() {
    this.CrearFormulario();
    this.IdProceso=history.state.idproceso;
    this.IdProceso==undefined &&  this._router.navigate(['Licitaciones', 'proceso','listar-proceso']);
    this.Filtrar();
  }

  

  CrearFormulario(){
     this.form = new FormGroup({
      IdProceso : new FormControl(history.state.idproceso,Validators.required),
      NumeroEntrega: new FormControl('1',Validators.required)
    });

    this.ListadoProgramacionMuestras = this._fb.group({
      MuestrasArray: this._fb.array([]),
    })
  }

  Filtrar(){
      this._LicitacionesServices.ListarProgramacionMuestrasLIP(this.form.value).subscribe(
        (resp:any)=>{
            resp.length>0 ? this.DeshabilitarBoton=false : this.DeshabilitarBoton=true;
            this.ProgramacionMuestraArray(resp);
        }
      );
  }
  
  ProgramacionMuestraArray(ListadoMuestra){
    const ArrayItem = this.ListadoProgramacionMuestras.controls.MuestrasArray as FormArray;
    ArrayItem.controls = [];

    ListadoMuestra.forEach((itemRow:DatosListarProgramacionMuestraLIP)=>{
          const ItemFilaForm = this._fb.group({
            idProgramacion: [itemRow.idProgramacion],
            idProceso: [itemRow.idProceso],
            numeroEntrega: [itemRow.numeroEntrega],
            numeroItem: [itemRow.numeroItem],
            descripcionItem:[itemRow.descripcionItem],
            codItem: [itemRow.codItem],
            numeroEnsayo: [itemRow.numeroEnsayo],
            numeroMuestreo: [itemRow.numeroMuestreo]
          });
      this.ProgramacionMuestreo.push(ItemFilaForm);
    })    
  }

  get ProgramacionMuestreo(){
    return this.ListadoProgramacionMuestras.controls['MuestrasArray'] as FormArray;
  }

  Guardar(){

    this._LicitacionesServices.RegistrarProgramacionMuestreoLIP(this.ListadoProgramacionMuestras.controls['MuestrasArray'].value).subscribe(
        (resp)=>{
            if(resp["success"]){
                this.toastr.success(resp["content"])
            }
        })
      
  }
  

}
