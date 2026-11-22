import { Directive, ElementRef, Input, NgZone, OnDestroy, afterNextRender, inject } from '@angular/core';

/**
 * Inclinaison 3D légère au survol (souris uniquement).
 * Désactivée sur écran tactile et si l'utilisateur préfère moins d'animations.
 */
@Directive({ selector: '[appTilt]', host: { class: 'tilt' } })
export class Tilt implements OnDestroy {
  @Input('appTilt') max: number | string = '';

  private el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private zone = inject(NgZone);
  private frame = 0;
  private cleanup: (() => void) | null = null;

  constructor() {
    afterNextRender(() => {
      const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!canHover || reduced) return;
      this.zone.runOutsideAngular(() => this.bind());
    });
  }

  private bind(): void {
    const max = Number(this.max) || 8;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => {
        const r = this.el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        this.el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        this.el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        this.el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        this.el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const enter = () => this.el.classList.add('is-tilting');
    const leave = () => {
      cancelAnimationFrame(this.frame);
      this.el.classList.remove('is-tilting');
      this.el.style.setProperty('--rx', '0deg');
      this.el.style.setProperty('--ry', '0deg');
    };
    this.el.addEventListener('pointerenter', enter);
    this.el.addEventListener('pointermove', move);
    this.el.addEventListener('pointerleave', leave);
    this.cleanup = () => {
      this.el.removeEventListener('pointerenter', enter);
      this.el.removeEventListener('pointermove', move);
      this.el.removeEventListener('pointerleave', leave);
    };
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.cleanup?.();
  }
}
