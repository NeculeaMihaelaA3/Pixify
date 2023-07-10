import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovenoiseComponent } from './removenoise.component';

describe('RemovenoiseComponent', () => {
  let component: RemovenoiseComponent;
  let fixture: ComponentFixture<RemovenoiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemovenoiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemovenoiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
