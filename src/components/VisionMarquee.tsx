const phrase='IOT VISION FROM LAB TO LIFE';
export function VisionMarquee(){
  return <section className="vision-marquee" aria-label={phrase}>
    <div className="vision-marquee-track" aria-hidden="true">
      {[0,1].map(copy=><div className="vision-marquee-group" key={copy}>{[0,1,2].map(index=><span key={index}>{phrase}<i>✦</i></span>)}</div>)}
    </div>
  </section>;
}
