import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GestionCalidadRoutes } from '@pages/gestion-calidad/gestion-calidad.routing';
import { SeguimientoLoteComponent } from '@pages/gestion-calidad/seguimiento-lote/seguimiento-lote.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VentasClientesComponent } from './ventas-clientes/ventas-clientes.component';
import { SsomaComponent } from './ssoma/ssoma.component';
import { RegistrarEditarComponent } from './ssoma/registrar-editar/registrar-editar.component';

@NgModule({
  declarations: [
    SeguimientoLoteComponent,
    VentasClientesComponent,
    SsomaComponent,
    RegistrarEditarComponent
  ],
  imports: [
    RouterModule.forChild(GestionCalidadRoutes),
    ReactiveFormsModule,
    CommonModule
  ]
})
export class GestionCalidadModule { }
