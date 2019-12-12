import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import {MatDialog} from '@angular/material';
import * as _ from 'lodash';
import {  of } from 'rxjs';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ClientService } from 'app/services/client.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {  HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';


export interface PeriodicElement {
    DateofHeat: string;
    Furnace: string;
    HeatCode: string;
    HeatType: string;
    Grade: string;
    StartTime: string;
    PowerReadingS: string;
    PowerReadingE: string; }

    const ELEMENT_DATA: PeriodicElement[] = [
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},
        {DateofHeat: '11/05/2019', Furnace: '500', HeatCode: '0001', HeatType: 'HMS',Grade: 'IS 1030 340-570', StartTime: '13:00', PowerReadingS: '1.00', PowerReadingE: '2.000'},

      
      ];

@Component({
    selector     : 'HeatFinish',
    templateUrl  : './HeatFinish.component.html',
    styleUrls    : ['./HeatFinish.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class HeatFinishComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource = ELEMENT_DATA;
   displayedColumns = ['sno','Date of Heat', 'Furnace', 'Heat Code', 'Heat Type', 'Grade','Start Time','Power Reading (Start)','Power Reading (End)','view','action'];
   
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
   
    serachData= [];
   
    final=[];
    // Private
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    createOrderForm: FormGroup;
    imageData:any;
    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        

    }


   
    


    
    

   
    

   




}



