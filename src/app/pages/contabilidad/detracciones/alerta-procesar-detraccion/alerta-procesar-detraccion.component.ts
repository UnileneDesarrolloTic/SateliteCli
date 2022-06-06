import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContabilidadService } from '@data/services/backEnd/pages/contabilidad.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alerta-procesar-detraccion',
  templateUrl: './alerta-procesar-detraccion.component.html',
  styleUrls: ['./alerta-procesar-detraccion.component.css']
})
export class AlertaProcesarDetraccionComponent implements OnInit {

 
  form:FormGroup;
  @Input() fromParent;
  ListaFormatos:object[]=[];
  Items:any;
  Quitamodal:any;
 
  constructor(private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private _ContabilidadService:ContabilidadService,
              private fb:FormBuilder,
              private toastr: ToastrService
            ) {

              this.form = this.fb.group({
                periodo : ['',[Validators.required,Validators.maxLength(6)]],
              })
             
    }

  ngOnInit(): void {
    
  }

 

  
  save(modalGeneracion) {
    
        const ConstDetraccion={
          periodo:this.form.controls.periodo.value,
          proceso:this.fromParent.detalle,
          totalimporte: this.fromParent.totalimporte
        }
        
       this.ModalCarga(modalGeneracion,ConstDetraccion)
    }
    
    ModalCarga(modal: NgbModal,ConstDetraccion){
      this.Quitamodal = this.modalService.open(modal, {
              centered: true,
              backdrop: 'static',
              size: 'sm',
              scrollable: true
            });
        this.GenerarTextDetraccion(ConstDetraccion)
    }


  GenerarTextDetraccion(JsonDetraccion:any,){
      this._ContabilidadService.GenerarBlogProcesoDetraccion(JsonDetraccion).subscribe( resp => {
          this.file(resp,JsonDetraccion.periodo);
          this.toastr.success("Se ha procesado correctamente");
      },
      error=> {this.toastr.info("Comuniquese con el administrador de TI");
              this.activeModal.close();
              this.Quitamodal.close()
      });
      
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

  file(helloWorldExcelContent,periodo){
    const fileBlob = new Blob(
      [this.base64ToUint8Array(helloWorldExcelContent)],
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    );
    var objectURL = URL.createObjectURL(fileBlob);
    
    const exportLinkElement = document.createElement('a');

    exportLinkElement.hidden = true;
    exportLinkElement.download = "D20197705249"+".txt";
    exportLinkElement.href = objectURL;
    exportLinkElement.text = "downloading...";

    document.body.appendChild(exportLinkElement);
    exportLinkElement.click();

    URL.revokeObjectURL(objectURL);

    exportLinkElement.remove();
    this.activeModal.close();
    this.Quitamodal.close();
};


}
