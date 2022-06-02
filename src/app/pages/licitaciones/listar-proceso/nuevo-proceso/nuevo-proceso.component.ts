import { Component, OnInit } from '@angular/core';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { DetallePedido } from '@data/interface/Response/ListarDetallePedido.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-nuevo-proceso',
  templateUrl: './nuevo-proceso.component.html',
  styleUrls: ['./nuevo-proceso.component.css']
})
export class NuevoProcesoComponent implements OnInit {
  listarcliente:object[]=[];
  ListarDetallePedido:DetallePedido[]=[];
  DeshabilitarBoton:boolean=true;

  form:FormGroup;
  constructor(private _comercialService:ComercialService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private _fb: FormBuilder,
              private _LicitacioneService:LicitacionesService) {
                this.crearFormulario();
               }

  ngOnInit(): void {
    this.ListarCliente();
  }

  crearFormulario(){ 
    this.form = this._fb.group({
      idcliente:[ ,Validators.required],
      cliente: [ ,Validators.required],
      Proceso: [,],
      NumeroProceso: [,Validators.required],
    })
   
   }

  ListarCliente(){
    const body = {};
    this._comercialService.ListarClientes(body).subscribe((resp) => {
      resp["success"]==true ? this.listarcliente=resp["content"] : this.listarcliente=[];
    });
  }
 
openModalConsultaClientes(){
    const modalBusquedaCliente = this.modalService.open(ModalClienteComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      size: "lg",
    });
    
    const data={
        listarclientes:this.listarcliente
    }

    modalBusquedaCliente.componentInstance.fromParent = data;
		modalBusquedaCliente.result.then((result) => { 
       this.DeshabilitarBoton=false;
       this.form.get("idcliente").patchValue(result.persona);
       this.form.get("cliente").patchValue(result.nombreCompleto);
		});
     
  }


  BuscarPedido(){
    console.log(this.form.controls.NumeroProceso.value);
    if(this.form.controls.NumeroProceso.value.trim()=="" || this.form.controls.NumeroProceso.value==undefined ){
         this.toastr.info("Debe Ingresar el Numero de Pedido");
        }else{
          this._LicitacioneService.ListarDetallePedido(this.form.controls.NumeroProceso.value.trim(),this.form.controls.idcliente.value).subscribe(
            (resp)=>{
                  if(resp.length>0 ){
                    resp.forEach((element)=>{
                        this.ListarDetallePedido.push(element);
                    })
                    this.form.controls.NumeroProceso.reset();
                  }else{
                    this.toastr.info("No hay Registrado de ese pedido");
                    this.form.controls.NumeroProceso.reset();
                  } 
                 
            },
            (error)=>{
                this.toastr.info("Comuniquese con sistemas");
            }
          )
          
        }
    }
   
    Guardar(){
        console.log(this.form.value);
        
      var infordatelle = document.getElementById("tbodyDetalle") as HTMLTableElement;
      var ArrayDetalle = Array();
      for (let index = 0; index <= infordatelle.childNodes.length -2; index++) {
          var obj = Object();
          obj.pedido= (infordatelle.rows[index])?.cells.item(0).innerHTML;
          obj.linea=parseInt((infordatelle.rows[index])?.cells.item(1).innerHTML);
          obj.item=(infordatelle.rows[index])?.cells.item(2).innerHTML;
          obj.descripcion=(infordatelle.rows[index])?.cells.item(3).innerHTML;
          obj.cantidadPedida=parseFloat((infordatelle.rows[index])?.cells.item(4).innerHTML);
          obj.precioUnitario=parseFloat(((infordatelle.rows[index])?.cells.item(5).innerHTML));
          obj.monto=parseFloat(((infordatelle.rows[index])?.cells.item(6).innerHTML));
          ArrayDetalle.push(obj);
      }

      let duplicados = [];
      const tempArray = ArrayDetalle.sort();
      
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i + 1]?.linea === tempArray[i]?.linea) {
          duplicados.push(tempArray[i]?.linea);
        }
      }
      
      if(duplicados.length>0){
          return this.toastr.info("Lineas Duplicadas: "+ JSON.stringify(duplicados));
      }
      console.log("pase");

      console.log(duplicados);

      console.log(ArrayDetalle);

    }
   

}
