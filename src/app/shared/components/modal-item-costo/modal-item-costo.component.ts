import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemComponenteUnitarioModel } from '@data/interface/Response/DatosFormatoItemComponent.interface';
import { DatosFormatoRecetaItemComponenteModel } from '@data/interface/Response/DatosFormatoRecetaItemComponente.interface';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-modal-item-costo',
  templateUrl: './modal-item-costo.component.html',
  styleUrls: ['./modal-item-costo.component.css']
})
export class ModalItemCostoComponent implements OnInit {
  @Input() ItemComponente:any;
  // @Input() FechaItemProductoTerminado: string;
  textFilterCtrl = new FormControl('');
  CargandoDatos:boolean=true;

  ListarItemComponente:ItemComponenteUnitarioModel[]=[];
  TempListarItemComponente:ItemComponenteUnitarioModel[]=[];
  constructor(public activeModal: NgbActiveModal,
              public _ContabilidadService:ContabilidadService,
              private toastr: ToastrService,) { }
  
  ngOnInit(): void {
      this.ListarItemComponenteUnitario();
      this.instanciarObservadoresFilter();
  }

  instanciarObservadoresFilter(){

    this.textFilterCtrl.valueChanges.pipe( debounceTime(900) ).subscribe( valor => {
      this.filtroSeleccion();
    })
     
  }

  filtroSeleccion(){
    if(this.textFilterCtrl.value != '')
    {
      const texto = this.textFilterCtrl.value.toLocaleUpperCase();
      this.ListarItemComponente = this.ListarItemComponente.filter( (x:ItemComponenteUnitarioModel) => x.itemComponente?.toLocaleUpperCase().indexOf(texto) !== -1
          || x.descripcionLocal?.toLocaleUpperCase().indexOf(texto) !== -1
      );
    }else{
      this.ListarItemComponente = this.TempListarItemComponente;
    }
  }
 

  ListarItemComponenteUnitario(){
    const Datos={
      Linea:this.ItemComponente.lineaItemComponente,
      Familia:this.ItemComponente.familiaItemComponente,
      SubFamilia:this.ItemComponente.subFamiliaItemComponente,
    }
    this._ContabilidadService.ListarItemComponentePrecio(Datos).subscribe(
        (resp:any)=>{
            this.ListarItemComponente=resp;
            this.TempListarItemComponente=resp;
            this.CargandoDatos=false;
      
            if(resp.length==0)
                this.toastr.warning("No hay elemento ha mostrar");
            
        },
        (error)=>{
          this.toastr.info("Comuniquese con sistema");
        }
    )
  }

  ElegirItemComponente(itemComponente:ItemComponenteUnitarioModel){
   
      // this.ItemComponente.itemComponente=itemComponente.itemComponente;
      // this.ItemComponente.nombreProducto=itemComponente.descripcionLocal;
      // this.ItemComponente.costoUnitarioSoles=itemComponente.costoUnitarioSoles;
      // this.ItemComponente.costoUnitarioDolares=itemComponente.costoUnitarioDolares;
      // this.ItemComponente.costoUnitario=itemComponente.costoUnitarioDolares / this.ItemComponente.cantidad;
      this.activeModal.close(itemComponente);
  }
}
