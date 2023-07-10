import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeConvertorComponent } from './type-convertor.component';

describe('TypeConvertorComponent', () => {
  let component: TypeConvertorComponent;
  let fixture: ComponentFixture<TypeConvertorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeConvertorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeConvertorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
