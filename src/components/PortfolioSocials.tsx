import {site} from '@/data/site';

function SocialIcon({name}:{name:string}){
 const paths:Record<string,React.ReactNode>={
  GitHub:<><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6A4.7 4.7 0 0 0 19 6c.1-1-.1-2-.5-3 0 0-1.1-.3-3.5 1a12 12 0 0 0-6 0C6.6 2.7 5.5 3 5.5 3A6 6 0 0 0 5 6a4.7 4.7 0 0 0-1 3c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4"/></>,
  Facebook:<path d="M14 22v-9h3l.5-4H14V6.5c0-1.1.3-1.5 1.5-1.5H18V1.5A20 20 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9"/>,
  LinkedIn:<><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-7h3v1c2-2 4-1 4 2v4M11 13c0-3 3-3 3 0v4"/></>,
  Email:<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 5 10 8L22 5"/></>,
 };
 return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function PortfolioSocials(){
 const links=[{name:'GitHub',href:site.githubUrl},{name:'Facebook',href:site.facebookUrl},...(site.linkedinUrl?[{name:'LinkedIn',href:site.linkedinUrl}]:[]),{name:'Email',href:`mailto:${site.email}`}];
 return <div className="ref-socials">{links.map(({name,href})=><a key={name} href={href} aria-label={name} target={name==='Email'?undefined:'_blank'} rel={name==='Email'?undefined:'noopener noreferrer'}><SocialIcon name={name}/><span className="social-tooltip" role="tooltip">{name}</span></a>)}</div>;
}
