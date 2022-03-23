import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-agregar-cotizacion',
  templateUrl: './modal-agregar-cotizacion.component.html',
  styleUrls: ['./modal-agregar-cotizacion.component.css']
})
export class ModalAgregarCotizacionComponent implements OnInit {

  @Input() fromParent;
  ListaCotizacionFaltantes:Object[]=[];
  CabeceraDetalle:Object[]=[];
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.ListaCotizacionFaltantes=this.fromParent.ListaFaltante;
    this.CabeceraDetalle=this.fromParent.CabeceraDetalle;

   this.construirtablaFaltaCotizacion(this.ListaCotizacionFaltantes,this.CabeceraDetalle);
  }

    construirtablaFaltaCotizacion(ArrayListDetalleCotizacion,ArrayCabecera){
    
      var cabeceras = ArrayCabecera;
      var detalle = ArrayListDetalleCotizacion;
  
      var bodyt = document.getElementById("cbBobyFaltaCotizacion");
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      var trh = document.createElement("tr");
      table.setAttribute("class", "table table-striped no-wrap border table-responsive");
      table.setAttribute("style", "font-size: 12px")
      bodyt.appendChild(table);
  
      table.appendChild(thead);
      thead.appendChild(trh);
      cabeceras.forEach(element => {
        var th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.setAttribute("style", "vertical-align: middle");
        th.innerHTML = element.etiqueta;
        trh.appendChild(th);
      });
      //cabecera de opcion
      var th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.setAttribute("style", "vertical-align: middle");
      th.innerHTML = "Opcion";
      trh.appendChild(th);
  
      var tbody = document.createElement("tbody");
      tbody.setAttribute("id", "tbodyDetalle")
      table.appendChild(tbody);
      detalle.forEach((elementSup, index) => {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        for (let campo in elementSup) {
          var td = document.createElement("td");
          td.innerHTML = elementSup[campo];
          td.setAttribute("id", campo);
          td.setAttribute("contenteditable", "false");
          tr.appendChild(td);
        }
  
        var td = document.createElement('td');
        td.innerHTML = '<i class="far fa-share-square" style="font-size:15px;cursor:pointer"></i>';
        td.addEventListener("click", () => {
          let Seleccionado =  this.ListaCotizacionFaltantes.splice(index, 1);
          table.remove();
          this.activeModal.close( Seleccionado ); 
        })
        tr.appendChild(td);
      });
    
      }    
}