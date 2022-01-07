import { Component } from '@angular/core';

@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent  {
  subtitle: string;

  constructor() {

    //_authService.validarToken();
    this.subtitle = 'Página principal del aplicativo';

  }

}
