import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html',
  styleUrls: ['./modal-pdf.component.css']
})
export class ModalPdfComponent implements OnInit {
  @Input() base:string;

  constructor(public activeModal: NgbActiveModal,
              public sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {
      this.cleanURL()
  }


   cleanURL(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,'+this.base);
  }
}
