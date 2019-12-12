import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap, map, switchMap } from 'rxjs/operators';

import * as RouterActions from 'app/store/actions/router.action';
import { Observable } from 'rxjs';
import { INDENT_ACTION } from 'app/store/actions/indent/indent.const';
import { CustomActions } from 'app/store/customActions';
import { Action } from '@ngrx/store';
import { IndentService } from 'app/services/indent.service';

@Injectable()
export class IndentEffects
{
   
    constructor(
        private actions$: Actions,
        private router: Router,
        private location: Location,
        private _indentService: IndentService 
    )
    {
    }

  @Effect() public GetIndentList$: Observable<Action> = this.actions$
    .ofType(INDENT_ACTION.GET_INDENT_LIST).pipe(
      switchMap((action: CustomActions) => {
        return this._indentService.GetIndent().pipe(
          map((res: any) => {
              debugger;
            if (res.status === 'success') {
            } else {
            //   this._toasty.clearAllToaster();
            //   this._toasty.errorToast(res.message);
            }
            return {type: 'EmptyAction'};
          }));
      }));

}
