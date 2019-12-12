import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, Inject, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { IndentService } from "app/services/indent.service";
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { CastingService } from 'app/services/casting.service';
import { ProductService } from 'app/services/product.service';
import { map, startWith } from 'rxjs/operators';
import {  HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RequestOptions, RequestOptionsArgs, Http } from '@angular/http';
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import { ClientService } from 'app/services/client.service';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
    selector     : 'Dialog',
    templateUrl  : './Dialog.component.html',
    styleUrls    : ['./Dialog.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})




export class DialogComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    formVar: FormGroup;




    constructor(
      public dialogRef: MatDialogRef<DialogComponent>,private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: DialogData, public http:Http,
      private _toastr: ToasterService,
        
        private _clientService: ClientService,) {}

    public ngOnInit(): void {
     
      this.formVar = this.fb.group({
      
        password: ''
      });
    }

    onNoClick(): void {
      //this.dialogRef.close();
      const model = this.formVar.value;
      console.log("password",model)


     
           
    
    }

}

