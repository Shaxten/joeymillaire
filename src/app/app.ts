import { Component, ElementRef, NgZone, OnDestroy, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Lenis from 'lenis';
import { Tilt } from './tilt';

declare const emailjs: any;
declare const grecaptcha: any;

/** Clé de site reCAPTCHA v2 (liée à joeymillaire.net ; refusée sur localhost). */
const RECAPTCHA_SITE_KEY = '6LdaW-gsAAAAAG7auP574yGAuKcP9Ln-ov8qd9fT';

type SectionId = 'accueil' | 'projets' | 'competences' | 'a-propos' | 'contact';

interface Project {
  title: string;
  description: string;
  kind: string;
  url: string;
  domain: string;
  image: string;
  tags: string[];
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, Tilt],
  templateUrl: './app.html'
})
export class App implements OnDestroy {
  @ViewChild('contactForm') contactForm?: ElementRef<HTMLFormElement>;
  @ViewChild('captcha') captchaEl?: ElementRef<HTMLDivElement>;

  private zone = inject(NgZone);
  private host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  readonly year = new Date().getFullYear();
  readonly email = 'joeymillaire19@hotmail.com';
  readonly github = 'https://github.com/Shaxten';
  readonly linkedin = 'https://www.linkedin.com/in/joey-millaire1998/';

  readonly nav: { id: SectionId; label: string; icon: string }[] = [
    { id: 'accueil', label: 'Accueil', icon: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z' },
    { id: 'projets', label: 'Projets', icon: 'M3 5h7v7H3zM14 5h7v7h-7zM3 15h7v5H3zM14 15h7v5h-7z' },
    { id: 'competences', label: 'Compétences', icon: 'm8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16' },
    { id: 'a-propos', label: 'À propos', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
    { id: 'contact', label: 'Contact', icon: 'M3 6h18v12H3zM3 7l9 6 9-6' }
  ];

  readonly projects: Project[] = [
    {
      title: 'Anny Williams — Coach & Intervenante',
      kind: 'Site vitrine',
      description: 'Site pour une coach en développement personnel et intervenante en langage à Sorel-Tracy. Présentation des services, tarifs et prise de rendez-vous, dans un design doux et chaleureux.',
      url: 'https://annywilliams.com/',
      domain: 'annywilliams.com',
      image: 'images/projets/anny-williams.webp',
      tags: ['Angular 20', 'TypeScript', 'SCSS', 'Prise de rendez-vous']
    },
    {
      title: 'La Boîte d’urbanisme',
      kind: 'Site corporatif',
      description: 'Site d’une firme d’urbanisme et d’aménagement de Victoriaville : services, projets réalisés, équipe et coordonnées, autour d’illustrations colorées.',
      url: 'https://laboitedurbanisme.ca/',
      domain: 'laboitedurbanisme.ca',
      image: 'images/projets/boite-urbanisme.webp',
      tags: ['Site corporatif', 'Responsive', 'ProWeb × Agence Well']
    },
    {
      title: 'Deadlock — Tier list & statistiques',
      kind: 'Application web',
      description: 'Tableau de bord pour le jeu Deadlock de Valve : tier list des héros calculée à partir des taux de victoire, KDA et taux de sélection, alimentés en temps réel par l’API de la communauté.',
      url: 'https://shaxten.github.io/deadlock/',
      domain: 'shaxten.github.io/deadlock',
      image: 'images/projets/deadlock.webp',
      tags: ['Angular 20', 'TypeScript', 'API REST', 'GitHub Pages']
    }
  ];

  /** Technologies dans lesquelles Joey est formé. */
  readonly skills = [
    { icon: '.N', name: '.NET', text: 'Applications et API côté serveur en C#' },
    { icon: 'W', name: 'WordPress', text: 'Sites gérables par le client, thèmes et extensions' },
    { icon: 'V', name: 'Vue.js', text: 'Interfaces réactives et composants légers' },
    { icon: 'A', name: 'Angular', text: 'Applications web modernes et performantes' }
  ];

  readonly extras = ['TypeScript', 'CSS / SCSS', 'Animations & responsive', 'CI/CD avec GitHub Actions'];

  /**
   * Lignes de code qui flottent dans le hero (.NET, Vue, Angular, WordPress, CSS).
   * x / y en % du hero, depth = amplitude du suivi de la souris, desk = masquée sur mobile.
   * Les jetons : k = mot-clé, f = fonction, s = chaîne, t = type/balise, c = commentaire.
   */
  readonly codeLines: { html: string; x: number; y: number; depth: number; dur: number; delay: number; caret?: boolean; desk?: boolean }[] = [
    { html: '<i class="k">public async</i> <i class="t">Task</i>&lt;<i class="t">IActionResult</i>&gt; <i class="f">Index</i>()', x: 4, y: 9, depth: 30, dur: 11, delay: 0, desk: true },
    { html: '<i class="t">&lt;li</i> <i class="k">v-for</i>=<i class="s">"projet in projets"</i><i class="t">&gt;</i>', x: 38, y: 5, depth: 45, dur: 13, delay: -4, desk: true },
    { html: '<i class="f">@Component</i>({ selector: <i class="s">\'app-root\'</i> })', x: 66, y: 9, depth: 25, dur: 12, delay: -2, desk: true },
    { html: '<i class="f">add_action</i>(<i class="s">\'init\'</i>, <i class="s">\'joey_setup\'</i>);', x: 2, y: 82, depth: 40, dur: 10, delay: -6 },
    { html: '<i class="k">display</i>: grid; <i class="k">gap</i>: <i class="f">clamp</i>(1rem, 4vw, 3rem);', x: 30, y: 92, depth: 55, dur: 14, delay: -1, desk: true },
    { html: '<i class="k">var</i> projets = <i class="k">await</i> _db.Projets.<i class="f">ToListAsync</i>();', x: 62, y: 89, depth: 35, dur: 12, delay: -8, desk: true },
    { html: '<i class="c">// conçu au pixel près</i>', x: 36, y: 80, depth: 70, dur: 9, delay: -3, caret: true, desk: true },
    { html: '<i class="k">git push</i> origin main <i class="s">✓ déployé</i>', x: 3, y: 17, depth: 50, dur: 10, delay: -5, caret: true, desk: true }
  ];

  readonly values = [
    { num: '01', name: 'Performance', text: 'Des applications rapides et optimisées pour une expérience utilisateur fluide.' },
    { num: '02', name: 'Design', text: 'Des interfaces élégantes et intuitives qui captivent les utilisateurs.' },
    { num: '03', name: 'Qualité', text: 'Du code propre, maintenable et testé pour des projets durables.' }
  ];

  active = signal<SectionId>('accueil');

  form = { name: '', email: '', subject: '', message: '' };
  submitted = signal(false);
  error = signal(false);
  loading = signal(false);
  captchaMissing = signal(false);

  private lenis: Lenis | null = null;
  private reduced = false;
  private observers: IntersectionObserver[] = [];
  private teardown: (() => void)[] = [];
  private captchaId: number | null = null;

  constructor() {
    afterNextRender(() => {
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.zone.runOutsideAngular(() => {
        this.initSmoothScroll();
        this.initReveal();
        this.initSectionSpy();
        this.initScrollEffects();
        this.initHeroPointer();
        this.initCaptcha();
        this.hideLoader();
      });
      this.handleInitialLocation();
    });
  }

  /** Défilement : Lenis si les animations sont permises, natif sinon. */
  go(event: Event, id: SectionId): void {
    event.preventDefault();
    const target = id === 'accueil' ? 0 : this.host.querySelector<HTMLElement>('#' + id);
    if (target === null) return;
    if (this.lenis) {
      this.lenis.scrollTo(target, { duration: 1.2 });
    } else if (target === 0) {
      window.scrollTo({ top: 0 });
    } else {
      target.scrollIntoView();
    }
    history.replaceState(null, '', id === 'accueil' ? location.pathname : '#' + id);
  }

  async onSubmit(): Promise<void> {
    if (!this.contactForm) return;
    this.error.set(false);
    this.submitted.set(false);
    // EmailJS exige la réponse reCAPTCHA : on bloque l'envoi tant que la case n'est pas cochée.
    const captchaReady = typeof grecaptcha !== 'undefined' && this.captchaId !== null;
    if (!captchaReady || !grecaptcha.getResponse(this.captchaId)) {
      this.captchaMissing.set(true);
      return;
    }
    this.captchaMissing.set(false);
    this.loading.set(true);
    try {
      await emailjs.sendForm('service_i67pend', 'template_mg4vdyu', this.contactForm.nativeElement, 'NtN7A7ZCZHsofmMu4');
      this.submitted.set(true);
      this.form = { name: '', email: '', subject: '', message: '' };
      grecaptcha.reset(this.captchaId);
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
    this.teardown.forEach(fn => fn());
    this.lenis?.destroy();
  }

  // ---------------------------------------------------------------------------

  private initSmoothScroll(): void {
    if (this.reduced) return;
    this.lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      this.lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    this.teardown.push(() => cancelAnimationFrame(raf));
  }

  /** Apparition des blocs au défilement. */
  private initReveal(): void {
    const items = this.host.querySelectorAll<HTMLElement>('.reveal');
    if (this.reduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
    this.observers.push(io);
  }

  /** Met en évidence la section courante dans le dock. */
  private initSectionSpy(): void {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) this.zone.run(() => this.active.set(e.target.id as SectionId));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    this.nav.forEach(n => {
      const el = this.host.querySelector('#' + n.id);
      if (el) io.observe(el);
    });
    this.observers.push(io);
  }

  /** Barre de progression + léger parallaxe, calculés une seule fois par image. */
  private initScrollEffects(): void {
    const root = document.documentElement;
    const layers = Array.from(this.host.querySelectorAll<HTMLElement>('[data-parallax]'));
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = root.scrollHeight - innerHeight;
      root.style.setProperty('--progress', max > 0 ? (scrollY / max).toFixed(4) : '0');
      if (this.reduced) return;
      const mid = innerHeight / 2;
      for (const el of layers) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const speed = Number(el.dataset['parallax']) || 0;
        const offset = (r.top + r.height / 2 - mid) * speed;
        el.style.setProperty('--py', `${offset.toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    update();
    this.teardown.push(() => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    });
  }

  /** Les lignes de code du hero suivent doucement la souris, chacune à sa profondeur. */
  private initHeroPointer(): void {
    if (this.reduced || !matchMedia('(pointer: fine)').matches) return;
    const hero = this.host.querySelector<HTMLElement>('.hero');
    if (!hero) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        hero.style.setProperty('--mx', x.toFixed(3));
        hero.style.setProperty('--my', y.toFixed(3));
      });
    };
    hero.addEventListener('pointermove', move);
    this.teardown.push(() => hero.removeEventListener('pointermove', move));
  }

  /** reCAPTCHA en rendu explicite : on attend que le script Google soit prêt. */
  private initCaptcha(): void {
    let tries = 0;
    let timer = 0;
    const render = () => {
      const el = this.captchaEl?.nativeElement;
      if (!el || this.captchaId !== null) return;
      if (typeof grecaptcha === 'undefined' || typeof grecaptcha.render !== 'function') {
        if (++tries < 60) timer = window.setTimeout(render, 500);
        return;
      }
      this.captchaId = grecaptcha.render(el, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: () => this.zone.run(() => this.captchaMissing.set(false))
      });
    };
    render();
    this.teardown.push(() => clearTimeout(timer));
  }

  private hideLoader(): void {
    const loader = document.getElementById('loader');
    const done = () => {
      document.documentElement.classList.add('is-loaded');
      if (!loader) return;
      loader.classList.add('is-done');
      setTimeout(() => loader.remove(), 700);
    };
    const minDelay = new Promise(r => setTimeout(r, this.reduced ? 0 : 650));
    const fonts = (document as any).fonts?.ready ?? Promise.resolve();
    const timeout = new Promise(r => setTimeout(r, 2500));
    Promise.all([minDelay, Promise.race([fonts, timeout])]).then(done);
  }

  /** Les anciennes URL (/projets, /a-propos, /contact) mènent à la bonne section. */
  private handleInitialLocation(): void {
    const legacy: Record<string, SectionId> = { '/projets': 'projets', '/a-propos': 'a-propos', '/contact': 'contact' };
    const path = location.pathname.replace(/\/+$/, '');
    let id: string | undefined = legacy[path];
    if (id) history.replaceState(null, '', '/#' + id);
    else id = location.hash.slice(1);
    if (!id) return;
    const el = this.host.querySelector<HTMLElement>('#' + CSS.escape(id));
    if (!el) return;
    setTimeout(() => {
      if (this.lenis) this.lenis.scrollTo(el, { immediate: true });
      else el.scrollIntoView();
    }, 50);
  }
}
