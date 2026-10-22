import {contactConfig} from './contact';
import {isContactEmail} from '@/lib/contact';
export const site = {
  name: 'HARDWARE LAB',
  description: 'A personal workspace exploring PCB design, embedded firmware and dashboard interfaces.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: isContactEmail(contactConfig.email) ? contactConfig.email : '',
  contactPlaceholder: 'Contact email coming soon',
  location: '',
  githubUrl: '',
  linkedinUrl: '',
};
export const navigation = ['Workspace', 'Boards', 'Firmware', 'Dashboard', 'About', 'Contact'];


