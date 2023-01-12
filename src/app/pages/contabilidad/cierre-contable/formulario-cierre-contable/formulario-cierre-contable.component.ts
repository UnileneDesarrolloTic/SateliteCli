import { formatDate } from '@angular/common';
import { Component, OnInit ,OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Paginado } from '@data/interface/Comodin/Paginado.interface';
import { DatosFormatoListadoTransaccionKardex } from '@data/interface/Response/DatosFormatoListadoTransaccionKardex.interfaces';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
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
  flagLoading:boolean=false;

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
              private toastr: ToastrService) { 
    this.subcripcion = this.activeroute.params.subscribe(params => {
      this.codigo = params["Codigo"];
    });

  }

  ngOnDestroy() {
    this.subcripcion.unsubscribe();
  }


  ngOnInit(): void {
    this.CreacionFormulario();

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
		this.Filtrar();
	}

  CreacionFormulario(){
    this.FormularioGrupo= new FormGroup({
      Periodo:new FormControl('',Validators.required),
      Tipo: new FormControl('TR',Validators.required),
      CheckCierre: new FormControl(false,Validators.required),
      DetalleTabla:this._fb.array([])
    });
  }
  
 

  Filtrar(){
    this.flagLoading=true;

    if(!this.FormularioGrupo.controls.Periodo.valid)
        return (this.toastr.warning("Debe ingresar el Periodo Correspondiente"), this.flagLoading=false);
    
    const datos={
      Pagina: this.pagina,
      RegistrosPorPagina: 10,
      ...this.FormularioGrupo.value
    }
    this.ListarFiltro(datos)
    
  }

  
  ListarFiltro(datos){
    this._ContabilidadService.ListarInformacionTransaccionKardex(datos)
    .subscribe(
        (resp:any)=>{
          this.ListarTransaccionKardex=resp["contenido"];
          this.flagLoading=false;
        },
        error=>{
          this.flagLoading=false;
        }
    );
  }

  Guardar(){
    const GuardarInformacion={
      Pagina: -1,
      RegistrosPorPagina: 10,
      ...this.FormularioGrupo.value
    }

    console.log(GuardarInformacion);

  }

}
