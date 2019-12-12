import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, Inject, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { IndentService } from "app/services/indent.service";
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';

export const gstList = [0, 5, 12, 18, 28];
export const priority = ['normal', 'urgent'];

@Component({
    selector     : 'add-indent',
    templateUrl  : './add-indent.component.html',
    styleUrls    : ['./add-indent.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AddIndentComponent implements OnInit, OnDestroy, OnChanges {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    public pageType: string;
    public indentForm: FormGroup;
    public materialList = [];
    public categoryList = [];
    public unitList = [];
    public gstList = gstList;
    public priority = priority;
    public materialFilter: Observable<any[]> = of([]);
    public categoryFilter: Observable<any[]> = of([]);
    public unitFilter: Observable<any[]> = of([]);
    public noMaterialFound: boolean = false;
    public noUnitFound: boolean = false;
    public moment = moment;
    public isUpdate = false;
    public addMaterialForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddIndentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    public ngOnInit(): void {
        this.getRawMaterial();
        this.getCategory();
        this.getStockUnit();
        this.indentForm = this.createIndentForm();
        this.addMaterialForm = this.addNewRawMaterial();


        this.indentForm.controls['RawMaterialId'].valueChanges.subscribe((value) => {
            if (value) {
                this.materialFilter = of(this._filter(value, 'material'));
            } else {
                this.materialFilter = of(this.materialList);
            }
        });

        this.addMaterialForm.controls['CategoryId'].valueChanges.subscribe((value) => {
            if (value) {
                 this.categoryFilter = of(this._filter(value, 'category'));
              } else {
                  this.categoryFilter = of(this.categoryList);
              }
        });

        this.addMaterialForm.controls['UOMID'].valueChanges.subscribe((value) => {
           if (value) {
                this.unitFilter = of(this._filter(value, 'unit'));
            } else {
                this.unitFilter = of(this.unitList);
            }
        });

        if(this.data && this.data.RawMaterialId) {
            let objToPatch = _.cloneDeep(this.data);
            objToPatch.RawMaterialId = objToPatch.ItemName;
            this.indentForm.patchValue(objToPatch);
            this.indentForm.disable();
            this.indentForm.get('Quantity').enable();                        
            this.isUpdate = true;            
        } else {
            this.indentForm.enable();
            this.indentForm.get('IndentId').disable();
            this.isUpdate = false;
        }

    }

    public createIndentForm(): FormGroup {
        return this._formBuilder.group({
            CreateDate: [moment(), [Validators.required]],
            RawMaterialId: ['', [Validators.required]],
            CategoryId: [{value: '', disabled: true}],
            Quantity: ['', [Validators.required]],
            IndentId: [{value: moment().format('YYYYMMDDHHss'), disabled: true}],
            UOMID: [{value: '', disabled: true}, [Validators.required]],
            // HsnCode: [''],
            // Gst: ['', [Validators.required]],
            Priority: ['', [Validators.required]]
        });
    }

    public addNewRawMaterial(): FormGroup {
        return this._formBuilder.group({
            ItemName: ['', [Validators.required]],
            CategoryId: ['', [Validators.required]],
            UOMID: ['', [Validators.required]],
            HsnCode: [''],
            Gst: ['', [Validators.required]],
        });
    }

    public addNewIndent(): any {
        let model = this.prepareRequest();
        this._indentService.AddIndent(model).subscribe(a => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this._toastr.successToast('Indent added succesfully');
                this.indentCreated.emit(true);
                this.indentForm.reset();
                this.indentForm.get('IndentId').patchValue(this.GenerateUniqueID());
                this.materialFilter = of(this.materialList);
                //this.dialogRef.close(true);                
            } else {
                this._toastr.errorToast(a.Status);
                this.indentCreated.emit(false);
            }
        });
    }

    public getRawMaterial() {
        this._indentService.GetRawMaterial().subscribe((a: any) => {
            if (a) {
                this.materialList = a.Body;
                this.materialFilter = of(a.Body);
            }
        });
    }

    public getStockUnit() {
        this._indentService.GetStockUnit().subscribe((a: any) => {
            if (a) {
                this.unitList = a.Body;
                this.unitFilter = of(this.unitList);                
            }
        });
    }

    public getCategory() {
        this._indentService.GetCategory().subscribe((a: any) => {
            if (a) {
                this.categoryList = a.Body;
                this.categoryFilter = of(this.categoryList);
            }
        });
    }

    public  addRawMaterial() {
        let obj = this.addMaterialForm.value;
        this._indentService.AddRawMaterial(obj).subscribe((a: any) => {
           if (a && a.Status && a.Status.toLowerCase() === 'success') {
            this.materialList.push(a.Body);
            this.materialFilter = of(this.materialList);
            this._toastr.successToast('Material added succesfully');
            this.addMaterialForm.reset();
            this.onSelectMaterial(a.Body);
            this._fuseSidebarService.getSidebar('rawMaterialForm').close();
           } else {
              this._toastr.errorToast(a.Status);
           }
        });

    }

    public addUnit() {
        let val = this.addMaterialForm.get('UOMID').value;
        if (!val) {
            return this._toastr.warningToast("Unit can't be blank");
        }
        this._indentService.AddStockUnit(val).subscribe((a: any) => {
           if (a && a.Status && a.Status.toLowerCase() === 'success') {
               this.unitList.push(a.Body);
               this.unitFilter = of(this.unitList);
               this.addMaterialForm.patchValue({UOMID: a.Body.UOMID});
               this.indentForm.patchValue({CategoryId: a.Body.UOMID});                               
               this._toastr.successToast('Unit added succesfully');
           } else {
              this._toastr.errorToast(a.Status);
           }
        });
    }

    public addCategory() {
        let val = this.addMaterialForm.get('CategoryId').value;
        if (!val) {
            return this._toastr.warningToast("Category can't be blank");
        }
        this._indentService.AddCategory(val).subscribe((a: any) => {
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                this.categoryList.push(a.Body);
                this.categoryFilter = of(this.categoryList);                
                this.addMaterialForm.patchValue({CategoryId: a.Body.CategoryId});
                this.indentForm.patchValue({CategoryId: a.Body.CategoryId});                
               this._toastr.successToast('Category added succesfully');
           } else {
              this._toastr.errorToast(a.Status);
           }
        });
    }

    public GenerateUniqueID() {
      return (Math.random() * (105000 - 784001) + 784001)|0;
    }

    public onSelectMaterial(value) {
        if (!value) {
            return;
        }
        this.indentForm.get('CategoryId').enable();
        this.indentForm.get('UOMID').enable();
        this.indentForm.patchValue({CategoryId: value.CategoryId, UOMID: value.UOMID});
        this.indentForm.get('CategoryId').disable();
        this.indentForm.get('UOMID').disable();
    }

    public openRawMaterialForm() {
        let newMaterialName = this.indentForm.get('RawMaterialId').value;
        this.addMaterialForm.patchValue({ItemName: newMaterialName});
        this._fuseSidebarService.getSidebar('rawMaterialForm').toggleOpen();
    }

    // public updateIndent() {
    //     this.indentForm.enable();
    //     let model = this.prepareRequest();
    //     this._indentService.UpdateIndent(model).subscribe(a => {
    //         if (a && a.Status && a.Status.toLowerCase() === 'success') {
    //             this._toastr.successToast('Indent updated succesfully');
    //             this.materialFilter = of(this.materialList);
    //             this.dialogRef.close(true);
    //         } else {
    //             this._toastr.errorToast(a.Status);
    //         }
    //     });

    // }

    prepareRequest(){
        this.indentForm.get('IndentId').enable();
        const model: any = _.cloneDeep(this.indentForm.value);
        this.indentForm.get('IndentId').disable();

        let RawMaterial = _.find(this.materialList, (o: any) => {
                return o.ItemName === model.RawMaterialId;
        });

        if (RawMaterial) {
            model.RawMaterialId = RawMaterial.RawMaterialId;
        } else {
            return this._toastr.errorToast("Raw Material doesn't exist");
        }

        model.CreateDate = moment(model.CreateDate).format('MM/DD/YYYY');
        return model;
    }

    public ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        
    }

    public selectCategory(CategoryId) {
        if (!CategoryId) {
            return;
        }
        let selection = this.categoryList.find(e => e.CategoryId === CategoryId);
        if (selection) {
            return selection.CategoryName;
        }
    }

    public selectUnit(unitId) {
        if (!unitId) {
            return;
        }
        let selection = this.unitList.find(e => e.UOMID === unitId);
        if (selection) {
            return selection.UOM;
        }
    }


    private _filter(value: string, type) {
        console.log(value,type)
        if(Number(value)) {
            return;
        }
        let filterValue = value.toLowerCase();
        switch (type) {
            case 'material': {
                            return this.materialList.filter( (option: any) => option.ItemName.toLowerCase().includes(filterValue));
                        }
            case 'category': {
                            return this.categoryList.filter( (option: any) => option.CategoryName.toLowerCase().includes(filterValue));
                        }
            case 'unit': {
                            return this.unitList.filter( (option: any) => option.UOM.toLowerCase().includes(filterValue));
                        }
        }
    }


}

