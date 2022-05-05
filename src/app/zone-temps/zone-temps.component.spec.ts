import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneTempsComponent } from './zone-temps.component';

describe('ZoneTempsComponent', () => {
  let component: ZoneTempsComponent;
  let fixture: ComponentFixture<ZoneTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneTempsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
