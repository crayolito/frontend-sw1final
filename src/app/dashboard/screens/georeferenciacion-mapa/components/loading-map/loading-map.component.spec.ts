import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingMapComponent } from './loading-map.component';

describe('LoadingMapComponent', () => {
  let component: LoadingMapComponent;
  let fixture: ComponentFixture<LoadingMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
