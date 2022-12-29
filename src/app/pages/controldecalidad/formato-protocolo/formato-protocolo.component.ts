import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NumeroLoteProtocoloModel } from '@data/interface/Response/DatosFormatoNumeroLoteProtocolo.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formato-protocolo',
  templateUrl: './formato-protocolo.component.html',
  styleUrls: ['./formato-protocolo.component.css']
})
export class FormatoProtocoloComponent implements OnInit {
  InformacionProducto: NumeroLoteProtocoloModel;
  FormProtocolo:FormGroup;
  TablaControlProducto:Array<number>=[1,2,3,4,5,6,7,8,9,10];
  TablaControlProceso:Array<number>=[1,2,3,4,5];
  disabled:boolean=false;
  subcripcion : Subscription;
  numeroLote:string="";

  constructor(private _ControlcalidadService:ControlcalidadService,
              private toastr: ToastrService,
              private _fb:FormBuilder,
              private _activatedRoute : ActivatedRoute,
              private _router: Router,) {
                this.subcripcion=this._activatedRoute.params.subscribe(params=>{
                  this.numeroLote =  params["NumeroLote"] == ":NumeroLote" ? '' :  params["NumeroLote"] ;
                });

               }

  ngOnInit(): void {
    this.crearFormularioProtocolo();
    if(this.numeroLote != ":NumeroLote")
        this.BuscarinformacionProductoProtocolo();
  }

  crearFormularioProtocolo(){
    this.FormProtocolo = this._fb.group({
      Numerolote:new FormControl(this.numeroLote), //10225225 20456592
      itemdescripcion: new FormControl(''),
      numerodeparte: new FormControl(''),
      fechaanalisis: new FormControl(null),
      presentacion: new FormControl(''),
      fechaproduccion: new FormControl(''), //fecha de fabricacion 
      cantidadproducida: new FormControl(''), // cantidadproducida 
      fechaexpiracion: new FormControl(''), // 
      marca: new FormControl(''), // 
    })
  }


  BuscarinformacionProductoProtocolo(){
    if(this.FormProtocolo.controls.Numerolote.value.trim()==''){
        return this.toastr.warning("Debe colocar el numero de lote");
    }
    
    this._ControlcalidadService.BuscarNumeroLoteProtocolo(this.FormProtocolo.controls.Numerolote.value,1).subscribe(
        (resp:any)=>{
              if(resp["success"]){
                  if (resp["content"]["item"]!=null){
                      this.InformacionProducto=resp["content"];
                      this.FormProtocolo.get("itemdescripcion").patchValue(this.InformacionProducto.itemdescripcion);
                      this.FormProtocolo.get("numerodeparte").patchValue(this.InformacionProducto.numerodeparte);
                      this.FormProtocolo.get("fechaanalisis").patchValue(this.formatoFecha(this.InformacionProducto.fechaanalisis));
                      this.FormProtocolo.get("presentacion").patchValue(this.InformacionProducto.presentacion);
                      this.FormProtocolo.get("fechaproduccion").patchValue(this.InformacionProducto.fechaproduccion);
                      this.FormProtocolo.get("cantidadproducida").patchValue(this.InformacionProducto.cantidadproducida);
                      this.FormProtocolo.get("fechaexpiracion").patchValue(this.formatoFecha(this.InformacionProducto.fechaexpiracion));
                      this.FormProtocolo.get("marca").patchValue(this.InformacionProducto.marca);
                  }else{
                      this.toastr.warning(`El lote '${this.FormProtocolo.controls.Numerolote.value}' no ha sido encontrado`)
                  }
                  
              }else{
                  this.InformacionProducto=null;
              }
        }
    )
  }

  formatoFecha(Fecha){
    return  Fecha!=null ? Fecha.split("T")[0] : null;
  }
  
  AbrirInterfaceControlProceso(){
    if(this.FormProtocolo.controls.Numerolote.value.trim()=='')
      return this.toastr.warning("Debe ingresar el  Numero de Lote");
    else
      this._router.navigate(['ControlCalidad', 'Protocolo', 'ControlProceso', this.FormProtocolo.controls.Numerolote.value]);
  }
  
  AbrirInterfaceControlProductoTerminado(){
    if(this.FormProtocolo.controls.Numerolote.value.trim()=='')
      return this.toastr.warning("Debe ingresar el  Numero de Lote");
    else
      this._router.navigate(['ControlCalidad', 'Protocolo', 'ControlProductoTerminado', this.FormProtocolo.controls.Numerolote.value]);
  }

  AbrirPruebaEfectuadas(){
    if(this.FormProtocolo.controls.Numerolote.value.trim()=='' ||  this.FormProtocolo.controls.numerodeparte.value.trim()=='')
      return this.toastr.warning("Debe ingresar el  Numero de Lote y/o Numero Parte");
    else
      this._router.navigate(['ControlCalidad', 'Protocolo', 'PruebaEfectuadas', this.FormProtocolo.controls.Numerolote.value,'NumeroParte',this.FormProtocolo.controls.numerodeparte.value.trim()]);
  }




}
