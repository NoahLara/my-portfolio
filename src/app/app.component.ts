import { Component, ElementRef, ViewChild } from '@angular/core';
import { Experience } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  experiences: Experience[] = [
    {
      startYear: '2022',
      endYear: 'Present',
      title: 'FullStack Developer Analyst',
      company: 'ORIGEN COWORK',
      link: 'https://www.origencorp.net/',
      description: `I have worked on 2 full-stack projects and 3 Frontend projects, all successfully deployed for companies such as Banco Integral de El Salvador and Sherwin Williams Central America, using the Scrum framework. In some projects, I led the end-to-end supervision and contributed to requirements gathering and UX/UI design. Additionally, I was responsible for presenting demos to clients and managing communication during continuous deliveries.`,
      technologies: [
        { name: 'Angular', icon: '' },
        { name: 'NodeJS', icon: '' },
        { name: 'Nest', icon: '' },
        { name: 'PostgreSql', icon: '' },
        { name: 'Microsoft SQLServer', icon: '' },
        { name: 'Illustrator', icon: '' },
        { name: 'Figma', icon: '' },
        { name: 'Photoshop', icon: '' },
      ]
    },
    {
      startYear: '2021',
      endYear: '2022',
      title: 'FullStack Developer Analyst',
      company: 'Creativa Studio',
      link: 'https://creativastudios.us/',
      description: `I was part of the LaPlacita Ecommerce project, where I implemented a module that displayed real-time online store orders on a graphical monitor. Additionally, I developed a real-time sales analysis comparing the current month's sales with the previous month. I also participated in the implementation of a payment gateway and added features such as Newsletters, Contact Us, Affiliate, and Product Filtering by Categories.`,
      technologies: [
        { name: 'Angular', icon: '' },
        { name: 'NodeJS', icon: '' },
        { name: 'PostgreSql', icon: '' },
      ]
    },
    {
      startYear: '2019',
      endYear: '2021',
      title: 'Bilingual Agent',
      company: 'At&t - Teleperformance El Salvador',
      link: 'https://www.teleperformance.com/es-sv/locations/el-salvador-site/el-salvador-careers/',
      description: `I worked as a Customer Service Agent for the North American company AT&T in the Secondary Customer Service & Sales Group. My role was to resolve customer inquiries and issues related to their phones, orders, payment tracking, and product sales.`,
      technologies: [
        { name: 'English B2-C1', icon: '' },
        { name: 'Excel', icon: '' },
        { name: 'At&t Ecosystem', icon: '' }
      ]
    }
  ];


  title = 'pp';
}
