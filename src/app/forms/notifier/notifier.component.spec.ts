import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifierComponent } from './notifier.component';

describe('NotifierComponent', () => {
  let component: NotifierComponent;
  let fixture: ComponentFixture<NotifierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotifierComponent]
    });
    fixture = TestBed.createComponent(NotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
