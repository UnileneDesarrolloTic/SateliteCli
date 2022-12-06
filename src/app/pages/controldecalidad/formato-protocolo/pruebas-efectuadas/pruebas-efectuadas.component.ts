import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  constructor(private _router: Router,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private _ControlcalidadService:ControlcalidadService,
    private _GenericoService:GenericoService,
    private activeroute:ActivatedRoute,
    private _modalService: NgbModal,
    private servicebase64:Cargarbase64Service,) { 

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
        this.buttonDeshabilitar=true;
        
        this._ControlcalidadService.RegistrarFormatoProtocolo(this.PruebasFormularioProtocolo.value).subscribe(
          (resp:any)=>{
              if(resp["success"]){
                this.toastr.success(resp["content"]);
              }else{
                this.toastr.success(resp["content"]);
              }
              this.buttonDeshabilitar=false;
          },
          (error)=>{
              this.toastr.info("Comuniquese con sistema")
              this.buttonDeshabilitar=false;
          }
        )
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

  ObservableIdioma(){
    this.PruebasFormularioProtocolo.controls.Idioma.valueChanges.subscribe(valor=>{
        this.buscarInformacionPrueba(this.NumeroLote,this.NumeroParte,valor);
        this.BuscarinformacionProductoProtocolo();
    })
  }

  BuscarinformacionProductoProtocolo(){
    
    this._ControlcalidadService.BuscarNumeroLoteProtocolo(this.NumeroLote,this.PruebasFormularioProtocolo.controls.Idioma.value).subscribe(
        (resp:any)=>{
              if(resp["success"]){
                  this.InformacionProducto=resp["content"];
                  // console.log(this.InformacionProducto);
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
        if(resp.success){
          this.servicebase64.file(resp.content,`Formato-prueba-${this.NumeroLote}-${this.hoy}`,'pdf',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
      }
    );
  }


}
