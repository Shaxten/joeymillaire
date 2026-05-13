import { Injectable, NgZone, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {
  private ngZone = inject(NgZone);
  private observer: IntersectionObserver | null = null;

  init(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('revealed'); this.observer?.unobserve(e.target); }
        }),
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
      );
      this.observeElements();
    });
  }

  observeElements(): void {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children')
      .forEach(el => this.observer?.observe(el));
  }

  destroy(): void { this.observer?.disconnect(); }
}
