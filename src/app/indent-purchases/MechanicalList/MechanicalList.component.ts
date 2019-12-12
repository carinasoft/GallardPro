import { Component, EventEmitter, OnDestroy,Input, OnInit, Output, ViewEncapsulation, Inject, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { IndentService } from "app/services/indent.service";
import { ToasterService } from "app/services/toaster.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { CastingService } from 'app/services/casting.service';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';

import { map, startWith } from 'rxjs/operators';
export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }


const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    
  ];

@Component({
    selector     : 'MechanicalList',
    templateUrl  : './MechanicalList.component.html',
    styleUrls    : ['./MechanicalList.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class MechanicalListComponent implements OnInit {

    @Output('indentCreated') public indentCreated: EventEmitter<boolean> = new EventEmitter(false);
    //filteredUsers: chemical[] = [];
    @Input() disabled = true;
    public pageType: string;
    public indentForm: FormGroup;
    public indentForm1: FormGroup;
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
    displayedColumns: string[] = ['id', 'progress','name','name1', 'color','color1'];
    // Private
    private _unsubscribeAll: Subject<any>;
    dataSource = ELEMENT_DATA;
    myModel: any;
    gradelist:any;
    camical:any;
    camical1:any;
    orderForm: FormGroup;
    isLoading = false;
    items: FormArray;
    vendorDetails:any;
    delRow;
    myvalue:any;
    counter:number;
    filteredOptions: Observable<[]>[] = [];
    someData:any;;
    final=[];
    mechnicalData:any;
    constructor(
        public dialogRef: MatDialogRef<MechanicalListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private _fuseSidebarService: FuseSidebarService,
        private _castingService: CastingService
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    public ngOnInit(): void {
        this.getGetChemical();

        this._castingService.getSpecificationlistbygradeid(this.data.indentList.ID).subscribe((a:any)=>{
              
          //  console.log(a.Body)
            this.gradelist = a.Body;
            this.gradelist.map(row => {      
                row.isEditable = false;        
              }); 
        })

        this.orderForm = this._formBuilder.group({
        
            items: this._formBuilder.array([ 
               this.createItem(name)
            ])
          });

   
            this._castingService.GetmechamicalList().subscribe((a: any) => {
                if (a) {
                    this.mechnicalData=a.Body;
                    console.log(this.dataSource)
                    this. patchValue()   
                }
                
              });
         
        
    }


    

    

    getGetChemical(): any {
        this._castingService.GetChemical().subscribe((a: any) => {
            if (a && a.Body &&a.Body.length) {
                
                this.camical = a.Body;
                this.camical1 = of(a.Body);
             //   console.log("camical",this.camical)
                
            }
           
        });
    }
    
   
    patchValue(){
       
  
      
            // const controls = <FormArray>this.orderForm.controls['items'];
            // controls.removeAt(0);
            // this.filteredOptions.splice(0, 1);
            // this.items = this.orderForm.get('items') as FormArray;
            // this.items.push(this.createItem());
            // this.ManageNameControl1(this.items.length - 1);
           
          const controls = <FormArray>this.orderForm.controls['items'];
            controls.removeAt(0);
            this.filteredOptions.splice(0, 1);
            
      for(let i=0; i<this.mechnicalData.length; i++){
           
        this.items = this.orderForm.get('items') as FormArray;
        this.items.push(this.createItem(this.mechnicalData[i].Name));
        this.ManageNameControl(this.items.length - 1);
           
      }
    
    
   
    
        
     }

    
      ManageNameControl(index: number) {
        var arrayControl = this.orderForm.get('items') as FormArray;
        this.camical1[index] = arrayControl.at(index).get('ChemicalID').valueChanges
          .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.ChemicalID),
         
          );
    
      }

      createItem(name): FormGroup {
        return  this._formBuilder.group({
            ChemicalID:  new FormControl({ value: name, disabled: this.disabled }),
            MinValue:  ['', [Validators.required]],
            MaxValue:  ['', [Validators.required]],
            
        });
       
      }

      
      editRow(row) {
        this.gradelist.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    }
    
    save(row){
    row.isEditable = false;
    this._castingService.EditSpecification(row).subscribe((a :any) =>{
        if( a && a.Status && a.Status.toLowerCase() === 'success' )
           {
            this._toastr.successToast('Mechanical Edited succesfully');
           
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
              this._toastr.successToast('Mechanical deleted succesfully');
              //let obj = this.indentForm.value;
            //  this.getList(obj.casting);  
            this.getTable();         
          } else {
              this._toastr.errorToast(a.Status);
          } 
      });
    
    }


    getTable(){
        this._castingService.getSpecificationlistbygradeid(this.data.indentList.ID).subscribe((a:any)=>{
                  
            console.log(a.Body)
            this.gradelist = a.Body;
            this.gradelist.map(row => {      
                row.isEditable = false;        
              }); 
       });
    } 


    

   

   

    public addData(){
        
        const model: any = _.cloneDeep(this.orderForm.value);
        model.GradeId =this.data.indentList.ID
        console.log(model)
        this._castingService.addSpecification(model).subscribe((a:any)=>{
              
            if (a && a.Status && a.Status.toLowerCase() === 'success') {
                
                this._toastr.successToast('Mechanical added succesfully');
               // console.log(a)
               this.getTable();
               
               } else {
                  this._toastr.errorToast(a.Status);
                  console.log(a)
               }
        })
      
    }

   
   }
