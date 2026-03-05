import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWishlistComponent } from './my-wishlist.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MyWishlistComponent', () => {
  let component: MyWishlistComponent;
  let fixture: ComponentFixture<MyWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWishlistComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
