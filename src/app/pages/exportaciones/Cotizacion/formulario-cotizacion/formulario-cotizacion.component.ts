import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetalleCotizacionExportaciones } from '@data/interface/Response/DatosFormatoDetalleCotizacionExportaciones.interface';
import { ListaFamiliaMaestroItem } from '@data/interface/Response/FamiliaMaestroItem.interface';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { ExportacionesService } from '@data/services/backEnd/pages/exportaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { ModalMaestroItemComponent } from '@shared/components/modal-maestro-item/modal-maestro-item.component';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { X } from 'angular-feather/icons';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-formulario-cotizacion',
  templateUrl: './formulario-cotizacion.component.html',
  styleUrls: ['./formulario-cotizacion.component.css']
})

export class FormularioCotizacionComponent implements OnInit {
  subcripcion : Subscription
  NumeroDocumento:string;
  formFormulario:FormGroup;
  listarcliente:object[]=[];
  checkboxtotal:boolean=false;
  FormularioNuevo:boolean=false;
  base64string:string="";
  FamiliaMaestro:ListaFamiliaMaestroItem[]=[];


  // @Input() MontoNoAfectoInput: number;
  @ViewChild("archivo", {
    read: ElementRef
  }) 
  archivo: ElementRef;
  

  constructor( private activeroute:ActivatedRoute,
               private _modalService: NgbModal,
               private _comercialService: ComercialService,
               private _fb: FormBuilder,
               private _toastrService: ToastrService, 
               private _exportacionesService:ExportacionesService,
               private _GenericoService:GenericoService) {
        this.subcripcion=this.activeroute.params.subscribe(params=>{
          this.NumeroDocumento=params["codDocumento"];
      });

   }

  ngOnDestroy(){
    this.subcripcion.unsubscribe();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes);
  // }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarCliente();
    this.Familias('P');
    this.ObservableFormarray();
    // this.ObservableInputDescuento();
    // this.ObservableCheckTotal();
    if (this.NumeroDocumento=='Nuevo'){
        this.FormularioNuevo=false;
    }else{
      this.EncontrarCotizacionExportacion(this.NumeroDocumento);
      this.FormularioNuevo=true;
    }
  }

  crearFormulario(){
    this.formFormulario = new FormGroup({
        Cliente : new FormControl(0,Validators.required),
        clienteNombre : new FormControl('',Validators.required),
        Contacto: new FormControl(),
        LugarEntrega: new FormControl(),
        Comentarios: new FormControl(),
        NumeroDocumento: new FormControl(),
        DetalleCotizacion: this._fb.array([]),
        MontoAfecto: new FormControl(0),
        MontoNoAfecto: new FormControl(0),
        Descuento: new FormControl(0),
        ImpVentas: new FormControl(0),
        AjusteRedondeo: new FormControl(0),
        MontoTotal: new FormControl(0),
    });
  }


  listarCliente()
  {
    this._comercialService.ListarClientes({}).subscribe(
      (resp) => resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[]
    );
  }

  ObservableFormarray(){
    this.formFormulario.get("DetalleCotizacion").valueChanges.subscribe((valor)=>{
        this.formFormulario.controls.DetalleCotizacion.value.forEach((element:DetalleCotizacionExportaciones)=>{
            element.monto= parseInt(element.cantidad) * element.precioUnitario;
            element.iGVExoneradoFlag= element.iGVExoneradoFlag;
        })
    });

    // this.calculoTotal();
  }


  calculoTotal(){
    let MontoAfectoLet=0;
    let MontoNoAfectoLet=0;
    let MontoTotalctoLet=0;
    this.formFormulario.controls.DetalleCotizacion.value.forEach((element:DetalleCotizacionExportaciones,index)=>{
          if(this.checkboxtotal==false){
            MontoNoAfectoLet= MontoNoAfectoLet + element.monto;
            MontoTotalctoLet= MontoTotalctoLet + element.monto;
          }else{
            MontoAfectoLet= MontoAfectoLet + element.monto;
            MontoTotalctoLet= MontoTotalctoLet + element.monto;
          }
          
    });

    this.formFormulario.patchValue({
      MontoAfecto:MontoAfectoLet,
      MontoNoAfecto:MontoNoAfectoLet,
      Descuento:0,
      ImpVentas:0,
      AjusteRedondeo:0,
      MontoTotal:MontoTotalctoLet,
    })
  }


  

  openModalConsultaClientes(){
    const modalBusquedaCliente = this._modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });

    this.formFormulario.patchValue({           
      Cliente: 0,
      clienteNombre: ''
    })
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => {     
        if(result!=undefined){
          this.formFormulario.patchValue({           
            Cliente: parseInt(result.persona),
            clienteNombre: result.nombreCompleto
          })
        }
		});
     
  }

  EncontrarCotizacionExportacion(NumeroDocumento){
    this._exportacionesService.BusquedaCotizacionExportaciones(NumeroDocumento).subscribe(
      (resp:any)=>{
          this.formFormulario.patchValue({
            Cliente : resp["cabecera"].ClienteNumero,
            clienteNombre : resp["cabecera"].ClienteNombre,
            Contacto: resp["cabecera"].Contacto,
            LugarEntrega: resp["cabecera"].LugarEntrega,
            Comentarios: resp["cabecera"].Comentarios,
            NumeroDocumento: resp["cabecera"].NumeroDocumento,
            MontoAfecto: resp["cabecera"].MontoAfecto,
            MontoNoAfecto: resp["cabecera"].MontoNoAfecto,
            Descuento: resp["cabecera"].MontoDescuentos,
            ImpVentas: resp["cabecera"].MontoImpuestoVentas,
            AjusteRedondeo: resp["cabecera"].MontoRedondeo,
            MontoTotal: resp["cabecera"].MontoTotal,
          });
          this.DetalleCotizacion(resp["detalle"]);
      });
  }

  DetalleCotizacion(Detalle:DetalleCotizacionExportaciones[]){
    const ArrayItem = this.formFormulario.controls.DetalleCotizacion as FormArray;
    ArrayItem.controls = [];

    Detalle.forEach((itemRow:DetalleCotizacionExportaciones)=>{
      const ItemFilaForm = this._fb.group({
        cantidad: [itemRow.cantidad, Validators.required],
        codSut: [itemRow.codSut,Validators.required],
        descripcion: [itemRow.descripcion,Validators.required],
        iGVExoneradoFlag: [itemRow.iGVExoneradoFlag,Validators.required],
        item: [itemRow.item,Validators.required],
        monto: [itemRow.monto,Validators.required],
        precioUnitario: [itemRow.precioUnitario,Validators.required],
      });
      
      this.DetalleCoti.push(ItemFilaForm);

      ItemFilaForm.get('precioUnitario').valueChanges.pipe(debounceTime(500)).subscribe(resp => this.sumarMonto());
      ItemFilaForm.get('cantidad').valueChanges.pipe(debounceTime(500)).subscribe(resp => this.sumarMonto());
      ItemFilaForm.get('iGVExoneradoFlag').valueChanges.pipe(debounceTime(500)).subscribe(resp => this.sumarMonto());
    });
    this.formFormulario.get("AjusteRedondeo").valueChanges.pipe(debounceTime(500)).subscribe(resp => this.sumarMonto());
    

    (this.NumeroDocumento=='Nuevo') &&  this.calculoTotal();
  }

  sumarMonto(){

    const MontoGeneralDetalle = this.DetalleCoti.value.map(detalle => detalle.monto);
    const MontoGeneralCantidad = this.sumar(MontoGeneralDetalle);

    const MontoAfectoDetalle = this.DetalleCoti.value.filter(X=> X.iGVExoneradoFlag==false).map(detalle => detalle.monto);
    const MontoAfectoCantidad = this.sumar(MontoAfectoDetalle);
    const MontoAfectoIGVCantidad = this.aplicandoIGV(MontoAfectoCantidad);

    const MontoNoAfectoDetalle = this.DetalleCoti.value.filter(X=> X.iGVExoneradoFlag==true).map(detalle => detalle.monto);
    const MontoNoAfectoCantidad = this.sumar(MontoNoAfectoDetalle);
    this.formFormulario.patchValue({
      MontoTotal:MontoGeneralCantidad + MontoAfectoIGVCantidad + (this.formFormulario.controls.AjusteRedondeo.value),
      MontoAfecto:MontoAfectoCantidad,
      MontoNoAfecto:MontoNoAfectoCantidad,
      ImpVentas:MontoAfectoIGVCantidad,
    });
    
  }

  aplicandoIGV(Cantidad){
    return Cantidad * 0.18;
  }

  sumar(ArrayItem){
      return ArrayItem.reduce((prev, curren) => prev + curren, 0);
  }

  get DetalleCoti(){
    return this.formFormulario.controls['DetalleCotizacion'] as FormArray;
  }


  Guardar(){
    const dato={
      ...this.formFormulario.value,
      FormularioNuevo:this.FormularioNuevo
    }
    
    if(this.DetalleCoti.length> 0 ){
        if(this.formFormulario.valid==true){
             this._exportacionesService.GuardarCotizacionExportaciones(this.formFormulario.value).subscribe(
                (resp)=>{
                    if(resp["success"]){
                        this._toastrService.success(resp["content"]);
                    }else{
                        this._toastrService.warning(resp["content"]);
                    }
                },
                (error)=>{
                  this._toastrService.info("Comuniquese con sistemas");
                }
              )
        }else{
             this._toastrService.warning("Debe completar los datos del detalle cotización");
        }
        
    }else{
        this._toastrService.warning("No hay detalles registrados");
    }
  
   
  }

  CheckoutTotal(){
    this.checkboxtotal =!this.checkboxtotal;
    this.formarrayDetalle().value.forEach((element,index)=>{
      this.formarrayDetalle().at(index).get("iGVExoneradoFlag").patchValue(this.checkboxtotal);
    })
   // this.calculoTotal();
  }

  formarrayDetalle(){
    return this.formFormulario.controls.DetalleCotizacion as FormArray;
  }


  handleUpload(event) {
    const file = event.target.files[0];
    if(file){
      this.convertFile(event.target.files[0]).subscribe(base64 => {
        // console.log(base64);
          // this.base64string=base64
          this.FiltrarExcel(base64);
      });
    }
  }
  FiltrarExcel(base64){
      let archivos = this.archivo.nativeElement.files;
      if(archivos.length==0){
          return this._toastrService.warning("Debe Colocar un excel en el sistema");
      }else{
        const ArchivoFile={
          nombrearchivo:archivos[0].name,
          base64string:base64
        }
        this._exportacionesService.ProcesarExcelExportaciones(ArchivoFile).subscribe(
          (resp:any)=>{
           
            if(resp["success"]){
              this.DetalleCotizacion(resp["content"]);
            }else{
              this._toastrService.warning(resp["message"]);
            }
  
          },
          (error)=>{
              this._toastrService.info("Comuniquese con sistemas");
          }
        );
      }
      
     
  }


  Familias(idlinea){
    this._GenericoService.ListarFamiliaMaestroItem(idlinea).subscribe(
      (resp:any)=>{

        if(resp["success"]){
          this.FamiliaMaestro=resp["content"];
        }
      }
    )
  }
  

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  //OPCIONES
  EliminarItem(itemRow:DetalleCotizacionExportaciones,index){
        this.formarrayDetalle().removeAt(index);
  }

  NuevoItem(itemRow:DetalleCotizacionExportaciones,index){
    // console.log(itemRow);
    const modalRefGenerarCotizacion = this._modalService.open(ModalMaestroItemComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'lg',
			scrollable: true,
			keyboard: false
		});

    const ConstDetraccion={
      Familia:this.FamiliaMaestro,
      Codsut:itemRow.codSut
    }
    modalRefGenerarCotizacion.componentInstance.fromParent =ConstDetraccion;
		modalRefGenerarCotizacion.result.then((result) => {
		}, (reason:any) => {
        if(reason!=undefined){
          this.formarrayDetalle().at(index).get("descripcion").patchValue(reason.descripcionCompleta);
          this.formarrayDetalle().at(index).get("item").patchValue(reason.item);
          
        }
       
		});
  }

}
