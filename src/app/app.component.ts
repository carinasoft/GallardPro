import { Component, Inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable, Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { Router } from '@angular/router';
import { FuseNavigation } from '@fuse/types';
import { clearResolutionOfComponentResourcesQueue } from '@angular/core/src/metadata/resource_loading';


const Nav = [
    {
        id      : 'admin',
        title   : 'Login',
        type    : 'group',
        icon    : 'apps',
        children: [
            {
                id   : 'user',
                title: 'Login',
                type : 'item',
                icon : 'person',
                url  : '/indent/user'
            },
            {
                id   : 'payments',
                title: 'Payments',
                type : 'item',
                icon : 'attach_money',
                url  : '/apps/academy'
            }
        ]
    },
    {
        id      : 'control-panel',
        title   : 'Control Panel',
        type    : 'group',
        icon    : 'apps',
        children: [
            {
                id   : 'cron-jobs',
                title: 'Cron Jobs',
                type : 'item',
                icon : 'settings',
                url  : '/apps/file-manager'
            },
            {
                id   : 'maintenance-mode',
                title: 'Maintenance Mode',
                type : 'item',
                icon : 'build',
                url  : '/apps/todo'
            }
        ]
    }
];



const Nav1 = [
    {
        id      : 'admin',
        
        type    : 'group',
        icon    : 'apps',
        children: [
           
            {
                id   : 'payments',
                title: 'Generated PO',
                type : 'item',
               
                url  : '/indent/gslsecurity'
            },
            {
                id   : 'maintenance-mode',
                title: 'Goods & Receive Note',
                type : 'item',
               
                url  : '/indent/goodnote'
            }
        ]
    },
    //{
    //     id      : 'control-panel',
    //     title   : 'Control Panel',
    //     type    : 'group',
    //     icon    : 'apps',
    //     children: [
         
    //         {
    //             id   : 'maintenance-mode',
    //             title: 'Goods & Receive Note',
    //             type : 'item',
               
    //             url  : '/indent/goodnote'
    //         }
    //     ]
    // }
];




const Nav2: FuseNavigation[] = [
    {
        id      : 'admin1',
        title   : 'Storekeeper',
        type    : 'group',
        icon    : 'apps',
        children: [
           
            {
                id   : 'Keeper',
                title: 'Indent',
                type : 'item',
            
                url  : '/indent/storekeeper'
            },
            {
                id   : 'cron-jobs',
                title: 'Stock',
                type : 'item',
                
                url  : '/indent/storekeeperissue'
             }
        ]
    },
    // {
    //     id      : 'control-panel',
    //     title   : '',
    //     type    : 'group',
    //     icon    : 'apps',
    //     children: [
    //         {
    //             id   : 'cron-jobs',
    //             title: 'Issue',
    //             type : 'item',
    //             icon : 'settings',
    //             url  : '/indent/storekeeperissue'
    //          },
    //         // {
    //         //     id   : 'maintenance-mode',
    //         //     title: 'Stock Summary',
    //         //     type : 'item',
    //         //     icon : 'build',
    //         //     url  : '/apps/todo'
    //         // }
    //     ]
    // }
];


@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})



export class AppComponent implements OnInit, OnDestroy
{
    @HostListener('window:onbeforeunload', ['$event'])
    clear(){
        window.onbeforeunload = function (e) {
            window.onunload = function () {
                    window.localStorage.isMySessionActive = "false";
            }
            return undefined;
        };
        
        window.onload = function () {
                    window.localStorage.isMySessionActive = "true";
        };
    }
    fuseConfig: any;
    navigation: any;
    User:any;

    // Private
    private _unsubscribeAll: Subject<any>;

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


    onlineEvent: Observable<Event>;
    offlineEvent: Observable<Event>;
    subscriptions: Subscription[] = [];
  
    connectionStatusMessage: string;
    connectionStatus: string;



    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        public router:Router
    )
    {
        
        this.navigation = navigation;
        

      


         this.User = localStorage.getItem('User')
        
        if(this.User == 'Admin'){
            // this._fuseNavigationService.register('main', this.navigation);
            // this._fuseNavigationService.setCurrentNavigation('main');
             this.router.navigate(["/indent/create"]);
        }
        else if(this.User == 'Security'){
            this._fuseNavigationService.register('Nav1', Nav1);
            this._fuseNavigationService.setCurrentNavigation('Nav1');
        }
        else if(this.User == 'StoreKeeper'){
            this._fuseNavigationService.register('Nav2', Nav2);
            this._fuseNavigationService.setCurrentNavigation('Nav2');
        }
        else{
            this.router.navigate(["/indent/user"]);
        }
        

        
        this._translateService.addLangs(['en', 'tr']);

        
        this._translateService.setDefaultLang('en');

       
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

     
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if ( this._platform.ANDROID || this._platform.IOS )
        {
            this.document.body.classList.add('is-mobile');
        }

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
        // ------------------------------------------------------------------

        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');
    
        this.subscriptions.push(this.onlineEvent.subscribe(e => {
          this.connectionStatusMessage = 'Back to online';
          this.connectionStatus = 'online';
          console.log('Online...');
        
        
        }));
    
        this.subscriptions.push(this.offlineEvent.subscribe(e => {
          this.connectionStatusMessage = 'Connection lost! You are not connected to internet';
          this.connectionStatus = 'offline';
          console.log('Offline...');
          window.location.reload();

        }));

        // ------------------------------------------------------------------

        this.User = localStorage.getItem('User')
        // Register the navigation to the service
        if(this.User == 'Admin'){
            this._fuseNavigationService.register('main', this.navigation);
            this._fuseNavigationService.setCurrentNavigation('main');
        }
        else if(this.User == 'Security'){
            this._fuseNavigationService.register('Nav1', Nav1);
      this._fuseNavigationService.setCurrentNavigation('Nav1');
        }
        else if(this.User == 'StoreKeeper'){
            this._fuseNavigationService.register('Nav2', Nav2);
            this._fuseNavigationService.setCurrentNavigation('Nav2');
        }
        else{
            //this._fuseNavigationService.register('Nav', Nav);
            this.router.navigate(["/indent/user"]);
            // Set the current navigation
           // this._fuseNavigationService.setCurrentNavigation('Nav');
        }
        

        // Subscribe to config changes
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

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        console.log("key >>>",key)
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

}
