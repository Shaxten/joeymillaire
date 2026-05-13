import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare const emailjs: any;
declare const grecaptcha: any;

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  @ViewChild('contactForm', { static: false }) contactForm!: ElementRef;

  form = { name: '', email: '', subject: '', message: '' };
  submitted = false;
  error = false;
  loading = false;

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = false;

    try {
      const formElement = this.contactForm.nativeElement as HTMLFormElement;
      await emailjs.sendForm('service_i67pend', 'template_mg4vdyu', formElement, 'NtN7A7ZCZHsofmMu4');

      this.submitted = true;
      this.form = { name: '', email: '', subject: '', message: '' };
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }
    } catch {
      this.error = true;
    }

    this.loading = false;
  }
}
