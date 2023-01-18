import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContabilidadRoutes } from "./contabilidad.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DetraccionesComponent } from './detracciones/detracciones.component';
import { AlertaProcesarDetraccionComponent } from './detracciones/alerta-procesar-detraccion/alerta-procesar-detraccion.component';
import { AnalisiscostosListaprecioComponent } from './analisiscostos-listaprecio/analisiscostos-listaprecio.component';
import { TagResumenComponent } from './analisiscostos-listaprecio/tag-resumen/tag-resumen.component';
import { ModalDetalleMateriaPrimaComponent } from './analisiscostos-listaprecio/modal-detalle-materia-prima/modal-detalle-materia-prima.component';
import { CierreContableComponent } from './cierre-contable/cierre-contable.component';
import { FormularioCierreContableComponent } from './cierre-contable/formulario-cierre-contable/formulario-cierre-contable.component';

@NgModule({
  declarations:
  [
    DetraccionesComponent,
    AlertaProcesarDetraccionComponent,
    AnalisiscostosListaprecioComponent,
    TagResumenComponent,
    ModalDetalleMateriaPrimaComponent,
    CierreContableComponent,
    FormularioCierreContableComponent,
  ],
  imports:
  [
    RouterModule.forChild(ContabilidadRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  exports:
  [
    DetraccionesComponent,
    AlertaProcesarDetraccionComponent
  ],
})
export class ContabilidadModule { }
