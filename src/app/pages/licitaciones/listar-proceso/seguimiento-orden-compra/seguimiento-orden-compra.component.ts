import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { ExpedienteModel } from '@data/interface/Response/Licitaciones/DatosFormatoExpedientes.interface';
import { informacionFacturaProceso } from '@data/interface/Response/Licitaciones/DatosFormatoFacturaProceso.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seguimiento-orden-compra',
  templateUrl: './seguimiento-orden-compra.component.html',
  styleUrls: ['./seguimiento-orden-compra.component.css']
})
export class SeguimientoOrdenCompraComponent implements OnInit {
  fechaActual: Date = new Date;
  subcripcion : Subscription;
  formulario:FormGroup;
  detalle: FormGroup;
  idProceso:number = 0;
  numeroEntrega:number = 0;
  tipoUsuario:string = '';
  listarProceso:DatosListarProceso[] = [];
  ListarItemProceso:any[]=[];
  ListarTipoUsuario:string[]=[];
  obtenerfacturaProceso :informacionFacturaProceso ;  
  flagAlerta : boolean = false;
  mensajeAlerta : string = "";
  mostrarData:boolean = false;

  expediente = new FormControl('');
  estadoSeguimiento = new FormControl('');
  comentario = new FormControl('');
  factura =  new FormControl('')

  constructor(private _licitacionesServices:LicitacionesService,
              private _router: Router, 
              private activeroute:ActivatedRoute, 
              private _fb: FormBuilder,
              private toastr: ToastrService) { 
    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.idProceso=params["idproceso"];
  });
  }


  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerProcesos();
    this.ListarItem();
    this.instanciarObservadoresFilter();
  }

  crearFormulario(){
    this.formulario = new FormGroup({
      idproceso: new FormControl(this.idProceso),
      NumeroEntrega:new FormControl('1'),
      Item:new FormControl(null),
      Usuario: new FormControl(null),
      NumeroOC:new FormControl(''),
      CantidadOC:new FormControl(0),
    });

    this.detalle = new FormGroup({
        detalleExpediente: this._fb.array([])
    });

    
  }

 

  obtenerProcesos()
  {
    this._licitacionesServices.ListarProceso(0).subscribe(
      resp => { 
          if(resp.length > 0)
          {
            this.listarProceso = resp;
            this.formulario.get("idproceso").patchValue(this.idProceso);
          }
          
      }
    );
  }

  ListarItem(){
    let dato={
      IdProceso :this.idProceso,
      NumeroEntrega: this.formulario.controls.NumeroEntrega.value
    }
    this._licitacionesServices.ListarProgramacionMuestrasLIP(dato).subscribe(
      (resp:any)=>{
          this.ListarItemProceso=resp;
      }
    );
  }

  instanciarObservadoresFilter() {
    this.formulario.get("NumeroEntrega").valueChanges.subscribe( valor => { 
      if(this.formulario.controls.Item.value != null && this.formulario.controls.Usuario.value != null){
          this.buscarOrdenCompraLicitaciones();
      }
      this.ListarItem();
      this.ObtenerListarTipoUsuario();
  });

  this.formulario.get("Item").valueChanges.subscribe(valor=>{
    if(this.formulario.controls.Item.value != null && this.formulario.controls.Usuario.value != null){
      this.buscarOrdenCompraLicitaciones();
    }
    this.ObtenerListarTipoUsuario();
  })

  this.formulario.get("Usuario").valueChanges.subscribe(valor=>{
    if(this.formulario.controls.Item.value != null && this.formulario.controls.Usuario.value != null){
      this.buscarOrdenCompraLicitaciones();
    }
  });
  }

  ObtenerListarTipoUsuario(){
    let dato={
      IdProceso :this.idProceso,
      Item:this.formulario.controls.Item.value,
      NumeroEntrega: this.formulario.controls.NumeroEntrega.value
    }

    this._licitacionesServices.ListarTipoUsuario(dato).subscribe(
      (resp:any)=>{
          this.ListarTipoUsuario=resp;
      }
    );
  }


  buscarOrdenCompraLicitaciones(){
    let dato={
      IdProceso :this.idProceso,
      NumeroEntrega: this.formulario.controls.NumeroEntrega.value,
      Item:this.formulario.controls.Item.value,
      TipoUsuario:this.formulario.controls.Usuario.value,
    }

    this._licitacionesServices.BuscarOrdenCompraLicitaciones(dato).subscribe(
      (res:any)=>{
          if(res["success"]){
              this.formulario.get("NumeroOC").patchValue(res["content"]["numeroOC"]);
              this.formulario.get("CantidadOC").patchValue(res["content"]["cantidadOC"]);
              this.factura.patchValue(res["content"]["factura"]);

          }
      }
    )
  }


  buscarFacturaProceso(){
    this.flagAlerta = false;
    this.obtenerfacturaProceso;
    if(this.factura.value=="")
      return this.toastr.warning("Debe ingresar un valor en la factura");

    this._licitacionesServices.buscarFacturaProceso(this.factura.value)
    .subscribe((resp:any)=>{
        if(resp.success)
        {
          this.obtenerfacturaProceso =  resp["content"]["informacionFactura"];
          this.flagAlerta = false;
          this.mostrarData= true;
          this.mensajeAlerta = resp["message"];
        }
        else
        {
          this.obtenerfacturaProceso =  resp["content"]["informacionFactura"];
          this.flagAlerta = true;
          this.mostrarData=false;
          this.mensajeAlerta = resp["message"]
        }

        this.expediente.patchValue(resp["content"]["informacionExpendiente"]["numeroExpediente"]);
        this.estadoSeguimiento.patchValue(resp["content"]["informacionExpendiente"]["estadoSeguimiento"]);
        this.comentario.patchValue(resp["content"]["informacionExpendiente"]["comentario"]);
        this.construirDetalleExpediente(resp["content"]["detalleExpediente"])
    });
  }


  construirDetalleExpediente( listado: ExpedienteModel[]){
    const ArrayItem = this.detalle.controls.detalleExpediente as FormArray;
    ArrayItem.controls = [];

    listado.forEach((expedienteRow:ExpedienteModel)=>{
      const ItemFilaForm = this._fb.group({
        codigo: [expedienteRow.codigo],
        destino: [expedienteRow.destino],
        fechaEntrega: [this.formatoFecha(expedienteRow.fechaEntrega)],
        fechaAprobacion: [this.formatoFecha(expedienteRow.fechaAprobacion)],
        usuario:[expedienteRow.usuario],
      });
  this.ProgramacionExpendiente.push(ItemFilaForm);
})    
  }


  formatoFecha(Fecha){
    return  Fecha!=null ? Fecha.split("T")[0] : null;
  }
  

  get ProgramacionExpendiente(){
    return this.detalle.controls['detalleExpediente'] as FormArray;
  }

  registrarSeguimiento(){
    
    if(this.estadoSeguimiento.value == '')
        return this.toastr.warning("Deber seleccionar el estado ")
    
    const datos = {
      idProceso  :  this.idProceso,
      entrega : this.formulario.controls.NumeroEntrega.value,
      item: this.formulario.controls.Item.value,
      usuario : this.formulario.controls.Usuario.value,
      ordenCompra: this.formulario.controls.NumeroOC.value,
      factura : this.factura.value,
      expediente: this.expediente.value,
      detalleExpediente: this.detalle.controls.detalleExpediente.value,
      estadoSeguimiento: this.estadoSeguimiento.value,
      comentario: this.comentario.value
    }

    this._licitacionesServices.registrarSeguimientoOrden(datos).subscribe(
      (resp:any)=>{
          if(resp["success"])
          {
            this.toastr.success(resp["message"]);
            this._router.navigate(['Licitaciones', 'proceso','listar-proceso']);
          }
          else
          {
            this.toastr.info(resp["message"]);
          }
      }

    )
    
  }

}
