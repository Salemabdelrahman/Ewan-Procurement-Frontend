import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { App } from './app';
import { AuthLayout } from '@layouts/auth-layout/auth-layout';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should redirect the root route to the login page', async () => {
    const harness = await RouterTestingHarness.create();
    const layout = await harness.navigateByUrl('/', AuthLayout);

    expect(layout).toBeInstanceOf(AuthLayout);
    expect(harness.routeNativeElement?.textContent).toContain('تسجيل الدخول');
  });
});
