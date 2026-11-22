import { TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
    }).compileComponents();
  });

  it('shows required-field errors when submitted empty', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#userName-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#password-error')).toBeTruthy();
  });

  it('does not claim to sign in when there is no backend', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    fixture.componentInstance.form.setValue({
      userName: 'employee',
      password: 'password',
      rememberMe: false,
    });

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'غير متصل بخادم',
    );
  });

  it('switches the login screen to English and left-to-right layout', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();

    const languageButton = fixture.nativeElement.querySelector(
      '.language-button',
    ) as HTMLButtonElement;
    languageButton.click();
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.login-card') as HTMLElement;
    expect(card.getAttribute('lang')).toBe('en');
    expect(card.getAttribute('dir')).toBe('ltr');
    expect(card.querySelector('h1')?.textContent).toContain('Sign in');
  });
});
