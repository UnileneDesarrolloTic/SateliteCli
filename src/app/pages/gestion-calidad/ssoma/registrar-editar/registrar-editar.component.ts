import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlmacenamientoSsoma } from '@data/interface/Response/DatosFormatosAlmacenamientosSoma.interfaces';
import { EstadoSsoma } from '@data/interface/Response/DatosFormatosEstadosSoma.interfaces';
import { ProteccionSsoma } from '@data/interface/Response/DatosFormatosProteccionsSoma.interfaces';
import { ResponsableSsoma } from '@data/interface/Response/DatosFormatosResponsableSoma.interfaces';
import { TipoDocumentoSsoma } from '@data/interface/Response/DatosFormatosTipoDocumentosSoma.interfaces';
import { UbicacionSsoma } from '@data/interface/Response/DatosFormatosUbicacionsSoma.interfaces';
import { SsomaDTO } from '@data/interface/Response/GestionCalidad.interface';
import { GestionCalidadService } from '@data/services/backEnd/pages/gestionCalidad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericoService } from '@shared/services/comunes/generico.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-editar',
  templateUrl: './registrar-editar.component.html',
  styleUrls: ['./registrar-editar.component.css']
})
export class RegistrarEditarComponent implements OnInit {

  @Input() Interfaz:string;
  @Input() data:any;
  FormFormulario:FormGroup;
  TipoDocumentoSsoma:TipoDocumentoSsoma[]=[];
  UbicacionSsoma:UbicacionSsoma[]=[];
  ListarproteccionSsoma: ProteccionSsoma[]=[];
  estadoSsoma: EstadoSsoma[]=[];
  ResponsableSsoma: ResponsableSsoma[]=[];
  Almacenamientossoma: AlmacenamientoSsoma[]=[];
  constructor(public activeModal: NgbActiveModal,
              private _toastrService: ToastrService,
              private _GenericoService: GenericoService,
              private _GestionCalidadService: GestionCalidadService) { }

  ngOnInit(): void {
    // console.log(this.Interfaz,this.data);
    this.formulario();
    this.tipoDocumento();
    this.ubicacion();
    this.proteccionSsoma();
    this.listarEstadoSsoma();
    this.ListarResponsable();
    this.Almacenamiento();

    if(this.Interfaz=='editar'){
      this.colocarValorFormulario(this.FormFormulario,this.data)
    }
    this.isObservacionTipoDocumento();
    this.isObservacionVigencia();
    this.isObservacionFechaPublicacion();
  }

  formulario(){
    this.FormFormulario = new FormGroup({
      idSsoma : new FormControl(0),
      codigo : new FormControl('DSSM',Validators.required),
      nombreDocumento : new FormControl('',Validators.required),
      tipoDocumento : new FormControl(1,Validators.required),
      version : new FormControl(0,Validators.required),
      fechapublicacion : new FormControl(null,Validators.required),
      fecharevision : new FormControl(null,Validators.required),
      fechaAprobacion: new FormControl(null,Validators.required),
      estado : new FormControl(null,Validators.required),
      Ubicacion :new FormControl(1,Validators.required),
      Almacenamiento :new FormControl(3,Validators.required),
      proteccion :new FormControl(1,Validators.required),
      vigencia:new FormControl(0,Validators.required),
      responsable :new FormControl(null,Validators.required),
      archivopasivo :new FormControl(0,Validators.required),
      comentario: new FormControl('',[ Validators.maxLength(300)])
    });
  }

  colocarValorFormulario(formulario:FormGroup,data:SsomaDTO)
  {   
    let fechaPublicacion = formatDate(data.fechaPublicacion, 'yyyy-MM-dd', 'en') ?? "";
    let fechaRevision = formatDate(data.fechaRevision, 'yyyy-MM-dd', 'en') ?? "";
    let fechaAprobacion = formatDate(data.fechaAprobacion, 'yyyy-MM-dd', 'en') ?? "";

    formulario.patchValue({
      idSsoma : data.idSsoma,
      codigo : data.codigoDocumento,
      nombreDocumento : data.nombreDocumento,
      tipoDocumento : data.idTipoDocumento,
      version : data.versionSsoma,
      fechapublicacion : fechaPublicacion ,
      fecharevision : fechaRevision ,
      fechaAprobacion: fechaAprobacion ,
      estado : data.idEstadoSsoma,
      Ubicacion :data.idUbicacionSsoma,
      Almacenamiento :data.idSsomaAlmacenamiento,
      proteccion :data.idProteccionSsoma,
      vigencia:data.vigencia,
      responsable :data.responsable,
      archivopasivo :data.archivoPasivo,
      comentario:data.comentario
    })
    this.FormFormulario.controls.codigo.disable();
    this.FormFormulario.controls.tipoDocumento.disable();
  }

  isObservacionTipoDocumento(){
    this.FormFormulario.get("tipoDocumento").valueChanges.subscribe((valor)=>{
         let respuesta= this.TipoDocumentoSsoma.find((row:TipoDocumentoSsoma)=> (row.idTipoDocumento==valor) && row.codigo)
         this.FormFormulario.get("codigo").patchValue(respuesta.codigo);
    })
  }

  isObservacionVigencia(){
    this.FormFormulario.controls.vigencia.valueChanges.pipe(debounceTime(500)).subscribe((Numerovigencia)=>{
          if(this.FormFormulario.controls.fechapublicacion.value!=null){
              this.calcularRevision()
          }else{
            this._toastrService.warning("Debe colocar la fecha de publicación ")
          }
    })
  }

  isObservacionFechaPublicacion(){
    this.FormFormulario.controls.fechapublicacion.valueChanges.pipe(debounceTime(500)).subscribe((fecha)=>{
          this.calcularRevision()
      })
  }

  calcularRevision(){
    let publicacion = this.FormFormulario.controls.fechapublicacion.value;
    let dia = publicacion.substr(8, 2);
    let mes = publicacion.substr(5, 2);
    let año = publicacion.substr(0, 4); 
    let fecha_A = new Date(año + "/" + mes + "/" + dia);

    let nueva_fecha = new Date(fecha_A.setFullYear(fecha_A.getFullYear() + (this.FormFormulario.controls.vigencia.value * 1)));

    var now = new Date(nueva_fecha);
    var d = new Date(now.getTime() + now.getTimezoneOffset() * 60000);//FORMATO FECHA UTC 
    var n = d.getUTCDay(); // OBTENEMOS EL NUMERO DEL DIA CONSIDERANDO DOMINGO EN 0 Y SABADO EN 6
    var fechaN = new Date(d);
    
    let FechaRevision;

    if (n == 0) {
       FechaRevision=fechaN.setDate(d.getDate() - 2); 
    } else if (n == 6) {
       FechaRevision=fechaN.setDate(d.getDate() - 1); 
    } else {
        FechaRevision=fechaN.setDate(d.getDate() - 0);
    }

    var event = new Date(FechaRevision);
    let date = JSON.stringify(event)
    date = date.slice(1,11)
    this.FormFormulario.patchValue({
      fecharevision:date
    })
    
  }

  tipoDocumento(){
    this._GenericoService.ListarTipoDocumentoSsoma().subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.TipoDocumentoSsoma=resp["content"];
          }
      }
    )
  }

  ubicacion(){
    this._GenericoService.ListarUbicacionSsoma().subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.UbicacionSsoma=resp["content"];
          }
      }
    )
  }


  proteccionSsoma(){
    this._GenericoService.ListarProteccionSsoma().subscribe(
      (resp:any)=>{
          if(resp["success"]){
              this.ListarproteccionSsoma=resp["content"];
          }
      }
    )
  }

  listarEstadoSsoma(){
    this._GenericoService.ListarEstadoSsoma().subscribe(
      (resp:any)=>{
        if(resp["success"]){
            this.estadoSsoma=resp["content"];
        }
      }
    )
  }

  ListarResponsable(){
    this._GenericoService.ListarResponsableSsoma().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.ResponsableSsoma=resp["content"];
        }
      }
    )
  }

  Almacenamiento(){
    this._GenericoService.ListarAlmacenamientoSsoma().subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.Almacenamientossoma=resp["content"];
        }
      }
    )
  }


  Guardar(){
      const datos={
          ...this.FormFormulario.value,
          Ubicacion: parseInt(this.FormFormulario.controls.Ubicacion.value),
          proteccion: parseInt(this.FormFormulario.controls.proteccion.value),
          tipoDocumento: parseInt(this.FormFormulario.controls.tipoDocumento.value),
          estado: parseInt(this.FormFormulario.controls.estado.value),
          Almacenamiento:parseInt(this.FormFormulario.controls.Almacenamiento.value)
      }

    this._GestionCalidadService.RegistrarSsoma(datos).subscribe(
      (resp)=>{
          if(resp["success"]){
            this._toastrService.success(resp["content"]);
            this.activeModal.close();
          }else{
            this._toastrService.warning(resp["content"]);
          }
          
      }
    )
  }
}
