import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdoorTempComponent } from './outdoor-temp.component';

describe('OutdoorTempComponent', () => {
  let component: OutdoorTempComponent;
  let fixture: ComponentFixture<OutdoorTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutdoorTempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
