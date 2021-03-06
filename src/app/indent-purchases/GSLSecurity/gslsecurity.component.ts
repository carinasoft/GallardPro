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
import { map, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IndentHistoryComponent } from 'app/indent-purchases/indent/indent-history-modal/indent-history.component';
import { AddIndentComponent } from "app/indent-purchases/indent/create-indent/add-indent.component";
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ViewpdfComponent } from '../viewpdf/viewpdf.component';
declare let jsPDF:any;
@Component({
    selector     : 'gslsecurity',
    templateUrl  : './gslsecurity.component.html',
    styleUrls    : ['./gslsecurity.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class GslsecurityComponent implements OnInit {
    @Input() refreshList: boolean = false;
    @Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    //displayedColumns = ['selected', 'IndentDate', 'material', 'category', 'quantity', 'priority', 'action'];
    displayedColumns = ['date', 'number', 'supplier','SupplierRef', 'TermsofDelivery', 'dispatch', 'preview','create'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    poNumber = null;
    supplierId = null;
    vendorList = [];

   searchTermStream: Subject<string> = new Subject();

    // Private
    private _unsubscribeAll: Subject<any>;

    renderedData: any;
    UserName: string;
    Password: string;
    loginData = { UserName:'', Password:'' };

    

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private router: Router,
        private _route: Router
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();


        
    }

    /**
     * On init
     */
//     ngOnInit(): void
//     {
//         this.getIndentList();

        
//     }

    
    

//     getIndentList(): any {
//         this._indentService.GetIndent().subscribe((a: any) => {
//             if (a && a.Body &&a.Body.length) {
//                 this.dataSource = a.Body;
//                 this.indentList = a.Body;
//                 this.refreshList = false;
//             }
//         });
//     }

//     editIndent(obj): any {
//         const dialogRef = this.dialog.open(AddIndentComponent, {
//             width: '100%',
//             panelClass: ['max-950', 'center-align'],
//             data: obj
//         });

//         dialogRef.afterClosed().subscribe(isSuccess => {
//             if(isSuccess) {
//                 dialogRef.close();
//                 this.getIndentList();
//             }
//         });
//     }

//     deleteIndent(indentId): any {
//         this._indentService.DeleteIndent(indentId).subscribe(a => {
//             if (a && a.Status.toLowerCase() === 'success') {
//                 this._toastr.successToast('Indent deleted succesfully');
//                 this.getIndentList();                
//             } else {
//                 this._toastr.errorToast(a.status);
//             }
//         });
//     }

//     generateOrder() {
//         let selectedIndent = _.filter(this.dataSource, (o: any) => o.selected);
//         if(selectedIndent && !selectedIndent.length) {
//             return this._toastr.warningToast('Please select atleast 1 indent');
//         }
//         const dialogRef = this.dialog.open(GeneratePurchaseOrder, {
//             width: "100%",
//             panelClass: 'full-width-modal',
//             data: { indentList: selectedIndent, isUpdate: false }
//         });

//         dialogRef.afterClosed().subscribe(result => {
//             this.getIndentList();
//         });

//     }

//     sortData(sort): any {
//         const data = this.dataSource.slice();
//         if (!sort.active || sort.direction === '') {
//           this.dataSource = data;
//           return;
//         }
    
//         this.dataSource = data.sort((a, b) => {
//           const isAsc = sort.direction === 'asc';
//           switch (sort.active) {
//             case 'IndentDate': return this.compare(a.CreateDate, b.CreateDate, isAsc);
//             case 'priority': return this.compare(a.Priority, b.Priority, isAsc);
//             case 'category': return this.compare(a.CategoryName, b.CategoryName, isAsc);
//             case 'quantity': return this.compare(a.Quantity, b.Quantity, isAsc);
//             case 'name': return this.compare(a.ItemName, b.ItemName, isAsc);
//             default: return 0;
//           }
//         });
//     }

//     getIndentHistory(id) {
//         this._indentService.GetIndentHistory(id).subscribe(a => {
//             if(a && a.Body && a.Body.length) {
//                 this.dialog.open(IndentHistoryComponent, {
//                     width: '100%',
//                     panelClass: ['medium-modal', 'center-align'],
//                     data: { indentList: a.Body }
//                 });

//             } else {
//                 this._toastr.errorToast('No history found');
//             }
//         })
//     }

//     createIndent() {
//         const dialogRef = this.dialog.open(AddIndentComponent, {
//             width: '100%',
//             panelClass: ['max-950', 'center-align'],
//         });

//         dialogRef.afterClosed().subscribe(isSuccess => {
//             if(isSuccess) {
//                 this.getIndentList();
//             }
//         });
//     }

//     ngOnChanges(s) {
//         if (s && s.refreshList.currentValue) {
//             this.getIndentList();
//         }
//     }
//     compare(a: number | string, b: number | string, isAsc: boolean): any {
//         return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
//     }

//     search(ev) {
//         let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
//         this.dataSource = this.indentList.filter((item) => item.ItemName.toLowerCase().includes(searchStr));
//     }

//     deleteMultipleIndent(){
//         let indentId = [];
//         _.forEach(this.dataSource, (o: any) => {
//             if (o.selected) {
//                 return indentId.push(o.IndentId);
//             }
//         });
//         if (!indentId.length) {
//             return this._toastr.warningToast('Please select atleast 1 indent');
//         } else {
//             this._indentService.DeleteMultipleIndent(indentId.toString()).subscribe(a => {
//                 console.log(a);
//                 if (a.Status === 'Success') {
//                     this._toastr.successToast(a.Body);
//                     this.getIndentList();
//                 } else {
//                     this._toastr.errorToast(a.Body);
//                 }
//             });
//         }
//     }
// //----------Login -------------------------


// login()  {
    
//     if(this.UserName == 'admin' && this.Password == 'admin'){

//         localStorage.setItem('User','Admin')
//         this.router.navigate(["/indent/create"]);
//       window.location.reload();
//     }
//     else if(this.UserName == 'security' && this.Password == '123'){
//         localStorage.setItem('User','Security')
//     }
//     else if(this.UserName == 'storekeeper' && this.Password == '123'){
//         localStorage.setItem('User','StoreKeeper');
//         alert("Store Keeper Page Not Define");
//     }
//     else {
//       alert("Invalid credentials");
//     }
//     // console.log(this.loginData)
//     // this._indentService.login(this.loginData).then((result) => {
       
//     //     console.log(result)
       
       
//     //   }, (err) => {
//     //     console.log(err)
//     //   });
//   }
  




//     //----------------Export File --------------------------

//     exportTableToCSV(filename) {
//         console.log(filename)
//        var csv = [];
//        var rows = document.querySelectorAll("table tr");
//        console.log(rows)
//        for (var i = 0; i < rows.length; i++) {
//            var row = [], cols = rows[i].querySelectorAll(".mat-header-cell");
           
//            for (var j = 0; j < cols.length; j++) 
//                row.push(cols[j].innerHTML);
           
//            csv.push(row.join(","));        
//        }
   
//        // Download CSV file
//        //this.downloadCSV(csv.join("\n"), filename);
//    }
   
// //     downloadCSV(csv, filename) {
// //      var csvFile;
// //      var downloadLink;
   
// //      // CSV file
// //      csvFile = new Blob([csv], {type: "text/csv"});
   
// //      // Download link
// //      downloadLink = document.createElement("a");
   
// //      // File name
// //      downloadLink.download = filename;
   
// //      // Create a link to the file
// //      downloadLink.href = window.URL.createObjectURL(csvFile);
   
// //      // Hide download link
// //      downloadLink.style.display = "none";
   
// //      // Add the link to DOM
// //      document.body.appendChild(downloadLink);
   
// //      // Click download link
// //      downloadLink.click();
// //    }


//    convertArrayOfObjectsToCSV(args) {
//     var result, ctr, keys, columnDelimiter, lineDelimiter, data;

//     data = args.data || null;
//     if (data == null || !data.length) {
//         return null;
//     }

//     columnDelimiter = args.columnDelimiter || ',';
//     lineDelimiter = args.lineDelimiter || '\n';

//     keys = Object.keys(data[0]);

//     result = '';
//     result += keys.join(columnDelimiter);
//     result += lineDelimiter;

//     data.forEach(function(item) {
//         ctr = 0;
//         keys.forEach(function(key) {
//             if (ctr > 0) result += columnDelimiter;

//             result += item[key];
//             ctr++;
//         });
//         result += lineDelimiter;
//     });

//     return result;
// }

//  downloadCSV(args) {
//     var data, filename, link;

//     var csv = this.convertArrayOfObjectsToCSV({
//         data: this.indentList
//     });
//     if (csv == null) return;

//     filename = 'export.csv';

//     if (!csv.match(/^data:text\/csv/i)) {
//         csv = 'data:text/csv;charset=utf-8,' + csv;
//     }
//     data = encodeURI(csv);

//     link = document.createElement('a');
//     link.setAttribute('href', data);
//     link.setAttribute('download', filename);
//     link.click();
// }

// } 


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
    this._indentService.GetPurchaseOrders(this.poNumber).subscribe((a: any) => {
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

    filename = 'Generated-Order-List.csv';

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
