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
import { RequestOptions, RequestOptionsArgs } from '@angular/http';
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }


const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    
  ];

@Component({
    selector     : 'approved-item',
    templateUrl  : './approved-item.component.html',
    styleUrls    : ['./approved-item.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    
  
})
export class ApprovedItemComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    CheckProductHave:any;
    public pageType: string;
    filteredOptions: Observable<[]>[] = [];
    public indentForm: FormGroup;
    public DetailList=[];
    
    
    
    displayedColumns: string[] = ['id', 'progress','name','name1','name2', 'name4','name6','name7','name9','name8'];
   
    private _unsubscribeAll: Subject<any>;
   




    constructor(
        public dialogRef: MatDialogRef<ApprovedItemComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _castingService: CastingService,
        private _productSevcie : ProductService,
        private httpService: HttpClient
    ) {
        
       
        this._unsubscribeAll = new Subject();
    }

    public ngOnInit(): void {
     
      this.WorkOrderDetailList(this.data.id);
     
    }

    


   

    WorkOrderDetailList(id){
        this._productSevcie.WorkOrderApprovedList(id).subscribe((a:any) => {
            if(a && a.Body && a.Body.length){
                this.DetailList = a.Body;
                
            } 
            this.DetailList.map(row => {      
                row.isEditable = false;        
              }); 
              console.log(this.DetailList) 
      })  
    }


}

