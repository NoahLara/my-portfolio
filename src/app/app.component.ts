import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('spotlight') spotlight!: ElementRef;

  activeSection = 'about';
  private observer!: IntersectionObserver;
  private readonly techBadgeVisuals: Record<string, { type: 'image' | 'text'; value: string }> = {
    Angular: { type: 'image', value: 'assets/angular.png' },
    NestJS: { type: 'image', value: 'assets/nest.png' },
    PostgreSQL: { type: 'image', value: 'assets/postgres.png' },
    'Node.js': { type: 'text', value: 'N' },
    'SQL Server': { type: 'text', value: 'SQL' },
    TypeScript: { type: 'text', value: 'TS' },
    Figma: { type: 'text', value: 'F' },
    WCAG: { type: 'text', value: 'A11y' },
    'Design Systems': { type: 'text', value: 'DS' },
    Product: { type: 'text', value: 'PR' },
    'Web app': { type: 'text', value: 'WEB' },
    'English B2-C1': { type: 'text', value: 'EN' },
    'Customer Service': { type: 'text', value: 'CS' }
  };

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    this.decorateTechTags();
  }

  onNavClick(event: Event, sectionId: string) {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    event.preventDefault();
    this.activeSection = sectionId;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${sectionId}`);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.spotlight?.nativeElement) {
      const x = event.clientX;
      const y = event.clientY;
      this.spotlight.nativeElement.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
    }
  }

  private setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => {
      this.observer.observe(section);
    });
  }

  private decorateTechTags() {
    const techTags = document.querySelectorAll<HTMLElement>('.tech-tag');

    techTags.forEach((tag) => {
      if (tag.dataset['enhanced'] === 'true') {
        return;
      }

      const techName = tag.textContent?.trim() || '';
      const visual = this.techBadgeVisuals[techName];

      if (!visual) {
        return;
      }

      if (visual.type === 'image') {
        const img = document.createElement('img');
        img.className = 'tech-tag-icon tech-tag-icon--image';
        img.src = visual.value;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        tag.prepend(img);
      } else {
        const textIcon = document.createElement('span');
        textIcon.className = 'tech-tag-icon tech-tag-icon--text';
        textIcon.setAttribute('aria-hidden', 'true');
        textIcon.textContent = visual.value;
        tag.prepend(textIcon);
      }

      tag.dataset['enhanced'] = 'true';
    });
  }
}
