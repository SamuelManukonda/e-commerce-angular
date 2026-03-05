import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderActionsComponent } from './header-actions.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HeaderActionsComponent', () => {
  let component: HeaderActionsComponent;
  let fixture: ComponentFixture<HeaderActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderActionsComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template Rendering', () => {
    it('should render Login button', () => {
      const loginBtn = fixture.debugElement.query(By.css('.btn-outline-primary'));
      expect(loginBtn).toBeTruthy();
      expect(loginBtn?.nativeElement.textContent).toContain('Login');
    });

    it('should render Sign Up button', () => {
      const signupBtn = fixture.debugElement.queryAll(By.css('.btn-primary'))[0];
      expect(signupBtn).toBeTruthy();
      expect(signupBtn?.nativeElement.textContent).toContain('Sign Up');
    });

    it('should render Favourites button', () => {
      const favBtn = fixture.debugElement.query(By.css('.btn-secondary'));
      expect(favBtn).toBeTruthy();
      expect(favBtn?.nativeElement.textContent).toContain('Favourites');
    });

    it('should render heart icon in Favourites button', () => {
      const span = fixture.debugElement.query(By.css('.btn-secondary span'));
      expect(span?.nativeElement.textContent).toContain('❤');
    });

    it('should have proper Bootstrap classes', () => {
      const container = fixture.debugElement.query(By.css('.d-flex'));
      expect(container?.nativeElement.classList.contains('align-items-center')).toBe(true);
      expect(container?.nativeElement.classList.contains('gap-2')).toBe(true);
    });
  });
});