import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosPruebaProtocoloModel } from '@data/interface/Response/DatosCabeceraPruebasProtocolos.interface';
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
      TablaPrueba:this._fb.array([])
    });
  }

  construirFormaArray(ArrayTabla:DatosPruebaProtocoloModel[]){
        const FormTabla = this.PruebasFormularioProtocolo.controls["TablaPrueba"] as FormArray;
        FormTabla.controls=[];

        ArrayTabla.forEach((element:DatosPruebaProtocoloModel) => {
          const lessForm = this._fb.group({
            iD_PRUEBA:[element.iD_PRUEBA],
            orden:[element.orden],
            descripcionLocal:[element.descripcionLocal],
            unidadMedida:[element.unidadMedida],
            especificacion:[element.especificacion],
            valor:[element.valor],
            resultado:[element.resultado],
            metodologia:[element.metodologia],
            decimales:[element.decimales],
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

  Eliminar(rowtabla:FormGroup){
      console.log(rowtabla)
  }

  
  trackFn(index) {
    return index;
  }


}
