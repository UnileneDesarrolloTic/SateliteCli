import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmpleadorComponent } from './modal-empleador.component';

describe('ModalEmpleadorComponent', () => {
  let component: ModalEmpleadorComponent;
  let fixture: ComponentFixture<ModalEmpleadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEmpleadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEmpleadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
