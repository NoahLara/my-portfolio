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
      description: `I have successfully completed two full-stack projects and three frontend projects, all deployed for companies in the banking industry and the colors and painting sector, utilizing the Scrum framework. In several of these projects, I took the lead on end-to-end supervision, actively participating in requirements gathering and UX/UI design. Additionally, I was responsible for delivering client presentations and managing communication throughout the continuous delivery process.`,
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
      description: `Contributed to an eCommerce project, playing a key role in developing and implementing solutions to enhance online shopping experiences.`,
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
