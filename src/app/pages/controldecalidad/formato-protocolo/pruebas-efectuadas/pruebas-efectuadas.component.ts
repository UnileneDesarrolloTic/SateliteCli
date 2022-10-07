import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosPruebaProtocoloModel } from '@data/interface/Response/DatosCabeceraPruebasProtocolos.interface';
import { NumeroLoteProtocoloModel } from '@data/interface/Response/DatosFormatoNumeroLoteProtocolo.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pruebas-efectuadas',
  templateUrl: './pruebas-efectuadas.component.html',
  styleUrls: ['./pruebas-efectuadas.component.css']
})
export class PruebasEfectuadasComponent implements OnInit , OnDestroy{
  PruebasFormularioProtocolo:FormGroup;
  InformacionProducto: NumeroLoteProtocoloModel;
  subcripcion : Subscription;
  NumeroLote:string;
  NumeroParte:string;

  constructor(private _router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private _ControlcalidadService:ControlcalidadService,
    private _GenericoService:GenericoService,
    private activeroute:ActivatedRoute) { 

    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.NumeroLote=params["NumeroLote"];
      this.NumeroParte=params["NumeroParte"];
  });
  }

  ngOnInit(): void {
    this.crearDetallePruebaProtocolo();
    this.BuscarinformacionProductoProtocolo();
    this.buscarInformacionPrueba(this.NumeroLote,this.NumeroParte);
  }


  buscarInformacionPrueba(NumeroLote,NumeroParte){
      this._ControlcalidadService.BusquedaPruebaProtocolo(this.NumeroLote,this.NumeroParte).subscribe(
        (resp:any)=>{
            this.construirFormaArray(resp);
        }
      )
  }

  save(){
        console.log(this.PruebasFormularioProtocolo.value);
  }

  crearDetallePruebaProtocolo(){
    this.PruebasFormularioProtocolo = this._fb.group({
      Idioma:new FormControl('1'),
      fechaanalisis:new FormControl(''),
      NumeroLote: new FormControl(''),
      NumeroParte : new  FormControl(''),
      Tecnica : new FormControl(''),
      Metodo : new FormControl(''),
      Detalle : new FormControl(''),
      TablaPrueba:this._fb.array([])
    });
  }

  BuscarinformacionProductoProtocolo(){
    
    this._ControlcalidadService.BuscarNumeroLoteProtocolo(this.NumeroLote).subscribe(
        (resp:any)=>{
              if(resp["success"]){
                  this.InformacionProducto=resp["content"];
                  console.log(this.InformacionProducto);
                  this.PruebasFormularioProtocolo.get("Tecnica").patchValue(this.InformacionProducto.tecnica);
                  this.PruebasFormularioProtocolo.get("Metodo").patchValue(this.InformacionProducto.metodo);
                  this.PruebasFormularioProtocolo.get("Detalle").patchValue(this.InformacionProducto.detalle);
                  this.PruebasFormularioProtocolo.get("NumeroParte").patchValue(this.InformacionProducto.numerodeparte);
                  this.PruebasFormularioProtocolo.get("NumeroLote").patchValue(this.InformacionProducto.referencianumero);
                  this.PruebasFormularioProtocolo.get("fechaanalisis").patchValue(this.formatoFecha(this.InformacionProducto.fechaanalisis));
              }else{
                  this.InformacionProducto=null;
              }
        }
    )
  }


  formatoFecha(Fecha){
    return  Fecha!=null ? Fecha.split("T")[0] : '01-01-1990';
  }

  

  construirFormaArray(ArrayTabla:DatosPruebaProtocoloModel[]){
        const FormTabla = this.PruebasFormularioProtocolo.controls["TablaPrueba"] as FormArray;
        FormTabla.controls=[];

        console.log(ArrayTabla);

        ArrayTabla.forEach((element:DatosPruebaProtocoloModel) => {
          const lessForm = this._fb.group({
            orden:[element.orden],
            descripcionLocal:[element.descripcionLocal],
            unidadMedida:[element.unidadMedida],
            especificacion:[element.especificacion],
            valor:[element.valor],
            resultado:[element.resultado],
            metodologia:[element.metodologia],
          })
          this.ListarPruebaProtocolo().push(lessForm);
          
        });
          
  }

  ngOnDestroy(){
    this.subcripcion.unsubscribe();
  }

  ListarPruebaProtocolo() : FormArray {
    return this.PruebasFormularioProtocolo.get("TablaPrueba") as FormArray
  } 

  Eliminar(index:number){
    
    const add = this.PruebasFormularioProtocolo.get('TablaPrueba') as FormArray;
    add.removeAt(index);
  }

  Cancelar(){
    this._router.navigate(['ControlCalidad', 'Protocolo','principal'])
  }
  

  AgregarFila(){
    const Agregar= this.PruebasFormularioProtocolo.get("TablaPrueba") as FormArray;
    Agregar.push(this._fb.group({
      orden:['',],
      descripcionLocal:['',],
      unidadMedida:['',],
      especificacion:['',],
      valor:['',],
      resultado:['',],
      metodologia:['',],
    }))

  }
  trackFn(index) {
    return index;
  }


}
