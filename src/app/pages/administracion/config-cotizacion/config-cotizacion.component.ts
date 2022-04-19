import { Component, OnInit } from '@angular/core';
import { CotizacionService } from '@data/services/backEnd/pages/cotizacion.service';

@Component({
  selector: 'app-config-cotizacion',
  templateUrl: './config-cotizacion.component.html',
  styleUrls: ['./config-cotizacion.component.css']
})
export class ConfigCotizacionComponent implements OnInit {

  constructor(
    private _CotizacionService:CotizacionService
  ) { }

  ngOnInit(): void {
    this.ListarFormatoCotizaciones();
  }

  ListarFormatoCotizaciones(){
    this._CotizacionService.ListarFormatoCotizaciones().subscribe(resp => {
      console.log(resp);
    });
  }



}
