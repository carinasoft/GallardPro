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
import { Indent_API, Inventory_API, Casting_API, Chemical_API, Grade_API, Specification_API } from 'app/services/apiurls/indent.api';
import { RAW_MATERIAL } from 'app/services/apiurls/rawMaterial.api';
import { STOCK_UNIT } from 'app/services/apiurls/unitOfMeasurment.api';
import { PRODUCT_LIST } from 'app/services/apiurls/product.api';
import { GENERAL_API } from 'app/services/apiurls/general.api';
import { VENDOR_API } from 'app/services/apiurls/vendor.api';
import 'rxjs/add/operator/map'
import { Http } from '@angular/http';

@Injectable()
export class CastingService {

  constructor(private errorHandler: ErrorHandler,
            public _httpClient: HttpClient,
            public http:Http,
            public _http: HttpWrapperService,
            public _router: Router,
            ) {

  }

  public GetCasting(): any {
    return this._http.get(config.apiUrl + Casting_API.GET).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
  public AddCasting(model): any {
    return this._http.post(config.apiUrl + Casting_API.ADD+model,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
  public CastingEdit(row): any {
   let query = '?Id='+row.ID+'&Name='+row.Name;
    return this._http.post(config.apiUrl + Casting_API.EDIT+ query,{}).pipe(map((res) => { 
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }
  public DeleteCasting(row): any {
    let query = '?Id='+row.ID;
    return this._http.delete(config.apiUrl + Casting_API.DELETE+ query,{}).pipe(map((res) => {
      const data: BaseResponse<any, any> = res;
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));

    // return this._http.delete(config.apiUrl + Indent_API.DELETE.replace(':indentId', indentId)).pipe(map((res) => {
    //   const data: BaseResponse<any, any> = res;
   
    // }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
  }

  
//                             -----   Chemical API --------------------

public GetChemical(): any {
  return this._http.get(config.apiUrl + Chemical_API.GET).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}
public AddChemical(model): any {
  let query = '?Name='+model
  return this._http.post(config.apiUrl + Chemical_API.ADD+query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}
public ChemicalEdit(row): any {
 let query = '?Id='+row.ID+'&Name='+row.Name;
  return this._http.post(config.apiUrl + Chemical_API.EDIT+ query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;  
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}
public DeleteChemical(row): any {
  let query = '?Id='+row.ID;
  return this._http.delete(config.apiUrl + Chemical_API.DELETE+ query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}




//        -------------------------------   Grade API -------------------------------------

 public GetGrade(): any {
  return this._http.get(config.apiUrl + Grade_API.GET).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
} 
public GetGradeListByCastingId(Id): any {
  let query = '?CastingID='+Id;
   return this._http.get(config.apiUrl + Grade_API.LISTBYID+ query,{}).pipe(map((res) => {
     const data: BaseResponse<any, any> = res;  
     return data;
   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
 }
public addGrade(model): any {
  let query = '?GradeName='+model.grade+'&CastingId='+model.casting;
  return this._http.post(config.apiUrl + Grade_API.ADD+query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}
public GradeEdit(row): any {
  //?Name=IS 276- Grade III&Id=5
   //{ID: 9, CastingID: 1, GradeName: "demoEdit", CastingName: "Alloy Steel", isEditable: false}
  let query = '?Name='+row.GradeName+'&Id='+row.ID;
   return this._http.post(config.apiUrl + Grade_API.EDIT+ query,{}).pipe(map((res) => {
     const data: BaseResponse<any, any> = res;  
     return data;
   }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
 }
public DeleteGrade(row): any {
  let query = '?Id='+row.ID;
  return this._http.delete(config.apiUrl + Grade_API.DELETE+ query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}

public getMechanicalList(id): any {

  let query = '?GradeID='+id;
  return this._http.get(config.apiUrl + Specification_API.GET11+ query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
} 

public getSpecificationlistbygradeid(id): any {

  let query = '?GradeID='+id;
  return this._http.get(config.apiUrl + Specification_API.GET1+ query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
} 

public addSpecification(model): any {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  return this._http.post(config.apiUrl + Specification_API.ADD,model,{myHeaders}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}

public EditSpecification(row):any {
 
let query = '?Id='+row.Id +'&MinValue='+row.MinValue+'&MaxValue='+row.MaxValue;
return this._http.post(config.apiUrl + Specification_API.EDIT+ query,{}).pipe(map((res) => {
  const data: BaseResponse<any, any> = res;
  return data;
}), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));

}

public DeleteSpecification(row):any{
  let query = '?Id='+row.Id;
  return this._http.delete(config.apiUrl + Specification_API.DELETE+ query,{}).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
}

public GetmechamicalList(): any {
  return this._http.get(config.apiUrl + Specification_API.GETMECHANICAL).pipe(map((res) => {
    const data: BaseResponse<any, any> = res;
    return data;
  }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
} 
}
