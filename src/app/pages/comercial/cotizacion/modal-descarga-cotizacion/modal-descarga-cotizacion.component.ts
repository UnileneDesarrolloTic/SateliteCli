import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-descarga-cotizacion',
  templateUrl: './modal-descarga-cotizacion.component.html',
  styleUrls: ['./modal-descarga-cotizacion.component.css']
})
export class ModalDescargaCotizacionComponent implements OnInit {

  form:FormGroup;
  @Input() fromParent;
  ListaDescarga:object[]=[];
  Items:any;
  Quitamodal:any;
  constructor(public _modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private fb:FormBuilder,
              private _cotizacionService: CotizacionService,
              private toastr: ToastrService
            ) {
              this.form=this.fb.group({})
    }
    

  ngOnInit(): void {
    this.ListarFormatosDescarga();
  }

  ListarFormatosDescarga(){
      this._cotizacionService.FormatoDescarga(this.fromParent.numeroDocumento).subscribe(
        (resp:any)=>{
          // console.log(resp);
          this.ListaDescarga=resp
        }
      )
  }

  GenerarCotizacion(modal: NgbModal,itemcotizacion){
      this.Quitamodal = this._modalService.open(modal, {
              centered: true,
              backdrop: 'static',
              size: 'sm',
              scrollable: true
            });
        
      this._cotizacionService.ObtenerReporte(itemcotizacion.codigo).subscribe(
          (resp:any)=>{
            this.file(resp.content)
            
          },
          error=>{this.toastr.info(error)
                  this.Quitamodal.close()}
      );


  }

  base64ToUint8Array(string) { 
    var raw = atob(string); 
    var rawLength = raw.length; 
    var array = new Uint8Array(new ArrayBuffer(rawLength)); 
    for (var i = 0; i < rawLength; i += 1) { 
    array[i] = raw.charCodeAt(i); 
    } 
    return array; 
  } 

 URL = window.URL || window.webkitURL;

  file(helloWorldExcelContent){
    const fileBlob = new Blob(
      [this.base64ToUint8Array(helloWorldExcelContent)],
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    );
    var objectURL = URL.createObjectURL(fileBlob);
    
    const exportLinkElement = document.createElement('a');

    exportLinkElement.hidden = true;
    exportLinkElement.download = "Cotizacion "+this.fromParent.numeroDocumento+".xlsx";
    exportLinkElement.href = objectURL;
    exportLinkElement.text = "downloading...";

    document.body.appendChild(exportLinkElement);
    exportLinkElement.click();

    URL.revokeObjectURL(objectURL);

    exportLinkElement.remove();
    this.Quitamodal.close();
};


  


  Editar(itemcotizacion){
    this._cotizacionService.ObtenerDatosReporte(itemcotizacion.codigo).subscribe(
      resp=>{
        const formato={
           idformato:itemcotizacion.idFormato,
           Codigo:itemcotizacion.codigo,
           nombreFormato:itemcotizacion.formato,
           numeroDocumento:this.fromParent.numeroDocumento,
           bodyCotizacion:resp
        }
        this.activeModal.close( formato ); 
      },
      error=>{
        this.toastr.info("Error con el formato de cotizacion");
      }
   )
  }

  


}
