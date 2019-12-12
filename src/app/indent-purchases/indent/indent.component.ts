import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { takeUntil } from 'rxjs/internal/operators';



@Component({
    selector     : 'indent',
    templateUrl  : 'indent.component.html',
    styleUrls    : ['indent.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class IndentComponent implements OnInit {
    public refreshList: boolean = false;
    constructor() {
        // 
    }

    public ngOnInit(): void {
        // 
    }

    public indentCreated(isCreated) {
        this.refreshList = isCreated;
    }
}

