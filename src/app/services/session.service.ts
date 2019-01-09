import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { AlertModalService } from '@app/services/alert-modal.service';
import { HttpResponse } from '@app/utils/web/models/HttpResponse';
import { Constants } from '@app/app.constants';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timerSubscription: Subscription;
  private resetOnTrigger: boolean = false;
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private _http: HttpClient, private alertModal: AlertModalService, private router: Router) {}

  public startTimer(duration?: number) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    const timeOut = duration || Constants.SESSION_TTL;
    if (timeOut > Constants.SESSION_RENEW_COUNTDOWN) {
      this.timerSubscription = timer((timeOut - Constants.SESSION_RENEW_COUNTDOWN) * 1000).subscribe(n => {
        this.timerComplete();
      });
    } else {
      // this.showSessionCountdownModal(timeOut);
    }
  }

  public stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  public resetTimer() {
    this.startTimer();
  }

  private timerComplete() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    // this.showSessionCountdownModal(Constants.SESSION_RENEW_COUNTDOWN);
    if (this.resetOnTrigger) {
      this.startTimer();
    }
  }

  private showSessionCountdownModal(dismissDuration: number) {
    this.alertModal.sessionTTLCountModal(dismissDuration).then(result => {
      if (result.value) {
        this.renewSession().subscribe(
          res => {
            if (res && res.success && res['data']) {
              localStorage.setItem(Constants.USER_KEY, JSON.stringify(res['data']));
              this.startTimer();
            }
          },
          err => {
            const userKey = JSON.parse(localStorage.getItem(Constants.USER_KEY));
            this.stopTimer();
            localStorage.removeItem(Constants.USER_KEY);
            localStorage.removeItem(Constants.TOKEN_KEY);
            this.router.navigate(['/login']);
          }
        );
      } else {
        const userKey = JSON.parse(localStorage.getItem(Constants.USER_KEY));
        this.stopTimer();
        localStorage.removeItem(Constants.USER_KEY);
        localStorage.removeItem(Constants.TOKEN_KEY);
        this.router.navigate(['/login']);
        this.setSessionFree(userKey['userID']);
      }
    });
  }

  public renewSession(): Observable<any> {
    const userKey = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const sessionUpdateUrl = `${Constants.apiHost}${Constants.apiPrefix}user/${userKey['userID']}/session`;
    return this._http.put(sessionUpdateUrl, {}, { headers: this.headers }).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  public setSessionFree(userId: any): Observable<any> {
    const sessionUpdateUrl = `${Constants.apiHost}${Constants.apiPrefix}user/${userId}/session`;
    return this._http.put(sessionUpdateUrl, { state: false }, { headers: this.headers }).pipe(
      map((response: HttpResponse) => {
        return response;
      })
    );
  }

  public getSessionExpirationDate(): Date {
    const userData = JSON.parse(localStorage.getItem(Constants.USER_KEY)) || null;
    if (!userData || !userData['sessionOcuppied'] || !userData['sessionStartTime']) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(Number(userData['sessionStartTime']) + Constants.SESSION_TTL);
    return date;
  }

  public isSessionExpired(): boolean {
    const date = this.getSessionExpirationDate();
    if (!date || date === null || date === undefined) {
      return true;
    }

    return !(date.valueOf() > new Date().valueOf());
  }

  public getSessionTimeLeft(): number {
    const date = this.getSessionExpirationDate();
    if (!date || date === undefined || date.valueOf() < new Date().valueOf()) {
      return null;
    }

    return Math.floor((date.valueOf() - new Date().valueOf()) / 1000) || 1;
  }
}
