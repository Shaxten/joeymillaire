import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare const emailjs: any;

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  form = { name: '', email: '', subject: '', message: '' };
  submitted = false;
  error = false;
  loading = false;

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = false;

    try {
      await emailjs.send('service_i67pend', 'template_mg4vdyu', {
        name: this.form.name,
        sujet: this.form.subject,
        courriel: this.form.email,
        message: this.form.message
      }, 'NtN7A7ZCZHsofmMu4');

      this.submitted = true;
      this.form = { name: '', email: '', subject: '', message: '' };
    } catch {
      this.error = true;
    }

    this.loading = false;
  }
}
