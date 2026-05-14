const { useState, useMemo, useEffect } = React;

// ---------- Data ----------
const FACILITIES = {
  IM: { name: 'Intermountain Healthcare', tone: 'green' },
  IM_REC: { name: 'Intermountain Health Addiction Medicine & Recovery Clinic - Provo', tone: null },
  IM_27: { name: 'Intermountain Health - N. 27th Walk-In Clinic', tone: null },
  STJ: { name: "St. Joseph's/Candler Physician Network", tone: null },
  CAS: { name: 'Cardiology Associates of Savannah (Savannah)', tone: null },
  SCR: { name: 'Scripps Mercy Hospital San Diego', tone: null },
};

const CLIENTS = [
  { id:1, initials:'JD', name:'John Doe', email:'johndoe@gmail.com', avatar:'amber',
    project:'InstaTrace Test', facilities:[], assignee:'Trevin Facer',
    clientStatus:'Pending', chartStatus:'Processing', created:'05/04/2026' },
  { id:2, initials:'PR', name:'Pete Rose', email:'matthew@insta-trace.ai', avatar:'lime',
    project:'InstaTrace Test', facilities:[{ ...FACILITIES.IM, badged:true }], assignee:'Matt Reinbold',
    clientStatus:'Pending', chartStatus:'Approved', created:'04/29/2026' },
  { id:3, initials:'JB', name:'Johnny Bench', email:'matthew@insta-trace.ai', avatar:'orange',
    project:'InstaTrace Test', facilities:[FACILITIES.IM], assignee:'Matt Reinbold',
    clientStatus:'Pending', chartStatus:'Processing', created:'04/27/2026' },
  { id:4, initials:'JL', name:'Johnny Liao', email:'johnny@insta-trace.ai', avatar:'indigo',
    project:'InstaTrace Test', facilities:[{ ...FACILITIES.IM, badged:true }], assignee:'Johnny Liao',
    clientStatus:'Pending', chartStatus:'Missing Information', created:'04/14/2026' },
  { id:5, initials:'TF', name:'Terry Francona', email:'matthew@insta-trace.ai', avatar:'violet',
    project:'InstaTrace Test', facilities:[FACILITIES.STJ, FACILITIES.CAS], assignee:'Matt Reinbold',
    clientStatus:'Pending', chartStatus:'Processing', created:'04/09/2026' },
  { id:6, initials:'JL', name:'Johnny Liao', email:'johnny@insta-trace.ai', avatar:'indigo',
    project:'Case Number\nXX-XX-XXXXX', facilities:[FACILITIES.IM_REC, FACILITIES.IM_27], assignee:'Johnny Liao',
    clientStatus:'Pending', chartStatus:'Missing Information', created:'04/01/2026' },
  { id:7, initials:'JL', name:'Johnny Liao', email:'johnny@insta-trace.ai', avatar:'indigo',
    project:'Case Number\nXX-XX-XXXXX', facilities:[FACILITIES.SCR], assignee:'Johnny Liao',
    clientStatus:'Pending', chartStatus:'Missing Information', created:'03/31/2026' },
  { id:8, initials:'JL', name:'Johnny Liao', email:'johnny@insta-trace.ai', avatar:'indigo',
    project:'Case Number\nXX-XX-XXXXX', facilities:[FACILITIES.IM_27], assignee:'Johnny Liao',
    clientStatus:'Pending', chartStatus:'Missing Information', created:'03/30/2026' },
  { id:9, initials:'TG', name:'Tom Glavine', email:'matthew@insta-trace.ai', avatar:'teal',
    project:'InstaTrace Test', facilities:[FACILITIES.IM], assignee:'Matt Reinbold',
    clientStatus:'Pending', chartStatus:'Missing Information', created:'03/30/2026' },
  { id:10, initials:'GM', name:'Greg Maddux', email:'greg@insta-trace.ai', avatar:'sky',
    project:'InstaTrace Test', facilities:[{ ...FACILITIES.IM, badged:true }], assignee:'Trevin Facer',
    clientStatus:'Authorized', chartStatus:'Approved', created:'03/22/2026' },
  { id:11, initials:'BB', name:'Barry Bonds', email:'barry@insta-trace.ai', avatar:'rose',
    project:'InstaTrace Test', facilities:[FACILITIES.STJ], assignee:'Matt Reinbold',
    clientStatus:'Imported', chartStatus:'Approved', created:'03/18/2026' },
  { id:12, initials:'KG', name:'Ken Griffey Jr.', email:'ken@insta-trace.ai', avatar:'fuchsia',
    project:'InstaTrace Test', facilities:[FACILITIES.IM, FACILITIES.SCR], assignee:'Johnny Liao',
    clientStatus:'Partial', chartStatus:'Processing', created:'03/12/2026' },
  { id:13, initials:'DJ', name:'Derek Jeter', email:'derek@insta-trace.ai', avatar:'amber',
    project:'InstaTrace Test', facilities:[FACILITIES.IM], assignee:'Matt Reinbold',
    clientStatus:'Email Viewed', chartStatus:'Processing', created:'03/05/2026' },
  { id:14, initials:'MR', name:'Mariano Rivera', email:'mariano@insta-trace.ai', avatar:'lime',
    project:'InstaTrace Test', facilities:[FACILITIES.IM], assignee:'Trevin Facer',
    clientStatus:'T&C Agreed', chartStatus:'Approved', created:'02/28/2026' },
];

// ---------- Dummy details for edit-modal prefill ----------
window.INSTATRACE_CLIENTS = CLIENTS;
const CLIENT_DETAILS = {
  1:  { firstName:'John', lastName:'Doe', dob:'1978-06-14', sex:'Male',
        mobile:'(555) 213-0481', ssn:'XXX-XX-4912',
        address:'1284 Maple Ridge Ln', city:'Salt Lake City', state:'UT', zips:['84101','84102'],
        startDate:'2024-01-15', endDate:'2025-09-22', authExpiration:'2027-05-04',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0001', project:'InstaTrace Test',
        assignedUser:'Trevin Facer (trevin@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_John_Doe.pdf' },
  2:  { firstName:'Pete', lastName:'Rose', dob:'1941-04-14', sex:'Male',
        mobile:'(513) 421-7755', ssn:'XXX-XX-1985',
        address:'412 Riverside Dr', city:'Cincinnati', state:'OH', zips:['45202'],
        startDate:'2023-06-03', endDate:'2026-04-12', authExpiration:'2027-04-29',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0002', project:'InstaTrace Test',
        assignedUser:'Matt Reinbold (matthew@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Pete_Rose.pdf' },
  3:  { firstName:'Johnny', lastName:'Bench', dob:'1947-12-07', sex:'Male',
        mobile:'(513) 887-3322', ssn:'XXX-XX-2240',
        address:'88 Catcher Way', city:'Cincinnati', state:'OH', zips:['45219','45220'],
        startDate:'2024-02-10', endDate:'2026-03-30', authExpiration:'2027-04-27',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0003', project:'InstaTrace Test',
        assignedUser:'Matt Reinbold (matthew@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Johnny_Bench.pdf' },
  4:  { firstName:'Johnny', lastName:'Liao', dob:'1989-08-22', sex:'Male',
        mobile:'(415) 553-0142', ssn:'XXX-XX-7733',
        address:'2200 Market St #410', city:'San Francisco', state:'CA', zips:['94114','94103'],
        startDate:'2024-07-01', endDate:'2026-02-28', authExpiration:'2027-04-14',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0004', project:'InstaTrace Test',
        assignedUser:'Johnny Liao (johnny+01@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Johnny_Liao.pdf',
        missingReason:'Date of signature is missing on the HIPAA authorization PDF.' },
  5:  { firstName:'Terry', lastName:'Francona', dob:'1959-04-22', sex:'Male',
        mobile:'(216) 420-9981', ssn:'XXX-XX-3414',
        address:'1717 Lakeshore Blvd', city:'Cleveland', state:'OH', zips:['44114','44115'],
        startDate:'2023-09-15', endDate:'2026-01-10', authExpiration:'2027-04-09',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0005', project:'InstaTrace Test',
        assignedUser:'Matt Reinbold (matthew@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Terry_Francona.pdf' },
  6:  { firstName:'Johnny', lastName:'Liao', dob:'1989-08-22', sex:'Male',
        mobile:'(415) 553-0142', ssn:'XXX-XX-7733',
        address:'2200 Market St #410', city:'San Francisco', state:'CA', zips:['94114'],
        startDate:'2025-01-05', endDate:'2026-03-15', authExpiration:'2027-04-01',
        capacity:'Power of Attorney',
        referenceNumber:'REF-2026-0006', project:'Case Number\nXX-XX-XXXXX',
        assignedUser:'Johnny Liao (johnny+01@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Johnny_Liao_Case.pdf',
        missingReason:'Date of signature is missing on the HIPAA authorization PDF.' },
  7:  { firstName:'Johnny', lastName:'Liao', dob:'1989-08-22', sex:'Male',
        mobile:'(415) 553-0142', ssn:'XXX-XX-7733',
        address:'2200 Market St #410', city:'San Francisco', state:'CA', zips:['94110'],
        startDate:'2024-11-12', endDate:'2026-02-20', authExpiration:'2027-03-31',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0007', project:'Case Number\nXX-XX-XXXXX',
        assignedUser:'Johnny Liao (johnny+01@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Johnny_Liao_Case2.pdf',
        missingReason:'Client signature is missing on the HIPAA authorization PDF.' },
  8:  { firstName:'Johnny', lastName:'Liao', dob:'1989-08-22', sex:'Male',
        mobile:'(415) 553-0142', ssn:'XXX-XX-7733',
        address:'2200 Market St #410', city:'San Francisco', state:'CA', zips:['94117'],
        startDate:'2024-10-04', endDate:'2026-02-14', authExpiration:'2027-03-30',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0008', project:'Case Number\nXX-XX-XXXXX',
        assignedUser:'Johnny Liao (johnny+01@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Johnny_Liao_Case3.pdf',
        missingReason:'Date of signature and witness signature are missing on the HIPAA authorization PDF.' },
  9:  { firstName:'Tom', lastName:'Glavine', dob:'1966-03-25', sex:'Male',
        mobile:'(404) 762-1144', ssn:'XXX-XX-6688',
        address:'310 Peachtree St NE', city:'Atlanta', state:'GA', zips:['30308','30309'],
        startDate:'2023-05-20', endDate:'2025-12-30', authExpiration:'2027-03-30',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0009', project:'InstaTrace Test',
        assignedUser:'Matt Reinbold (matthew@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Tom_Glavine.pdf',
        missingReason:'Date of signature is missing on the HIPAA authorization PDF.' },
  10: { firstName:'Greg', lastName:'Maddux', dob:'1966-04-14', sex:'Male',
        mobile:'(702) 339-4421', ssn:'XXX-XX-5512',
        address:'9450 W. Sahara Ave', city:'Las Vegas', state:'NV', zips:['89117','89107'],
        startDate:'2024-03-02', endDate:'2025-12-01', authExpiration:'2027-03-22',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0010', project:'InstaTrace Test',
        assignedUser:'Trevin Facer (trevin@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Greg_Maddux.pdf' },
  11: { firstName:'Barry', lastName:'Bonds', dob:'1964-07-24', sex:'Male',
        mobile:'(415) 982-7700', ssn:'XXX-XX-4488',
        address:'700 Embarcadero', city:'San Francisco', state:'CA', zips:['94107','94158'],
        startDate:'2023-08-14', endDate:'2025-11-19', authExpiration:'2027-03-18',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0011', project:'InstaTrace Test',
        assignedUser:'Matt Reinbold (matthew@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Barry_Bonds.pdf' },
  12: { firstName:'Ken', lastName:'Griffey Jr.', dob:'1969-11-21', sex:'Male',
        mobile:'(206) 442-1933', ssn:'XXX-XX-2299',
        address:'1250 First Ave S', city:'Seattle', state:'WA', zips:['98134','98144'],
        startDate:'2024-04-19', endDate:'2026-01-22', authExpiration:'2027-03-12',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0012', project:'InstaTrace Test',
        assignedUser:'Johnny Liao (johnny+01@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Ken_Griffey_Jr.pdf' },
  13: { firstName:'Derek', lastName:'Jeter', dob:'1974-06-26', sex:'Male',
        mobile:'(212) 339-7711', ssn:'XXX-XX-0202',
        address:'1 E. 161st Street', city:'Bronx', state:'NY', zips:['10451','10452'],
        startDate:'2024-02-02', endDate:'2025-10-15', authExpiration:'2027-03-05',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0013', project:'InstaTrace Test',
        assignedUser:'Matt Reinbold (matthew@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Derek_Jeter.pdf' },
  14: { firstName:'Mariano', lastName:'Rivera', dob:'1969-11-29', sex:'Male',
        mobile:'(212) 442-9942', ssn:'XXX-XX-4242',
        address:'42 River Ave', city:'Bronx', state:'NY', zips:['10451'],
        startDate:'2024-01-12', endDate:'2025-09-04', authExpiration:'2027-02-28',
        capacity:'Self-Authorizing',
        referenceNumber:'REF-2026-0014', project:'InstaTrace Test',
        assignedUser:'Trevin Facer (trevin@insta-chart.ai)',
        uploadFile:'HIPAA_Authorization_Mariano_Rivera.pdf' },
};


const TABS = ['All status','Approved','Processing','Missing Information','Denied'];

// ---------- Status pill mapping ----------
const STATUS_TONES = {
  'Approved':              'green',
  'Processing':            'blue',
  'Missing Information':   'amber',
  'Denied':                'rose',
};

// ---------- Avatar gradients ----------
const AVATAR_GRADIENTS = {
  amber:   'linear-gradient(135deg,#fbbf24,#f97316)',
  lime:    'linear-gradient(135deg,#a3e635,#16a34a)',
  orange:  'linear-gradient(135deg,#fb923c,#ea580c)',
  indigo:  'linear-gradient(135deg,#818cf8,#6366f1)',
  violet:  'linear-gradient(135deg,#c4b5fd,#7c3aed)',
  teal:    'linear-gradient(135deg,#5eead4,#0d9488)',
  sky:     'linear-gradient(135deg,#7dd3fc,#0284c7)',
  rose:    'linear-gradient(135deg,#fda4af,#e11d48)',
  fuchsia: 'linear-gradient(135deg,#f0abfc,#c026d3)',
};

// ---------- Icons ----------
const Icon = {
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Trace: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>,
  Folder: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Card: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  Status: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Help: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Chevron: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Type: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Verified: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981"><path d="M12 2 4 5v6c0 5 3.4 9.5 8 11 4.6-1.5 8-6 8-11V5l-8-3z" stroke="#047857" strokeWidth="1" fill="#34d399"/><path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// ---------- InstaChart Logo (wordmark: INSTA solid + CHART outlined box) ----------
function InstaTraceLogo() {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center',
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: '0.02em',
      color: '#fff',
      lineHeight: 1,
    }}>
      <span style={{paddingRight: 6}}>INSTA</span>
      <span style={{
        border: '2px solid #fff',
        padding: '4px 8px 4px 9px',
        borderRadius: 2,
        letterSpacing: '0.04em',
      }}>CHART</span>
    </div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ active, onNav, showLogo }) {
  const items = [
    { id:'dashboard', label:'Dashboard', icon:<Icon.Grid/> },
    { id:'clients', label:'Clients', icon:<Icon.Users/> },
    { id:'instatrace', label:'InstaTrace', icon:<Icon.Trace/>, pill:'Beta' },
    { id:'projects', label:'Projects', icon:<Icon.Folder/> },
    { id:'notifications', label:'Notifications', icon:<Icon.Bell/>, badge: 3 },
    { id:'reports', label:'Reports', icon:<Icon.Chart/> },
    { id:'users', label:'Users', icon:<Icon.User/> },
    { id:'billing', label:'Billing', icon:<Icon.Card/> },
    { id:'status', label:'InstaTrace Project', icon:<Icon.Status/> },
  ];
  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: 'var(--sidebar)',
      color: '#cbd5e1',
      display: 'flex', flexDirection:'column',
      position:'sticky', top:0, height:'100vh',
      borderRight:'1px solid #1f2937',
    }}>
      {showLogo && (
        <div style={{padding:'22px 20px 18px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <InstaTraceLogo />
        </div>
      )}
      <nav style={{flex:1, padding:'14px 12px', overflowY:'auto'}}>
        {items.map(it => {
          const isActive = it.id === active;
          return (
            <button key={it.id} onClick={()=>onNav(it.id)} style={{
              width:'100%', display:'flex', alignItems:'center', gap:12,
              padding:'10px 12px', borderRadius:8, marginBottom:2,
              background: isActive ? 'var(--sidebar-active)' : 'transparent',
              color: isActive ? '#fff' : '#cbd5e1',
              fontSize:13.5, fontWeight: isActive ? 600 : 500,
              textAlign:'left', position:'relative',
              transition:'background .15s, color .15s',
            }}
            onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='var(--sidebar-hover)';}}
            onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent';}}
            >
              {isActive && <div style={{position:'absolute', left:0, top:8, bottom:8, width:3, borderRadius:'0 3px 3px 0', background:'var(--accent)'}}/>}
              <span style={{display:'flex', color: isActive ? 'var(--accent-light, #a5b4fc)' : '#9ca3af'}}>{it.icon}</span>
              <span style={{flex:1}}>{it.label}</span>
              {it.pill && <span style={{
                background:'#0d9488', color:'#fff', fontSize:10, fontWeight:700,
                padding:'2px 7px', borderRadius:99, letterSpacing:'0.06em', textTransform:'uppercase',
                boxShadow:'0 0 0 1px rgba(255,255,255,0.08) inset',
              }}>{it.pill}</span>}
              {it.badge && <span style={{
                background:'var(--accent)', color:'#fff', fontSize:11, fontWeight:600,
                padding:'2px 7px', borderRadius:10, minWidth:20, textAlign:'center'
              }}>{it.badge}</span>}
            </button>
          );
        })}
        <div style={{height:1, background:'rgba(255,255,255,.06)', margin:'12px 4px'}}/>
        <button onClick={()=>onNav('settings')} style={{
            width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
            color:'#cbd5e1', fontSize:13.5, fontWeight:500, borderRadius:8, textAlign:'left',
        }}>
          <span style={{color:'#9ca3af'}}><Icon.Settings/></span>
          <span style={{flex:1}}>Settings</span>
          <Icon.Chevron/>
        </button>
        <button onClick={()=>onNav('help')} style={{
            width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
            color:'#cbd5e1', fontSize:13.5, fontWeight:500, borderRadius:8, textAlign:'left',
        }}>
          <span style={{color:'#9ca3af'}}><Icon.Help/></span>
          <span style={{flex:1}}>Help</span>
        </button>
      </nav>
      {/* User card */}
      <div style={{padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
          <div style={{
            width:36, height:36, borderRadius:'50%',
            background: AVATAR_GRADIENTS.indigo,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:700, fontSize:13,
          }}>JL</div>
          <div style={{lineHeight:1.2, minWidth:0}}>
            <div style={{color:'#fff', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:4}}>
              Johnny Liao <Icon.Verified/>
            </div>
            <div style={{color:'#9ca3af', fontSize:11, overflow:'hidden', textOverflow:'ellipsis'}}>
              johnny@insta-trace.ai
            </div>
          </div>
        </div>
        <div style={{display:'flex', gap:6}}>
          <button title="Accessibility" style={iconBtnStyle}><Icon.Type/></button>
          <button title="Settings" style={iconBtnStyle}><Icon.Settings/></button>
          <button title="Sign out" style={iconBtnStyle}><Icon.Logout/></button>
        </div>
      </div>
    </aside>
  );
}

const iconBtnStyle = {
  width:38, height:38, borderRadius:8,
  background:'rgba(255,255,255,.04)',
  border:'1px solid rgba(255,255,255,.06)',
  color:'#cbd5e1', display:'flex', alignItems:'center', justifyContent:'center',
};

// ---------- StatusPill ----------
function StatusPill({ status }) {
  const tone = STATUS_TONES[status] || 'gray';
  const styles = {
    blue:   { bg:'var(--st-blue-bg)',   fg:'var(--st-blue-fg)',   bd:'var(--st-blue-bd)' },
    green:  { bg:'var(--st-green-bg)',  fg:'var(--st-green-fg)',  bd:'var(--st-green-bd)' },
    amber:  { bg:'var(--st-amber-bg)',  fg:'var(--st-amber-fg)',  bd:'var(--st-amber-bd)' },
    rose:   { bg:'var(--st-rose-bg)',   fg:'var(--st-rose-fg)',   bd:'var(--st-rose-bd)' },
    gray:   { bg:'var(--st-gray-bg)',   fg:'var(--st-gray-fg)',   bd:'var(--st-gray-bd)' },
    violet: { bg:'var(--st-violet-bg)', fg:'var(--st-violet-fg)', bd:'var(--st-violet-bd)' },
  }[tone];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'4px 10px', borderRadius:999,
      background: styles.bg, color: styles.fg, border:`1px solid ${styles.bd}`,
      fontSize:12, fontWeight:500, whiteSpace:'nowrap',
    }}>
      <span style={{width:6, height:6, borderRadius:'50%', background:styles.fg, opacity:.7}}/>
      {status}
    </span>
  );
}

// ---------- FacilityChip ----------
function FacilityChip({ facility }) {
  if (facility.badged) {
    return (
      <span style={{
        display:'inline-flex', alignItems:'center', gap:7,
        padding:'5px 11px 5px 7px', borderRadius:999,
        background:'#ecfdf5', color:'#065f46', border:'1px solid #a7f3d0',
        fontSize:12.5, fontWeight:500, maxWidth:'100%',
      }}>
        <Icon.Verified/>
        <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{facility.name}</span>
      </span>
    );
  }
  return <span style={{color:'#374151', fontSize:13}}>{facility.name}</span>;
}

// ---------- Avatar ----------
function Avatar({ initials, color }) {
  return (
    <div style={{
      width:36, height:36, borderRadius:'50%',
      background: AVATAR_GRADIENTS[color] || AVATAR_GRADIENTS.indigo,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:700, fontSize:12.5,
      flexShrink:0, boxShadow:'inset 0 1px 0 rgba(255,255,255,.2)',
    }}>{initials}</div>
  );
}

// ---------- Tabs ----------
function Tabs({ value, onChange, counts }) {
  return (
    <div style={{
      display:'flex', flexWrap:'wrap', gap:6, padding:'4px',
      background:'#f3f4f6', borderRadius:10, border:'1px solid var(--border-soft)',
    }}>
      {TABS.map(t => {
        const active = t === value;
        return (
          <button key={t} onClick={()=>onChange(t)} style={{
            padding:'7px 13px', borderRadius:7,
            background: active ? '#fff' : 'transparent',
            color: active ? 'var(--accent)' : '#4b5563',
            fontSize:13, fontWeight: active ? 600 : 500,
            boxShadow: active ? '0 1px 2px rgba(0,0,0,.06), 0 0 0 1px var(--border)' : 'none',
            display:'inline-flex', alignItems:'center', gap:7,
            transition:'all .15s',
          }}>
            {t}
            {counts[t] !== undefined && (
              <span style={{
                fontSize:11, fontWeight:600,
                padding:'1px 7px', borderRadius:99,
                background: active ? 'var(--primary-soft)' : '#e5e7eb',
                color: active ? 'var(--accent)' : '#6b7280',
              }}>{counts[t]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Select ----------
function Select({ value, onChange, options, placeholder }) {
  return (
    <div style={{position:'relative'}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        appearance:'none', WebkitAppearance:'none',
        padding:'9px 36px 9px 12px',
        background:'#fff', border:'1px solid var(--border)', borderRadius:8,
        fontSize:13, color: value ? 'var(--text)' : 'var(--text-muted)',
        minWidth:200, cursor:'pointer', outline:'none',
      }}
      onFocus={e=>e.target.style.borderColor='var(--accent)'}
      onBlur={e=>e.target.style.borderColor='var(--border)'}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div style={{position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none'}}>
        <Icon.Chevron/>
      </div>
    </div>
  );
}

// ---------- Header ----------
function Header({ active, onNew }) {
  const titles = {
    instatrace: 'InstaTrace',
    clients: 'Clients',
    dashboard: 'Dashboard',
    projects: 'Projects',
    notifications: 'Notifications',
    reports: 'Reports',
    users: 'Users',
    billing: 'Billing',
    status: 'InstaTrace Project',
  };
  const title = titles[active] || 'Clients';
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'24px 32px 20px',
    }}>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4, fontSize:12, color:'var(--text-muted)'}}>
          <span>InstaChart</span><Icon.ChevronRight/><span style={{color:'var(--text)', fontWeight:500}}>{title}</span>
        </div>
        <h1 style={{margin:0, fontSize:26, fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)'}}>{title}</h1>
      </div>
      <div style={{display:'flex', gap:10}}>
        <button style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'10px 16px', borderRadius:9,
          background:'#fff', border:'1px solid var(--border)',
          color:'var(--text)', fontSize:13.5, fontWeight:500,
          boxShadow:'0 1px 2px rgba(0,0,0,.04)',
        }}>
          <Icon.Upload/> Import Clients
        </button>
        <button onClick={onNew} style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'10px 18px', borderRadius:9,
          background:'var(--accent)', color:'#fff',
          fontSize:13.5, fontWeight:600,
          boxShadow:'0 1px 2px rgba(0,0,0,.06), 0 4px 12px -2px rgba(79,70,229,.4)',
        }}>
          <Icon.Plus/> New Client
        </button>
      </div>
    </div>
  );
}

// ---------- Row ----------
function Row({ c, checked, onCheck, density, stripe, accentRow, onEdit, onView, linkedToInstaChart }) {
  const [hover, setHover] = useState(false);
  const py = density === 'compact' ? 10 : 16;
  return (
    <tr
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        background: accentRow ? 'var(--primary-soft)' : (hover ? 'var(--row-hover)' : (stripe ? '#fafbfc' : '#fff')),
        transition:'background .12s',
        borderTop:'1px solid var(--border-soft)',
      }}>
      <td style={{padding:`${py}px 12px ${py}px 24px`, width:36}}>
        <input type="checkbox" checked={checked} onChange={onCheck} style={{accentColor:'var(--accent)', width:15, height:15, cursor:'pointer'}}/>
      </td>
      <td style={{padding:`${py}px 12px`}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <Avatar initials={c.initials} color={c.avatar}/>
          <div style={{minWidth:0, flex:1}}>
            <div style={{fontSize:13.5, fontWeight:600, color:'var(--text)'}}>{c.name}</div>
            <div style={{fontSize:12, color:'var(--text-muted)'}}>{c.email}</div>
            {linkedToInstaChart && (
              <div style={{
                display:'inline-flex', alignItems:'center', gap:5,
                marginTop:5, padding:'2px 8px', borderRadius:99,
                background:'#dcfce7', color:'#166534',
                border:'1px solid #86efac', fontSize:10.5, fontWeight:600,
                letterSpacing:'0.02em',
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Linked to InstaChart
              </div>
            )}
          </div>
          <button
            onClick={(e)=>{ e.stopPropagation(); onEdit && onEdit(c); }}
            title="Edit client record"
            aria-label="Edit client record"
            style={{
              opacity: hover ? 1 : 0,
              transition:'opacity 120ms ease, background 120ms ease, border-color 120ms ease',
              width:32, height:32, borderRadius:'50%',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              background:'#fff', border:'1px solid var(--border-soft)',
              color:'var(--accent)', cursor:'pointer', flexShrink:0,
              boxShadow:'0 1px 2px rgba(15,23,42,0.04)',
            }}
            onMouseEnter={(e)=>{ e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.borderColor='var(--accent)'; }}
            onMouseLeave={(e)=>{ e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='var(--border-soft)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        </div>
      </td>
      <td style={{padding:`${py}px 12px`, fontSize:13, color:'var(--text)'}}>
        {c.project.split('\n').map((line,i)=>(
          <div key={i} style={i===0?{fontWeight:500}:{fontFamily:'JetBrains Mono, monospace', fontSize:11.5, color:'var(--text-muted)', marginTop:2}}>{line}</div>
        ))}
      </td>
      <td style={{padding:`${py}px 12px`, fontSize:13, color:'var(--text)', fontVariantNumeric:'tabular-nums', textAlign:'center'}}>
        {c.facilities.length}
      </td>
      <td style={{padding:`${py}px 12px`, fontSize:13, color:'var(--text)'}}>{c.assignee}</td>
      <td style={{padding:`${py}px 12px`}}><StatusPill status={c.chartStatus}/></td>
      <td style={{padding:`${py}px 12px`, fontSize:13, color:'var(--text-muted)', whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums'}}>{c.created}</td>
      <td style={{padding:`${py}px 24px ${py}px 12px`, whiteSpace:'nowrap'}}>
        <ActionCell status={c.chartStatus} client={c} initiallyAdded={linkedToInstaChart} onReauthorize={()=>onEdit && onEdit(c)} onView={()=>onView && onView(c)}/>
      </td>
    </tr>
  );
}

// ---------- Action cell ----------
function ActionCell({ status, client, onReauthorize, onView, initiallyAdded }) {
  const [hover, setHover] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [added, setAdded] = useState(!!initiallyAdded);
  React.useEffect(()=>{ if (initiallyAdded) setAdded(true); }, [initiallyAdded]);

  // Search InstaChart clients for a match
  const match = useMemo(() => {
    if (!client || !window.CP_CLIENTS) return null;
    const targetName = (client.name || '').toLowerCase().trim();
    const targetEmail = (client.email || '').toLowerCase().trim();
    return window.CP_CLIENTS.find(cp => {
      const n = (cp.name || '').toLowerCase().trim();
      const e = (cp.email || '').toLowerCase().trim();
      return n === targetName && e === targetEmail;
    }) || null;
  }, [client, confirm]);
  if (status === 'Approved') {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'stretch'}}>
        <button
          onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
          onClick={(e)=>{ e.stopPropagation(); onView && onView(); }}
          style={{
            fontSize:12.5, fontWeight:600,
            padding:'7px 14px', borderRadius:8,
            background: hover ? 'var(--accent-dark, #4338ca)' : 'var(--accent)',
            color:'#fff', border:'none', cursor:'pointer',
            boxShadow:'0 1px 2px rgba(67,56,202,0.18)',
            transition:'background 120ms ease',
          }}>
          View Clinical Data
        </button>
        {added ? (
          <span style={{
            fontSize:11.5, fontWeight:600, color:'#166534',
            padding:'6px 12px', borderRadius:8,
            background:'#dcfce7', border:'1px solid #86efac',
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Added to InstaChart
          </span>
        ) : (
          <button
            onClick={(e)=>{ e.stopPropagation(); setConfirm(true); }}
            style={{
              fontSize:12, fontWeight:600,
              padding:'6px 12px', borderRadius:8,
              background:'#fff', color:'var(--text)',
              border:'1px solid var(--border-soft)', cursor:'pointer',
              whiteSpace:'nowrap',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
            onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
            Add to InstaChart Clients
          </button>
        )}
        {confirm && ReactDOM.createPortal((
          <div onClick={(e)=>{ e.stopPropagation(); setConfirm(false); }} style={{
            position:'fixed', inset:0, background:'rgba(31,41,55,.55)', backdropFilter:'blur(4px)',
            zIndex:1100, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
          }}>
            <div onClick={e=>e.stopPropagation()} style={{
              background:'#fff', borderRadius:14, padding:'28px 30px 24px',
              maxWidth:520, width:'100%',
              boxShadow:'0 20px 50px rgba(0,0,0,0.25)',
            }}>
              <div style={{display:'flex', gap:16, alignItems:'flex-start'}}>
                <div style={{
                  flexShrink:0, width:40, height:40, borderRadius:'50%',
                  background:'#eef2ff', color:'#4f46e5',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16, fontWeight:700, color:'#111827', marginBottom:8}}>
                    {match ? 'Confirmed Client Match' : 'No Matching Client Found'}
                  </div>
                  <div style={{fontSize:13.5, color:'#374151', lineHeight:1.55}}>
                    {match
                      ? <>We found <b>{match.name}</b> ({match.email}) in InstaChart Clients. Do you want to link this InstaTrace client to the existing InstaChart client, or create a new one?</>
                      : <>No matching client was found in InstaChart for <b>{client && client.name}</b> ({client && client.email}). Do you want to create a new InstaChart client?</>
                    }
                  </div>
                  {match && (
                    <div style={{
                      marginTop:14, padding:'12px 14px', background:'#f0fdf4',
                      border:'1px solid #86efac', borderRadius:8,
                      fontSize:13, color:'#111827',
                    }}>
                      <div style={{fontWeight:600}}>{match.name}</div>
                      <div style={{color:'#6b7280', fontSize:12, marginTop:3}}>{match.email} Â· {match.project}</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{display:'flex', gap:10, alignItems:'center', marginTop:24, paddingTop:18, borderTop:'1px solid #f1f5f9'}}>
                {match ? (
                  <>
                    <button onClick={()=>{ setConfirm(false); setAdded(true);
                      window.dispatchEvent(new CustomEvent('instatrace:client-linked', { detail: client }));
                      if (match) {
                        window.dispatchEvent(new CustomEvent('instachart:client-linked', { detail: match }));
                        window.dispatchEvent(new CustomEvent('instachart:edit-client', { detail: match }));
                      }
                    }} style={{
                      marginRight:'auto',
                      padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600,
                      background:'var(--accent)', color:'#fff', border:'none', cursor:'pointer',
                    }}>Link Client</button>
                    <button onClick={()=>{
                      setConfirm(false); setAdded(true);
                      window.dispatchEvent(new CustomEvent('instachart:create-client', { detail: { ...client, openEditAfterCreate: true } }));
                      window.dispatchEvent(new CustomEvent('instatrace:client-linked', { detail: client }));
                    }} style={{
                      padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600,
                      background:'#fff', color:'var(--accent)',
                      border:'1px solid var(--accent)', cursor:'pointer',
                    }}>Create New</button>
                  </>
                ) : (
                  <button onClick={()=>{
                    setConfirm(false); setAdded(true);
                    window.dispatchEvent(new CustomEvent('instachart:create-client', { detail: { ...client, openEditAfterCreate: true } }));
                    window.dispatchEvent(new CustomEvent('instatrace:client-linked', { detail: client }));
                  }} style={{
                    marginRight:'auto',
                    padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600,
                    background:'var(--accent)', color:'#fff', border:'none', cursor:'pointer',
                  }}>Create New Client</button>
                )}
                <button onClick={()=>setConfirm(false)} style={{
                  padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600,
                  background:'#fff', color:'#374151',
                  border:'1px solid var(--border)', cursor:'pointer',
                }}>Cancel</button>
              </div>
            </div>
          </div>
        ), document.body)}
      </div>
    );
  }
  if (status === 'Processing') {
    return (
      <span style={{
        fontSize:12.5, color:'var(--text-muted)',
        fontStyle:'italic',
      }}>
        Pending Authorization
      </span>
    );
  }
  // Missing Information / Denied
  return (
    <button
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={(e)=>{ e.stopPropagation(); onReauthorize && onReauthorize(); }}
      style={{
        fontSize:12.5, fontWeight:600,
        padding:'6px 14px', borderRadius:8,
        background: hover ? '#f9fafb' : '#fff',
        color:'var(--text)', border:'1px solid var(--border-soft)', cursor:'pointer',
        transition:'background 120ms ease',
      }}>
      Reauthorize
    </button>
  );
}

// ---------- App ----------
function App() {
  const [t, setTweak] = window.useTweaks(window.__TWEAK_DEFAULTS);
  const [tab, setTab] = useState('All status');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('instatrace');
  const [selected, setSelected] = useState(new Set([2])); // pre-select Pete Rose like reference
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showICCreate, setShowICCreate] = useState(false);
  const [icEditClient, setIcEditClient] = useState(null);
  const [extraICClients, setExtraICClients] = useState([]);

  // Listen for "create new" events globally â€” works whether or not ClientsPage is mounted
  useEffect(() => {
    const handler = (ev) => {
      const c = ev.detail || {};
      const initials = (c.name || '').split(' ').map(s=>s[0]).filter(Boolean).slice(0,2).join('').toUpperCase() || 'NC';
      const today = new Date();
      const created = `${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}/${today.getFullYear()}`;
      const newRow = {
        id: 'new-' + Date.now(),
        initials, name: c.name || 'New Client', email: c.email || '',
        avatar: 'sky', project: c.project || 'InstaTrace Test',
        facility: { name: 'No facilities have been selected' },
        assignee: c.assignee || '\u2014',
        clientStatus: 'Pending', chartStatus: 'Need to add facilities', created,
        linkedToInstaTrace: c.sourceInstaTraceId || c.linkedToInstaTrace || c.name || true,
      };
      setExtraICClients(list => [newRow, ...list]);
      if (c.openEditAfterCreate) {
        setIcEditClient(newRow);
        setShowICCreate(true);
      }
    };
    window.addEventListener('instachart:create-client', handler);
    const linkAdd = (ev) => {
      const id = ev.detail && ev.detail.id;
      if (id != null) setLinkedTraceIds(s => { const n = new Set(s); n.add(id); return n; });
    };
    window.addEventListener('instatrace:client-linked', linkAdd);
    const linkChartAdd = (ev) => {
      const id = ev.detail && ev.detail.id;
      if (id != null) setLinkedChartIds(s => { const n = new Set(s); n.add(id); return n; });
    };
    window.addEventListener('instachart:client-linked', linkChartAdd);
    const editHandler = (ev) => {
      setIcEditClient(ev.detail || null);
      setShowICCreate(true);
    };
    window.addEventListener('instachart:edit-client', editHandler);
    return () => {
      window.removeEventListener('instachart:create-client', handler);
      window.removeEventListener('instatrace:client-linked', linkAdd);
      window.removeEventListener('instachart:client-linked', linkChartAdd);
      window.removeEventListener('instachart:edit-client', editHandler);
    };
  }, []);
  const [editingClient, setEditingClient] = useState(null);
  const [linkedTraceIds, setLinkedTraceIds] = useState(()=>new Set());
  const [linkedChartIds, setLinkedChartIds] = useState(()=>new Set());
  const [clinicalClient, setClinicalClient] = useState(null);

  // Apply CSS vars from tweaks
  useEffect(() => {
    const root = document.documentElement;
    // InstaTrace gets a teal palette inspired by the TG avatar; InstaChart keeps the configured accent.
    const isTrace = active !== 'clients';
    const accent = isTrace ? '#0d9488' : t.accent;
    const accentDark = isTrace ? '#0f766e' : t.accent;
    const accentSoft = isTrace ? '#ccfbf1' : '#eef2ff';
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-dark', accentDark);
    root.style.setProperty('--accent-light', accent + 'aa');
    root.style.setProperty('--primary', accent);
    root.style.setProperty('--primary-hover', accentDark);
    root.style.setProperty('--primary-soft', accentSoft);
    // sidebar tone
    if (t.sidebarTone === 'ink') {
      root.style.setProperty('--sidebar', '#0f1115');
      root.style.setProperty('--sidebar-hover', '#1b1e25');
      root.style.setProperty('--sidebar-active', '#232730');
    } else if (t.sidebarTone === 'navy') {
      root.style.setProperty('--sidebar', '#0c1733');
      root.style.setProperty('--sidebar-hover', '#162449');
      root.style.setProperty('--sidebar-active', '#1e2f5e');
    } else if (t.sidebarTone === 'light') {
      root.style.setProperty('--sidebar', '#f9fafb');
      root.style.setProperty('--sidebar-hover', '#f3f4f6');
      root.style.setProperty('--sidebar-active', '#e5e7eb');
    }
  }, [t, active]);

  const filtered = useMemo(() => {
    return CLIENTS.filter(c => {
      if (tab !== 'All status') {
        if (c.chartStatus !== tab && c.clientStatus !== tab) return false;
      }
      if (statusFilter && c.chartStatus !== statusFilter) return false;
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
  }, [tab, statusFilter, userFilter, projectFilter, search]);

  const counts = useMemo(() => {
    const c = { 'All status': CLIENTS.length };
    TABS.slice(1).forEach(t => {
      c[t] = CLIENTS.filter(cl => cl.chartStatus === t || cl.clientStatus === t).length;
    });
    return c;
  }, []);

  const toggle = (id) => setSelected(s => {
    const ns = new Set(s);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    return ns;
  });
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(c=>c.id)));
  };

  const sidebarTextColor = t.sidebarTone === 'light' ? '#111827' : '#cbd5e1';
  const isLightSidebar = t.sidebarTone === 'light';

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg)'}} data-screen-label="Clients dashboard">
      <div style={{
        // Patch sidebar text colors when light
        ...(isLightSidebar && {'--sidebar-text':'#111827'}),
      }}>
        <Sidebar active={active} onNav={setActive} showLogo={t.showSidebarLogo} />
      </div>

      <main style={{flex:1, minWidth:0}}>
        <Header active={active} onNew={()=>{
          if (active === 'clients') { setIcEditClient(null); setShowICCreate(true); }
          else { setEditingClient(null); setShowNewPatient(true); }
        }}/>
        <window.NewPatientModal open={showNewPatient} onClose={()=>{ setShowNewPatient(false); setEditingClient(null); }} prefill={editingClient}/>
        <window.InstaChartCreateClientModal open={showICCreate} onClose={()=>{ setShowICCreate(false); setIcEditClient(null); }}
          prefill={icEditClient}
          onCreate={(form)=>{
            if (icEditClient) return; // edit mode â€” don't create new
            const fullName = `${form.firstName} ${form.lastName}`.trim() || 'New Client';
            window.dispatchEvent(new CustomEvent('instachart:create-client', {
              detail: { name: fullName, email: form.email, project: form.project || 'Mark Test Project', assignee: 'You' }
            }));
          }}/>
        <window.ClinicalDataModal open={!!clinicalClient} onClose={()=>setClinicalClient(null)} client={clinicalClient}/>

        {active === 'clients' ? <window.ClientsPage extraClients={extraICClients} linkedIds={linkedChartIds}/> : (
        <div style={{padding:'0 32px 32px'}}>
          <div style={{
            background:'#fff', border:'1px solid var(--border)', borderRadius:14,
            boxShadow:'0 1px 2px rgba(0,0,0,.03), 0 1px 3px rgba(0,0,0,.04)',
            overflow:'hidden',
          }}>
            <div style={{padding:'18px 20px', borderBottom:'1px solid var(--border-soft)'}}>
              <Tabs value={tab} onChange={setTab} counts={counts}/>
            </div>

            <div style={{padding:'16px 20px', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', borderBottom:'1px solid var(--border-soft)'}}>
              <Select value={statusFilter} onChange={setStatusFilter} placeholder="All Authorization Status"
                options={['Approved','Processing','Missing Information','Denied']}/>
              <Select value={userFilter} onChange={setUserFilter} placeholder="All assigned user"
                options={['Trevin Facer','Matt Reinbold','Johnny Liao']}/>
              <Select value={projectFilter} onChange={setProjectFilter} placeholder="All project"
                options={['InstaTrace Test','Case Number']}/>
              <div style={{flex:1, minWidth:280, position:'relative'}}>
                <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}}><Icon.Search/></span>
                <input
                  value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search by name, email, authorization status or assign user name"
                  style={{
                    width:'100%', padding:'9px 12px 9px 36px',
                    background:'#fff', border:'1px solid var(--border)', borderRadius:8,
                    fontSize:13, outline:'none',
                  }}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'}
                />
              </div>
            </div>

            {selected.size > 0 && (
              <div style={{
                padding:'10px 24px', background:'var(--primary-soft)',
                borderBottom:'1px solid var(--border-soft)',
                display:'flex', alignItems:'center', gap:14, fontSize:13,
              }}>
                <span style={{color:'var(--accent)', fontWeight:600}}>{selected.size} selected</span>
                <span style={{color:'var(--text-muted)'}}>Â·</span>
                <button style={linkBtnStyle}>Resend invitations</button>
                <button style={linkBtnStyle}>Export CSV</button>
                <button style={linkBtnStyle}>Reassign</button>
                <div style={{flex:1}}/>
                <button onClick={()=>setSelected(new Set())} style={{...linkBtnStyle, color:'var(--text-muted)'}}>Clear</button>
              </div>
            )}

            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:1100}}>
                <thead>
                  <tr style={{background:'#fafbfc'}}>
                    <th style={thStyle('24px 12px')}>
                      <input type="checkbox"
                        checked={filtered.length>0 && selected.size === filtered.length}
                        onChange={toggleAll}
                        style={{accentColor:'var(--accent)', width:15, height:15, cursor:'pointer'}}/>
                    </th>
                    <th style={thStyle()}>Client Information</th>
                    <th style={thStyle()}>Client Project</th>
                    <th style={thStyle({textAlign:'center'})}>Number of Facilities Visited</th>
                    <th style={thStyle()}>Assign User</th>
                    <th style={thStyle()}>Authorization Status</th>
                    <th style={thStyle()}>Created Date</th>
                    <th style={thStyle('12px 24px 12px 12px')}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) =>
                    <Row key={c.id} c={c}
                      linkedToInstaChart={linkedTraceIds.has(c.id)}
                      checked={selected.has(c.id)}
                      onCheck={()=>toggle(c.id)}
                      density={t.density}
                      stripe={t.rowStripes && i%2===1}
                      accentRow={selected.has(c.id)}
                      onEdit={(client)=>{ setEditingClient({ ...(CLIENT_DETAILS[client.id] || {}), email: client.email }); setShowNewPatient(true); }}
                      onView={(client)=>setClinicalClient({ ...(CLIENT_DETAILS[client.id] || {}), ...client })}/>)}
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} style={{padding:48, textAlign:'center', color:'var(--text-muted)'}}>
                      No clients match these filters.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{
              padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between',
              borderTop:'1px solid var(--border-soft)', fontSize:13, color:'var(--text-muted)',
            }}>
              <span>Showing <b style={{color:'var(--text)'}}>{filtered.length}</b> of {CLIENTS.length} clients</span>
              <div style={{display:'flex', gap:6, alignItems:'center'}}>
                <button style={pageBtn} disabled>â€¹</button>
                <button style={{...pageBtn, background:'var(--accent)', color:'#fff', borderColor:'var(--accent)'}}>1</button>
                <button style={pageBtn}>2</button>
                <button style={pageBtn}>3</button>
                <span style={{padding:'0 4px'}}>â€¦</span>
                <button style={pageBtn}>â€º</button>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Brand">
          <window.TweakColor label="Accent" value={t.accent}
            onChange={v=>setTweak('accent', v)}
            options={['#4f46e5','#0ea5e9','#10b981','#f59e0b','#e11d48','#7c3aed']}/>
          <window.TweakToggle label="Show sidebar logo" value={t.showSidebarLogo}
            onChange={v=>setTweak('showSidebarLogo', v)}/>
        </window.TweakSection>
        <window.TweakSection label="Layout">
          <window.TweakRadio label="Sidebar tone" value={t.sidebarTone}
            options={[{value:'ink',label:'Ink'},{value:'navy',label:'Navy'},{value:'light',label:'Light'}]}
            onChange={v=>setTweak('sidebarTone', v)}/>
          <window.TweakRadio label="Density" value={t.density}
            options={[{value:'comfortable',label:'Comfortable'},{value:'compact',label:'Compact'}]}
            onChange={v=>setTweak('density', v)}/>
          <window.TweakToggle label="Zebra rows" value={t.rowStripes}
            onChange={v=>setTweak('rowStripes', v)}/>
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

const thStyle = (overrides={}) => {
  // backward compat: if a string was passed, treat it as padding
  if (typeof overrides === 'string') overrides = { padding: overrides };
  return {
    textAlign:'left', padding:'12px',
    fontSize:11.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em',
    color:'var(--text-muted)', borderBottom:'1px solid var(--border-soft)', whiteSpace:'nowrap',
    ...overrides,
  };
};
const linkBtnStyle = {
  fontSize:13, fontWeight:500, color:'var(--accent)',
  padding:'4px 8px', borderRadius:6,
};
const pageBtn = {
  minWidth:32, height:32, padding:'0 10px', borderRadius:7,
  border:'1px solid var(--border)', background:'#fff',
  fontSize:13, color:'var(--text)', fontWeight:500,
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
