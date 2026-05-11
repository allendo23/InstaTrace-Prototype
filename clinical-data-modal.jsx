// Clinical Data / Patient Details modal — opens when "View Clinical Data" clicked
const { useState: useStateCD, useEffect: useEffectCD, useMemo: useMemoCD } = React;

// ---------- Sample clinical visit data ----------
const SAMPLE_VISITS = [
  { date:'04/24/2026', time:'11:59 AM', name:'Canyon View Medical Group', address:'336 West 100 South', type:'BILLING', service:'11/17/2025', specialty:'Family Practice', request:true },
  { date:'04/24/2026', time:'11:59 AM', name:'Michael Mclay', address:'724 South 1600 West', type:'RENDERING', service:'11/17/2025', specialty:'Family Medicine' },
  { date:'04/24/2026', time:'11:59 AM', name:'Michael Mclay', address:'724 South 1600 West', type:'REFERRING', service:'11/17/2025', specialty:'Family Medicine' },
  { date:'04/24/2026', time:'11:59 AM', name:'Whitney Hope', address:'1055 North 300 West', type:'PRESCRIBING', service:'03/29/2025', specialty:'Family Practice' },
  { date:'04/24/2026', time:'11:59 AM', name:'Michael Mclay', address:'724 South 1600 West', type:'PRESCRIBING', service:'01/20/2026', specialty:'Family Medicine' },
  { date:'04/24/2026', time:'11:59 AM', name:'Mapleton Medical Clinic', address:'325 West Center Street', type:'FACILITY', service:'11/17/2025', specialty:'Family Practice', request:true },
  { date:'04/24/2026', time:'11:59 AM', name:'Dixie Harris', address:'464 Allegheny Boulevard', type:'RENDERING', service:'06/30/2023', specialty:'Sleep Medicine' },
  { date:'04/24/2026', time:'11:59 AM', name:'Matthew Brown', address:'3249 North 1200 West', type:'RENDERING', service:'06/28/2023', specialty:'Family Medicine' },
  { date:'04/24/2026', time:'11:59 AM', name:'Ihc Health Services Incorporated', address:'1975 North State Street', type:'BILLING', service:'06/21/2023', specialty:'Family Practice', request:true },
  { date:'04/24/2026', time:'11:59 AM', name:'Frederick Dattel', address:'1004 Carondelet Drive', type:'PRESCRIBING', service:'03/23/2020', specialty:'Pediatrics' },
  { date:'04/24/2026', time:'11:59 AM', name:'Saint Marks Hospital', address:'1200 East 3900 South', type:'FACILITY', service:'02/14/2023', specialty:'Internal Medicine' },
  { date:'04/24/2026', time:'11:59 AM', name:'Robert Bishop', address:'5848 South Fashion Blvd', type:'RENDERING', service:'10/02/2022', specialty:'Cardiology' },
  { date:'04/24/2026', time:'11:59 AM', name:'Lakeview Family Health', address:'880 Murray Holladay Rd', type:'BILLING', service:'08/15/2022', specialty:'Family Practice', request:true },
  { date:'04/24/2026', time:'11:59 AM', name:'Sarah Thompson', address:'415 East 200 South', type:'REFERRING', service:'05/19/2021', specialty:'Dermatology' },
  { date:'04/24/2026', time:'11:59 AM', name:'Wasatch Pediatrics', address:'2200 North University Pkwy', type:'FACILITY', service:'04/04/2021', specialty:'Pediatrics' },
  { date:'04/24/2026', time:'11:59 AM', name:'Nathan Park', address:'77 South Mountain Way', type:'PRESCRIBING', service:'01/11/2021', specialty:'Endocrinology' },
  { date:'04/24/2026', time:'11:59 AM', name:'Provo Surgery Center', address:'1100 East Center Street', type:'FACILITY', service:'09/28/2020', specialty:'Surgery' },
];

// ---------- Type pill ----------
const TYPE_TONES = {
  BILLING:      { bg:'#ecfeff', fg:'#0e7490', border:'#a5f3fc' },
  RENDERING:    { bg:'#ccfbf1', fg:'#0f766e', border:'#5eead4' },
  REFERRING:    { bg:'#fdf4ff', fg:'#a21caf', border:'#f5d0fe' },
  PRESCRIBING:  { bg:'#fef3c7', fg:'#92400e', border:'#fde68a' },
  FACILITY:     { bg:'#dcfce7', fg:'#166534', border:'#bbf7d0' },
};
function TypeBadge({ type }) {
  const t = TYPE_TONES[type] || TYPE_TONES.BILLING;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'3px 8px', borderRadius:5,
      fontSize:10.5, fontWeight:700, letterSpacing:'0.05em',
      background:t.bg, color:t.fg, border:`1px solid ${t.border}`,
      textDecoration:'underline', textUnderlineOffset:2,
    }}>{type}</span>
  );
}

// ---------- Mini SVG map placeholder with pins ----------
function MiniMap() {
  // Build a stylized topo-ish background with random pins clustered near center
  const pins = [
    { x: 360, y: 220, n: 1 },
    { x: 388, y: 232, n: 2 },
    { x: 380, y: 252, n: 1 },
    { x: 372, y: 268, n: 1 },
    { x: 360, y: 286, n: 1 },
  ];
  return (
    <div style={{
      position:'relative',
      width:'100%', height:380, borderRadius:10,
      overflow:'hidden', background:'linear-gradient(180deg,#e0f2fe 0%, #f0fdf4 50%, #ecfccb 100%)',
      border:'1px solid #e5e7eb',
    }}>
      <svg viewBox="0 0 720 380" preserveAspectRatio="xMidYMid slice"
        style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
        {/* "Lake" shape */}
        <path d="M40,140 Q90,80 200,100 T340,180 Q280,220 180,210 Q100,200 40,140Z" fill="#bae6fd" opacity="0.85"/>
        {/* Mountain shading */}
        <path d="M450,80 Q540,100 620,60 L720,140 L720,220 Q620,200 540,210 Q470,205 450,180Z" fill="#bbf7d0" opacity="0.6"/>
        <path d="M420,260 Q500,250 580,280 Q650,300 720,270 L720,380 L0,380 L0,300 Q140,270 280,290 Q360,300 420,260Z" fill="#dcfce7" opacity="0.7"/>
        {/* Roads */}
        <path d="M0,200 Q200,180 400,210 Q560,235 720,200" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7"/>
        <path d="M0,200 Q200,180 400,210 Q560,235 720,200" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="6 4"/>
        <path d="M380,0 L380,380" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6"/>
        <path d="M380,0 L380,380" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="6 4"/>
        {/* Approved facility (green pin) */}
        <g transform="translate(310,200)">
          <circle r="14" fill="#16a34a" opacity="0.25"/>
          <path d="M0,-12 C7,-12 12,-7 12,0 C12,8 0,18 0,18 C0,18 -12,8 -12,0 C-12,-7 -7,-12 0,-12 Z" fill="#16a34a"/>
          <circle r="3.5" cy="-1" fill="#fff"/>
        </g>
        {/* Indigo pins clustered */}
        {pins.map((p,i)=>(
          <g key={i} transform={`translate(${p.x},${p.y})`}>
            <path d="M0,-13 C8,-13 13,-8 13,-1 C13,8 0,20 0,20 C0,20 -13,8 -13,-1 C-13,-8 -8,-13 0,-13 Z" fill="#0d9488"/>
            <circle r="7" cy="-2" fill="#fff"/>
            <text y="1" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0f766e">{p.n}</text>
          </g>
        ))}
      </svg>
      {/* Map header bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0,
        background:'#0d9488', color:'#fff',
        padding:'10px 16px', display:'flex', alignItems:'center', gap:8,
        fontSize:13, fontWeight:600,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Map
      </div>
      {/* Zoom + fullscreen controls */}
      <div style={{position:'absolute', bottom:14, right:14, display:'flex', flexDirection:'column', gap:6}}>
        {['+','−'].map((s,i)=>(
          <button key={i} style={{
            width:32, height:32, borderRadius:6, border:'1px solid #e5e7eb',
            background:'#fff', cursor:'pointer', fontSize:16, fontWeight:600,
            color:'#374151', boxShadow:'0 1px 2px rgba(0,0,0,0.06)',
          }}>{s}</button>
        ))}
      </div>
      <div style={{
        position:'absolute', bottom:14, left:14,
        fontSize:10, color:'#64748b', background:'rgba(255,255,255,0.7)',
        padding:'2px 6px', borderRadius:3,
      }}>Map data ©2026 InstaChart · Sample data</div>
    </div>
  );
}

// ---------- Pill ----------
function Pill({ children, tone='green' }) {
  const tones = {
    green: { bg:'#dcfce7', fg:'#166534', border:'#bbf7d0' },
    indigo:{ bg:'#ccfbf1', fg:'#0f766e', border:'#5eead4' },
    gray:  { bg:'#f3f4f6', fg:'#374151', border:'#e5e7eb' },
  };
  const t = tones[tone] || tones.green;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'5px 12px', borderRadius:999,
      fontSize:12, fontWeight:700,
      background:t.bg, color:t.fg, border:`1px solid ${t.border}`,
    }}>{children}</span>
  );
}

// ---------- Modal ----------
function ClinicalDataModal({ open, onClose, client }) {
  const [tab, setTab] = useStateCD('clinical');
  const [search, setSearch] = useStateCD('');
  const [allCols, setAllCols] = useStateCD(true);
  const [page, setPage] = useStateCD(3); // start at 3/8 like reference

  useEffectCD(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow=''; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const filtered = useMemoCD(() => {
    if (!search) return SAMPLE_VISITS;
    const q = search.toLowerCase();
    return SAMPLE_VISITS.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q) ||
      v.specialty.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q)
    );
  }, [search]);

  if (!open || !client) return null;

  const A = '#0d9488'; // indigo accent
  const Asoft = '#ccfbf1';

  const fullName = `${(client && client.firstName) || client.name.split(' ')[0]} ${(client && client.lastName) || client.name.split(' ').slice(1).join(' ')}`.trim() || client.name;

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(31,41,55,.55)',
      backdropFilter:'blur(4px)', zIndex:1000,
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'40px 24px', overflowY:'auto',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', maxWidth:980, background:'#fff', borderRadius:14,
        boxShadow:'0 20px 60px -10px rgba(0,0,0,0.25)',
        overflow:'hidden',
      }}>
        {/* Header strip */}
        <div style={{padding:'24px 28px 0', position:'relative'}}>
          <button onClick={onClose} aria-label="Close" style={{
            position:'absolute', top:18, right:18,
            width:34, height:34, borderRadius:'50%',
            border:'none', background:'#f3f4f6', color:'#6b7280',
            cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
            fontSize:18,
          }}>×</button>

          <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:4}}>
            <div>
              <h2 style={{margin:0, fontSize:22, fontWeight:700, color:A, letterSpacing:'-0.01em'}}>Patient Details</h2>
              <div style={{fontSize:12.5, color:'#64748b', marginTop:4, display:'flex', alignItems:'center', gap:6}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
                Created by: johnny@insta-chart.ai
              </div>
            </div>

          </div>

          {/* Patient name + status pills */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'18px 0 16px', borderBottom:'1px solid #f1f5f9',
          }}>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{
                  width:28, height:28, borderRadius:'50%',
                  background:Asoft, color:A,
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
                </div>
                <div style={{fontSize:18, fontWeight:700, color:'#111827'}}>{fullName}</div>
              </div>
              <div style={{display:'flex', gap:18, marginTop:8, fontSize:12, color:'#64748b'}}>
                <span style={{display:'inline-flex', alignItems:'center', gap:6}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Created: 04/24/2026
                </span>
                <span style={{display:'inline-flex', alignItems:'center', gap:6}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 3 21 9 15 9"/></svg>
                  Updated: 04/24/2026
                </span>
              </div>
            </div>

          </div>

          {/* Project details removed per request */}
        </div>

        {/* Tabs removed per request */}

        {/* Body */}
        <div style={{padding:'20px 28px 28px', background:'#fff'}}>
          {tab === 'clinical' && (
            <div>
              <MiniMap/>

              {/* Search row */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginTop:16}}>
                <div style={{position:'relative', flex:'0 0 320px'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
                    style={{position:'absolute', left:10, top:'50%', transform:'translateY(-50%)'}}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input value={search} onChange={e=>setSearch(e.target.value)}
                    placeholder="Search... (Press /)"
                    style={{
                      width:'100%', padding:'8px 12px 8px 32px',
                      border:'1px solid #e5e7eb', borderRadius:8,
                      fontSize:13, color:'#374151', background:'#fff',
                      outline:'none',
                    }}/>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#64748b'}}>
                  Showing 1-{filtered.length} of {filtered.length}
                  <div style={{display:'inline-flex', alignItems:'center', gap:0, border:'1px solid #e5e7eb', borderRadius:6, overflow:'hidden'}}>
                    <button style={miniNav()}>‹</button>
                    <span style={{padding:'4px 10px', fontSize:12, color:'#374151', borderLeft:'1px solid #e5e7eb', borderRight:'1px solid #e5e7eb', fontVariantNumeric:'tabular-nums'}}>1</span>
                    <span style={{padding:'4px 10px', fontSize:12, color:'#9ca3af'}}>of 1</span>
                    <button style={miniNav()}>›</button>
                  </div>
                </div>
              </div>

              {/* Filters row */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <button style={chipBtn()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filters <span style={{background:'#e5e7eb', color:'#374151', padding:'1px 7px', borderRadius:99, fontSize:11, fontWeight:700, marginLeft:2}}>8/26</span>
                  </button>
                  <button style={{...chipBtn(), color:'#9ca3af'}}>× Reset</button>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <button style={chipBtn()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export CSV
                  </button>
                  <label style={{display:'inline-flex', alignItems:'center', gap:8, fontSize:12, color:'#374151', cursor:'pointer'}}>
                    <span style={{
                      width:32, height:18, borderRadius:99,
                      background: allCols ? A : '#cbd5e1',
                      position:'relative', transition:'background 120ms ease',
                    }}
                    onClick={()=>setAllCols(v=>!v)}>
                      <span style={{
                        position:'absolute', top:2, left: allCols ? 16 : 2,
                        width:14, height:14, borderRadius:'50%',
                        background:'#fff', transition:'left 120ms ease',
                        boxShadow:'0 1px 2px rgba(0,0,0,0.2)',
                      }}/>
                    </span>
                    All columns
                  </label>
                </div>
              </div>

              {/* Visits table */}
              <div style={{
                marginTop:12, border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden',
              }}>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:12.5}}>
                  <thead>
                    <tr style={{background:'#f9fafb'}}>
                      <th style={cdTh()}>
                        <span style={{display:'inline-flex', alignItems:'center', gap:4}}>
                          Created<br/>At <span style={{color:A}}>↓</span>
                        </span>
                      </th>
                      <th style={cdTh()}>Visit Name</th>
                      <th style={cdTh()}>Address</th>
                      <th style={cdTh()}>Type</th>
                      <th style={cdTh()}>Latest<br/>Service Date</th>
                      <th style={cdTh()}>Specialty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v,i) => (
                      <tr key={i} style={{borderTop:'1px solid #f1f5f9', background: v.request ? Asoft : 'transparent'}}>
                        <td style={cdTd()}>
                          <div>{v.date}</div>
                          <div style={{color:'#64748b', fontSize:11}}>{v.time}</div>
                        </td>
                        <td style={{...cdTd(), color:A, fontWeight:600, textDecoration:'underline', textUnderlineOffset:2}}>{v.name}</td>
                        <td style={cdTd()}>{v.address}</td>
                        <td style={cdTd()}><TypeBadge type={v.type}/></td>
                        <td style={{...cdTd(), fontVariantNumeric:'tabular-nums'}}>{v.service}</td>
                        <td style={cdTd()}>{v.specialty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'patient' && (
            <div style={{padding:60, textAlign:'center', color:'#64748b'}}>
              Patient overview content goes here.
            </div>
          )}
          {tab === 'records' && (
            <div style={{padding:60, textAlign:'center', color:'#64748b'}}>
              Record requests timeline goes here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Helpers ----------
function InfoCard({ icon, title, rows }) {
  const A = '#0d9488';
  return (
    <div style={{
      border:'1px solid #e5e7eb', borderRadius:10,
      padding:'14px 16px', background:'#fff',
    }}>
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
        <div style={{
          width:24, height:24, borderRadius:6,
          background:'#ccfbf1', color:A,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>
          {icon === 'building' ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
          )}
        </div>
        <div style={{fontSize:13, fontWeight:700, color:A}}>{title}</div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {rows.map((r,i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap:8, fontSize:12.5}}>
            <span style={{color:A, fontWeight:600}}>{r[0]}</span>
            <span style={{color:'#1f2937'}}>{r[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function navBtn() {
  return {
    width:24, height:24, borderRadius:5, border:'none',
    background:'#fff', cursor:'pointer', color:'#374151',
    boxShadow:'0 1px 1px rgba(0,0,0,0.06)',
  };
}
function miniNav() {
  return {
    width:26, height:26, border:'none', background:'#fff', cursor:'pointer',
    color:'#374151', fontSize:14,
  };
}
function chipBtn() {
  return {
    display:'inline-flex', alignItems:'center', gap:6,
    background:'#fff', color:'#374151',
    border:'1px solid #e5e7eb', borderRadius:8,
    padding:'6px 12px', fontSize:12.5, fontWeight:500, cursor:'pointer',
  };
}
function cdTh(extra={}) {
  return {
    textAlign:'left', padding:'10px 12px',
    fontSize:11, fontWeight:600, color:'#0d9488',
    background:'#f9fafb',
    ...extra,
  };
}
function cdTd(extra={}) {
  return {
    padding:'10px 12px', color:'#374151',
    ...extra,
  };
}

window.ClinicalDataModal = ClinicalDataModal;
window.SAMPLE_VISITS = SAMPLE_VISITS;
