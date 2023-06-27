import { DecimalPipe, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosPruebaProtocoloModel } from '@data/interface/Response/DatosCabeceraPruebasProtocolos.interface';
import { NumeroLoteProtocoloModel } from '@data/interface/Response/DatosFormatoNumeroLoteProtocolo.interface';
import { ControlcalidadService } from '@data/services/backEnd/pages/controlcalidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ModalElegirDocumentoComponent } from './modal-elegir-documento/modal-elegir-documento.component';

@Component({
  selector: 'app-pruebas-efectuadas',
  templateUrl: './pruebas-efectuadas.component.html',
  styleUrls: ['./pruebas-efectuadas.component.css']
})
export class PruebasEfectuadasComponent implements OnInit , OnDestroy{
  hoy = new Date().toLocaleDateString();
  PruebasFormularioProtocolo:FormGroup;
  InformacionProducto: NumeroLoteProtocoloModel;
  subcripcion : Subscription;
  NumeroLote:string;
  NumeroParte:string;
  buttonDeshabilitar:boolean=false;
  NombreCumple:string='Cumple';
  mostrarmodalCantidad:boolean = false;

  constructor(private _router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private _ControlcalidadService:ControlcalidadService,
    private _GenericoService:GenericoService,
    private activeroute:ActivatedRoute,
    private _modalService: NgbModal,
    private servicebase64:Cargarbase64Service,
    private _decimalPipe: DecimalPipe
   ) { 

    this.subcripcion=this.activeroute.params.subscribe(params=>{
      this.NumeroLote=params["NumeroLote"];
      this.NumeroParte=params["NumeroParte"];
  });
  }

  ngOnInit(): void {
    this.crearDetallePruebaProtocolo();
    this.BuscarinformacionProductoProtocolo();
    this.buscarInformacionPrueba(this.NumeroLote,this.NumeroParte,this.PruebasFormularioProtocolo.controls.Idioma.value);
    this.ObservableIdioma();
  }


  buscarInformacionPrueba(NumeroLote,NumeroParte,Idioma){
      this._ControlcalidadService.BusquedaPruebaProtocolo(this.NumeroLote,this.NumeroParte,Idioma).subscribe(
        (resp:any)=>{
            this.construirFormaArray(resp);
        }
      )
  }


  save(){
        
        if (this.PruebasFormularioProtocolo.controls.fechaanalisis.value=="0001-01-01")
        {
          return this.toastr.warning("Debe Seleccionar la fecha");
        }

        if(this.PruebasFormularioProtocolo.controls.TablaPrueba.invalid)
        {
          this.PruebasFormularioProtocolo.markAllAsTouched();
          return this.toastr.warning("Debe completar la información la columna resultado");
        }
            

        this._ControlcalidadService.RegistrarFormatoProtocolo(this.PruebasFormularioProtocolo.value).subscribe(
          (resp:any)=>{
              if(resp["success"]){
                this.toastr.success(resp["content"]);
              }else{
                this.toastr.info(resp["content"]);
              }
          }
        )
        
  }

  crearDetallePruebaProtocolo(){
    this.PruebasFormularioProtocolo = this._fb.group({
      Idioma:new FormControl('1'),
      fechaanalisis:new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')),
      fechaproduccion:new FormControl({value:'',disabled:true}),
      NumeroLote: new FormControl(''),
      NumeroParte : new  FormControl(''),
      Tecnica : new FormControl(''),
      Metodo : new FormControl(''),
      Detalle : new FormControl(''),
      TablaPrueba:this._fb.array([])
    });
  }

  ObservableIdioma(){
    this.PruebasFormularioProtocolo.controls.Idioma.valueChanges.subscribe(valor=>{
        valor=='1'? this.NombreCumple='Cumple' : this.NombreCumple='Comply';
        this.buscarInformacionPrueba(this.NumeroLote,this.NumeroParte,valor);
        this.BuscarinformacionProductoProtocolo();
    })
  }

  BuscarinformacionProductoProtocolo(){
    
    this._ControlcalidadService.BuscarNumeroLoteProtocolo(this.NumeroLote,this.PruebasFormularioProtocolo.controls.Idioma.value).subscribe(
        (resp:any)=>{
              if(resp["success"]){
                  this.InformacionProducto=resp["content"];
                  console.log(this.InformacionProducto);
                  const date1 = new Date('0001-01-01T00:00:00');
                  this.PruebasFormularioProtocolo.get("Tecnica").patchValue(this.InformacionProducto.tecnica);                  
                  this.PruebasFormularioProtocolo.get("Metodo").patchValue(this.InformacionProducto.metodo);
                  this.PruebasFormularioProtocolo.get("Detalle").patchValue(this.InformacionProducto.detalle);
                  this.PruebasFormularioProtocolo.get("NumeroParte").patchValue(this.InformacionProducto.numerodeparte);
                  this.PruebasFormularioProtocolo.get("NumeroLote").patchValue(this.InformacionProducto.referencianumero);
                  this.PruebasFormularioProtocolo.get("fechaanalisis").patchValue(  this.formatoFecha(this.InformacionProducto.fechaanalisis) );
                  this.PruebasFormularioProtocolo.get("fechaproduccion").patchValue(this.formatoFecha(this.InformacionProducto.fechaproduccion));
              }else{
                  this.InformacionProducto=null;
              }
        }
    )
  }


  formatoFecha(Fecha){
    return  Fecha!='01-01-0001' ? Fecha.split("T")[0] : '01-01-0001';
  }

  transformDecimal(num,decimal) {
    return this._decimalPipe.transform(num, `1.${decimal}-${decimal}`);
  }
  

  construirFormaArray(ArrayTabla:DatosPruebaProtocoloModel[]){
        const FormTabla = this.PruebasFormularioProtocolo.controls["TablaPrueba"] as FormArray;
        FormTabla.controls=[];
        let contador=0;
        let especificacion1="";
        let especificacion2="";
        let esp="";
        
        ArrayTabla.forEach((element:DatosPruebaProtocoloModel) => {
          if(element.decimales=="0.0000" || element.decimales==""){
            element.resultado= element.resultado=="0.0000" ? this.NombreCumple : element.resultado;
          }else{
            // console.log(this._GenericoService.RedondearDecimales(element.resultado,parseInt(element.decimales),false));
            element.resultado=+(element.resultado== this.NombreCumple || element.resultado=="0.0000") ? this.NombreCumple : this.transformDecimal(element.resultado,element.decimales);
          }

          

          if(element.flagPreResultado=='S' ){
              element.resultado=element.preResultado
          }else{
              element.resultado=element.resultado;
          }

          if(element.orden==3 &&  contador==0){
            especificacion1=element.especificacion+element.valor;
            contador ++;
          }else if(element.orden==3 && contador>0){
            especificacion2=element.especificacion+element.valor;
            esp="de "+especificacion1.replace(".",",")+" a "+especificacion2.replace(".",",");

            

            const lessForm = this._fb.group({
              orden:[element.orden],
              descripcionLocal:[element.descripcionLocal],
              unidadMedida:[element.unidadMedida],
              especificacion:[esp],
              valor:[""],
              resultado:[element.resultado,Validators.required],
              metodologia:[element.metodologia],
            })

            this.ListarPruebaProtocolo().push(lessForm);

          }else{
            esp = element.especificacion;

            const lessForm = this._fb.group({
              orden:[element.orden],
              descripcionLocal:[element.descripcionLocal],
              unidadMedida:[element.unidadMedida],
              especificacion:[esp],
              valor:[element.valor],
              resultado:[element.resultado,Validators.required],
              metodologia:[element.metodologia],
            })

            this.ListarPruebaProtocolo().push(lessForm);
          }   
          
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
    this._router.navigate(['ControlCalidad', 'Protocolo','principal',this.NumeroLote])
  }
  

  AgregarFila(){
    const Agregar= this.PruebasFormularioProtocolo.get("TablaPrueba") as FormArray;
    Agregar.push(this._fb.group({
      orden:['',],
      descripcionLocal:['',],
      unidadMedida:['',],
      especificacion:['',],
      valor:['',],
      resultado:['',Validators.required],
      metodologia:['',],
    }))

  }
  trackFn(index) {
    return index;
  }

  Imprimir(){
    const ModalDocumento = this._modalService.open(ModalElegirDocumentoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalDocumento.result.then((result) => {
        this.DocumentoImprimir(result);
      },
      (reason) => {

      }
    );
  }

  DocumentoImprimir(Opcion:boolean){
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });

    ModalCarga.componentInstance.fromParent = "Generando el Formato pdf";

    this._ControlcalidadService.ImprimirDocumentoControPruebasProtocolo(this.NumeroLote,Opcion,this.PruebasFormularioProtocolo.controls.Idioma.value).subscribe(
      (resp:any)=>{
            // this.modalpdf(resp.content);
          if(resp.success){
            this.servicebase64.file(resp.content,`Formato-prueba-${this.NumeroLote}-${this.hoy}`,'pdf',ModalCarga);
          }else{
            ModalCarga.close();
            this.toastr.warning(resp.content);
          }
      },
      _ => ModalCarga.close()
    
    );
  }

  verProducto(){
    this.mostrarmodalCantidad = true;
    (document.getElementById('rightMenu') as HTMLFormElement).style.width = '300px';
  }


  cancelClick(){
    this.mostrarmodalCantidad = false;
    (document.getElementById('rightMenu') as HTMLFormElement).style.width = '0';
  }
  // modalpdf(base){
  //   // const ModalCarga = this._modalService.open(ModalPdfComponent, {
  //   const ModalCarga = this._modalService.open(ModalPdfComponent, {
  //     centered: true,
  //     backdrop: 'static',
  //     size: 'lx',
  //     scrollable: true
  //   });
  //   ModalCarga.componentInstance.base = base;
  //   ModalCarga.result.then((result) => {
     
  //   },
  //   (reason) => {

  //   }
  // );
  // }

}
