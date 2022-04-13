import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-documento-cotizacion',
  templateUrl: './modal-documento-cotizacion.component.html',
  styleUrls: ['./modal-documento-cotizacion.component.css']
})
export class ModalDocumentoCotizacionComponent implements OnInit {

  form:FormGroup;
  @Input() fromParent;
  ListaFormatos:object[]=[];
  Items:any;
 
  constructor(private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private fb:FormBuilder,
              private _cotizacionService: CotizacionService
            ) {
              this.form=this.fb.group({
                  SeleccionFormato:[null,[Validators.required]]
              })
    }

  ngOnInit(): void {
    this.Items=this.fromParent.items;
    // console.log(this.fromParent);
    this.ListarFormatoCotizacion(this.Items.codCliente);
  }

  ListarFormatoCotizacion(codClient) {
		this._cotizacionService.FormatoPorCliente(codClient).subscribe(
			(res: any) => {
				this.ListaFormatos = res;
				
			}
		)
	}

  save() {
      // filtramos el nombre del formato seleccionado
      let nombreformato:any = this.ListaFormatos.find((element:any)=> element.idFormato == this.form.controls.SeleccionFormato.value ? element.formato : '');
      
      const respuesta={
          seleccionado: this.form.controls.SeleccionFormato.value,
          numeroDocumento: this.Items.numeroDocumento,
          nombreFormato: nombreformato.formato
      } 
      this.activeModal.close( respuesta ); 
    }
}
