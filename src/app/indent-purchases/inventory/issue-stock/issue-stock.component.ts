import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter, Input, OnChanges, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IndentService } from 'app/services/indent.service';
import { ToasterService } from 'app/services/toaster.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';


export const gstList = [0, 5, 12, 18, 28];
export const priority = ['normal', 'urgent'];

@Component({
    selector     : 'issue-stock',
    templateUrl  : './issue-stock.component.html',
    styleUrls    : ['./issue-stock.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class IssueStockComponent implements OnInit, OnChanges
{
    @Output('indentCreated') indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    @Input() dataSource: any[] = [];
    
    pageType: string;
    indentForm: FormGroup;
    materialList = [];
    categoryList = [];
    unitList = [];
    gstList = gstList;
    priority = priority;
    materialFilter: Observable<any[]> = of([]);
    categoryFilter: Observable<any[]> = of([]);
    unitFilter: Observable<any[]> = of([]);
    public noMaterialFound = false;
    public noUnitFound = false;
    public moment = moment;
    isUpdate = false;
    addMaterialForm: FormGroup;
    IssueStockForm: any = {};
    displayedColumns = ['serial', 'name', 'Orgqty', 'IssuedQty', 'unit', 'action'];


    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<IssueStockComponent>,        
        @Inject(MAT_DIALOG_DATA) public data: any,        
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
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
        this.getRawMaterial();
        this.getCategory();
        this.getStockUnit();
        this.indentForm = this.createProductForm();
        this.addMaterialForm = this.addNewRawMaterial();
        // this.IssueStockForm = this.IssueNewStock();

    }

    createProductForm(): FormGroup
    {
        return this._formBuilder.group({
            CreateDate: ['', [Validators.required]],
            RawMaterialId: ['', [Validators.required]],
            CategoryId: [{value: '', disabled: true}],
            Quantity: ['', [Validators.required]],
            IndentId: [{value: this.GenerateUniqueID(), disabled: true}],
            UOMID: [{value: '', disabled: true}, [Validators.required]],
            HsnCode: [''],
            Gst: ['', [Validators.required]],
            Priority: ['', [Validators.required]]
        });
    }

    addNewRawMaterial(): FormGroup
    {
        return this._formBuilder.group({
            ItemName: ['', [Validators.required]],
            CategoryId: ['', [Validators.required]],
            UOMID: ['', [Validators.required]],
        });
    }

    IssueNewStock() {
        return this._formBuilder.group({
            RawMaterialId: ['', [Validators.required]],
            Name: ['', [Validators.required]],
            Quantity: ['', [Validators.required]],
            IssueDate: ['', [Validators.required]],
        });
    }

    IssueStock(): any {
        var boolean =true;
        const model: any = _.cloneDeep(this.IssueStockForm);
        model.IssueList = _.cloneDeep(this.data.material);
        model.IssueDate = moment(model.IssueDate).format('YYYY-MM-DD');
console.log(model,"","IssueList")

console.log(model.IssueList.length)

    for(let i=0; i<model.IssueList.length; i++){
          let Quantity = model.IssueList[i].Quantity;
          let OrderQuantity = model.IssueList[i].IssueQuantity;
          if(Quantity >= OrderQuantity){
            console.log(Quantity,"Q < ORDERQ",OrderQuantity)
            
          }
          else{
          alert("OrderQuantity:" + OrderQuantity + " is greter than your actual Quantity:"+ Quantity)
          boolean=false;
          }
    }
   if(boolean == true){
     console.log("Web service")
     this._indentService.IssueStock(model).subscribe(a => {
            console.log(a)
            if (a && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Stock issued succesfully');
                this.IssueStockForm = {};
                // this.IssueStockForm.reset();
                this.dialogRef.close(true);
            } else {
                this._toastr.errorToast(a.Body);
                // this.dialogRef.close(false);                
            }
        });
   }
   else{
     console.log("Web service false")
   }


        // this._indentService.IssueStock(model).subscribe(a => {
        //     console.log(a)
        //     if (a && a.Status.toLowerCase() === 'success') {
        //         this._toastr.successToast('Stock issued succesfully');
        //         this.IssueStockForm = {};
        //         // this.IssueStockForm.reset();
        //         this.dialogRef.close(true);
        //     } else {
        //         this._toastr.errorToast(a.Body);
        //         // this.dialogRef.close(false);                
        //     }
        // });
    }

    showToaster() {
        this._matSnackBar.open('Indent added succesfully', '', {
            duration: 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
    }

    getRawMaterial() {
        this._indentService.GetRawMaterial().subscribe((a: any) => {
            if (a) {
                this.materialList = a.Body;
            }
        });
    }

    getStockUnit() {
        this._indentService.GetStockUnit().subscribe((a: any) => {
            if (a) {
                this.unitList = a.Body;
            }
        });
    }

    getCategory() {
        this._indentService.GetCategory().subscribe((a: any) => {
            if (a) {
                this.categoryList = a.Body;
            }
        });
    }

    addRawMaterial() {
        const obj = this.addMaterialForm.value;
        this._indentService.AddRawMaterial(obj).subscribe((a: any) => {
           if (a && a.Status.toLowerCase() === 'success') {
               this.materialList.push(a.Body);
               this._toastr.successToast('Material added succesfully');
                this.addMaterialForm = this.addNewRawMaterial();
           } else {
              this._toastr.errorToast(a.Status);
           }
        }); 

    }



    addUnit() {
        const val = this.addMaterialForm.get('UOMID').value;
        if (!val) {
            return this._toastr.warningToast('Unit can\'t be blank');
        }
        this._indentService.AddStockUnit(val).subscribe((a: any) => {
           if (a && a.Status.toLowerCase() === 'success') {
               this.unitList.push(a.Body);
               this._toastr.successToast('Stock Unit added succesfully');
           } else {
              this._toastr.errorToast(a.Status);
              this.indentForm.patchValue({unit: ''});
           }
        }); 
    }


    addCategory() {
        const val = this.addMaterialForm.get('CategoryId').value;
        if (!val) {
            return this._toastr.warningToast('Category can\'t be blank');
        }
        this._indentService.AddCategory(val).subscribe((a: any) => {
            if (a && a.Status.toLowerCase() === 'success') {
                this.categoryList.push(a.Body);
               this._toastr.successToast('Category added succesfully');
           } else {
              this._toastr.errorToast(a.Status);
           }
        }); 
    }

    GenerateUniqueID() {
      return (Math.random() * (105000 - 784001) + 784001) | 0;
    }

    onSelectMaterial(value) {
        if (!value) {
            return;
        }
        this.indentForm.get('CategoryId').enable();
        this.indentForm.get('UOMID').enable();
        this.indentForm.patchValue({CategoryId: value.CategoryId, UOMID: value.UOMID});
        this.indentForm.get('CategoryId').disable();    
        this.indentForm.get('UOMID').disable();
    }


    openRawMaterialForm() {
        const newMaterialName = this.indentForm.get('RawMaterialId').value;
        this.addMaterialForm.patchValue({ItemName: newMaterialName});
        this._fuseSidebarService.getSidebar('rawMaterialForm').toggleOpen();
    }

    closeModal() {
        this.dialogRef.close(true);
    }

    removeItem(idx) {
        this.data.material.splice(idx, 1);  
        console.log(this.data.material);     
        
        this.data.material
        this.data.material = _.cloneDeep( this.data.material);  
        // this.data.material=this.data.material.splice(idx, 1); 
        // console.log(this.data.material);

        
    //     console.log(idx)
    //   if (this.data.material.length > 1) {
    //     this.data.material = this.data.material.splice(idx, 1);  
    //     console.log(this.data.material);      
    //   } else {
    //     this._toastr.warningToast('Atleast 1 material required');
    //   }
    }

    ngOnChanges(s) {
        // 
    }



    private _filter(value: string, type) {

        const filterValue = value.toLowerCase();
        return this.materialList.filter( (option: any) => option.ItemName.toLowerCase().includes(filterValue));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
