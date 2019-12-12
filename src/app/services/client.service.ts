import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
// import { Configuration, URLS } from '../app.constants';
import { Router } from '@angular/router';
import { HttpWrapperService } from './httpWrapper.service';
import { LOGIN_API } from './apiurls/login.api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from 'environments/environment';
import { BaseResponse } from 'app/models/api-models/BaseResponse';
import { ErrorHandler } from 'app/services/catchManager/catchmanger';
import { LoginWithPassword } from 'app/models/interfaces/login.interface';
import { Indent_API, Inventory_API, Casting_API, Chemical_API, Grade_API, Specification_API, Client_API } from 'app/services/apiurls/indent.api';
import { RAW_MATERIAL } from 'app/services/apiurls/rawMaterial.api';
import { STOCK_UNIT } from 'app/services/apiurls/unitOfMeasurment.api';
import { PRODUCT_LIST } from 'app/services/apiurls/product.api';
import { GENERAL_API } from 'app/services/apiurls/general.api';
import { VENDOR_API } from 'app/services/apiurls/vendor.api';
import 'rxjs/add/operator/map'
import { Http } from '@angular/http';

@Injectable()
export class ClientService {

  constructor(private errorHandler: ErrorHandler,
            public _httpClient: HttpClient,
            public http:Http,
            public _http: HttpWrapperService,
            public _router: Router,
            ) {

  }



  EditClientType(model):any {
    
    let query = '?Id='+model.Id+'&ClientType='+model.ClientType
    
     return this._http.post(config.apiUrl + Client_API.EditClientType+query,{}).pipe(map((res) => {
       const data: BaseResponse<any, any> = res;
       return data;
     }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
   }


  DeleteClientType(model):any {
    
    let query = '?Id='+model
    
     return this._http.delete(config.apiUrl + Client_API.DeleteClientType+query,{}).pipe(map((res) => {
       const data: BaseResponse<any, any> = res;
       return data;
     }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
   }




  public AddClientType(model):any {
    
   let query = '?ClientType='+model.ClientType
   
    return this._http.post(config.apiUrl + Client_API.ADDClientType+query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  public GetClientType1():any {
    return this._http.get(config.apiUrl + Client_API.GETClientType1).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public GetClientType():any {
    return this._http.get(config.apiUrl + Client_API.GETClientType).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
 
  public GetClientList():any {
    return this._http.get(config.apiUrl + Client_API.GET).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
 
  public AddClient(model):any {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log(model)
    return this._http.post(config.apiUrl + Client_API.ADD,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public ClientEdit(model):any{
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    return this._http.post(config.apiUrl + Client_API.EDIT,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public DeleteClient(row):any {
    let query = '?Id='+row.Id;
    return this._http.delete(config.apiUrl + Client_API.DELETE+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public AddClientContact(model):any {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log(model)
    return this._http.post(config.apiUrl + Client_API.ADDCONTACT,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public AddClientBank(model):any {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log(model)
    return this._http.post(config.apiUrl + Client_API.ADDBANK,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public DisplayClient(id):any {

    let query = '?Id='+id;
    return this._http.get(config.apiUrl + Client_API.DISPLAY+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public GetApproveList():any{
    return this._http.get(config.apiUrl + Client_API.GETAPPROVELIST).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public GetApproved():any{
    return this._http.get(config.apiUrl + Client_API.GETAPPROVED).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public GetWorkOrderList():any {
    return this._http.get(config.apiUrl + Client_API.GETWORKORDER).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  public DeleteWorkOrder(row):any {
    console.log(row.rowdata.WOID)
     let query = '?WOID='+row.rowdata.WOID;
    // let query = '?WOID='+row.WOID;
    return this._http.delete(config.apiUrl + Client_API.DELETEWORKORDER+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  DeleteWorkOrderrRecordbyId(row):any {
    console.log(row.rowdata.WOID)
     let query = '?WOID='+row.rowdata.WOID+'&SNO='+row.rowdata.SNO;
    // //api/SecondModuleApi/DeleteWorkOrderRecordbyId?WOID=2&SNO=2
    return this._http.delete(config.apiUrl + Client_API.DeleteWorkOrderrRecordbyIdrow+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
}
