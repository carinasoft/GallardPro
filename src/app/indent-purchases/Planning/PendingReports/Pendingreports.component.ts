import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef,MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';

import {MatDialog} from '@angular/material';
import * as _ from 'lodash';
import {  of } from 'rxjs';
import * as moment from 'moment';



import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {  HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { PlanningService } from 'app/services/planning.service';
import { ToasterService } from 'app/services/toaster.service';



    

@Component({
    selector     : 'Pendingreports',
    templateUrl  : './Pendingreports.component.html',
    styleUrls    : ['./Pendingreports.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PendingreportsComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource:any;
   displayedColumns = ['WorkOrderNo', 'MouldNo', 'OrderDate','DateofMoulding','Client PO No', 'Client Name','Contractor','Product','Weight'];
   
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    listData: MatTableDataSource<any>;
    serachData= [];
    contractorList:any;
    final=[];
    // Private
    private _unsubscribeAll: Subject<any>;
    public vendorList1: Observable<any[]> = of([]);
    planningReportsForm: FormGroup;
    imageData:any;
    someData:any;
    from:any;
    to:any;
    cont:any;
    shift:any;

     dateform:any;
     dateto:any;
     id:any;
     Shift:any;
     loader:boolean;

    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _planningSevcie: PlanningService,
        private _formBuilder: FormBuilder,
        private httpService: HttpClient,
        private _toastr: ToasterService,
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

        this.planningReportsForm = this.planningReportForm();
        this.getContractorList();

    }


    
 
    planningReportForm(): FormGroup {
        return this._formBuilder.group({
            PlanDate: new FormControl((new Date()).toISOString()),
            PlanDate1: new FormControl((new Date()).toISOString()),
            ContractorId: ['', [Validators.required]],
            Shift: ['', [Validators.required]],
        });

    }

    getContractorList() {
        ////api/SecondModuleApi/PlanningContractor
        this._planningSevcie.GetContractorList().subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.contractorList = a.Body;

            }
        });
    }

    onSearchChange(event){
        this.dateform = event;
        this.searchButton();
    }

    onSearchChange1(event){
        this.dateto = event;
        this.searchButton();
    }

    onSearchChange2(event){
        this.id = event;
        this.searchButton();
    }

    onSearchChange3(event){
        this.Shift = event;
        this.searchButton();
    }

    searchButton(){
        // const model = this.planningReportsForm.value
        // this.from=moment(this.dateform).format('YYYY-MM-DD')
        // this.to=moment(model.PlanDate).format('YYYY-MM-DD')
        // this.cont=model.ContractorId
        // this.shift=model.Shift
       let json = {
            PlanDate: moment(this.dateform).format('YYYY-MM-DD')?moment(this.dateform).format('YYYY-MM-DD'):(new Date()).toISOString(),
            PlanDate1: moment(this.dateto).format('YYYY-MM-DD')?moment(this.dateto).format('YYYY-MM-DD'):(new Date()).toISOString(),
            ContractorId:this.id,
            Shift:this.Shift
        }
        

if(json.PlanDate && json.PlanDate1 && json.ContractorId && json.Shift){
    this.loader=true;
    this._planningSevcie.planningReports(json).subscribe((a: any) => {
        if( a && a.Status && a.Status.toLowerCase() === 'success' )
           {
            this.loader=false;
           this.dataSource=a.Body
           this.serachData=a.Body
           this.get()
           //console.log(a.Body)
           this.listData = new MatTableDataSource(this.dataSource);
           this.listData.sort = this.sort;
           this.listData.paginator = this.paginator;
           }
          else{
              this._toastr.errorToast(a.Status);
              this.loader=false;
          }
       });
    }
    else{
      //  this._toastr.errorToast("Please select all filds")
    }
        
    }


    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.serachData.filter((item) => item.ProductName.toLowerCase().includes(searchStr));
    }


    get(){
        var csv =[];
        for(let i=0;i<this.dataSource.length;i++){
        this.someData = 
                {SNo: i+1, 
                WOID: this.dataSource[i].WOID,
                MouldNo: this.dataSource[i].MouldNo,
                ClientName: this.dataSource[i].ClientName,
                ClientPoNo: this.dataSource[i].ClientPoNo,
                ProductName: this.dataSource[i].ProductName,
                NetWeight: this.dataSource[i].NetWeight,
                PlanningDate: this.dataSource[i].NoofPieces,
                MouldingDate  : this.dataSource[i].Planned,
                ContractorName:this.dataSource[i].ContractorName

            }

        csv.push(this.someData)
        }
        this.final=csv
    }


    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
        console.log(data, data.length)
        for (let i = 0; i < data.length; i++) {
            console.log(data[i].IndentId)
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }


    downloadCSV() {
        var data, filename, link;

        var csv = this.convertArrayOfObjectsToCSV({
            data: this.final
        });
        if (csv == null) return;

        filename = 'PlanningReporst.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }


}





