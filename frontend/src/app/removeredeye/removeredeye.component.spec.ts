import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveredeyeComponent } from './removeredeye.component';

describe('RemoveredeyeComponent', () => {
  let component: RemoveredeyeComponent;
  let fixture: ComponentFixture<RemoveredeyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveredeyeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveredeyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
