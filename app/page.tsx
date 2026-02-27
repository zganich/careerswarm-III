import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-inner { animation: scroll 30s linear infinite; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade1 { animation: fadeUp .8s ease forwards .1s; opacity:0; }
        .fade2 { animation: fadeUp .8s ease forwards .2s; opacity:0; }
        .fade3 { animation: fadeUp .8s ease forwards .35s; opacity:0; }
        .fade4 { animation: fadeUp .8s ease forwards .5s; opacity:0; }
        .fade5 { animation: fadeUp .8s ease forwards .65s; opacity:0; }
      `}</style>

      {/* NAV */}
      <nav style={{position:'fixed',top:0,width:'100%',padding:'20px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:100,background:'linear-gradient(to bottom, rgba(8,8,8,0.95), transparent)',backdropFilter:'blur(4px)'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:'0.12em',color:'#d4922a',textTransform:'uppercase'}}>CareerSwarm</div>
        <Link href="/auth/signup" style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#080808',background:'#d4922a',padding:'10px 22px',textDecoration:'none'}}>
          Get Early Access
        </Link>
      </nav>

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'140px 48px 80px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'radial-gradient(ellipse 60% 50% at 70% 40%, rgba(212,146,42,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(212,146,42,0.03) 0%, transparent 60%)',pointerEvents:'none'}} />
        <div className="fade1" style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#d4922a',marginBottom:32}}>AI Application Engine for Executives</div>
        <h1 className="fade2" style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(48px,7vw,96px)',lineHeight:1.0,fontWeight:400,maxWidth:820}}>
          Stop rewriting your resume.<br /><em style={{fontStyle:'italic',color:'#d4922a'}}>Start getting interviews.</em>
        </h1>
        <p className="fade3" style={{fontSize:18,fontWeight:300,color:'#a09080',maxWidth:520,marginTop:28,lineHeight:1.7}}>
          CareerSwarm turns your entire career history into a permanent database, then generates perfectly tailored applications in under 3 minutes — not 3 hours.
        </p>
        <div className="fade4" style={{display:'flex',gap:16,marginTop:48,alignItems:'center'}}>
          <Link href="/auth/signup" style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase',color:'#080808',background:'#d4922a',padding:'16px 32px',textDecoration:'none',display:'inline-block'}}>
            Join as Founding Member
          </Link>
          <a href="#how" style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase',color:'#a09080',textDecoration:'none',padding:'16px 0',borderBottom:'1px solid #252525'}}>
            See how it works
          </a>
        </div>
      </section>

      {/* TICKER */}
      <div className="fade5" style={{borderTop:'1px solid #252525',borderBottom:'1px solid #252525',padding:'14px 0',overflow:'hidden'}}>
        <div className="ticker-inner" style={{display:'flex',gap:64,width:'max-content'}}>
          {['Scout Agent - Finds Opportunities','Qualifier Agent - Verifies Comp + Location','Tailor Agent - ATS-Optimized Resume','Scribe Agent - Personalized Cover Letter','Hunter Agent - Finds Decision Makers',
            'Scout Agent - Finds Opportunities','Qualifier Agent - Verifies Comp + Location','Tailor Agent - ATS-Optimized Resume','Scribe Agent - Personalized Cover Letter','Hunter Agent - Finds Decision Makers'
          ].map((item, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,whiteSpace:'nowrap',fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.08em',color:'#a09080',textTransform:'uppercase'}}>
              <span style={{width:6,height:6,background:'#d4922a',borderRadius:'50%',display:'inline-block'}} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section style={{padding:'120px 48px'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',color:'#d4922a',marginBottom:48}}>The Problem</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,background:'#252525',border:'1px solid #252525',maxWidth:900}}>
          {[
            {stat:'3 hrs',text:<>Average time to tailor one application at the Director+ level. <strong style={{color:'#f0ebe0',fontWeight:400}}>Per role. Every single time.</strong></>},
            {stat:'80%',text:<>Of interviews go to the <strong style={{color:'#f0ebe0',fontWeight:400}}>first 50 applicants</strong> — before most executives have even drafted a cover letter.</>},
            {stat:'60%',text:<>Of your best achievements never make it into applications because <strong style={{color:'#f0ebe0',fontWeight:400}}>you forgot they existed</strong> three jobs ago.</>},
            {stat:'10+',text:<>Different resume versions scattered across your computer. <strong style={{color:'#f0ebe0',fontWeight:400}}>None of them current. None of them optimal.</strong></>},
          ].map((item, i) => (
            <div key={i} style={{background:'#111',padding:40}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:56,color:'#c0392b',lineHeight:1,marginBottom:12}}>{item.stat}</div>
              <div style={{fontSize:15,color:'#a09080',lineHeight:1.5}}>{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{height:1,background:'#252525',margin:'0 48px'}} />

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:'120px 48px'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',color:'#d4922a',marginBottom:48}}>How It Works</div>
        <div style={{maxWidth:700,marginBottom:72}}>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(36px,4vw,56px)',fontWeight:400,lineHeight:1.15,marginBottom:20}}>
            Build your Career DNA once.<br /><em style={{fontStyle:'italic',color:'#d4922a'}}>Deploy it everywhere.</em>
          </h2>
          <p style={{fontSize:17,color:'#a09080',maxWidth:540}}>A structured database of every achievement, metric, and proof point from your entire career. AI agents select what matters for each role and generate a complete application package in minutes.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'#252525',border:'1px solid #252525'}}>
          {[
            {num:'01 / Upload',title:'Build Your Career Database',desc:'Upload all your existing resume versions. AI extracts and consolidates every achievement, metric, and proof point across your entire career history.',time:'One-time setup: 20-30 min'},
            {num:'02 / Target',title:'Paste the Job Description',desc:'Drop in any job posting. The Qualifier Agent verifies location compatibility and compensation before a single word is written.',time:'Per application: 30 seconds'},
            {num:'03 / Apply',title:'Get a Complete Package',desc:'ATS-optimized resume, personalized cover letter referencing actual company news, and a LinkedIn outreach message to the hiring manager.',time:'Delivered in: 2-3 minutes'},
          ].map((step) => (
            <div key={step.num} style={{background:'#111',padding:'48px 40px'}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.15em',color:'#d4922a',marginBottom:24,textTransform:'uppercase'}}>{step.num}</div>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,fontWeight:400,marginBottom:16,lineHeight:1.2}}>{step.title}</h3>
              <p style={{fontSize:14,color:'#a09080',lineHeight:1.65}}>{step.desc}</p>
              <div style={{marginTop:28,fontFamily:"'DM Mono',monospace",fontSize:11,color:'#27ae60',letterSpacing:'0.08em'}}>{step.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <div style={{background:'#111',padding:'120px 48px',borderTop:'1px solid #252525',borderBottom:'1px solid #252525'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',color:'#d4922a',marginBottom:64}}>Validated by the Founder&apos;s Own Search</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,background:'#252525',border:'1px solid #252525'}}>
          {[
            {num:'425%',desc:'Pipeline increase from first application package built with this system'},
            {num:'2 min',desc:'Average time to generate a complete tailored application vs. 3+ hours manually'},
            {num:'$300K',desc:'Average OTE of opportunities in active pipeline using CareerSwarm'},
            {num:'90+',desc:'Partners scaled at peak using the same systematic approach applied to job search'},
          ].map((item) => (
            <div key={item.num} style={{background:'#1a1a1a',padding:'40px 32px',textAlign:'center'}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:48,color:'#d4922a',lineHeight:1,marginBottom:8}}>{item.num}</div>
              <div style={{fontSize:13,color:'#a09080',lineHeight:1.5}}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <section id="founding" style={{padding:'120px 48px'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',color:'#d4922a',marginBottom:48}}>Founding Member Pricing</div>
        <div style={{maxWidth:700,marginBottom:64}}>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(36px,4vw,56px)',fontWeight:400,lineHeight:1.15,marginBottom:20}}>
            Early access.<br /><em style={{fontStyle:'italic',color:'#d4922a'}}>Permanent discount.</em>
          </h2>
          <p style={{fontSize:17,color:'#a09080'}}>Founding members lock in pricing that never changes. Limited to the first 20 members.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24,maxWidth:800}}>
          {/* Free */}
          <div style={{border:'1px solid #252525',padding:'48px 40px',background:'#111'}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'#a09080',marginBottom:16}}>Free</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:52,lineHeight:1,marginBottom:4}}>$0</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'#a09080',marginBottom:32}}>forever</div>
            <ul style={{listStyle:'none',marginBottom:40}}>
              {['3 tailored resumes per month','Career DNA database','Opportunity scoring','Basic cover letters'].map(f => (
                <li key={f} style={{fontSize:14,color:'#a09080',padding:'10px 0',borderBottom:'1px solid #252525',display:'flex',gap:10}}>
                  <span style={{color:'#d4922a',fontFamily:"'DM Mono',monospace",flexShrink:0}}>+</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase',color:'#080808',background:'#d4922a',padding:'16px 32px',textDecoration:'none',display:'inline-block'}}>
              Start Free
            </Link>
          </div>
          {/* Founding */}
          <div style={{border:'1px solid #d4922a',padding:'48px 40px',background:'#111',position:'relative'}}>
            <div style={{position:'absolute',top:-1,left:-1,background:'#d4922a',color:'#080808',fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',padding:'6px 14px'}}>
              Founding Member
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'#a09080',marginBottom:16,marginTop:16}}>Pro — Locked In for Life</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:52,lineHeight:1,marginBottom:4}}>$49</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'#a09080',marginBottom:32}}>per month, forever</div>
            <ul style={{listStyle:'none',marginBottom:40}}>
              {['Unlimited tailored resumes & cover letters','Career DNA database (unlimited achievements)','Qualifier filter — location + comp verified','ATS compatibility scoring','Weekly opportunity alerts','Direct access to founder during beta'].map(f => (
                <li key={f} style={{fontSize:14,color:'#a09080',padding:'10px 0',borderBottom:'1px solid #252525',display:'flex',gap:10}}>
                  <span style={{color:'#d4922a',fontFamily:"'DM Mono',monospace",flexShrink:0}}>+</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase',color:'#080808',background:'#d4922a',padding:'16px 32px',textDecoration:'none',display:'inline-block'}}>
              Claim Founding Rate
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'40px 48px',borderTop:'1px solid #252525',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:'0.12em',color:'#d4922a',textTransform:'uppercase'}}>CareerSwarm</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'#a09080',letterSpacing:'0.04em'}}>Built by a partnerships executive, for executives.</div>
      </footer>
    </>
  )
}
