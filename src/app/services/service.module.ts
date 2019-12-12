import { ErrorHandler } from './catchManager/catchmanger';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication.service';

import { HttpWrapperService } from './httpWrapper.service';
import { ToasterService } from './toaster.service';
import { IndentService } from 'app/services/indent.service';
import { CastingService } from './casting.service';
import { ClientService } from './client.service';
import { ProductService } from './product.service';
import { PlanningService } from './planning.service';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule
  ],
  exports: [CommonModule, FormsModule, RouterModule]
})
export class ServiceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        PlanningService,
        ProductService,
        ClientService,
        CastingService,
        IndentService,
        ToasterService,
        HttpWrapperService,
        ErrorHandler,
        AuthenticationService

      ]
    };
  }
}
