import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class FileService 
  {
    
    descargarArchivo(response: any, fileName:string): void
    {
        const formato = response.type;
        const binaryData = [];
        binaryData.push(response);

        const data = window.URL.createObjectURL( new Blob(binaryData, {type: formato}));
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

  }