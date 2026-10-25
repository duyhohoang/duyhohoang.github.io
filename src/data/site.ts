import {contactConfig} from './contact';
import {isContactEmail} from '@/lib/contact';
export const site = {
  name: 'Hồ Hoàng Duy',
  description: 'Hồ Hoàng Duy — Hardware Design Engineer. PCB design, STM32/ESP32 embedded systems and industrial IoT.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: isContactEmail(contactConfig.email) ? contactConfig.email : '',
  contactPlaceholder: 'Contact email coming soon',
  location: 'Ho Chi Minh City, Vietnam',
  githubUrl: 'https://github.com/duyhohoang',
  facebookUrl: 'https://www.facebook.com/hoang.duy.72806/',
  linkedinUrl: (process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/duy-h%E1%BB%93-ho%C3%A0ng-778955433/').trim(),
};
export const navigation = ['Workspace', 'Projects', 'Firmware', 'Dashboard', 'About', 'Contact'];


