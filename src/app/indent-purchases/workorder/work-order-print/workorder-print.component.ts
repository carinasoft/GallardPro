import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as html2canvas from 'html2canvas';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import {MatDialog} from '@angular/material';
import * as _ from 'lodash';
import { GeneratePurchaseOrder } from 'app/indent-purchases/generate-order-modal/generate-order.component';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { IssueStockComponent } from 'app/indent-purchases/inventory/issue-stock/issue-stock.component';
import { MAT_DIALOG_DATA} from '@angular/material';
declare let jsPDF:any;
@Component({
    selector     : 'workorder-print',
    templateUrl  : './workorder-print.component.html',
    styleUrls    : ['./workorder-print.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class WorkorderPrintComponent implements OnInit
{    
    @Input() refreshList = false;
    @Input() dataSource: any[] = [];
    displayedColumns = ['serial', 'date',  'name', 'category','Net Weight','Gross Weight','Total Net Weight','Total Gross Weight','No. of Pieces','Rate / KG','Estimate Price','Notes'];
  //  @ViewChild('content') content:ElementRef;
    type1:any;
    type2:any;
    moment = moment;
    stockList = [];
    someData:any;
    final:any;;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialogRef: MatDialogRef<WorkorderPrintComponent>,
	    @Inject(MAT_DIALOG_DATA) public data: any,
       // public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private content: ElementRef
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // this.type1=this.data.indentList.type;
        // console.log(this.type1)
      
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
         
    }

    // getTotalCost() {
    //     return this.data.indentList.map(t =>.Quantity).reduce((acc, value) => acc + value, 0);
    //   }

    convert(){
        window.print();



//-------------------------------------------------------------------------        
//         let doc = new jsPDF();


// doc.setFontSize(20); 
// doc.text(20, 10, "Stock Summary");

// // Create your table here (The dynamic table needs to be converted to canvas).
// let element = <HTMLScriptElement>document.getElementsByClassName("mat-typography")[0];
// html2canvas(element).then((canvas: any) => {
// doc.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 0, 50, 
// doc.internal.pageSize.width, element.offsetHeight / 5 );
// doc.save(`Report-${Date.now()}.pdf`);
// })
//--------------------------------------------------------------------
        // const doc = new jsPDF();
        // const specialElememtHandlers = {
        //   '#editor': function (element, renderer) {
        //     return true;
        //   }
        // };
        
        // doc.fromHTML(this.content.nativeElement.innerHTML, 40, 40, {
        //   'width': 190,
        //   'elementHandlers': specialElememtHandlers
        // });
        // doc.save('test.pdf');
      


//         let doc= new jsPDF();
//   let specialElememtHandlers = {
//     '#editor':function(element,renderer)
//     {
//       return true;
//     }    
//   };
//   let content =this.content.nativeElement;
//   doc.fromHTML(content.innerHTML,15,15, {
//     'width':190,
//     'elementHandlers':specialElememtHandlers
//   });
//   doc.save('test.pdf');
  
    //     var item = {
    //       "Name" : "XYZ",
    //       "Age" : "22",
    //       "Gender" : "Male"
    //     };
    //     this.get();

        
    //     var doc = new jsPDF();
    //     var col = this.displayedColumns;
    //     var rows = [];
    
    //     for(var key in this.final){
    //         var temp = [key, item[key]];
    //         rows.push(temp);
    //     }
    
    //     doc.autoTable(col, rows);
    
    //     doc.save('Test.pdf');
      }
}


