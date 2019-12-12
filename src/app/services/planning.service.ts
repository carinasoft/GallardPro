import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import * as moment from 'moment';
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
import { Indent_API, Inventory_API, Planning_API } from 'app/services/apiurls/indent.api';
import { RAW_MATERIAL } from 'app/services/apiurls/rawMaterial.api';
import { STOCK_UNIT } from 'app/services/apiurls/unitOfMeasurment.api';
import { PRODUCT_LIST } from 'app/services/apiurls/product.api';
import { GENERAL_API } from 'app/services/apiurls/general.api';
import { VENDOR_API } from 'app/services/apiurls/vendor.api';
import 'rxjs/add/operator/map'
import { Http } from '@angular/http';


@Injectable()
export class PlanningService {

  constructor(private errorHandler: ErrorHandler,
            public _httpClient: HttpClient,
            public http:Http,
            public _http: HttpWrapperService,
            public _router: Router,
            
            ) {

  }
  public GetContractorList(): any {
   
    return this._http.get(config.apiUrl + Planning_API.GETContractor,+{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  public SearchPlanning(model): any {

    let query = '?PlanDate='+model.PlanDate+
    '&ContractorId='+model.ContractorId+
    '&ClientID='+model.ClientID+
    '&ProductId='+model.ProductId+
    '&Shift='+model.Shift;
//let query = '?PlanDate=2019-05-04&ContractorId=21&ClientID=20&ProductId=0&Shift=Day'
    return this._http.get(config.apiUrl +Planning_API.SearchPlanning+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
     
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  
  SubmitPlanning(model): any {
    let data1
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log( Planning_API.SUBMITPLAN,model,{myHeaders})
    return this._http.post(config.apiUrl + Planning_API.SUBMITPLAN,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
   
    // return this._http.post(config.apiUrl + Planning_API.SUBMITPLAN,model,{myHeaders}).subscribe(res => {
    //   const data: BaseResponse<any, any> = res;
    //   console.log("error",data);
    //   return data;
    // },
    // (error) => {
    //   console.log("error",error);
    // })
   
    // catchError((e) => this.ErrorHandlerService.handleError<any, any>(e, '')));
    //catchError((e) => this.ErrorHandlerService.handleError(e)));
      // }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
// this.errorService.handleError(error);

  SearchTodayPlanning(model): any {
     let query = '?PlanDate='+moment(model.PlanDate).format('YYYY-MM-DD')+
     '&ContractorId='+model.ContractorId+
     '&Shift='+model.Shift;
 //?PlanDate=2019-06-03&ContractorId=1&Shift=Day
     return this._http.get(config.apiUrl +Planning_API.SearchTodayPlanning+ query,{}).pipe(map((res) => {
       const data: BaseResponse<any, any> = res;
      
       return data;
     }), catchError((e) =>  this.errorHandler.HandleCatch<any, any>(e, '')));
   }

   deleteTodayPlanning(row):any {
     
    let query = '?ID='+row.ID+'&WODID='+row.WODID;
    return this._http.delete(config.apiUrl + Planning_API.DELETETODAYPLAN+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  SearchdayPlanning(model): any {
    
     let query = '?PlanDate='+moment(model.PlanDate).format('YYYY-MM-DD');
    
     
     return this._http.get(config.apiUrl +Planning_API.SearchdayPlanning+ query,{}).pipe(map((res) => {
       const data: BaseResponse<any, any> = res;
      
       return data;
     }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
   }

   SearchPendingMould(model):any{
    let query = '?PlanDate='+moment(model.PlanDate).format('YYYY-MM-DD');
    
     
     return this._http.get(config.apiUrl +Planning_API.SearchPendingMould+ query,{}).pipe(map((res) => {
       const data: BaseResponse<any, any> = res;
      
       return data;
     }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
   }

   planningReports(model): any {
    let query = '?DateFrom='+moment(model.PlanDate).format('YYYY-MM-DD')+
    '&DateTo='+moment(model.PlanDate1).format('YYYY-MM-DD')+
    '&ContractorId='+model.ContractorId+'&Status='+model.Shift;
//?PlanDate=2019-06-03&ContractorId=1&Shift=Day
    return this._http.get(config.apiUrl +Planning_API.planningReports+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
     
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  SearchMoulding(model): any {
    let query = '?PlanDate='+moment(model.PlanDate).format('YYYY-MM-DD')+
    '&ContractorId='+model.ContractorId+
    '&Shift='+model.Shift;
    return this._http.get(config.apiUrl +Planning_API.SearchMoulding+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
     
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  MovedToProduction(model): any {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log( config.apiUrl + Planning_API.MovedToProduction,model)
    return this._http.post(config.apiUrl + Planning_API.MovedToProduction,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  PlanMoveToNextDay(model):any{
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    return this._http.post(config.apiUrl + Planning_API.MovedToNextDay,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  RejectMouldsList(): any {
   
    return this._http.get(config.apiUrl + Planning_API.RejectMouldsList,+{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  Reject(model):any{
    let query = '?ID='+model.ID+'&WODID='+model.WODID+'&Reason='+model.Reason;
    ///api/PlanningApi/RejectMould?PlanId=1&WODID=1&Reason=This Mould is rejected
     
     return this._http.post(config.apiUrl +Planning_API.Reject+ query,{}).pipe(map((res) => {
       const data: BaseResponse<any, any> = res;
      
       return data;
     }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
   }


   RemoveMouldNoSearch(model): any {
     //http://localhost:1153//api/PlanningApi/RemoveMouldSearch?MouldDateFrom=&MouldDateTo=&MouldCode=A1234
    let query = '?MouldDateFrom='+model.MouldDateFrom +'&MouldDateTo='+model.MouldDateTo +'&MouldCode='+model.MouldCode
   
    return this._http.get(config.apiUrl +Planning_API.RemoveMouldNoSearch+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
     
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  MoveToPlanning(model): any {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    return this._http.post(config.apiUrl + Planning_API.MoveToPlanning,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

}
