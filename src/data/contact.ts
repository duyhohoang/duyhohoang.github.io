/** Public, build-time configuration. An explicitly empty override disables email. */
export const contactConfig = {
  email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hoangduy2206.ute@gmail.com').trim(),
};
