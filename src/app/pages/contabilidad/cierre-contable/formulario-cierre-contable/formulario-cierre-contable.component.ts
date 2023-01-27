import { formatDate } from '@angular/common';
import { Component, OnInit ,OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { DatosFormatoListadoTransaccionKardex } from '@data/interface/Response/DatosFormatoListadoTransaccionKardex.interfaces';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario-cierre-contable',
  templateUrl: './formulario-cierre-contable.component.html',
  styleUrls: ['./formulario-cierre-contable.component.css']
})
export class FormularioCierreContableComponent implements OnInit,OnDestroy {
  subcripcion: Subscription;
  codigo:string="";
  FormularioGrupo:FormGroup;
  ListarTransaccionKardex:DatosFormatoListadoTransaccionKardex[]=[];
  InformacionCabecera:any={cCantidadTotal:0,cMontoTotal:0};

  flagLoading:boolean=false;
  flagRegistrar:boolean=false;

  pagina: Number = 1
	pageSize: Number = 10;
	page: Number = 1;
	dropdownSettings = {};

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


  
  constructor(private activeroute: ActivatedRoute,
              private _fb:FormBuilder,
              private _ContabilidadService:ContabilidadService,
              private _modalService: NgbModal,
              private toastr: ToastrService) { 
    this.subcripcion = this.activeroute.params.subscribe(params => {
      this.codigo = params["Codigo"];
    });

  }

  ngOnDestroy() {
    this.subcripcion.unsubscribe();
  }


  ngOnInit(): void {
    this.creacionFormulario();

    this.paginador = {
			"paginaActual": 1,
			"totalPaginas": 40000,
			"registroPorPagina": 7,
			"totalRegistros": 40000,
			"siguiente": true,
			"anterior": false,
			"primeraPagina": false,
			"ultimaPagina": true
		};
  }

  cambioPagina(paginaCambiada: Number) {
		this.pagina = paginaCambiada
		this.filtrar();
	}

  creacionFormulario(){
    this.FormularioGrupo= new FormGroup({
      Periodo:new FormControl('',Validators.required),
      Tipo: new FormControl('TR',Validators.required),
      CheckCierre: new FormControl(false,Validators.required),
    });
  }
  
 

  filtrar(){
    
    if(!this.FormularioGrupo.valid)
    {
      this.FormularioGrupo.markAllAsTouched();
      return this.toastr.warning("Debe ingresar los datos faltantes","Advertencia");
    }
       
    this.flagLoading=true;
    const datos=
    {
      Pagina: this.pagina,
      RegistrosPorPagina: 10,
      ...this.FormularioGrupo.value,
      Periodo:this.FormularioGrupo.controls.Periodo.value.replace("-","")
    }
    this.listarFiltro(datos)
    
  }

  
  listarFiltro(datos){
    this._ContabilidadService.ListarInformacionTransaccionKardex(datos)
    .subscribe(
        (resp:any)=>{
          this.ListarTransaccionKardex=resp["contentidoDetalle"]["contenido"];
          this.InformacionCabecera=resp["contentidoCabecera"];
          this.flagLoading=false;
        },
        _=> this.flagLoading=false   
      );
  }

  guardar()
  { 
    if(!this.FormularioGrupo.valid)
    {
      this.FormularioGrupo.markAllAsTouched();
      return this.toastr.warning("Debe ingresar los datos faltantes","Advertencia");
    }
    
      
    this.flagRegistrar=true;    
    const GuardarInformacion=
    {
      Pagina: -1,
      RegistrosPorPagina: 10,
      ...this.FormularioGrupo.value,
      Periodo:this.FormularioGrupo.controls.Periodo.value.replace("-","")
    }

    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Subiendo la información ...";

    this._ContabilidadService.RegistrarInformacionTransaccionKardex(GuardarInformacion)
    .subscribe(
          resp=>{
                if(resp["success"])
                  this.toastr.success(resp["content"])
                else
                  this.toastr.info(resp["message"])

                ModalCarga.close();
                this.flagRegistrar=false;
            },
            _=>{
              ModalCarga.close();
              this.flagRegistrar=false;
            }
      );
  }

  
}
