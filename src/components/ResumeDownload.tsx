import {resumeConfig} from '@/data/resume';
export function ResumeDownload({outline=false}:{outline?:boolean}){
  if(resumeConfig.url)return <span className="resume-download"><a className={'ref-button'+(outline?' outline':'')} href={resumeConfig.url} download>↓ &nbsp; Download Resume</a>{resumeConfig.demo&&<small>Demo CV · Ngô Triệu Vy</small>}</span>;
  return <button className="ref-button" disabled title="Resume PDF has not been supplied yet">↓ &nbsp; Download Resume</button>;
}
