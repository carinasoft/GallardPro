import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { of } from 'rxjs';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ClientService } from 'app/services/client.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { PlanningService } from 'app/services/planning.service';

import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
    selector: 'Todaysplan',
    templateUrl: './Todaysplan.component.html',
    styleUrls: ['./Todaysplan.component.scss'],

    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('fadeInOut', [
            state('void', style({
                opacity: 0
            })),
            transition('void <=> *', animate(1000)),
        ]),
        trigger('EnterLeave', [
            state('flyIn', style({ transform: 'translateX(0)' })),
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.5s 300ms ease-in')
            ]),
            transition(':leave', [
                animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class TodaysplanComponent implements OnInit {
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource: any;
    displayedColumns = ['sno','WorkOrderNo','Mould No', 'Client Name',  'Product', 'Grade', 'Weight', 'No.of Pieces', 'Action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    listData: MatTableDataSource<any>;
    serachData = [];
    public todayPlanForm: FormGroup;
    final = [];
    contractorList: any
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    createOrderForm: FormGroup;
    imageData: any;
 
    date:any;
    id:any;
    Shift:any;
    loader:boolean;
 

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private _planningSevcie: PlanningService
    ) {

        this._unsubscribeAll = new Subject();
    }


    ngOnInit(): void {

        this.todayPlanForm = this.createTodayPlanForm();
        this.getContractorList();

    }

    createTodayPlanForm(): FormGroup {
        return this._formBuilder.group({

            PlanDate: new FormControl((new Date()).toISOString()),
            ContractorId: ['', [Validators.required]],
            Shift: ['', [Validators.required]],

        });

    }
    getContractorList() {

        this._planningSevcie.GetContractorList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.contractorList = a.Body;

            }
        });
    }

    onSearchChange(event){
        this.date = event;
        this.searchButton();
    }

    onSearchChange1(event){
        this.id = event;
        this.searchButton();

    }

    onSearchChange2(event){
        this.Shift = event;
        this.searchButton();
    }

    searchButton() {

         let json ={
            PlanDate:  moment(this.date).format('YYYY-MM-DD')?moment(this.date).format('YYYY-MM-DD'):(new Date()).toISOString(),
            ContractorId:this.id,
            Shift:this.Shift
         }
          console.log(json);
          if(json.PlanDate && json.ContractorId && json.Shift){
              this.loader=true;
             this._planningSevcie.SearchTodayPlanning(json).subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                console.log(a.Body)
                this.dataSource = a.Body
                this.serachData= a.Body
                this.listData = new MatTableDataSource(this.dataSource);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
              this.loader=false;
            }
            else {
                this._toastr.errorToast(a.Status)
                this.loader=false;
            }
        });
  
          }
        // const model = this.todayPlanForm.value;
        // this._planningSevcie.SearchTodayPlanning(model).subscribe((a: any) => {
        //     if (a && a.Status && a.Status.toLowerCase() === 'success') {
        //         console.log(a.Body)
        //         this.dataSource = a.Body
        //         this.serachData= a.Body
        //         this.listData = new MatTableDataSource(this.dataSource);
        //       this.listData.sort = this.sort;
        //       this.listData.paginator = this.paginator;
        //     }
        //     else {
        //         this._toastr.errorToast(a.Status)
        //     }
        // });

    }

    removeTodayPlan(data) {

        console.log(data)
        this._planningSevcie.deleteTodayPlanning(data).subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this.searchButton();
                this._toastr.successToast("Today's Plan Deleted SuccessFully")
            }
            else {
                this._toastr.errorToast(a.Status)
            }
        });
    }

    convert(){
        window.print();
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.serachData.filter((item) => item.ProductName.toLowerCase().includes(searchStr) || item.MouldNo.toLowerCase().includes(searchStr));
    }

}

