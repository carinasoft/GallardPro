import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { GeneratePurchaseOrder } from "app/indent-purchases/generate-order-modal/generate-order.component";
import { IndentService } from 'app/services/indent.service';
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, merge, Observable, Subject, fromEvent } from 'rxjs';
import { map, takeUntil, debounceTime, distinctUntilChanged, startWith, switchMap, catchError } from 'rxjs/operators';
import { IndentHistoryComponent } from 'app/indent-purchases/indent/indent-history-modal/indent-history.component';
import { AddIndentComponent } from "app/indent-purchases/indent/create-indent/add-indent.component";
import { IndentDeleteComponent } from '../indent-delete-modal/indent-delete.component';
import { IndentEditComponent } from '../indent-edit/indent-edit.component';
import * as $ from 'jquery';
import { trigger, state,transition, style, animate, query, stagger,animateChild } from '@angular/animations';
declare let jsPDF:any;

@Component({
    selector     : 'indent-list',
    templateUrl  : './indent-list.component.html',
    styleUrls    : ['./indent-list.component.scss'],
    //animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    animations   : [trigger('EnterLeave', [
        state('flyIn', style({ transform: 'translateX(0)' })),
        transition(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s 300ms ease-in')
        ]),
        transition(':leave', [
          animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
        ])
      ]),
      trigger('EnterLeave1', [
        state('flyIn1', style({ transform: 'translateX(0)' })),
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

export class IndentListComponent implements OnInit, OnChanges {
    @Input() refreshList: boolean = false;
    @Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    //displayedColumns = ['selected', 'IndentDate', 'material', 'category', 'quantity', 'priority', 'action'];
    displayedColumns = ['selected', 'material', 'category', 'quantity',  'action'];
   
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    
    listData: MatTableDataSource<any>;
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    User:any;
    name:any;
    category:any;
    quny:any;
    someData:any;;
    final=[];
    errorMessage:string='Loading............'
    // Private
    private _unsubscribeAll: Subject<any>;
    renderedData: any;

    newRowIndex = 0;

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

       // this.getIndentList();
        this.User = localStorage.getItem('User');
        
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
       
        
       
            this.getIndentList();
        
    
    
    
    }

    ngAfterViewInit() {
        
      
      }






get(){
    var csv =[];
    for(let i=0;i<this.indentList.length;i++){
       
        this.name=this.indentList[i].ItemName
        this.category=this.indentList[i].CategoryName
        this.quny=this.indentList[i].Quantity
  
    this.someData = 
        {Name: this.indentList[i].ItemName, CategoryName: this.indentList[i].CategoryName, Quantity: this.indentList[i].Quantity}
       
    // var someData = [
    //     {firstName: this.name, lastName: this.category, age: this.quny}
    //    ];
    csv.push(this.someData)
    }

    this.final=csv

}
    getIndentList(): any {
        this._indentService.GetIndent().subscribe((a: any) => {
            if (a && a.Body &&a.Body.length) {
                this.dataSource = a.Body;
                this.indentList = a.Body;
                this.refreshList = false;
                this.get();
            }
            this.listData = new MatTableDataSource(this.dataSource);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
           
        },(err)=>{

        });
    }

    editIndent(obj){


        this._indentService.GetIndentHistory1(obj).subscribe(a => {


            
            if(a && a.Body && a.Body.length) {
                const dialogRef=this.dialog.open(IndentEditComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.Body , Q:a.Body[0].Quantity }
                });
               
                dialogRef.afterClosed().subscribe(isSuccess => {
                   
                        this.getIndentList();
                    
                });


            } else {
                this._toastr.errorToast('No history found');
            }
        })







        // const dialogRef = this.dialog.open(AddIndentComponent, {
        //     width: '100%',
        //     panelClass: ['max-950', 'center-align'],
        //     data: obj
        // });

        // dialogRef.afterClosed().subscribe(isSuccess => {
        //     if(isSuccess) {
        //         dialogRef.close();
        //         this.getIndentList();
        //     }
        // });
    }

    deleteIndent(indentId): any {
        this._indentService.DeleteIndent(indentId).subscribe(a => {
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Indent deleted succesfully');
                this.getIndentList();                
            } else {
                this._toastr.errorToast(a.status);
            }
        });
    }

    generateOrder() {
        let selectedIndent = _.filter(this.dataSource, (o: any) => o.selected);
        if(selectedIndent && !selectedIndent.length) {
            return this._toastr.warningToast('Please select atleast 1 indent');
        }
        const dialogRef = this.dialog.open(GeneratePurchaseOrder, {
            width: "100%",
            panelClass: 'full-width-modal',
            data: { indentList: selectedIndent, isUpdate: false }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getIndentList();
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
            case 'IndentDate': return this.compare(a.CreateDate, b.CreateDate, isAsc);
            case 'priority': return this.compare(a.Priority, b.Priority, isAsc);
            case 'category': return this.compare(a.CategoryName, b.CategoryName, isAsc);
            case 'quantity': return this.compare(a.Quantity, b.Quantity, isAsc);
            case 'name': return this.compare(a.ItemName, b.ItemName, isAsc);
            default: return 0;
          }
        });
    }

    getIndentHistory(id) {
        this._indentService.GetIndentHistory(id).subscribe(a => {
            if(a && a.Body && a.Body.length) {
                this.dialog.open(IndentHistoryComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.Body }
                });

            } else {
                this._toastr.errorToast('No history found');
            }
        })
    }
    deleteIndent_History(id1){
      
        this._indentService.GetIndentHistory1(id1).subscribe(a => {
            if(a && a.Body && a.Body.length) {
                const dialogRef=this.dialog.open(IndentDeleteComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: a.Body }
                });
                dialogRef.afterClosed().subscribe(isSuccess => {
                   
                        this.getIndentList();
                    
                });


            } else {
                this._toastr.errorToast('No history found');
            }
        })


       
    }

    createIndent() {
        const dialogRef = this.dialog.open(AddIndentComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
        });

        dialogRef.afterClosed().subscribe(isSuccess => {
           
                this.getIndentList();
                this.newRowIndex++;
        });
    }
   
    ngOnChanges(s) {
        if (s && s.refreshList.currentValue) {
            this.getIndentList();
        }
    }
    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.indentList.filter((item) => item.ItemName.toLowerCase().includes(searchStr));
    }

    deleteMultipleIndent(){
        let indentId = [];
        _.forEach(this.dataSource, (o: any) => {
            if (o.selected) {
                return indentId.push(o.IndentId);
            }
        });
        if (!indentId.length) {
            return this._toastr.warningToast('Please select atleast 1 indent');
        } else {
            this._indentService.DeleteMultipleIndent(indentId.toString()).subscribe(a => {
               
                if (a.Status === 'Success') {
                    this._toastr.successToast(a.Body);
                    this.getIndentList();
                } else {
                    this._toastr.errorToast(a.Body);
                }
            });
        }
    }





    //----------------Export File --------------------------

//     exportTableToCSV(filename) {
//         console.log(filename)
//     var csv = [];
//     var rows = document.querySelectorAll("table tr");
    
//     for (var i = 0; i < rows.length; i++) {
//         var row = [], cols = rows[i].querySelectorAll("td, th");
         
//         for (var j = 0; j < cols.length; j++) 
//             row.push(cols[j].innerHTML,);
//             //csv.push(row+(","));
//         csv.push(row.join(","));  
        
        
//     }

//     // Download CSV file
//     this.downloadCSV1(csv.join("\n"), filename);
// console.log(csv, filename)
//    }
   
//     downloadCSV1(csv, filename) {
//      var csvFile;
//      var downloadLink;
   
//      // CSV file
//      csvFile = new Blob([csv], {type: "text/csv"});
   
//      // Download link
//      downloadLink = document.createElement("a");
//    console.log(downloadLink)
//      // File name
//      downloadLink.download = filename;
   
//      // Create a link to the file
//      downloadLink.href = window.URL.createObjectURL(csvFile);
   
//      // Hide download link
//      downloadLink.style.display = "none";
   
//      // Add the link to DOM
//      document.body.appendChild(downloadLink);
   
//      // Click download link
//      downloadLink.click();
//    }


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

    filename = 'indentList.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


//  downloadCSV() {


 
       
// console.log("click me ")
    
//     var data, filename, link;

//     var csv = this.convertArrayOfObjectsToCSV({
//         data:  this.final
       
        

//     });
  



//     if (csv == null) return;

//     filename = 'indent-list.csv';

//     if (!csv.match(/^data:text\/csv/i)) {
//         csv = 'data:text/csv;charset=utf-8,' + csv;
//     }
//     data = encodeURI(csv);

//     link = document.createElement('a');
//     link.setAttribute('href', data);
//     link.setAttribute('download', filename);
//     link.click();
// }

} 






// $(document).ready(function () {

//     function exportTableToCSV($table, filename) {

//         var $rows = $table.find('tr:has(td)'),

//             // Temporary delimiter characters unlikely to be typed by keyboard
//             // This is to avoid accidentally splitting the actual contents
//             tmpColDelim = String.fromCharCode(11), // vertical tab character
//             tmpRowDelim = String.fromCharCode(0), // null character

//             // actual delimiter characters for CSV format
//             colDelim = '","',
//             rowDelim = '"\r\n"',

//             // Grab text from table into CSV formatted string
//             csv = '"' + $rows.map(function (i, row) {
//                 var $row = $(row),
//                     $cols = $row.find('td');

//                 return $cols.map(function (j, col) {
//                     var $col = $(col),
//                         text = $col.text();

//                     return text.replace(/"/g, '""'); // escape double quotes

//                 }).get().join(tmpColDelim);

//             }).get().join(tmpRowDelim)
//                 .split(tmpRowDelim).join(rowDelim)
//                 .split(tmpColDelim).join(colDelim) + '"';

// 				// Deliberate 'false', see comment below
//         if (false && window.navigator.msSaveBlob) {

// 						var blob = new Blob([decodeURIComponent(csv)], {
// 	              type: 'text/csv;charset=utf8'
//             });
            
//             // Crashes in IE 10, IE 11 and Microsoft Edge
//             // See MS Edge Issue #10396033: https://goo.gl/AEiSjJ
//             // Hence, the deliberate 'false'
//             // This is here just for completeness
//             // Remove the 'false' at your own risk
//             window.navigator.msSaveBlob(blob, filename);
            
//         } else if (window.Blob && window.URL) {
// 						// HTML5 Blob        
//             var blob = new Blob([csv], { type: 'text/csv;charset=utf8' });
//             var csvUrl = URL.createObjectURL(blob);

//             $(this)
//             		.attr({
//                 		'download': filename,
//                 		'href': csvUrl
// 		            });
// 				} else {
//             // Data URI
//             var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

// 						$(this)
//                 .attr({
//                		  'download': filename,
//                     'href': csvData,
//                     'target': '_blank'
//             		});
//         }
//     }

//     // This must be a hyperlink
//     $(".export").on('click', function (event) {
//         // CSV
//         var args = [$('#content>table'), 'export.csv'];
        
//         exportTableToCSV.apply(this, args);
        
//         // If CSV, don't do event.preventDefault() or return false
//         // We actually need this to be a typical hyperlink
//     });
// });

