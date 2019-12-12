import { Component, ElementRef, Inject,OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import {MatDialog} from '@angular/material';
import * as _ from 'lodash';
import { GeneratePurchaseOrder } from 'app/indent-purchases/generate-order-modal/generate-order.component';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';



@Component({
    selector     : 'issue-stock-list-history',
    templateUrl  : './issue-stock-list-history.component.html',
    styleUrls    : ['./issue-stock-list-history.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class IssueStockListHistoryComponent implements OnInit
{
    @Input() refreshList = false;
    @Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    @Input() dataSource: any[] = [];
   
    stockList: any[] = [];
    displayedColumns = ['IssuedDate', 'IssuedDate1','IssuedTo', 'material', 'category', 'quantity'];

    
    moment = moment;
    // Private
    private _unsubscribeAll: Subject<any>;
    someData:any;;
    final=[];
    constructor(
        public dialogRef: MatDialogRef<IssueStockListHistoryComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService
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
        _.map(this.data.indentList, (o) => {
            o.CreateDate = moment(o.CreateDate).format('MM/DD/YYYY');
            return o.OrderQuantity = o.Quantity;  
          });
          this.get()
    }

    get(){
       
        var csv =[];
        for(let i=0;i<this.data.indentList.length;i++){
           
    
   
        this.someData = 
            {SNo: i+1, Date:moment(this.data.indentList[i].IssuedDate).format('MM/DD/YYYY'), IssuedTo:this.data.indentList[i].Name,Name: this.data.indentList[i].ItemName, CategoryName: this.data.indentList[i].CategoryName, Quantity: this.data.indentList[i].Quantity}
           
     
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
    
        filename = 'issuehistory.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
    
    


    sortData(sort): any {
        const data = this.dataSource.slice();
        if (!sort.active || sort.direction === '') {
          this.dataSource = data;
          return;
        }
    
        this.dataSource = data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'IssuedDate': return compare(a.IssuedDate, b.IssuedDate, isAsc);
            case 'material': return compare(a.ItemName, b.ItemName, isAsc);
            case 'category': return compare(a.CategoryName, b.CategoryName, isAsc);
            case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
            case 'IssuedTo': return compare(a.Name, b.Name, isAsc);
            default: return 0;
          }
        });
    }



    ngOnChanges(s) {
        if (s && s.refreshList.currentValue) {
           
        }
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.stockList.filter((item) => { 
            return item.ItemName.toLowerCase().includes(searchStr) || item.Name.toLowerCase().includes(searchStr) || item.CategoryName.toLowerCase().includes(searchStr);
        });
    }

}
function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
