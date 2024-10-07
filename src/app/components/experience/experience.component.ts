import { Component, Input, OnInit } from '@angular/core';
import { Technologie } from 'src/app/interfaces';

@Component({
    selector: 'app-experience',
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
    @Input() startYear: string = '';
    @Input() endYear: string = '';
    @Input() title: string = '';
    @Input() company: string = '';
    @Input() description: string = '';
    @Input() link: string = '';
    @Input() technologies: Technologie[] = [];

    constructor() { }

    ngOnInit() { }
}