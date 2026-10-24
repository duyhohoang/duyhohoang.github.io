const topics=['PCB DESIGN','IOT','FIRMWARE','WEARABLE TECH','AI','EMBEDDED SYSTEMS'];
export function VisionMarquee(){
  return <section className="vision-marquee" aria-label={topics.join(' · ')}>
    <div className="vision-marquee-track" aria-hidden="true">
      {[0,1].map(copy=><div className="vision-marquee-group" key={copy}>{[0,1].map(repeat=>topics.map(topic=><span key={`${repeat}-${topic}`}>{topic}<i>·</i></span>))}</div>)}
    </div>
  </section>;
}
