import { Component, OnInit  } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { DatosFormatoDistribuccionLP } from '@data/interface/Response/DatosFormatoDistribuccionLP.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-distribucion-proceso',
  templateUrl: './distribucion-proceso.component.html',
  styleUrls: ['./distribucion-proceso.component.css']
})
export class DistribucionProcesoComponent implements OnInit  {

  textFilterCtrl = new FormControl('');
  _searchTerm: string='';
  form:FormGroup;
  ObjectDistribuccionProceso:FormGroup;
  ListarProceso:DatosListarProceso[]=[];
  ListarDistribuccion:DatosFormatoDistribuccionLP[]=[];
  TempListarDistribuccion:DatosFormatoDistribuccionLP[]=[];

  constructor(private _licitacionesServices:LicitacionesService,
              private toastr: ToastrService,
              private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.CrearFormulario();   
    this.ListarProcesoCombox();
    this.instanciarObservadoresFilter();
  }

  CrearFormulario(){
    this.form = new FormGroup({
      NumeroProceso : new FormControl(1,Validators.required),
      Item : new FormControl(''),
      Mes: new FormControl('1',Validators.required)
    });

    // this.ObjectDistribuccionProceso=this._fb.group({
    //     ArrayDistribuccion:this._fb.array([]),
    // })

  }

  instanciarObservadoresFilter(){
    this.textFilterCtrl.valueChanges.pipe( debounceTime(900) ).subscribe( _ => {
      this._searchTerm=this.textFilterCtrl.value;
      this.TempListarDistribuccion=this.filter(this.textFilterCtrl.value);
    })
  
  }

  ListarProcesoCombox(){
    this._licitacionesServices.ListarProceso().subscribe(
      (resp:any)=>{
        this.ListarProceso=resp;
      }
    );
  }


  get searchTerm(): string {
    return this._searchTerm;
  }

  // set searchTerm(val: string) {
  //   this._searchTerm = val;
  //   this.TempListarDistribuccion=this.filter(val);
  // }



  filter(v: string) {
    return this.ListarDistribuccion.filter(x => x.codItem?.toLowerCase().indexOf(v.toLowerCase()) !== -1 ||
      x.codigoAlmacen?.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.descripcionItem?.toLowerCase().indexOf(v.toLowerCase()) !== -1 || x.nombreDiresa?.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  Filtrar(){
    
      this._licitacionesServices.ListarDistribuccionLP(this.form.value).subscribe(
        (resp:any)=>{
          this.ListarDistribuccion=resp;
          this.TempListarDistribuccion=resp;
          this._searchTerm='';
          this.textFilterCtrl.patchValue('');
          // this.CreacionDeTabla(this.ListarDistribuccion);
        }
      );
      
  }

  procesar(){
    var infordatelle = document.getElementById("tbodyDetalle") as HTMLTableElement;
    var ArrayProceso = Array();
    for (let index = 0; index <= infordatelle.childNodes.length -2; index++) {
        var obj = Object();
        obj.idEntrega= parseInt((infordatelle.rows[index])?.cells.item(0).innerText);
        obj.OrdenCompra =(infordatelle.rows[index])?.cells.item(13).innerText.trim();
        obj.Pecosa =(infordatelle.rows[index])?.cells.item(14).innerText.trim();
        ArrayProceso.push(obj);
    }
      
      this._licitacionesServices.RegistrarDistribuccionLP(ArrayProceso).subscribe(
        ((resp:any)=>{
            if(resp["success"]){
                this.toastr.success(resp["content"])
                this.TempListarDistribuccion=[];
                this.ListarDistribuccion=[];
                this._searchTerm='';
                this.textFilterCtrl.patchValue('');
                this.Filtrar();
            }
            error=>this.toastr.info(error.menssage);
       }));  
  }

  trackbyFn(index:number,item:any):number{
    return index;
  }

}
