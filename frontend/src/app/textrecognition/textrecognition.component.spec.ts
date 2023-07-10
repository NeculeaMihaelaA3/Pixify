import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextrecognitionComponent } from './textrecognition.component';

describe('TextrecognitionComponent', () => {
  let component: TextrecognitionComponent;
  let fixture: ComponentFixture<TextrecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextrecognitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextrecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
