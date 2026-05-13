import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { ScrollAnimationService } from '../../services/scroll-animation';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit, OnDestroy {
  private scroll = inject(ScrollAnimationService);
  ngAfterViewInit(): void { this.scroll.init(); }
  ngOnDestroy(): void { this.scroll.destroy(); }
}
