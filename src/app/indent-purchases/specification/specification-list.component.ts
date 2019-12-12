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

import { Location } from '@angular/common';

import { SpecificationhistoryComponent } from '../specification-history/specification-history.component';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { CastingService } from 'app/services/casting.service';

import { MechanicalListComponent } from '../MechanicalList/MechanicalList.component';
import { ActivatedRoute } from '@angular/router';
import {  of } from 'rxjs';
import {  startWith } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
@Component({
    selector     : 'specification-list',
    templateUrl  : './specification-list.component.html',
    styleUrls    : ['./specification-list.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class SpecificationListComponent implements OnInit {
    listData: MatTableDataSource<any>;
    selected = '';
    @Input() refreshList: boolean = false;
    //@Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
   // displayedColumns = [ 'S.NO.', 'Casting Base' ,'view'];
    displayedColumns: string[] = ['id', 'progress','name','name1', 'color','color1'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @Input() disabled = true;
    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    public indentForm: FormGroup;
    indentFormAddChemical: FormGroup;
    orderFormMechanical: FormGroup;
    casting:any;
    value:boolean = false;
    someData:any;;
    final=[];
    mechnicalData:any
    GradeNameDisplay:any;
    orderForm: FormGroup;
    camical:any;
    camical1:any;
    myvalue:any;
    counter:number;
    vendorDetails:any;
    delRow;
    items: FormArray;
    items1: FormArray;
    filteredOptions: Observable<[]>[] = [];
    gradelist:any;
    mechanicalData:any;
    buttonName:any;
    inputFormValue:boolean
    inputFormValue1:boolean
    formgroupButton:boolean
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        public location :Location,
        private _formBuilder: FormBuilder,
        private _castingService: CastingService,
        private route: ActivatedRoute,
        private _fuseSidebarService: FuseSidebarService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.formgroupButton=false
        this.inputFormValue=false
        this.inputFormValue1=false
        this.buttonName = 'Chemical';

        
        let item  = this.route.snapshot.queryParamMap.get('value')
        let item1  = this.route.snapshot.queryParamMap.get('value1')
        let item2  = this.route.snapshot.queryParamMap.get('value2')
        console.log("Item ",item,item1,item2)
        this.GradeNameDisplay = item1
        this.indentForm = this.createIndentForm();
        this.list();
        this.getGetChemical()
        this.orderForm = this._formBuilder.group({
        
            items: this._formBuilder.array([ 
               this.createItem(name)
            ])
          });

          this.indentFormAddChemical = this.AddChemicalForm();

          this.getTable(item)
          this.getMechanicalTable(item)
          //-----------  mechanical -------------
          this.orderFormMechanical = this._formBuilder.group({
        
            items: this._formBuilder.array([ 
               this.createItemMechanical(name)
            ])
          });



          this._castingService.GetmechamicalList().subscribe((a: any) => {
            if (a) {
                this.mechnicalData=a.Body;
                console.log(this.mechnicalData)
               // this. patchValueMechanical()                 
            }
            
          });
          // -----------end mechnaical -----------
          
    }

    openForm(buttonName){
        if(buttonName == 'Chemical'){
            this.inputFormValue=true
        }
        else{
            this.inputFormValue1=true
        }
    }
    formClose(){
        this.inputFormValue=false
        this.inputFormValue1=false
    }

    tabClick(tab) {
        console.log(tab.tab.textLabel);
        
      
        if(tab.tab.textLabel == 'Mechanical'){
            let count = 0;
            this.buttonName = 'Mechanical';
            this.inputFormValue1=false
            console.log(count);
            if(count == 0){
                this.patchValueMechanical()
              //  count += 1
            }
            else{
                
            }
        }
        else{
            this.buttonName = 'Chemical';
            // for(let i=0; i<this.mechnicalData.length; i++){
            //     const controls = <FormArray>this.orderFormMechanical.controls['items'];
            //     controls.removeAt(i);
            //     this.filteredOptions.splice(i, 1);
              
            //     console.log("this.mechnicalData[i].Name >>>>>>>>>>> ",this.mechnicalData[i].Name)
            //      }  
        }
      }



    patchValueMechanical(){


        let ite;
        const controls = <FormArray>this.orderFormMechanical.controls['items'];
        controls.removeAt(0);
        this.filteredOptions.splice(0, 1);
        console.log("controlscontrolscontrolscontrols value",controls.value)
        if(this.mechnicalData.length ){
        for(let i=0; i<this.mechnicalData.length; i++){
   
        this.items = this.orderFormMechanical.get('items') as FormArray;
        this.items.push(this.createItemMechanical(this.mechnicalData[i].Name));
        this.ManageNameControl111(this.items.length - 1);
        console.log("this.mechnicalData[i].Name >>>>>>>>>>> ",this.mechnicalData[i].Name)
         }  
        }
 }


  ManageNameControl111(index: number) {
    var arrayControl = this.orderFormMechanical.get('items') as FormArray;
    this.camical1[index] = arrayControl.at(index).get('ChemicalID').valueChanges
      .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.ChemicalID),
     
      );

  }

    createItemMechanical(name): FormGroup {
        return  this._formBuilder.group({
            ChemicalID:  new FormControl(name),
            MinValue:  ['0', []],
            MaxValue:  ['0', []],
            
        });
       this.ManageNameControl111(0)
      }




      public addMechanicalData(){
        
        const model: any = _.cloneDeep(this.orderFormMechanical.value);
        let item  = this.route.snapshot.queryParamMap.get('value')
        model.GradeId =item
        console.log(model)
        this._castingService.addSpecification(model).subscribe((a:any)=>{
              
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                
                this._toastr.successToast('Mechanical added succesfully');
               // console.log(a)
               let item1  = this.route.snapshot.queryParamMap.get('value')
               this.getMechanicalTable(item1)
              this.inputFormValue=false
              this.inputFormValue1=false
               
               } else {
                  this._toastr.errorToast(a.Status);
                  console.log(a)
               }
        })
      
    }
    getMechanicalTable(item){
        this._castingService.getMechanicalList(item).subscribe((a:any)=>{
                  
            console.log(a.Body)
            this.mechanicalData = a.Body;
           this.mechanicalData.map(row => {      
                row.isEditable = false;        
              }); 
       });
    } 


//      --------------------------------   Mechanical --------------------------------------
    getTable(item){
        this._castingService.getSpecificationlistbygradeid(item).subscribe((a:any)=>{
                  
            console.log(a.Body)
            this.gradelist = a.Body;
            this.gradelist.map(row => {      
                row.isEditable = false;        
              }); 

              this.listData = new MatTableDataSource(this.gradelist);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
       });
    } 

    public AddChemicalForm(): FormGroup {
        return this._formBuilder.group({
           
            Name: ['', [Validators.required]],
            
        });
    }

    public  addChemical() {
        let obj = this.indentFormAddChemical.value;
        console.log(obj.Name)
        this._castingService.AddChemical(obj.Name).subscribe((a: any) => {
           if (a && a.Status && a.Status.toLowerCase() === 'success') {
        
            this._toastr.successToast('Chemical added succesfully');
            this._fuseSidebarService.getSidebar('addvendorDetails').close();
            this.indentFormAddChemical.reset();
            this.getGetChemical();
           
           } else if(a.Status === 'Warning')
           {
              this._toastr.warningToast("Item already exists"); 
          }
          else{
              this._toastr.errorToast(a.Status)
          }
        });

    }  
    
    createItem(name): FormGroup {
        return  this._formBuilder.group({
            ChemicalID:   new FormControl(name),
           
           // ChemicalID:  ['', [Validators.required]],
            MinValue:  ['', [Validators.required]],
            MaxValue:  ['', [Validators.required]],
          
        });
      }

     goBack() {
    this.location.back();
  }
  public createIndentForm(): FormGroup {
    return this._formBuilder.group({
        casting: ['', [Validators.required]],
        grade: ['', [Validators.required]],
       
    });
}

public list(){
    this._castingService.GetCasting().subscribe((a: any) => {
        if (a) {
            this.casting=a.Body;
        } 
      });
}

getGetChemical(): any {
    this._castingService.GetChemical().subscribe((a: any) => {
        if (a && a.Body &&a.Body.length) {
            
            this.camical = a.Body;
            this.camical1 = of(a.Body);
            //console.log("camical",this.camical)
            
        }
       
    });
}




//   createCasting(id) {
    

//     console.log(id)
//     const dialogRef = this.dialog.open(AddRowTowComponent, {
//         width: '100%',
//         panelClass: ['max-950', 'center-align'],
//         data: { indentList: id},
//     });

//     dialogRef.afterClosed().subscribe(isSuccess => {
//         if(isSuccess) {
//             //this.getIndentList();
//         }
//     });
// }


getMechanical(){
this._castingService.GetmechamicalList().subscribe((a: any) => {
    if (a) {
        this.mechnicalData=a.Body;
        console.log(this.dataSource)
     
        
    }
    
  });
}
MechanicalList(id){
    this.getMechanical();
    console.log(id)
    const dialogRef = this.dialog.open(MechanicalListComponent, {
        width: '100%',
        panelClass: ['max-950', 'center-align'],
        data: { indentList: id},
    });

    dialogRef.afterClosed().subscribe(isSuccess => {
        if(isSuccess) {
            //this.getIndentList();
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
            case 'IndentDate': return this.compare(a.CreateDate, b.CreateDate, isAsc);
            case 'priority': return this.compare(a.Priority, b.Priority, isAsc);
            case 'category': return this.compare(a.CategoryName, b.CategoryName, isAsc);
            case 'quantity': return this.compare(a.Quantity, b.Quantity, isAsc);
            case 'name': return this.compare(a.ItemName, b.ItemName, isAsc);
            default: return 0;
          }
        });
    }

    openView(){
        
           
                this.dialog.open(SpecificationhistoryComponent, {
                    width: '100%',
                    panelClass: ['medium-modal', 'center-align'],
                    data: { indentList: this.dataSource},
                    
                });
          
            
        
    }

 
    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    search(ev) {
        let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
        this.dataSource = this.indentList.filter((item) => item.ItemName.toLowerCase().includes(searchStr));
    }

    
    get(){
        var csv =[];
        for(let i=0;i<this.dataSource.length;i++){
        this.someData = 
            {SNo: i+1, GradeName: this.dataSource[i].GradeName}
        
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
    
        filename = 'SpecificationGradeList.csv';
    
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
    
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }


//-------------------------------------


patchValue(name){
    this.formgroupButton=true
  console.log(name)
    if(this.counter == undefined)
    { 
         this.myvalue = name.Name;
        // this.delRow = this.camical.indexOf(name);
        // this.orderForm.get('items').valueChanges.subscribe((value) => {
           

        //     value[0].ChemicalID = name.Name;
            
        // });
      
        const controls = <FormArray>this.orderForm.controls['items'];
        controls.removeAt(0);
        this.filteredOptions.splice(0, 1);
        this.items = this.orderForm.get('items') as FormArray;
        this.items.push(this.createItem11(name.Name));
        this.ManageNameControl1(this.items.length - 1);
       
        this.counter++;
        
    }
    else{
        this.myvalue = name.Name;
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem11(name.Name));
    this.ManageNameControl1(this.items.length - 1);
       
        // this.orderForm.get('items').valueChanges.subscribe((value) => {
          
        //     value[0].ChemicalID = name.Name;
            
        // });


        this.delRow = this.camical.indexOf(name);
    }
     



    // console.log("patch value ",name.Name)
    // this.myvalue = name.Name;
    // this.delRow = this.camical.indexOf(name);
    // console.log("(this.delRow  ",this.delRow) 
    // if (this.delRow > -1) {
    //     this.camical.splice(this.delRow,1);
    //   }
    //   else{
    //     console.log("(this.delRow > -1 ",name) 
    //   }
    
    
    
   
    // console.log(this.camical)  

    


//   this.orderForm.get('items').valueChanges.subscribe((value) => {
//             console.log(value[0].ChemicalID)

//             value[0].ChemicalID = this.myvalue;
        
//         });

//         console.log("patch value ",this.orderForm.value)
    
 }


  ManageNameControl1(index: number) {
    var arrayControl = this.orderForm.get('items') as FormArray;
    this.camical1[index] = arrayControl.at(index).get('ChemicalID').valueChanges
      .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.ChemicalID),
     // map(name => name ? this._filter(name) : this.options.slice())
      );

  }
//(name),
  createItem11(name): FormGroup {
    return  this._formBuilder.group({
        ChemicalID:  new FormControl(name),
        MinValue:  ['', [Validators.required]],
        MaxValue:  ['', [Validators.required]],
        
    });
   
  }

  removeItem(i: number) {
    this.formgroupButton=true
    const controls = <FormArray>this.orderForm.controls['items'];
    controls.removeAt(i);
    
    this.filteredOptions.splice(i, 1);

  }

  addVendorDetail(){

      
    this._fuseSidebarService.getSidebar('addvendorDetails').toggleOpen();
  }

  EditFormData(buttonName){
    //this.listData.isEditable =true;
  }

  editRow(row) {
    this.gradelist.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
row.isEditable = true;
// this.gradelist.isEditable =true;
}
close(row){
    row.isEditable = false;
}
save(row){
row.isEditable = false;
this._castingService.EditSpecification(row).subscribe((a :any) =>{
    if( a && a.Status && a.Status.toLowerCase() === 'success' )
       {
        this._toastr.successToast('Chemical Edited succesfully');
        let item  = this.route.snapshot.queryParamMap.get('value')  
        this.getMechanicalTable(item)
       }
    else{
           this._toastr.errorToast(a.Status);
        } 

});

}

delete(row){
// console.log(row);
this.delRow = this.gradelist.indexOf(row);
this.gradelist.splice(this.delRow,1);
// console.log(this.dataSource);

this._castingService.DeleteSpecification(row).subscribe((a:any)=>{
    //  console.log(a)
      if (a && a.Status && a.Status.toLowerCase() === 'success') {
          this._toastr.successToast('Item deleted succesfully');
          //let obj = this.indentForm.value;
        //  this.getList(obj.casting);  
        let item  = this.route.snapshot.queryParamMap.get('value')  
        this.getTable(item) 
        this.getMechanicalTable(item)    
      } else {
          this._toastr.errorToast(a.Status);
      } 
  });

}



public addData(){
        
    const model: any = _.cloneDeep(this.orderForm.value);
    let item  = this.route.snapshot.queryParamMap.get('value')  
    model.GradeId =item
    console.log(model)
    this._castingService.addSpecification(model).subscribe((a:any)=>{
          
        if (a && a.Status && a.Status.toLowerCase() === 'success') {
            
            this._toastr.successToast('Material added succesfully');
            this.formgroupButton=false
            this.inputFormValue=false
            const controls = <FormArray>this.orderForm.controls['items'];
            let len = controls.length
            for(let i = 0; i<len; i++){
                console.log(controls.removeAt(i))
                controls.removeAt(i);
                controls.removeAt(i);
                this.filteredOptions.splice(0, i);
            }
            this.getTable(item)    
            // this._castingService.getSpecificationlistbygradeid(this.data.indentList.ID).subscribe((a:any)=>{
          
            //     console.log(a.Body)
            //     this.gradelist = a.Body;
            //     this.gradelist.map(row => {      
            //         row.isEditable = false;        
            //       }); 
            // })
           
           } else {
              this._toastr.errorToast(a.Status);
              
           }
    })
  
}






} 
