import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AlertaProcesarDetraccionComponent } from './alerta-procesar-detraccion/alerta-procesar-detraccion.component';

@Component({
  selector: 'app-detracciones',
  templateUrl: './detracciones.component.html',
  styleUrls: ['./detracciones.component.css']
})
export class DetraccionesComponent implements OnInit {
  // formulario:FormGroup;
  listarDetraccion:any=[];
  totalimporte:number=0;
  displayButton:boolean=true;
  Ocultar:boolean=true;
  @ViewChild("archivo", {
    read: ElementRef
  }) 
  archivo: ElementRef;

  
  constructor(private _ContabilidadService:ContabilidadService,
              private modalService: NgbModal,
              private _fb:FormBuilder,
              private toastr: ToastrService) {
                  // this.formulario = this._fb.group({
                  //   inputBox:['']
                  // })
               }

  paginador: Paginado = {
    paginaActual: 1,
    totalPaginas: 1,
    registroPorPagina: 10,
    totalRegistros: 1,
    siguiente:true,
    anterior: false,
    primeraPagina: true,
    ultimaPagina: false
  }

  pagina: Number = 1
  pageSize: Number = 10;
  page: Number =1;


  ngOnInit() {
    this.ListarDetraccion();
  }

  // FiltrarDetraccion(){
  //   this.ListarDetraccion();
  // }

  ListarDetraccion(){
   /* const body = {
      // documento: this.formulario.controls.documento.value,
      Pagina : this.pagina,
      RegistrosPorPagina: 10
    }*/
    this._ContabilidadService.ListarDetracciones().subscribe( resp => {
        this.listarDetraccion = resp;
        this.listarDetraccion?.length>0 ?  this.TotalImporte(this.listarDetraccion) : '';
        
    });
  }
  TotalImporte(ListDetraccion){
    this.totalimporte=0;
     ListDetraccion.forEach((element:any) => {
          this.totalimporte=this.totalimporte +  element.importe;
     });
  }

  MensajeProcesar(ArrayDetraccion){
    const modalRefGenerarCotizacion = this.modalService.open(AlertaProcesarDetraccionComponent, {
			ariaLabelledBy: 'modal-basic-title',
			centered: true,
			backdropClass: 'light-blue-backdrop',
			backdrop: 'static',
			size: 'xs',
			scrollable: true,
			keyboard: false
		});

    const ConstDetraccion={
      totalimporte: this.totalimporte,
      detalle:ArrayDetraccion
    }
    modalRefGenerarCotizacion.componentInstance.fromParent =ConstDetraccion;
		modalRefGenerarCotizacion.result.then((result) => {
         
		}, (reason) => {
			
			
		});
  }

  procesar(){
    var infordatelle = document.getElementById("tbodyDetalle") as HTMLTableElement;
    var ArrayDetraccion = Array();
    for (let index = 0; index <= infordatelle.childNodes.length -2; index++) {
        var obj = Object();
        obj.Num_Registro= parseFloat(((infordatelle.rows[index])?.cells.item(0).innerHTML).toString());
        obj.Ruc=(infordatelle.rows[index])?.cells.item(1).innerHTML;
        obj.RazonSocial=(infordatelle.rows[index])?.cells.item(2).innerHTML;
        obj.NumProf=(infordatelle.rows[index])?.cells.item(3).innerHTML;
        obj.BienServicio=(infordatelle.rows[index])?.cells.item(4).innerHTML;
        obj.Importe=parseFloat(((infordatelle.rows[index])?.cells.item(5).innerHTML).toString());
        obj.Serie=(infordatelle.rows[index])?.cells.item(6).innerHTML;
        obj.Numero=(infordatelle.rows[index])?.cells.item(7).innerHTML;
        obj.Periodo=(infordatelle.rows[index])?.cells.item(8).innerHTML;
        obj.Tipo=(infordatelle.rows[index])?.cells.item(9).innerHTML;
        obj.TipoDocumento=parseFloat(((infordatelle.rows[index])?.cells.item(10).innerHTML).toString());
        obj.TipoOperacion=(infordatelle.rows[index])?.cells.item(11).innerHTML;
        ArrayDetraccion.push(obj);
    }

    let validarCampo=ArrayDetraccion.filter((element:any)=>element.BienServicio==''||element.BienServicio==null || element==undefined);
    
    if (validarCampo.length > 0)
        this.toastr.info("Completa los campos restantes de la columna Servicio");
    else
        this.MensajeProcesar(ArrayDetraccion);
  }

  GuardarExcel(){
      this.Ocultar=false;
      let archivos = this.archivo.nativeElement.files;
      this._ContabilidadService.SubirExcelProcesoDetraccion(archivos[0].name).subscribe( resp => {
        if(resp==1){
          this.toastr.success("Guardado con exito");
          this.ListarDetraccion();
          this.Ocultar=true;
        }
      },
    error=> {this.toastr.info("Comuniquese con el administrador de TI")
              this.Ocultar=true;});
  }

  handleUpload(event) {
    const file = event.target.files[0];
    if(file){
      this.displayButton=false;
    }
  }
 

  
  cambioPagina(paginaCambiada: Number){
    this.pagina = paginaCambiada
    this.ListarDetraccion()
  }

  

}
