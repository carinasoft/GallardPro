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
import { map, takeUntil, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { IndentHistoryComponent } from 'app/indent-purchases/indent/indent-history-modal/indent-history.component';
import { AddIndentComponent } from "app/indent-purchases/indent/create-indent/add-indent.component";
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient } from 'selenium-webdriver/http';
import { Http } from '@angular/http';
import { AuthenticationService } from 'app/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';






import {  Inject, OnDestroy, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';


import { FuseConfigService } from '@fuse/services/config.service';

import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';

import { FuseNavigation } from '@fuse/types';
import { clearResolutionOfComponentResourcesQueue } from '@angular/core/src/metadata/resource_loading';
@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class loginComponent implements OnInit {
    @Input() refreshList: boolean = false;
    @Output() updateIndent: EventEmitter<any> = new EventEmitter(null);
    dataSource: any[] = [];
    displayedColumns = ['selected', 'IndentDate', 'material', 'category', 'quantity', 'priority', 'action'];

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;
    moment = moment;
    indentList:any[] = [];
    //navigation: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    renderedData: any;
    UserName: string;
    Password: string;
    loginData = { UserName:'', Password:'' };
    User:any;
    //fuseConfig: any;
    fuseConfig: any;
    navigation: any;
    valueLoginForm:boolean
    // Private
   // private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */

    constructor(
        public AuthenticationService:AuthenticationService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _indentService: IndentService,
        private _toastr: ToasterService,
        private router: Router,
        public _httpClient: Http,
        public http:Http,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseNavigationService: FuseNavigationService,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
    )
    {

        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();

 this.User =localStorage.getItem('User')
 //this._fuseSidebarService.getSidebar('navbar').toggleFold();


 if ( this._platform.ANDROID || this._platform.IOS )
        {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.valueLoginForm=false;
        document.body.classList.add('bg-img');



        this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {

            this.fuseConfig = config;

            // Boxed
            if ( this.fuseConfig.layout.width === 'boxed' )
            {
                this.document.body.classList.add('boxed');
            }
            else
            {
                this.document.body.classList.remove('boxed');
            }

            // Color theme - Use normal for loop for IE11 compatibility
            for ( let i = 0; i < this.document.body.classList.length; i++ )
            {
                const className = this.document.body.classList[i];

                if ( className.startsWith('theme-') )
                {
                    this.document.body.classList.remove(className);
                }
            }

            this.document.body.classList.add(this.fuseConfig.colorTheme);
        });

        
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        
    }

    
    
   /**
     * Toggle sidebar open
     *
     * @param key
     */

    toggleSidebarOpen(key): void
    {
       this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
//----------Login -------------------------


login()  {
 
 this.valueLoginForm=true;
 this.http.post('/api/AdminApi/UserLogin?'+'UserName='+this.UserName+'&Password='+this.Password,{}).pipe(map(data => {
    let res = data.json()
      if(res.Status== 1){
              if(res.Details.AccountType == "Admin")
              {

                       this._fuseNavigationService.register('main', this.navigation);
                       this._fuseNavigationService.setCurrentNavigation('main');
                       localStorage.setItem('User','Admin')
                      // window.location.reload();
                       this.valueLoginForm=false;
                      // location.replace(window.location.href.replace("http://carinait.net/gallard/#/indent/user","http://carinait.net/gallard/#/indent/create"));
                     //  location.replace(window.location.href.replace("http://localhost:4000/#/indent/user","http://localhost:4000/#/indent/create"));
                     //http://carinait.net/gallard/indent/create  http://localhost:4000/indent/create this.router.navigate(["/indent/create"]);
                    
                     window.location.reload();
                    //  if (location.protocol == 'https:'){
                    //     console.log(window.location.href)
                    //     console.log(location.protocol)
                    //  }
                    //  else{
                    //     console.log(window.location.href)
                    //     console.log(location.protocol)
                    //  }
                     
              }
              else if(res.Details.AccountType == "Security"){
                        localStorage.setItem('User','Security')
                        //this.router.navigate(["/indent/gslsecurity"]);
                       this.router.navigate(["/"]);
                        
                        window.location.reload();
                    
              }
              else{
                       localStorage.setItem('User','StoreKeeper');
                       this.router.navigate(["/"]);
                       window.location.reload();
              }
      }
     else{
         alert("Invalid")
         this.valueLoginForm=false;
     }



 })).subscribe(result => {
      //console.log(result);
    });

    //.pipe(map((response: any) => response.json()));
    //_body: "{"Status":1,"Details":{"Id":1,"UserName":"Admin","Password":"Admin","AccountType":"Admin"}}"
    //Status":1,"Details":{"Id":1,"UserName":"Admin","Password":"Admin","AccountType":"Admin"}}
    // if(this.UserName == 'admin' && this.Password == 'admin'){

    //     localStorage.setItem('User','Admin')
    //     this.router.navigate(["/indent/create"]);
    //     window.location.reload();
    // }
    // else if(this.UserName == 'security' && this.Password == '123'){
    //     localStorage.setItem('User','Security')
    //     this.router.navigate(["/indent/gslsecurity"]);
    //     window.location.reload();
        
    // }
    // else if(this.UserName == 'storekeeper' && this.Password == '123'){
    //     localStorage.setItem('User','StoreKeeper');
    //     this.router.navigate(["/indent/storekeeper"]);
    //     window.location.reload();
    // }
    // else {
    //   alert("Invalid credentials");
    // }
   
    
  }
  login1(UserName,Password) {
    return this._httpClient.post('//api/AdminApi/UserLogin?', {UserName, Password}).pipe(tap(res => {
    console.log(res);
}))
  }




    //----------------Export File --------------------------

    exportTableToCSV(filename) {
        console.log(filename)
       var csv = [];
       var rows = document.querySelectorAll("table tr");
       console.log(rows)
       for (var i = 0; i < rows.length; i++) {
           var row = [], cols = rows[i].querySelectorAll(".mat-header-cell");
           
           for (var j = 0; j < cols.length; j++) 
               row.push(cols[j].innerHTML);
           
           csv.push(row.join(","));        
       }
   
       // Download CSV file
       //this.downloadCSV(csv.join("\n"), filename);
   }
   
//     downloadCSV(csv, filename) {
//      var csvFile;
//      var downloadLink;
   
//      // CSV file
//      csvFile = new Blob([csv], {type: "text/csv"});
   
//      // Download link
//      downloadLink = document.createElement("a");
   
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






} 






//----------------------------------------------------------------------------------------------------------


