import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeocoderComponent } from './geocoder.component';

describe('GeocoderComponent', () => {
  let component: GeocoderComponent;
  let fixture: ComponentFixture<GeocoderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeocoderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeocoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
