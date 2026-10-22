'use client';
import {useRef,useState,useSyncExternalStore,type FormEvent} from 'react';
import {contactConfig} from '@/data/contact';
import {composeContactEmail,isContactEmail,type ContactFields} from '@/lib/contact';
const subscribe=()=>()=>{};
export function ContactForm(){
  const [status,setStatus]=useState('');
  const draft=useRef<HTMLAnchorElement>(null);
  const hydrated=useSyncExternalStore(subscribe,()=>true,()=>false);
  const configured=isContactEmail(contactConfig.email);
  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!event.currentTarget.reportValidity())return;
    try{
      const data=new FormData(event.currentTarget);
      const fields=Object.fromEntries(['name','email','phone','subject','message'].map(key=>[key,String(data.get(key)||'')])) as ContactFields;
      const href=composeContactEmail(contactConfig.email,fields);
      if(draft.current){draft.current.href=href;draft.current.click();}
      setStatus('Email draft requested. Complete sending in your email app.');
    }catch(error){setStatus(error instanceof Error?error.message:'Unable to compose email.');}
  }
  return <form onSubmit={submit}>
    <div className="ref-form-grid">
      <label>Full Name <b>*</b><input required name="name" placeholder="Your full name" autoComplete="name"/></label>
      <label>Email Address <b>*</b><input required name="email" type="email" placeholder="you@example.com" autoComplete="email"/></label>
      <label>Phone Number<input name="phone" type="tel" placeholder="Your phone number" autoComplete="tel"/></label>
      <label>Subject<input name="subject" placeholder="I have a project for you"/></label>
      <label className="message">Message <b>*</b><textarea required name="message" placeholder="Write your message..." rows={5}/></label>
    </div>
    <p className="ref-demo" role="status">{!configured?'Contact email is not configured. Please configure NEXT_PUBLIC_CONTACT_EMAIL.':status||'Opens an email draft. Complete sending in your email app.'}</p>
    <button className="ref-button" type="submit" disabled={!hydrated||!configured}>Send Message ♧</button>
    <a ref={draft} hidden aria-hidden="true" tabIndex={-1}>Email draft</a>
    <noscript><p>Use Send Email to contact us. Form composition requires JavaScript.</p></noscript>
  </form>;
}
export function SendEmail(){return isContactEmail(contactConfig.email)?<a className="ref-button outline ref-send-email" href={`mailto:${contactConfig.email}`}>✉ &nbsp; Send Email</a>:<span className="ref-demo">Contact email is not configured.</span>;}
