import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraMPrimaComponent } from './compra-mprima.component';

describe('CompraMPrimaComponent', () => {
  let component: CompraMPrimaComponent;
  let fixture: ComponentFixture<CompraMPrimaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraMPrimaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraMPrimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
