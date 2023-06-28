import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListlogComponent } from './listlog.component';

describe('ListlogComponent', () => {
  let component: ListlogComponent;
  let fixture: ComponentFixture<ListlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListlogComponent]
    });
    fixture = TestBed.createComponent(ListlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
