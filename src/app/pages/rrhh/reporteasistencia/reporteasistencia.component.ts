import { RRHHService } from '@data/services/backEnd/pages/rrhh.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reporteasistencia',
  templateUrl: './reporteasistencia.component.html',
  styleUrls: ['./reporteasistencia.component.css']
})
export class ReporteAsistenciaComponent implements OnInit {

  modalCargaReporte: any;
  listaAsistencia: any[] = [];

  fechaForm: Date;
  constructor(private modalService: NgbModal, private _RRHHService: RRHHService, private _toastrService: ToastrService) {}

  ngOnInit(): void {
    var fecha = (<HTMLInputElement>document.getElementById("FechaReporte"))
    var today = new Date();

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+ this.zeroFill(today.getDate(),2);
    fecha.value = date;
  } 

  zeroFill( number, width )
  {
    width -= number.toString().length;
    if ( width > 0 )
    {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ""; // siempre devuelve tipo cadena
  }
  openVerticallyCentered(modal: NgbModal) {
		this.modalCargaReporte = this.modalService.open(modal, { centered: true, backdrop: 'static' });
	}

  base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }
  downloadFile(b64encodedString: string, name: string) {
    if (b64encodedString) {
      var blob = this.base64ToBlob(b64encodedString, 'text/plain');
      saveAs(blob, name);
    }
  }

  GenerarReporte(modal: NgbModal){
    var fecha = (<HTMLInputElement>document.getElementById("FechaReporte")).value;
    
    const body = {
      FechaReporte: fecha
    }
    this.openVerticallyCentered(modal);
    var base64 = "";
    this._RRHHService.GenerarReporte(body).subscribe( resp => {
      base64 = resp['content']
      this.downloadFile(base64, "ReporteDiario_" + fecha.toString() + ".xls");
      this.modalCargaReporte.close();
    });

    console.log(body);
    
  }

  VistaPreviaAsistencia()
  {    

    if(this.fechaForm == undefined || this.fechaForm == null || !this.fechaForm )
    {
      this._toastrService.warning("La fecha no es válida", "Advertencia !!", {timeOut: 3000, closeButton: true, tapToDismiss: true, progressBar: true})
      return
    }

    this.listaAsistencia = []

    const fechaDate: Date = new Date(formatDate(this.fechaForm, 'MM-dd-yyyy', 'en-US'));
    
    this._RRHHService.ObtenerListaAsistencia(fechaDate).subscribe(
      asistencia => this.listaAsistencia = asistencia
    );
    
  }
}
