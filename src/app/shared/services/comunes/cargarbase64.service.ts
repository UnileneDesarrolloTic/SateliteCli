import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Cargarbase64Service {

  constructor() { }


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

  file(helloWorldExcelContent,NumeroFormato,formato,ModalCarga){
    ModalCarga.close();
    const fileBlob = new Blob(
      [this.base64ToUint8Array(helloWorldExcelContent)],
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    );
    var objectURL = URL.createObjectURL(fileBlob);
    
    const exportLinkElement = document.createElement('a');

    exportLinkElement.hidden = true;
    exportLinkElement.download = NumeroFormato+"."+formato;
    exportLinkElement.href = objectURL;
    exportLinkElement.text = "downloading...";
    document.body.appendChild(exportLinkElement);
    exportLinkElement.click();
    URL.revokeObjectURL(objectURL);
    
    exportLinkElement.remove();
    
  };

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}
}
