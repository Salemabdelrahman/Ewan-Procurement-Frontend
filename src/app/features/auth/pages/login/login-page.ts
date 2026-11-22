import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type LoginLanguage = 'ar' | 'en';
type LoginField = 'userName' | 'password';

interface LoginCopy {
  systemName: string;
  introduction: string;
  title: string;
  userName: string;
  password: string;
  rememberMe: string;
  showPassword: string;
  hidePassword: string;
  switchLanguage: string;
  required: string;
  serviceUnavailable: string;
}

const LOGIN_COPY: Record<LoginLanguage, LoginCopy> = {
  ar: {
    systemName: 'Ewan ERP',
    introduction: 'أدخل بيانات حسابك للمتابعة',
    title: 'تسجيل الدخول',
    userName: 'اسم المستخدم',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    switchLanguage: 'English',
    required: 'هذا الحقل مطلوب',
    serviceUnavailable: 'النموذج جاهز، لكن تسجيل الدخول غير متصل بخادم بعد.',
  },
  en: {
    systemName: 'Ewan ERP',
    introduction: 'Enter your account details to continue',
    title: 'Sign in',
    userName: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    switchLanguage: 'العربية',
    required: 'This field is required',
    serviceUnavailable: 'The form is ready, but no sign-in service is connected yet.',
  },
};

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.scss',
  templateUrl: './login-page.html',
})
export class LoginPage {
  readonly form = new FormGroup({
    userName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  protected readonly language = signal<LoginLanguage>('ar');
  protected readonly copy = computed(() => LOGIN_COPY[this.language()]);
  protected readonly showPassword = signal(false);
  protected readonly submitted = signal(false);
  protected readonly showServiceUnavailable = signal(false);

  protected toggleLanguage(): void {
    this.language.update((language) => (language === 'ar' ? 'en' : 'ar'));
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected clearServiceNotice(): void {
    this.showServiceUnavailable.set(false);
  }

  protected isInvalid(field: LoginField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.showServiceUnavailable.set(false);

    if (this.form.invalid) {
      return;
    }

    this.showServiceUnavailable.set(true);
  }
}
