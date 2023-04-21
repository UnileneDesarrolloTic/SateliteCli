import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarioCabeceraSeguimiento } from '@data/interface/Response/DatosFormatoCabeceraCalendarioSeguimiento.interfaces';
import { CalendarioDetalleSeguimiento } from '@data/interface/Response/DatosFormatoDetalleCalendarioSeguimientoOC.interface';
import { ProduccionService } from '@data/services/backEnd/pages/produccion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { ModalInformacionItemComponent } from '../modal-informacion-item/modal-informacion-item.component';

@Component({
  selector: 'app-tag-resumen',
  templateUrl: './tag-resumen.component.html',
  styleUrls: ['./tag-resumen.component.css']
})
export class TagResumenComponent implements OnInit {
  @Input() ListarSeguimientoItemOC:CalendarioCabeceraSeguimiento[]=[];
  @Input() ListarDetalleSeguimientoItemOC:CalendarioDetalleSeguimiento[]=[];
  @Input() TempListarSeguimientoItemOC:CalendarioCabeceraSeguimiento[]=[];
  @Input() Anio:string;
  @Input() PermisoAcceso:boolean;
  @Output() ItemEventMinitabla = new EventEmitter<boolean>();

  ListadoOrdenCompra:FormGroup;
  
  textFilterCtrl = new FormControl('');
  constructor(private _modalService: NgbModal,
              private _fb:FormBuilder,) { }

  ngOnInit(): void {
    this.TempListarSeguimientoItemOC=this.ListarSeguimientoItemOC;
    this.instanciarObservadoresFilter();
  }


  AbrirModalItem(item){
    const modalRef = this._modalService.open(ModalInformacionItemComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'dark-modal',
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });

    const datoEntrada={
      item:item,
      Anio:this.Anio,
      Permiso:this.PermisoAcceso
    }
    
    modalRef.componentInstance.fromParent = datoEntrada;
    modalRef.result.then((result) => {
      this.SalirModalMinitabla(result);
    }, (reason) => {
      
    });
  }

  SalirModalMinitabla(valor){
      this.textFilterCtrl.patchValue('');
      this.ItemEventMinitabla.emit(valor)
  }

  FiltrarOrdenCompra(itemCalendario,mes){
      return  this.ListarDetalleSeguimientoItemOC.filter((elemento:CalendarioDetalleSeguimiento)=> elemento.item == itemCalendario && elemento.fecha==mes )
  }

  instanciarObservadoresFilter(){

  this.textFilterCtrl.valueChanges.pipe( debounceTime(900) ).subscribe( valor => {
    this.filtroSeleccion();
  })
   
  }

  filtroSeleccion(){
    if(this.textFilterCtrl.value != '')
    {
      const texto = this.textFilterCtrl.value.toLowerCase();

      this.TempListarSeguimientoItemOC = this.ListarSeguimientoItemOC.filter( (x:CalendarioCabeceraSeguimiento) => x.item?.toLowerCase().indexOf(texto) !== -1
          || x.descripcion?.toLowerCase().indexOf(texto) !== -1
      );
    }else{
      this.TempListarSeguimientoItemOC = this.ListarSeguimientoItemOC;
    }
  }
 
}
