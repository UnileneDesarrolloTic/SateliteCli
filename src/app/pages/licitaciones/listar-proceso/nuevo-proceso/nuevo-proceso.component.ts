import { Component, OnInit } from '@angular/core';
import { ComercialService } from '@data/services/backEnd/pages/comercial.service';
import { ModalClienteComponent } from '@shared/components/modal-cliente/modal-cliente.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LicitacionesService } from '@data/services/backEnd/pages/licitaciones.service';
import { DetallePedido } from '@data/interface/Response/ListarDetallePedido.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-nuevo-proceso',
  templateUrl: './nuevo-proceso.component.html',
  styleUrls: ['./nuevo-proceso.component.css']
})
export class NuevoProcesoComponent implements OnInit {
  listarcliente:object[]=[];
  ListarDetallePedido:DetallePedido[]=[];
  form:FormGroup;
  constructor(private _comercialService:ComercialService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private _LicitacioneService:LicitacionesService) {
                this.crearFormulario();
               }

  ngOnInit(): void {
    
  }

  crearFormulario(){ 
    this.form=new FormGroup({
      Pedido : new FormControl(''),
      NumeroProceso : new FormControl('',Validators.required),
      Asociado : new FormControl('',Validators.required),
      Descripcion : new FormControl('',Validators.required)
    })
   
   }


 



  BuscarPedido(){
      console.log(this.form.controls.Pedido.value);
    if(this.form.controls.Pedido.value.trim()=="" || this.form.controls.Pedido.value==undefined ){
         this.toastr.info("Debe Ingresar el Numero de Pedido");
        }else{
          this._LicitacioneService.ListarDetallePedido(this.form.controls.Pedido.value.trim()).subscribe(
            (resp)=>{
                  if(resp.length>0 ){
                    resp.forEach((element)=>{
                        this.ListarDetallePedido.push(element);
                    })
                    this.form.controls.Pedido.reset();
                  }else{
                    this.toastr.info("No hay Registrado de ese pedido");
                    this.form.controls.Pedido.reset();
                  } 
                 
            },
            (error)=>{
                this.toastr.info("Comuniquese con sistemas");
            }
          )
          
        }
    }
   
    Guardar(){
        
        
      var infordatelle = document.getElementById("tbodyDetalle") as HTMLTableElement;
      var ArrayDetalle = Array();
      for (let index = 0; index <= infordatelle.childNodes.length -2; index++) {
          var obj = Object();
          obj.Pedido= (infordatelle.rows[index])?.cells.item(0).innerHTML;
          obj.Linea=parseInt((infordatelle.rows[index])?.cells.item(1).innerHTML);
          obj.Item=(infordatelle.rows[index])?.cells.item(2).innerHTML;
          obj.Descripcion=(infordatelle.rows[index])?.cells.item(3).innerHTML;
          obj.CantidadPedida=parseFloat((infordatelle.rows[index])?.cells.item(4).innerHTML);
          obj.PrecioUnitario=parseFloat(((infordatelle.rows[index])?.cells.item(5).innerHTML));
          obj.Monto=parseFloat(((infordatelle.rows[index])?.cells.item(6).innerHTML));
          ArrayDetalle.push(obj);
      }

      let busqueda = ArrayDetalle.reduce((acc, detalle) => {
        acc[detalle.Linea] = ++acc[detalle.Linea] || 0;
        return acc;
      }, {})

      let duplicados = ArrayDetalle.filter((detalle) => {
        return busqueda[detalle.Linea];
      });
      
      if(duplicados.length>0){
        return this.toastr.info("Existe duplicidad en la columna Linea");
      }
      
      const ConstProceso={
          Cliente:parseInt(this.form.controls.idcliente.value),
          Proceso:this.form.controls.NumeroProceso.value,
          DetalleProceso:ArrayDetalle
      }
      console.log(ConstProceso);

    }
   

}
