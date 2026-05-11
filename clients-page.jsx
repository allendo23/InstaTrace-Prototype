// Clients page — matches reference screenshot exactly. Rendered when sidebar "Clients" is active.
const { useState: useStateCP, useMemo: useMemoCP } = React;

const CP_TABS = ['All status','Imported','Invitation Sent','Email Viewed','T&C Agreed','Share Record','Invite Expired','Partially Authorized','Fully Authorized','Expired'];

const CP_CLIENTS = [
  { id:100, initials:'PR', name:'Pete Rose', email:'matthew@insta-trace.ai', avatar:'lime',
    project:'InstaTrace Test', facility:{ name:'Intermountain Healthcare', badged:true },
    assignee:'Matt Reinbold', clientStatus:'Pending', chartStatus:'Fully Authorized', created:'05/06/2026' },
  { id:101, initials:'JD', name:'John Doe', email:'trevinfacer8@gmail.com', avatar:'amber',
    project:'Mark Test Project', facility:{ name:'Intermountain Health Cardiology Clinic at Riverton Hospital', badged:true },
    assignee:'Matt Cottrell', clientStatus:'Pending', chartStatus:'Fully Authorized', created:'05/05/2026' },
  { id:102, initials:'JL', name:'Johnny Liao', email:'johnny@insta-chart.ai', avatar:'violet',
    project:'Mark Test Project', facility:{ name:'Intermountain Health Utah Valley Clinic - Allergy and Asthma' },
    assignee:'Johnny Liao', clientStatus:'Pending', chartStatus:'T&C Agreed', created:'05/05/2026' },
  { id:103, initials:'MC', name:'Mark Chamberlain TruBridge', email:'trubridge1231231223@yopmail.com', avatar:'fuchsia',
    project:'Mark Test Project', facility:{ name:'Ozark Health Medical Center' },
    assignee:'Mark Chamberlain', clientStatus:'Pending', chartStatus:'Share Record', created:'04/21/2026' },
  { id:104, initials:'JL', name:'Johnny Liao', email:'johnny@insta-chart.ai', avatar:'rose',
    project:'Mark Test Project', facility:{ name:'HCA Florida Gulf Coast Hospital' },
    assignee:'Johnny Liao', clientStatus:'Pending', chartStatus:'Share Record', created:'04/17/2026' },
  { id:105, initials:'JL', name:'Johnny Liao', email:'johnny@insta-chart.ai', avatar:'orange',
    project:'Mark Test Project', facility:{ name:'Intermountain Cancer Center - St George', leaf:true },
    assignee:'Matt Cottrell', clientStatus:'Pending', chartStatus:'Download Expired', created:'04/17/2026' },
  { id:106, initials:'JL', name:'Johnny Liao', email:'johnny@insta-chart.ai', avatar:'lime',
    project:'Mark Test Project', facility:{ name:'Intermountain Health Hospital', leaf:true },
    assignee:'Matt Cottrell', clientStatus:'Pending', chartStatus:'Download Expired', created:'04/16/2026' },
  { id:107, initials:'MC', name:'Matthew Cottrell', email:'mcottrell1@gmail.com', avatar:'sky',
    project:'Mark Test Project', facility:{ name:'Intermountain Health Hospital' },
    assignee:'Matt Cottrell', clientStatus:'Pending', chartStatus:'T&C Agreed', created:'04/16/2026' },
  { id:108, initials:'BT', name:'Bo Tao (Johnny) Liao', email:'johnny@insta-chart.ai', avatar:'pink',
    project:'Mark Test Project', facility:{ name:'Intermountain Health Hospital', badged:true },
    assignee:'Johnny Liao', clientStatus:'Pending', chartStatus:'Fully Authorized', created:'04/09/2026' },
  { id:109, initials:'MC', name:'Matthew Cottrell', email:'mcottrell1@gmail.com', avatar:'violet',
    project:'Mark Test Project', facility:{ name:'Granger Medical Clinic, Summit Urology - American Fork' },
    assignee:'Matt Cottrell', clientStatus:'Pending', chartStatus:'Share Record', created:'04/09/2026' },
  { id:110, initials:'MC', name:'Matthew Cottrell', email:'mcottrell1@gmail.com', avatar:'amber',
    project:'Mark Test Project', facility:{ name:'InstaChart' }, secondFacility:{ name:'Intermountain Health' },
    assignee:'Matt Cottrell', clientStatus:'Pending', chartStatus:'T&C Agreed', created:'04/08/2026' },
  { id:111, initials:'MR', name:'Matthew Reinbold', email:'matthew@insta-chart.ai', avatar:'orange',
    project:'Mark Test Project', facility:{ name:'InstaChart' },
    assignee:'Mark Chamberlain', clientStatus:'Pending', chartStatus:'T&C Agreed', created:'04/07/2026' },
  { id:112, initials:'BT', name:'Bo Tao Liao', email:'johnny@insta-chart.ai', avatar:'rose',
    project:'Mark Test Project', facility:{ name:'InstaChart' },
    assignee:'Johnny Liao', clientStatus:'Pending', chartStatus:'T&C Agreed', created:'04/06/2026' },
  { id:113, initials:'JL', name:'Johnny Liao', email:'johnny@insta-chart.ai', avatar:'lime',
    project:'Mark Test Project', facility:{ name:'Intermountain Healthcare' }, secondFacility:{ name:'InstaChart' },
    assignee:'Johnny Liao', clientStatus:'Pending', chartStatus:'T&C Agreed', created:'04/06/2026' },
];

const CP_AVATAR = {
  amber:'#f59e0b', lime:'#84cc16', orange:'#fb923c', indigo:'#6366f1',
  violet:'#8b5cf6', teal:'#14b8a6', sky:'#0ea5e9', rose:'#f43f5e',
  fuchsia:'#d946ef', pink:'#ec4899',
};

function CPStatusPill({ status }) {
  const tones = {
    'Fully Authorized': { bg:'#dcfce7', fg:'#166534', border:'#86efac' },
    'T&C Agreed':       { bg:'#f3f4f6', fg:'#374151', border:'#d1d5db' },
    'Share Record':     { bg:'#f3f4f6', fg:'#374151', border:'#d1d5db' },
    'Download Expired': { bg:'#f3f4f6', fg:'#374151', border:'#d1d5db' },
    'Pending':          { bg:'transparent', fg:'#6b7280', border:'transparent' },
    'Need to add facilities': { bg:'#fef3c7', fg:'#92400e', border:'#fcd34d' },
  };
  const t = tones[status] || tones['T&C Agreed'];
  if (status === 'Pending') return <span style={{fontSize:13, color:t.fg}}>{status}</span>;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', padding:'4px 12px',
      borderRadius:99, fontSize:11.5, fontWeight:500,
      background:t.bg, color:t.fg, border:`1px solid ${t.border}`,
    }}>{status}</span>
  );
}

function CPFacilityCell({ facility, secondFacility }) {
  const Pill = ({ f }) => (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding: f.badged ? '4px 12px' : '0',
      borderRadius:99,
      border: f.badged ? '1px solid #86efac' : 'none',
      background: f.badged ? '#dcfce7' : 'transparent',
      color: f.badged ? '#166534' : '#374151',
      fontSize:13, fontWeight: f.badged ? 500 : 400,
    }}>
      {f.leaf && (
        <span style={{
          width:18, height:18, borderRadius:'50%', background:'#dcfce7',
          display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#16a34a',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 20A7 7 0 0 1 4 13c0-2 1-3.9 3-5.5s3.5-4 4-6.5c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 0 1-7 7Z"/></svg>
        </span>
      )}
      {f.name}
    </span>
  );
  return (
    <div style={{display:'flex', flexDirection:'column', gap:6}}>
      {facility && <Pill f={facility}/>}
      {secondFacility && <Pill f={secondFacility}/>}
    </div>
  );
}

function CPActionCell({ status }) {
  if (status === 'Fully Authorized') {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end'}}>
        <button style={cpBtnGhost()}>View</button>
      </div>
    );
  }
  if (status === 'Download Expired') {
    return <button style={cpBtnGhost()}>Reauthorize</button>;
  }
  return (
    <div style={{display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end'}}>
      <span style={{fontSize:11.5, color:'#9ca3af'}}>Pending Authorization</span>
      <button style={cpBtnPrimary()}>View Authorization Page</button>
    </div>
  );
}
function cpBtnGhost() {
  return {
    background:'#fff', color:'#374151', border:'1px solid #d1d5db',
    borderRadius:8, padding:'6px 14px', fontSize:12.5, fontWeight:500, cursor:'pointer',
    minWidth:80,
  };
}
function cpBtnPrimary() {
  return {
    background:'#4f46e5', color:'#fff', border:'none',
    borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer',
    whiteSpace:'nowrap',
  };
}

function CPTabs({ value, onChange, counts }) {
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:2, padding:4, background:'#f3f4f6', borderRadius:10, flexWrap:'wrap'}}>
      {CP_TABS.map(tb => {
        const active = tb === value;
        return (
          <button key={tb} onClick={()=>onChange(tb)} style={{
            padding:'7px 14px', borderRadius:7,
            background: active ? '#3b82f6' : 'transparent',
            color: active ? '#fff' : '#6b7280',
            fontSize:12.5, fontWeight:600, cursor:'pointer', border:'none',
            whiteSpace:'nowrap',
          }}>{tb}</button>
        );
      })}
    </div>
  );
}

function ClientsPage({ extraClients = [], linkedIds }) {
  const [tab, setTab] = useStateCP('All status');
  const [statusFilter, setStatusFilter] = useStateCP('');
  const [userFilter, setUserFilter] = useStateCP('');
  const [projectFilter, setProjectFilter] = useStateCP('');
  const [search, setSearch] = useStateCP('');

  const filtered = useMemoCP(() => {
    const all = [...extraClients, ...CP_CLIENTS];
    return all.filter(c => {
      if (tab !== 'All status' && c.chartStatus !== tab && c.clientStatus !== tab) return false;
      if (statusFilter && c.clientStatus !== statusFilter) return false;
      if (userFilter && c.assignee !== userFilter) return false;
      if (projectFilter && !c.project.includes(projectFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) &&
            !c.email.toLowerCase().includes(q) &&
            !c.assignee.toLowerCase().includes(q) &&
            !c.clientStatus.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tab, statusFilter, userFilter, projectFilter, search, extraClients]);



  return (
    <div style={{padding:'0 32px 32px'}}>
      <div style={{
        background:'#fff', border:'1px solid var(--border)', borderRadius:14,
        boxShadow:'0 1px 2px rgba(0,0,0,.03), 0 1px 3px rgba(0,0,0,.04)',
        overflow:'hidden',
      }}>
        <div style={{padding:'18px 20px', borderBottom:'1px solid var(--border-soft)'}}>
          <CPTabs value={tab} onChange={setTab}/>
        </div>

        <div style={{padding:'16px 20px', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', borderBottom:'1px solid var(--border-soft)'}}>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={cpSelect()}>
            <option value="">All Client Status</option>
            <option>Pending</option><option>Authorized</option>
          </select>
          <select value={userFilter} onChange={e=>setUserFilter(e.target.value)} style={cpSelect()}>
            <option value="">All assigned user</option>
            <option>Matt Cottrell</option><option>Johnny Liao</option><option>Mark Chamberlain</option>
          </select>
          <select value={projectFilter} onChange={e=>setProjectFilter(e.target.value)} style={cpSelect()}>
            <option value="">All project</option>
            <option>Mark Test Project</option>
          </select>
          <div style={{flex:1, minWidth:280, position:'relative'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
              style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search by name, email, client status or assign user name"
              style={{
                width:'100%', padding:'9px 12px 9px 36px',
                background:'#fff', border:'1px solid var(--border)', borderRadius:8,
                fontSize:13, outline:'none',
              }}/>
          </div>
        </div>

        <div style={{overflow:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:13}}>
            <thead>
              <tr>
                <th style={cpTh('40px')}><input type="checkbox" style={{margin:0}}/></th>
                <th style={cpTh()}>Client Information</th>
                <th style={cpTh()}>Client Project</th>
                <th style={cpTh()}>Facilities</th>
                <th style={cpTh()}>Assign User</th>
                <th style={cpTh()}>Client Status</th>
                <th style={cpTh()}>Chart Status</th>
                <th style={cpTh()}>Created Date</th>
                <th style={cpTh('','right')}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <CPRow key={c.id} c={c} stripe={i%2===1}
                  linkedToInstaTrace={c.linkedToInstaTrace || (linkedIds && linkedIds.has(c.id))}
                  onEdit={()=>{
                  window.dispatchEvent(new CustomEvent('instachart:edit-client', { detail: c }));
                }}/>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CPRow({ c, stripe, onEdit, linkedToInstaTrace }) {
  const [hover, setHover] = useStateCP(false);
  return (
    <tr onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{borderTop:'1px solid var(--border-soft)', background: hover ? '#f4f7ff' : (stripe ? '#fafbfc' : '#fff'), transition:'background 120ms ease'}}>
      <td style={cpTd()}><input type="checkbox" style={{margin:0}}/></td>
      <td style={cpTd()}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{
            width:34, height:34, borderRadius:'50%',
            background:CP_AVATAR[c.avatar] || '#9ca3af', color:'#fff',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            fontSize:11.5, fontWeight:700, flexShrink:0,
          }}>{c.initials}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13.5, fontWeight:600, color:'#111827'}}>{c.name}</div>
            <div style={{fontSize:12, color:'#6b7280'}}>{c.email}</div>
            {(linkedToInstaTrace || c.linkedToInstaTrace) && (
              <div style={{
                display:'inline-flex', alignItems:'center', gap:5,
                marginTop:5, padding:'2px 8px', borderRadius:99,
                background:'#eef2ff', color:'#4338ca',
                border:'1px solid #c7d2fe', fontSize:10.5, fontWeight:600,
                letterSpacing:'0.02em',
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Linked to InstaTrace
              </div>
            )}
          </div>
          <button
            onClick={(e)=>{ e.stopPropagation(); onEdit && onEdit(); }}
            title="Edit client"
            style={{
              opacity: hover ? 1 : 0,
              pointerEvents: hover ? 'auto' : 'none',
              transition:'opacity 120ms ease, background 120ms ease',
              width:30, height:30, borderRadius:'50%',
              background:'#fff', border:'1px solid var(--border)',
              color:'#4b5563', cursor:'pointer',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, marginLeft:4,
            }}
            onMouseEnter={(e)=>{ e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.color='#4338ca'; e.currentTarget.style.borderColor='#c7d2fe'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#4b5563'; e.currentTarget.style.borderColor='var(--border)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </td>
      <td style={cpTd()}>{c.project}</td>
      <td style={cpTd()}><CPFacilityCell facility={c.facility} secondFacility={c.secondFacility}/></td>
      <td style={cpTd()}>{c.assignee}</td>
      <td style={cpTd()}>{c.clientStatus}</td>
      <td style={cpTd()}><CPStatusPill status={c.chartStatus}/></td>
      <td style={{...cpTd(), color:'#6b7280', whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums'}}>{c.created}</td>
      <td style={{...cpTd(), textAlign:'right'}}><CPActionCell status={c.chartStatus}/></td>
    </tr>
  );
}

function cpTh(w, align) {
  return {
    textAlign: align || 'left', padding:'12px 16px',
    fontSize:11.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em',
    color:'#6b7280', background:'#fff', borderBottom:'1px solid var(--border)',
    width: w || 'auto', whiteSpace:'nowrap',
  };
}
function cpTd() { return { padding:'14px 16px', verticalAlign:'middle' }; }

function cpSelect() {
  return {
    padding:'8px 28px 8px 12px', border:'1px solid var(--border)', borderRadius:8,
    fontSize:13, background:'#fff', color:'#374151', minWidth:160, outline:'none',
    appearance:'none',
    backgroundImage:'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>")',
    backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center',
  };
}

window.ClientsPage = ClientsPage;
window.CP_CLIENTS = CP_CLIENTS;
