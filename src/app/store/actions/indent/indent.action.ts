import { map, switchMap } from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IndentService } from "app/services/indent.service";
import { ToasterService } from "app/services/toaster.service";
import { State } from "app/store";
import { CustomActions } from "app/store/customActions";
import { INDENT_ACTION } from "app/store/actions/indent/indent.const";
import { BaseResponse } from "app/models/api-models/BaseResponse";

@Injectable()
export class IndentPurchaseActions {
  constructor(private action$: Actions,
    // private _toasty: ToasterService,
    private store: Store<State>,
    private _indentService: IndentService) {
  }

  public GetIndentList(): CustomActions {
    return {
      type: INDENT_ACTION.GET_INDENT_LIST,
      payload: ''
    };
  }

  public GetIndentListResponse(response): CustomActions {
    return {
      type: INDENT_ACTION.GET_INDENT_LIST_RESPONSE,
      payload: response
    };
  }

  private validateResponse<TResponse, TRequest>(response: BaseResponse<TResponse, TRequest>, successAction: CustomActions, showToast: boolean = false, errorAction: CustomActions = { type: 'EmptyAction' }): CustomActions {
    if (response.status === 'error') {
      if (showToast) {
        // this._toasty.errorToast(response.message);
      }
      return errorAction;
    }
    return successAction;
  }
}
