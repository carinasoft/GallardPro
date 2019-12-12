import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
// import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { LOGIN_API } from './apiurls/login.api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "environments/environment";
import { BaseResponse } from "app/models/api-models/BaseResponse";
import { ErrorHandler } from "app/services/catchManager/catchmanger";
import { LoginWithPassword } from "app/models/interfaces/login.interface";

@Injectable()
export class AuthenticationService {

  constructor(private errorHandler: ErrorHandler,
            public _httpClient: HttpClient,
            public _http: HttpWrapperService,
            public _router: Router,
            ) {

  }

  public LoginWithPassword(model: LoginWithPassword): Observable<BaseResponse<any, any>> {
    return this._http.post(config.apiUrl + LOGIN_API.LOGIN_WITH_USERNAME, model).pipe(map((res) => {
      let data: BaseResponse<any, any> = res;
      data.request = model;
      // console.log(data);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
  }

}
