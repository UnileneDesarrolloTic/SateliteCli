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


@NgModule({
  declarations:
  [
    DetraccionesComponent,
    AlertaProcesarDetraccionComponent
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
