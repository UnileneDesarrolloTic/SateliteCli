import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
  constructor(private modalService: NgbModal,
              public activeModal: NgbActiveModal,
              private fb:FormBuilder,
              private _cotizacionService: CotizacionService
            ) {
              this.form=this.fb.group({})
    }


  ngOnInit(): void {
    this.ListarFormatosDescarga();
  }

  ListarFormatosDescarga(){
      this._cotizacionService.FormatoDescarga().subscribe(
        (resp:any)=>{
          this.ListaDescarga=resp
        }
      )
  }

  GenerarCotizacion(ItemDescarga){
    this.exportAsExcelFile([], 'persons')
  }

  Editar(Itemdescarga){
      console.log("Vamos a editar")
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    // this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }



}
