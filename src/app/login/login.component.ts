import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { USER_KEY } from '@app/services/authentication.service';

import { environment } from '@env/environment';
import { Logger, I18nService } from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;
  submitted = false;
  errormsg: boolean = false;
  passworderrormsg: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (user && !this.authenticationService.isTokenExpired()) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  login() {
    this.errormsg = false;
    this.passworderrormsg = false;
    this.isLoading = true;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService
      .login(this.loginForm.value['email'], this.loginForm.value['password'])
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        result => {
          console.log('success', result);
          if (result.data.user.userID) {
            localStorage.setItem('id', result.data.user.userID);
          }
          this.route.queryParams.subscribe(params => this.router.navigate(['/dashboard'], { replaceUrl: true }));
        },
        error => {
          log.debug(`Login error: ${error}`);
          if (error && error.error['message']) {
            if (error.error['message'] == 'User does not exists.') {
              this.errormsg = true;
            }
            if (error.error['message'] == 'Password is incorrect.') {
              this.passworderrormsg = true;
            }
            this.error = error.error['message'];
          } else {
            console.log(error);
          }
        }
      );
  }

  get f() {
    return this.loginForm.controls;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }

  falseMsg() {
    this.passworderrormsg = false;
    this.errormsg = false;
  }
}
