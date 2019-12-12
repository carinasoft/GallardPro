import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { FuseUtils } from '@fuse/utils';
import { GeneratePurchaseOrder } from 'app/indent-purchases/generate-order-modal/generate-order.component';
import { IndentService } from 'app/services/indent.service';
import { ToasterService } from 'app/services/toaster.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ViewpdfComponent } from '../viewpdf/viewpdf.component';
import { trigger, state,transition, style, animate, query, stagger,animateChild } from '@angular/animations';
declare let jsPDF:any;

@Component({
    selector     : 'goodlist',
    templateUrl  : './goodlist.component.html',
    styleUrls    : ['./goodlist.component.scss'],
    animations   : [trigger('EnterLeave', [
        state('flyIn', style({ transform: 'translateX(0)' })),
        transition(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s 300ms ease-in')
        ]),
        transition(':leave', [
          animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
        ])
      ])
    ,
    trigger('EnterLeave1', [
        state('flyIn1', style({ transform: 'translateX(0)' })),
        transition(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s 300ms ease-in')
        ]),
        transition(':leave', [
          animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
        ])
      ])
    
    ],
    encapsulation: ViewEncapsulation.None
})
export class GoodlistComponent implements OnInit
{
    dataSource: any[] = [];
    displayedColumns = ['date', 'number', 'supplier','SupplierRef', 'TermsofDelivery', 'dispatch', 'preview','grn'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;

    poNumber = null;
    supplierId = null;
    vendorList = [];

   searchTermStream: Subject<string> = new Subject();

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _route: Router
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
        this.getAllVendor();
        this.getPurchaseOrders();

        this.searchTermStream.pipe(
        debounceTime(700),
        distinctUntilChanged())
        .subscribe(term => {
            this.getPurchaseOrders();
        });

    }

    getPurchaseOrders(): any {
        this._indentService.GetPurchaseOrders1(this.poNumber).subscribe((a: any) => {
            if (a && a.Body && a.Body.length) {
                this.dataSource = a.Body;
            } else {
                this.dataSource = [];
                this._toastr.errorToast('No Order Found');
            }
        });
    }

    editIndent(obj): any {
        console.log(obj);
    }

    deleteIndent(indentId): any {
        console.log(indentId);
        this._indentService.DeleteIndent(indentId).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Indent deleted succesfully');
                this.getPurchaseOrders();                
            } else {
                this._toastr.errorToast(a.status);
            }
        });
    }

    generateOrder() {
        const selectedIndent = _.filter(this.dataSource, (o: any) => o.selected);
        if (selectedIndent && !selectedIndent.length) {
            return this._toastr.warningToast('Please select atleast 1 indent');
        }
        console.log('selectedIndent', selectedIndent);
        const dialogRef = this.dialog.open(GeneratePurchaseOrder, {
            width: '100%',
            panelClass: 'full-width-modal',
            data: { indentList: selectedIndent }
        });

        dialogRef.afterClosed().subscribe(result => {
        this.getPurchaseOrders();
          console.log(`Dialog result: ${result}`);
        });

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
            case 'number': return compare(a.PONumber, b.PONumber, isAsc);
            case 'supplier': return compare(a.VendorName, b.VendorName, isAsc);
            case 'date': return compare(a.PODate, b.PODate, isAsc);
            case 'dispatch': return compare(a.Despatchhrough, b.Despatchhrough, isAsc);
            default: return 0;
          }
        });
      }

    createToGrn(poNumber) {
      this._route.navigate(['indent', 'grn'], { queryParams: {poNumber}});
    }

    getAllVendor() {
      this._indentService.GetAllVendor().subscribe((a: any) => {
        if (a) {
            this.vendorList = a.Body;
        }
      });
    }

    search(term: string): void {
        this.searchTermStream.next(term);
    }

    editPurchaseOrder(poNumber){
        this._indentService.GetPoByNumber(poNumber).subscribe(a => {
            if (a.PONumber) {
                console.log(a);
                const dialogRef = this.dialog.open(GeneratePurchaseOrder, {
                    width: "100%",
                    panelClass: 'full-width-modal',
                    data: { indentList: a.PoList, isUpdate: true, poDetail: a  }
                });
            }
        });

        // dialogRef.afterClosed().subscribe(result => {
        //     this.getIndentList();
        // });

    }

    openPDF(a){
        const dialogRef = this.dialog.open(ViewpdfComponent, {
            width: "100%",
            panelClass: 'full-width-modal',
            data: { data:a }
            
        });
        console.log(a)
    }

    convert(){
        // var item = {
        //   "Name" : "XYZ",
        //   "Age" : "22",
        //   "Gender" : "Male"
        // };

        var item = this.dataSource;
        console.log(item)
        var doc = new jsPDF();
        var col = ["Details", "Values"];
        var rows = [];
    
        for(var key in item){
            var temp = [key, item[key]];
            rows.push(temp);
        }
    
        doc.autoTable(col, rows);
    
        doc.save('Test.pdf');
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
            data: this.dataSource
        });
        if (csv == null) return;
    
        filename = 'Goods & Receive.csv';
    
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
