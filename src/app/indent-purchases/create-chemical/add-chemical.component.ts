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
import { CastingService } from 'app/services/casting.service';



@Component({
    selector     : 'add-chemical',
    templateUrl  : './add-chemical.component.html',
    styleUrls    : ['./add-chemical.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AddchemicalComponent implements OnInit, OnDestroy, OnChanges {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    public pageType: string;
    public indentForm: FormGroup;
    public materialList = [];
    public categoryList = [];
    public unitList = [];
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
        public dialogRef: MatDialogRef<AddchemicalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _castingService: CastingService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService
    ) {

       
        this._unsubscribeAll = new Subject();
    }

    public ngOnInit(): void {
        
        this.indentForm = this.createIndentForm();
    
    }

    public createIndentForm(): FormGroup {
        return this._formBuilder.group({
           
            Name: ['', [Validators.required]],
           
        });
    }


    

    public  addChemical() {
        let obj = this.indentForm.value;
        //console.log(obj.Name)
        this._castingService.AddChemical(obj.Name).subscribe((a: any) => {
           if (a && a.Status && a.Status.toLowerCase() === 'success') {
        
            this._toastr.successToast('Chemical added succesfully');
            this.dialogRef.close(true);
           
           }
           else(a && a.Status && a.Status.toLowerCase() === 'Warning')
           {
                this._toastr.warningToast("Item  already exists.")
           }
        //    else {
        //       this._toastr.errorToast(a.Status);
        //    }
        });

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
        console.log(s);
    }

    


    


}

