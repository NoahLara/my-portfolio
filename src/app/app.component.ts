import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';

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

  constructor(private zone: NgZone) { }

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
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));

    // Recompute from geometry on every callback rather than trusting a single
    // entry: when two sections swap across the midpoint in the same frame the
    // batched entries do not reliably say which one is now current.
    const syncActiveSection = () => {
      // Anchor on a line near the top of the viewport, not the middle: the
      // About block is short enough that a mid-viewport line would mark
      // Experience as current while the page is still scrolled to the top.
      const line = window.innerHeight * 0.3;
      let current = sections[0];

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= line) {
          current = section;
        }
      }

      if (!current || current.id === this.activeSection) {
        return;
      }

      // IntersectionObserver callbacks run outside Angular's zone, so the nav
      // highlight would never repaint without re-entering it here.
      this.zone.run(() => {
        this.activeSection = current.id;
      });
    };

    this.observer = new IntersectionObserver(syncActiveSection, {
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach((section) => {
      this.observer.observe(section);
    });

    syncActiveSection();
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
