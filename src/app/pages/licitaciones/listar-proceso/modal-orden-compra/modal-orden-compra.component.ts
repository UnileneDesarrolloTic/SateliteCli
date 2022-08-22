import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-orden-compra',
  templateUrl: './modal-orden-compra.component.html',
  styleUrls: ['./modal-orden-compra.component.css']
})
export class ModalOrdenCompraComponent implements OnInit {
  form:FormGroup;
  ListarItemProceso:any[]=[];
  ListarTipoUsuario:string[]=[];
  @Input() fromParent:DatosListarProceso;
  constructor(public activeModal: NgbActiveModal,
              private _LicitacionesServices:LicitacionesService,
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.ListarItem();
    this.instanciarObservadoresFilter();

    this.form.get("idproceso").patchValue(this.fromParent.idProceso);
  }

  inicializarFormulario() {
    this.form = new FormGroup({
      idproceso: new FormControl(''),
      NumeroEntrega:new FormControl('1',[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      Item:new FormControl(null,[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      Usuario: new FormControl(null,[Validators.required]),
      NumeroOC:new FormControl(null),
      CantidadOC:new FormControl(0),
    })
  }

  ListarItem(){
    let dato={
      IdProceso :this.fromParent.idProceso,
      NumeroEntrega: this.form.controls.NumeroEntrega.value
    }
    this._LicitacionesServices.ListarProgramacionMuestrasLIP(dato).subscribe(
      (resp:any)=>{
          this.ListarItemProceso=resp;
      }
    );
  }

  ObtenerListarTipoUsuario(){
    let dato={
      IdProceso :this.fromParent.idProceso,
      Item:this.form.controls.Item.value,
      NumeroEntrega: this.form.controls.NumeroEntrega.value
    }

    this._LicitacionesServices.ListarTipoUsuario(dato).subscribe(
      (resp:any)=>{
          this.ListarTipoUsuario=resp;
      }
    );
  }

  BuscarOrdenCompraLicitaciones(){
    let dato={
      IdProceso :this.fromParent.idProceso,
      NumeroEntrega: this.form.controls.NumeroEntrega.value,
      Item:parseInt(this.form.controls.Item.value),
      TipoUsuario:this.form.controls.Usuario.value,
    }

    this._LicitacionesServices.BuscarOrdenCompraLicitaciones(dato).subscribe(
      (res:any)=>{
          if(res["success"]){
              this.form.get("NumeroOC").patchValue(res["content"]["numeroOC"]);
              this.form.get("CantidadOC").patchValue(res["content"]["cantidadOC"]);
          }
      }
    )
  }
  
  instanciarObservadoresFilter() {
    this.form.get("NumeroEntrega").valueChanges.subscribe( valor => { 
        if(this.form.controls.Item.value!=null && this.form.controls.Usuario.value!=null){
            this.BuscarOrdenCompraLicitaciones();
        }
        this.ListarItem();
        this.ObtenerListarTipoUsuario();
    });

    this.form.get("Item").valueChanges.subscribe(valor=>{
      if(this.form.controls.Item.value!=null && this.form.controls.Usuario.value!=null){
        this.BuscarOrdenCompraLicitaciones();
      }
      this.ObtenerListarTipoUsuario();
    })

    this.form.get("Usuario").valueChanges.subscribe(valor=>{
      if(this.form.controls.Item.value!=null && this.form.controls.Usuario.value!=null){
        this.BuscarOrdenCompraLicitaciones();
      }
    });

   
  }



  save() {
    
    if(this.form.controls.NumeroOC.value==null || this.form.controls.NumeroOC.value=="" || this.form.controls.CantidadOC.value<=0){
        this.toastr.warning("Completar los datos faltantes");
        return;
    }

    let dato={
      idProceso :this.fromParent.idProceso,
      Item:parseInt(this.form.controls.Item.value),
      NumeroEntrega: parseInt(this.form.controls.NumeroEntrega.value),
      Usuario : this.form.controls.Usuario.value,
      NumeroOC : this.form.controls.NumeroOC.value,
      CantidadOC :parseInt(this.form.controls.CantidadOC.value)
    }
    
    this._LicitacionesServices.RegistrarOrdenCompra(dato).subscribe(
      (resp:any)=>{
        if(resp["success"]){
          this.toastr.success(resp["content"]);
        }else{
          this.toastr.warning(resp["content"]);
        }
      }
    );
   
    this.activeModal.close(); 
  }

}
