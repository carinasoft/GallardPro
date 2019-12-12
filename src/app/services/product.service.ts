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
import { Indent_API, Inventory_API, Casting_API, Chemical_API, Grade_API, Specification_API, Client_API, Product_API } from 'app/services/apiurls/indent.api';
import { RAW_MATERIAL } from 'app/services/apiurls/rawMaterial.api';
import { STOCK_UNIT } from 'app/services/apiurls/unitOfMeasurment.api';
import { PRODUCT_LIST } from 'app/services/apiurls/product.api';
import { GENERAL_API } from 'app/services/apiurls/general.api';
import { VENDOR_API } from 'app/services/apiurls/vendor.api';
import 'rxjs/add/operator/map'
import { Http } from '@angular/http';

@Injectable()
export class ProductService {

  constructor(private errorHandler: ErrorHandler,
            public _httpClient: HttpClient,
            public http:Http,
            public _http: HttpWrapperService,
            public _router: Router,
            ) {

  }

  public GetProductList():any {
    return this._http.get(config.apiUrl + Product_API.GET).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
  

  public ZeroProductList():any {
    return this._http.get(config.apiUrl + Product_API.GET1).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
  // public AddClient(model):any {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   console.log(model)
  //   return this._http.post(config.apiUrl + Client_API.ADD,model,{myHeaders}).pipe(map((res) => {
  //     const data: BaseResponse<any, any> = res;
  //     return data;
  //   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  // }

  // public ClientEdit(model):any{
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   return this._http.post(config.apiUrl + Client_API.EDIT,model,{myHeaders}).pipe(map((res) => {
  //     const data: BaseResponse<any, any> = res;
  //     return data;
  //   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  // }

  public DeleteProduct(row):any {
    let query = '?ProductId='+row;
    return this._http.delete(config.apiUrl + Product_API.DELETE+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  // public AddClientContact(model):any {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   console.log(model)
  //   return this._http.post(config.apiUrl + Client_API.ADDCONTACT,model,{myHeaders}).pipe(map((res) => {
  //     const data: BaseResponse<any, any> = res;
  //     return data;
  //   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  // }

  // public AddClientBank(model):any {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   console.log(model)
  //   return this._http.post(config.apiUrl + Client_API.ADDBANK,model,{myHeaders}).pipe(map((res) => {
  //     const data: BaseResponse<any, any> = res;
  //     return data;
  //   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  // }

  // public DisplayClient(id):any {

  //   let query = '?Id='+id;
  //   return this._http.get(config.apiUrl + Client_API.DISPLAY+ query,{}).pipe(map((res) => {
  //     const data: BaseResponse<any, any> = res;
  //     return data;
  //   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  // }

  public addWorkOrder(model): any {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    return this._http.post(config.apiUrl + Product_API.ADDWORKORDER,model,{myHeaders}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
  

  WorkOrderApprovedList(id):any {

    let query = '?WOID='+id;
    return this._http.get(config.apiUrl + Product_API.DISPLAYWorkOrderApproved+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }


  WorkOrderDetailList(id):any {

      let query = '?WOID='+id;
      return this._http.get(config.apiUrl + Product_API.DISPLAYWorkOrder+ query,{}).pipe(map((res) => {
        const data: BaseResponse<any, any> = res;
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    EditWorkOder(model): any {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      return this._http.post(config.apiUrl + Product_API.EDITWORKORDER,model,{myHeaders}).pipe(map((res) => {
        const data: BaseResponse<any, any> = res;
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    DeleteWORK(row):any {
     
      let query = '?WOID='+row.WOID+'&SNO='+row.SNO;
      return this._http.delete(config.apiUrl + Product_API.DELETEWORK+ query,{}).pipe(map((res) => {
        const data: BaseResponse<any, any> = res;
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    MouldNoList(row):any {
      let query = '?SNo='+row.SNO+'&ProductId='+row.ProductId;
      return this._http.get(config.apiUrl + Product_API.MouldNoList+ query,{}).pipe(map((res) => {
        const data: BaseResponse<any, any> = res;
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    getPlannedHistory(row):any {
     //212@@##?WOID=3&ProductId=66
      let query = '?SNo='+row.SNO+'&ProductId='+row.ProductId;
      return this._http.get(config.apiUrl + Product_API.PlannedHistory+ query,{}).pipe(map((res) => {
        const data: BaseResponse<any, any> = res;
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }
    

    getMouldHistory(row):any {
      //212@@##?WOID=3&ProductId=66
       let query = '?SNo='+row.SNO+'&ProductId='+row.ProductId;
       return this._http.get(config.apiUrl + Product_API.MouldHistory+ query,{}).pipe(map((res) => {
         const data: BaseResponse<any, any> = res;
         return data;
       }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
     }

     getRejectedHistory(row):any {
      //212@@##?WOID=3&ProductId=66
       let query = '?SNo='+row.SNO+'&ProductId='+row.ProductId;
       return this._http.get(config.apiUrl + Product_API.RejectedHistory+ query,{}).pipe(map((res) => {
         const data: BaseResponse<any, any> = res;
         return data;
       }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
     }

}
