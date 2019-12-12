import { Component, ElementRef, Input,OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';




@Component({
    selector     : 'OnlineStatus',
    templateUrl  : './OnlineStatus.component.html',
    styleUrls    : ['./OnlineStatus.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class OnlineStatusComponent implements OnInit
{    
    @Input() onlineStatusMessage: string;
    @Input() onlineStatus: string;


    constructor(
        
    )
    {
        // Set the private defaults
   
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
       
    }
   

}


