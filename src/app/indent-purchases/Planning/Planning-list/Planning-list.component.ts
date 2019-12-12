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
    MouldNo: string;
    DateofPlanning: string;
    WorkOrderNo: string;
    OrderDate: string;
    ClientPONo: string;
    ClientName: string;
    Base: string;
    Grade: string;
    Product: string;
    Weight: string;
    Notes: string; }
//Client Name','Base','Grade','Product','Weight','Notes'
    const ELEMENT_DATA: PeriodicElement[] = [
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        {MouldNo: '4288', DateofPlanning: '11/04/2019', WorkOrderNo: '5241', OrderDate: '11/11/2019',ClientPONo: 'Verbal', ClientName: 'Alert Engg', Base: 'MS',Grade:'IS 1030 340-570',Product:'Bearing cartridge 01033',Weight:'0.000',Notes:'notes'},
        
      
      ];

@Component({
    selector     : 'Planning-list',
    templateUrl  : './Planning-list.component.html',
    styleUrls    : ['./Planning-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PlanninglistComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() disabled = true;
    dataSource = ELEMENT_DATA;
   displayedColumns = ['sno','MouldNo', 'Date of Planning', 'Work Order No.', 'Client PO No', 'OrderDate','Client Name','Base','Grade','Product','Weight','Notes'];
   
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


    createProduct(){
        this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }
    


    
    

   
    // search(ev) {
    //     let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
    //     this.dataSource1 = this.serachData.filter((item) => item.Name.toLowerCase().includes(searchStr) || item.ClientPoNo.toLowerCase().includes(searchStr));
    // }
   

    // get(){
    //     var csv =[];
    //     for(let i=0;i<this.dataSource1.length;i++){
    //     this.someData = 
    //         {SNo: i+1, 
    //             WOID: this.dataSource1[i].WOID,
    //             Orderdate: this.dataSource1[i].Orderdate,
    //             Deliverydate: this.dataSource1[i].Deliverydate,
    //             ClientPoNo: this.dataSource1[i].ClientPoNo,
    //             Name: this.dataSource1[i].Name,
    //             Entrydate: this.dataSource1[i].Entrydate,
    //             Status: this.dataSource1[i].WOID,
                
    //         }
        
    //     csv.push(this.someData)
    //     }
    //     this.final=csv
    // }


    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
        console.log(data , data.length)
        for(let i=0; i<data.length; i++)
        {
            console.log(data[i].IndentId)
        }
    
        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';
    
        keys = Object.keys(data[0]);
    
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
    
        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
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
    
        filename = 'workorderlist.csv';
    
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
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}





// @Component({
//     selector: 'dialog-overview-example-dialog',
//     templateUrl: 'dialog-overview-example-dialog.html',
//   })
//   export class DialogOverviewExampleDialog {
  
//     constructor(
//       public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//       @Inject(MAT_DIALOG_DATA) public data: DialogData) {
          
//       }
  
//     onNoClick(): void {
//       this.dialogRef.close();
//     }
  
//   }

