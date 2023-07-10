import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurrydetectionComponent } from './blurrydetection.component';

describe('BlurrydetectionComponent', () => {
  let component: BlurrydetectionComponent;
  let fixture: ComponentFixture<BlurrydetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlurrydetectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlurrydetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
