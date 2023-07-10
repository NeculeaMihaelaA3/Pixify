import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelplotComponent } from './pixelplot.component';

describe('PixelplotComponent', () => {
  let component: PixelplotComponent;
  let fixture: ComponentFixture<PixelplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixelplotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixelplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
