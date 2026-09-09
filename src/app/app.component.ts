import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, OnDestroy, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('spotlight') spotlight!: ElementRef;
  @ViewChild('navScroller') navScroller?: ElementRef<HTMLElement>;

  activeSection = 'about';
  navFadeLeft = false;
  navFadeRight = false;
  private observer!: IntersectionObserver;
  private onScroll?: () => void;
  private onResize?: () => void;
  readonly techBadgeVisuals: Record<string, { type: 'image' | 'text'; value: string }> = {
    Angular: { type: 'image', value: 'assets/angular.webp' },
    NestJS: { type: 'image', value: 'assets/nest.webp' },
    PostgreSQL: { type: 'image', value: 'assets/postgres.webp' },
    'Node.js': { type: 'text', value: 'N' },
    'SQL Server': { type: 'text', value: 'SQL' },
    TypeScript: { type: 'text', value: 'TS' },
    Figma: { type: 'text', value: 'F' },
    WCAG: { type: 'text', value: 'A11y' },
    React: { type: 'text', value: 'R' },
    'Design Systems': { type: 'text', value: 'DS' },
    Product: { type: 'text', value: 'PR' },
    'Web app': { type: 'text', value: 'WEB' },
    'English (Fluent)': { type: 'text', value: 'EN' },
    'Customer Service': { type: 'text', value: 'CS' }
  };

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  onNavScroll() {
    this.updateNavFades();
  }

  techIcon(name: string): { type: 'image' | 'text'; value: string } | undefined {
    return this.techBadgeVisuals[name];
  }

  ngAfterViewInit() {
    // IntersectionObserver does not exist during prerendering.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupIntersectionObserver();

    // Deferred a tick: touching the fade bindings inside ngAfterViewInit would
    // mutate state Angular has already checked this cycle.
    setTimeout(() => {
      this.updateNavFades();
      this.centreNavItem(this.activeSection);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll);
    }

    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
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

  /** Shows the edge gradients only on the side that actually has more to scroll. */
  private updateNavFades() {
    const scroller = this.navScroller?.nativeElement;

    if (!scroller || scroller.clientWidth === 0) {
      return;
    }

    this.applyNavFades(scroller.scrollLeft, scroller.scrollWidth - scroller.clientWidth);
  }

  private applyNavFades(scrollLeft: number, max: number) {
    const left = scrollLeft > 1;
    const right = scrollLeft < max - 1;

    if (left !== this.navFadeLeft || right !== this.navFadeRight) {
      this.zone.run(() => {
        this.navFadeLeft = left;
        this.navFadeRight = right;
      });
    }
  }

  /**
   * Keeps the current section visible in the horizontally scrolling strip.
   * Targets the link by href rather than by the .active class, so it does not
   * depend on change detection having run yet.
   */
  private centreNavItem(sectionId: string) {
    const scroller = this.navScroller?.nativeElement;

    // clientWidth is 0 while the strip is display:none on desktop.
    if (!scroller || scroller.clientWidth === 0) {
      return;
    }

    const active = scroller.querySelector<HTMLElement>(`a[href="#${sectionId}"]`);

    if (!active) {
      return;
    }

    const target = active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2;
    const max = scroller.scrollWidth - scroller.clientWidth;

    const left = Math.min(Math.max(target, 0), max);

    // Honour reduced motion, and fall back to an instant jump where smooth
    // scrolling is unavailable.
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    scroller.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });

    // Derive the gradients from the target rather than waiting for a scroll
    // event, which does not always arrive for a programmatic scroll.
    this.applyNavFades(left, max);
  }

  private setupIntersectionObserver() {
    const sections = Array.from(this.document.querySelectorAll<HTMLElement>('section[id]'));

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

      // At the end of the page the trailing sections can never reach the line,
      // so the last one would otherwise be unreachable as the current section.
      const doc = this.document.documentElement;

      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }

      if (!current || current.id === this.activeSection) {
        return;
      }

      // The strip scrolls horizontally on small screens, so the current item
      // has to be brought into view or it sits off the right edge.
      this.centreNavItem(current.id);

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

    // The observer only fires on threshold crossings, which never happen while
    // scrolling the last stretch of the page.
    this.onScroll = () => syncActiveSection();
    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.onResize = () => {
      this.updateNavFades();
      this.centreNavItem(this.activeSection);
    };
    window.addEventListener('resize', this.onResize, { passive: true });

    syncActiveSection();
  }

}
