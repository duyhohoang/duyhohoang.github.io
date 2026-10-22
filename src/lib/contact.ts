export type ContactFields = {name:string;email:string;phone:string;subject:string;message:string};
export function isContactEmail(value:string) {
  return /^[^\s@?&#:,<>]+@[^\s@?&#:,<>]+\.[^\s@?&#:,<>]+$/.test(value);
}
export function composeContactEmail(recipient:string, fields:ContactFields) {
  if(!isContactEmail(recipient))throw new Error('Contact email is not configured correctly.');
  if(!fields.name.trim() || !isContactEmail(fields.email.trim()) || !fields.message.trim()) {
    throw new Error('Please complete your name, a valid email address and message.');
  }
  const subject=fields.subject.trim().replace(/[\r\n]+/g,' ') || 'Hardware Lab project inquiry';
  const body=`Name: ${fields.name.trim()}\nEmail: ${fields.email.trim()}\nPhone: ${fields.phone.trim() || 'Not provided'}\n\n${fields.message.trim()}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
