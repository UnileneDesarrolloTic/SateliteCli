import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatosFormatoPlanOrdenServicosDModel } from '@data/interface/Response/DatosFormatoPlanOrdenServicosD.inteface';
import { LogisticaService } from '@data/services/backEnd/pages/logistica.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCargarComponent } from '@shared/components/modal-cargar/modal-cargar.component';
import { Cargarbase64Service } from '@shared/services/comunes/cargarbase64.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-guias',
  templateUrl: './gestion-guias.component.html',
  styleUrls: ['./gestion-guias.component.css']
})
export class GestionGuiasComponent implements OnInit {
  hoy = new Date().toLocaleDateString();
  Planservicios:FormGroup;
  form:FormGroup;
  flagEsperaExcel:boolean=false;
  
  constructor(private _ServiceLogistica:LogisticaService,
              private toastr: ToastrService,
              private _modalService: NgbModal,
              private _Cargarbase64Service:Cargarbase64Service,
              private _fb: FormBuilder,) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.form = new FormGroup({ 
      numero : new FormControl ('')
    })

    this.Planservicios = this._fb.group({
      ListadoNumeroGuias: this._fb.array([]),
    });
  }

  buscar(){
    if(this.form.controls.numero.value==''){
        return this.toastr.warning("Debe Ingresar Numero de la Guia o la serie");
    }

    this._ServiceLogistica.ObtenerNumeroGuia(this.form.controls.numero.value).subscribe(
      resp=>{
        if(resp.length>0){
          this.ConstruirFormArray(resp);
        }else{
          this.toastr.warning("no hay informacion con el numero de guia:" + this.form.controls.numero.value);
        }
        
      }
    );
  }

  ConstruirFormArray(formArrayResp:DatosFormatoPlanOrdenServicosDModel[]){
    const ArrayItem = this.Planservicios.controls.ListadoNumeroGuias as FormArray;
    ArrayItem.controls = [];
    formArrayResp.forEach((itemRow:DatosFormatoPlanOrdenServicosDModel)=>{

        let separarFecha=itemRow.fechaRetorno.split("T");
        
          const ItemFilaForm = this._fb.group({
            numeroGuia: [itemRow.numeroGuia],
            fechaDocumento: [itemRow.fechaDocumento],
            cliente: [itemRow.cliente],
            ordenServicios: [itemRow.ordenServicios],
            fechaRetorno:[separarFecha[0]]
          });
          this.ListadoServicios.push(ItemFilaForm);
      })
  }

  get ListadoServicios(){
    return this.Planservicios.controls['ListadoNumeroGuias'] as FormArray;
  }

  guardarServicios(){
    this._ServiceLogistica.RegistarFechaRetorno(this.Planservicios.controls['ListadoNumeroGuias'].value).subscribe(
      (resp:any)=>{
              resp["success"] ? this.toastr.success(resp["content"]) : this.toastr.info(resp["content"]);
      }
    );
  }

  exportaExcel(){
    const ModalCarga = this._modalService.open(ModalCargarComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm',
      scrollable: true
    });
    ModalCarga.componentInstance.fromParent = "Generando el Formato Excel";
    this._ServiceLogistica.exportarExcelRetornoGuia().subscribe(
      (resp:any)=>{
        if(resp.success){
          this._Cargarbase64Service.file(resp.content,`ReporteRetornoGuia-${this.hoy}`,'xlsx',ModalCarga);
        }else{
          ModalCarga.close();
          this.toastr.info(resp.message);
        }
        this.flagEsperaExcel=false;
      },
      error=> {
            ModalCarga.close();
            this.flagEsperaExcel=false;
      }
    );
  }

}
