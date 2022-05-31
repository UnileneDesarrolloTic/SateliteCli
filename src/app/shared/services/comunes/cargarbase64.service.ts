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
}
