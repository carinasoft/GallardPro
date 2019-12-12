import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';


import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { IndentService } from 'app/services/indent.service';
import {MatDialog} from '@angular/material';
import * as _ from 'lodash';

import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ContactComponent } from '../add-contact/contact.component';
import { BankComponent } from '../add-bank/bank.component';
import { DetailsComponent } from '../view-details/details.component';
import { AlldetailsofclientComponent } from '../alldetailsof client/alldetailsofclient.component';
import { HttpClientBackendService } from 'angular-in-memory-web-api';
import { ClientService } from 'app/services/client.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditClientComponent } from '../edit-client/edit-client.component';



@Component({
    selector     : 'client-list',
    templateUrl  : './client-list.component.html',
    styleUrls    : ['./client-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ClientlistComponent implements OnInit
{    
    @Input() refreshList = false;
    dataSource: any[] = [];
    //, 'Product Name', 'Total Net Weight','Notes','No. of Ordered Pieces','Planned','Pincode','Email','Contact No'
    displayedColumns = ['workorderno', 'order-date', 'Grade','Contact','Bank','view','view1'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    stockList = [];
    someData:any;;
    final=[];
    // Private
    stateList:any;
    cityList:any;
    public clintForm: FormGroup;
    delRow;
    private _unsubscribeAll: Subject<any>;
    public searchlist:any;
    ClientType: any[] = [];
    listData: MatTableDataSource<any>;

    constructor(
        public dialog: MatDialog,
        // public dialogRef: MatDialogRef<IssueStockComponent>,                
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _clientService: ClientService,
        private _formBuilder: FormBuilder
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
        this.clintForm = this.createClintForm();
        this.getClientList();
        this.getState();
        this.getClientType()
    }
    createClintForm(): FormGroup {
        return  this._formBuilder.group({
            Name:  ['', []],
            EmailID:  ['', []],
            GST:  ['', []],
            PanNo:  ['', []],
            MobileNo:  ['', []],
            StateID:  ['', []],
            CityID:  ['', []],
            Address:  ['', []],
            ClientTypeId:  ['', []],
            ServiceTaxNo:  ['', []],

          
        });
      }

      getClientType(){
        this._clientService.GetClientType().subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
             console.log(a)
             this.ClientType=a.Body
             
            } else {
               this._toastr.errorToast(a.Status);
            }
         });
      }




      saveClient(){
        let obj = this.clintForm.value;
       if(obj.Name,obj.ClientTypeId,obj.StateID,obj.CityID,obj.Address){

      
        this._clientService.AddClient(obj).subscribe((a: any) => {
           if (a && a.Status && a.Status.toLowerCase() === 'success') {
            
            this._toastr.successToast('Client added succesfully');
            this._fuseSidebarService.getSidebar('addvendorDetails').close();
            this.getClientList();
            this.clintForm.reset();
            var element = <HTMLInputElement> document.getElementById("condition");
            element.disabled = false;
           } else if(a.Status === 'Warning')
           {
              this._toastr.warningToast("Item already exists"); 
            }
          else{
              this._toastr.errorToast(a.Status)
             }
             });
            }
            else{
                this._toastr.errorToast("Fill all input filds")
                var element = <HTMLInputElement> document.getElementById("condition");
                element.disabled = false;

            }

      }

    getClientList(): any {
        this._clientService.GetClientList().subscribe((a: any) => {
            
                this.dataSource = a.Body;
                this.searchlist = a.Body;
                this.dataSource.map(row => {      
                    row.isEditable = false;        
                  }); 
                  this.get()
                  this.listData = new MatTableDataSource(this.dataSource);
              this.listData.sort = this.sort;
              this.listData.paginator = this.paginator;
        });
    }

    getState() {
        this._indentService.GetState().subscribe((a: any) => {
          if (a) {
              this.stateList = a.Body;
          }
        });
      }
  
      getCity(stateId) {
        this._indentService.GetCity(stateId).subscribe((a: any) => {
          if (a) {
              this.cityList = a.Body;
          }
        });
      }

    createProduct(){
        this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
    }
   
    createContact(id,material) {
        const dialogRef = this.dialog.open(ContactComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
            data: { indentList: id,dataof:material},
        });  
        dialogRef.afterClosed().subscribe(result => {
            this.getClientList();
           
          });
    }
    createBank(id,material) {
        const dialogRef = this.dialog.open(BankComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
            data: { indentList: id,dataof:material},
        }); 
        dialogRef.afterClosed().subscribe(result => {
            this.getClientList();
           
          }); 
    }
    viewData(){
        const dialogRef = this.dialog.open(DetailsComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
        });
    }

    openView(id){
        
                this.dialog.open(AlldetailsofclientComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: id},
                    
                });
          
           
        }

        editRow(row) {
            this.dataSource.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
        row.isEditable = true;
      }
    
      save(row){
        row.isEditable = false;
        
        //{ID: 7, Name: "asasasasas", isEditable: false}
        this._clientService.ClientEdit(row).subscribe((a :any) =>{
            if( a && a.Status && a.Status.toLowerCase() === 'success' )
               {
                this._toastr.successToast('Client Edited succesfully');
              
               }
            else{
                   this._toastr.errorToast(a.Status);
                } 
    
        });
      }
    
      delete(row){
       // console.log(row);
        this.delRow = this.dataSource.indexOf(row);
        this.dataSource.splice(this.delRow,1);
       // console.log(this.dataSource);
    
        this._clientService.DeleteClient(row).subscribe((a:any)=>{
          //  console.log(a)
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Client deleted succesfully');
                        this.getClientList();
            } else {
                this._toastr.errorToast(a.Status);
            } 
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
            case 'material': return compare(a.ItemName, b.ItemName, isAsc);
            case 'category': return compare(a.CategoryId, b.CategoryId, isAsc);
            case 'quantity': return compare(a.Quantity, b.Quantity, isAsc);
            default: return 0;
          }
        });
    }
    

   
    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.listData.filter = searchStr.trim().toLowerCase();
        this.dataSource = this.searchlist.filter((item) => item.Name.toLowerCase().includes(searchStr));
    }



    get(){
        var csv =[];
        for(let i=0;i<this.dataSource.length;i++){
        this.someData = 
            {    SNo: i+1,
                ClientId:this.dataSource[i].Id,
                Name: this.dataSource[i].Name,
                GST: this.dataSource[i].GST,
                PanNo: this.dataSource[i].PanNo,
                Address: this.dataSource[i].Address,
                StateName: this.dataSource[i].StateName,
                CityName: this.dataSource[i].CityName,
                Pincode: this.dataSource[i].Pincode,
                EmailID: this.dataSource[i].EmailID,
                MobileNo: this.dataSource[i].MobileNo
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
    
        filename = 'ClientList.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }


     OpenEditDailogBox(material){
     console.log(material)

        const dialogRef = this.dialog.open(EditClientComponent, {
            width: '100%',
            panelClass: ['max-950', 'center-align'],
            data: { ClientID:material.Id,Name:material.Name,GST:material.GST,PAN:material.PanNo,Address:material.Address,State:material.StateID,City:material.CityID,Pincode:material.Pincode,EmailID:material.EmailID,MobileNo:material.MobileNo,ClientTypeId:material.ClientTypeId,ServiceTaxNo:material.ServiceTaxNo},
           
        });
        
        dialogRef.afterClosed().subscribe(result => {
            this.getClientList();
            console.log('valu call ')
            dialogRef.close();
          });
     }

   

}







function compare(a: number | string, b: number | string, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

