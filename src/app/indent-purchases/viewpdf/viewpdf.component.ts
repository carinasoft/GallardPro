import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter, Input, OnChanges, Inject, Sanitizer } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IndentService } from 'app/services/indent.service';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Http, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';




@Component({
    selector     : 'viewpdf',
    templateUrl  : './viewpdf.component.html',
    styleUrls    : ['./viewpdf.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ViewpdfComponent implements OnInit {
  value:any;
  
    private _unsubscribeAll: Subject<any>;
    constructor(
      public dialogRef: MatDialogRef<ViewpdfComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        public http:Http,
        public sanitizer:Sanitizer
        
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        

    }

    /**
     * On init
     */
    ngOnInit(): void
    {

      _.map(this.data.a, (o) => {
        o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
        return o.OrderQuantity = o.Quantity;  
      });
      document.getElementById("myframe").setAttribute("src", ""+this.data.data);
    }


  



}
