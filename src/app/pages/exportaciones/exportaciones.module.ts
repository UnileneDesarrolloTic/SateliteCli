import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExportacionesRoutes } from "./exportaciones.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ListarCotizacionComponent } from './Cotizacion/listar-cotizacion/listar-cotizacion.component';
import { FormularioCotizacionComponent } from './Cotizacion/formulario-cotizacion/formulario-cotizacion.component';


@NgModule({
  declarations:
  [ ListarCotizacionComponent, FormularioCotizacionComponent],
  imports:
  [
    RouterModule.forChild(ExportacionesRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgxDatatableModule,
  ],
  exports:
  [
    
  ],
})
export class ExportacionesModule { }
