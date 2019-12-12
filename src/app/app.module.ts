import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
import { APP_RESOLVER_PROVIDERS } from 'app/app.resolver';
import { WindowRef } from '@agm/core/utils/browser-globals';
import { ServiceModule } from 'app/services/service.module';
import { ToastrModule } from 'ngx-toastr';
//import { CastingProductModule } from './casting-product/casting-product.module';
import { HttpModule } from '@angular/http';
import { IndentPurchaseModule } from './indent-purchases/indent-purchase.module';
import { OnlineStatusComponent } from './indent-purchases/online-status/OnlineStatus.component';

const appRoutes: Routes = [
    //{
    //    path        : 'apps',
    //    loadChildren: './main/apps/apps.module#AppsModule'
    //},
    //{
    //    path        : 'pages',
    //    loadChildren: './main/pages/pages.module#PagesModule'
    //},
    //{
    //    path        : 'ui',
    //    loadChildren: './main/ui/ui.module#UIModule'
    //},
    //{
    //    path        : 'documentation',
    //    loadChildren: './main/documentation/documentation.module#DocumentationModule'
    //},
    //{
    //    path        : 'angular-material-elements',
    //    loadChildren: './main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule'
    //},
    // {
    //     path      : '**',
    //     redirectTo: 'apps/dashboards/analytics'
    // },
    {
        path        : 'indent',
        loadChildren: './indent-purchases/indent-purchase.module#IndentPurchaseModule'
    },
    // {
    //     path        : 'casting',
    //     loadChildren: './casting-product/casting-product.module#CastingProductModule'
    // },
];

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  // { provide: APP_BASE_HREF, useValue: './' }
];
@NgModule({
    declarations: [
        AppComponent,OnlineStatusComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpModule,

        RouterModule.forRoot(appRoutes, {useHash: true, onSameUrlNavigation: 'reload'}),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        ToastrModule.forRoot(),

        // App modules
        LayoutModule,
        AppStoreModule,
        ServiceModule.forRoot(),
       
     
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        APP_PROVIDERS,
        WindowRef,
        
        
       
    ]
})
export class AppModule
{
}
