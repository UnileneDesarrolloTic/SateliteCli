import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class FileService 
  {
    
    descargarArchivo(response: any, fileName:string): void
    {
        const formatoArchivo = response.type;
        
        const binaryData = [];
        binaryData.push(response);

        const data = window.URL.createObjectURL( new Blob(binaryData, {type: formatoArchivo}));
        const link =  document.createElement('a');
        link.href = data;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        setTimeout(function () {  
            window.URL.revokeObjectURL(data); 
            link.remove(); 
        }, 200);
    }

    decargarExcel_Base64 (base64: string, nombreArchivo: string, formatoArchivo: string){

      const fileBlob = new Blob (
        [this.base64ToUint8Array(base64)],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      );

      const objectURL = URL.createObjectURL(fileBlob);
      const exportLinkElement = document.createElement('a');
  
      exportLinkElement.hidden = true;
      exportLinkElement.download = `${nombreArchivo}.${formatoArchivo}`;
      exportLinkElement.href = objectURL;
      exportLinkElement.text = "downloading...";
      
      document.body.appendChild(exportLinkElement);
      exportLinkElement.click();

      URL.revokeObjectURL(objectURL);
      exportLinkElement.remove();
    };

    base64ToUint8Array(string) 
    { 
      var raw = atob(string); 
      var rawLength = raw.length; 
      var array = new Uint8Array(new ArrayBuffer(rawLength)); 

      for (var i = 0; i < rawLength; i += 1) 
        array[i] = raw.charCodeAt(i); 
      
      return array; 
    } 
  

  }