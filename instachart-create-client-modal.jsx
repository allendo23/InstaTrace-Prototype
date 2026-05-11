// InstaChart "Create Client" modal — matches reference screenshot
// Two steps: (1) Select Facility, (2) Client Information
const { useState: useStateICM, useEffect: useEffectICM } = React;

const ICM = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primarySoft: '#eff6ff',
  primarySofter: '#dbeafe',
  border: '#e5e7eb',
  inputBorder: '#d1d5db',
  label: '#111827',
  labelMuted: '#374151',
  textMuted: '#6b7280',
  rowBg: '#f9fafb',
  danger: '#dc2626',
};

function ICMField({ label, required, children, hint }) {
  return (
    <div>
      <div style={{fontSize:12.5, fontWeight:600, color:ICM.labelMuted, marginBottom:6}}>
        {label}{required && <span style={{color:ICM.danger, marginLeft:3}}>*</span>}
      </div>
      {children}
      {hint && <div style={{fontSize:11.5, color:ICM.textMuted, marginTop:4}}>{hint}</div>}
    </div>
  );
}

function ICMInput(props) {
  const [focus, setFocus] = useStateICM(false);
  return (
    <input {...props}
      onFocus={(e)=>{ setFocus(true); props.onFocus && props.onFocus(e); }}
      onBlur={(e)=>{ setFocus(false); props.onBlur && props.onBlur(e); }}
      style={{
        width:'100%', padding:'9px 12px', fontSize:13.5,
        background:'#fff', color:ICM.label,
        border:`1px solid ${focus ? ICM.primary : ICM.inputBorder}`,
        borderRadius:8, outline:'none',
        boxShadow: focus ? `0 0 0 3px ${ICM.primarySoft}` : 'none',
        transition:'border-color 120ms ease, box-shadow 120ms ease',
        boxSizing:'border-box',
        ...(props.style || {}),
      }}/>
  );
}

function ICMSelect({ value, onChange, options, placeholder }) {
  const [focus, setFocus] = useStateICM(false);
  return (
    <div style={{position:'relative'}}>
      <select value={value || ''} onChange={e=>onChange(e.target.value)}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{
          width:'100%', padding:'9px 36px 9px 12px', fontSize:13.5,
          background:'#fff', color: value ? ICM.label : ICM.textMuted,
          border:`1px solid ${focus ? ICM.primary : ICM.inputBorder}`,
          borderRadius:8, outline:'none', appearance:'none',
          boxShadow: focus ? `0 0 0 3px ${ICM.primarySoft}` : 'none',
          transition:'border-color 120ms ease, box-shadow 120ms ease',
          cursor:'pointer',
        }}>
        <option value="">{placeholder || 'Select…'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ICM.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none'}}>
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function StepCard({ step, title, subtitle, children }) {
  return (
    <div style={{
      border:`1px solid ${ICM.border}`, borderRadius:12, background:'#fff',
      overflow:'hidden', marginBottom:16,
    }}>
      <div style={{
        background:ICM.primarySoft,
        padding:'12px 18px',
        borderBottom:`1px solid ${ICM.border}`,
        display:'flex', alignItems:'center', gap:12,
      }}>
        <span style={{
          fontSize:11, fontWeight:700, letterSpacing:'0.06em',
          color:ICM.primaryDark, background:'#fff',
          border:`1px solid ${ICM.primarySofter}`, borderRadius:6,
          padding:'3px 8px',
        }}>STEP {step}</span>
        <div>
          <div style={{fontSize:14, fontWeight:700, color:ICM.label}}>{title}</div>
          {subtitle && <div style={{fontSize:12, color:ICM.textMuted, marginTop:1}}>{subtitle}</div>}
        </div>
      </div>
      <div style={{padding:18}}>{children}</div>
    </div>
  );
}

function PillBtn({ icon, children, onClick }) {
  const [hover, setHover] = useStateICM(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        display:'inline-flex', alignItems:'center', gap:6,
        padding:'7px 14px', borderRadius:999,
        background: hover ? ICM.primaryDark : ICM.primary,
        color:'#fff', border:'none', cursor:'pointer',
        fontSize:12.5, fontWeight:600,
        transition:'background 120ms ease',
      }}>
      {icon}{children}
    </button>
  );
}

function InstaChartCreateClientModal({ open, onClose, onCreate, prefill }) {
  const blank = {
    state:'', facilitySearch:'', authorizeIdMe:false,
    firstName:'', lastName:'', email:'', dob:'',
    quickAddress:'', street:'', stateAddr:'', city:'', zip:'',
    gender:'', phone:'',
    referenceNumber:'', project:'',
    preferredLanguage:'English', clientStatus:'Pending',
    assignedUser:'dc599272-9b3f-4084-aca2-4226894c7c26',
  };
  const [form, setForm] = useStateICM(blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffectICM(() => {
    if (!open) return;
    if (prefill) {
      const [first, ...rest] = (prefill.name || '').split(' ');
      setForm({
        ...blank,
        firstName: first || '',
        lastName: rest.join(' '),
        email: prefill.email || '',
        project: prefill.project || '',
        clientStatus: prefill.clientStatus || 'Pending',
        assignedUser: prefill.assignee || blank.assignedUser,
      });
    } else {
      setForm(blank);
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow=''; window.removeEventListener('keydown', onKey); };
  }, [open, prefill]);

  if (!open) return null;

  const STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(31,41,55,.55)',
      backdropFilter:'blur(4px)', zIndex:1100,
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'40px 24px', overflowY:'auto',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', maxWidth:660, background:'#fff',
        borderRadius:14, boxShadow:'0 24px 48px rgba(15,23,42,.18)',
        padding:'24px 24px 20px',
      }}>
        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18}}>
          <h2 style={{margin:0, fontSize:19, fontWeight:700, color:ICM.label, letterSpacing:'-0.01em'}}>
            {prefill ? 'Edit Client' : 'Create Client'}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{
            background:'transparent', border:'none', cursor:'pointer',
            color:ICM.textMuted, padding:6, borderRadius:6,
            display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* STEP 1 — Select Facility */}
        <StepCard step="1" title="Select Facility" subtitle="Search by Facility Name or use Filters to find the right location">
          {prefill && (prefill.linkedToInstaTrace || (prefill.email && (window.INSTATRACE_CLIENTS||[]).some(ic => ic.email && ic.email.toLowerCase() === String(prefill.email).toLowerCase()))) && (
            <div style={{
              marginBottom:16, padding:'12px 14px',
              border:'1px solid #5eead4', borderRadius:10, background:'#f5f7ff',
            }}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
                <div style={{
                  width:24, height:24, borderRadius:6, background:'#ccfbf1', color:'#0f766e',
                  display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11,
                }}>iT</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:700, color:'#1e293b'}}>InstaTrace Clinical Data</div>
                  <div style={{fontSize:11.5, color:'#64748b'}}>Reference these visits to add the right facilities below.</div>
                </div>
                <span style={{
                  padding:'2px 8px', borderRadius:99, background:'#ccfbf1', color:'#0f766e',
                  border:'1px solid #5eead4', fontSize:10.5, fontWeight:600,
                }}>Linked</span>
              </div>
              <div style={{maxHeight:200, overflowY:'auto', border:'1px solid #e5e7eb', borderRadius:8, background:'#fff'}}>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                  <thead>
                    <tr style={{background:'#f9fafb', position:'sticky', top:0}}>
                      <th style={{textAlign:'left', padding:'7px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Date</th>
                      <th style={{textAlign:'left', padding:'7px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Visit Name</th>
                      <th style={{textAlign:'left', padding:'7px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Address</th>
                      <th style={{textAlign:'left', padding:'7px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Type</th>
                      <th style={{textAlign:'left', padding:'7px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Specialty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(window.SAMPLE_VISITS || []).slice(0, 10).map((v,i) => (
                      <tr key={i} style={{borderTop:'1px solid #f1f5f9'}}>
                        <td style={{padding:'7px 10px', color:'#374151', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap'}}>{v.date}</td>
                        <td style={{padding:'7px 10px', color:'#0f766e', fontWeight:600}}>{v.name}</td>
                        <td style={{padding:'7px 10px', color:'#374151'}}>{v.address}</td>
                        <td style={{padding:'7px 10px'}}>
                          <span style={{padding:'2px 7px', borderRadius:99, background:'#ccfbf1', color:'#0f766e', fontSize:10, fontWeight:600, letterSpacing:'0.04em'}}>{v.type}</span>
                        </td>
                        <td style={{padding:'7px 10px', color:'#374151'}}>{v.specialty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div style={{marginBottom:14}}>
            <ICMField label="State" required>
              <ICMSelect value={form.state} onChange={v=>set('state', v)}
                placeholder="Select one or more States" options={STATES}/>
            </ICMField>
          </div>

          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
            <div style={{fontSize:12.5, fontWeight:600, color:ICM.labelMuted}}>Facilities</div>
            <div style={{display:'flex', gap:8}}>
              <PillBtn icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
              }>Filter <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:2}}><polyline points="6 9 12 15 18 9"/></svg></PillBtn>
              <PillBtn icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              }>Search by Map</PillBtn>
            </div>
          </div>

          <div style={{position:'relative', marginBottom:8}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ICM.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)'}}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={form.facilitySearch} onChange={e=>set('facilitySearch', e.target.value)}
              placeholder="Enter facility name to search..."
              style={{
                width:'100%', padding:'9px 12px 9px 34px', fontSize:13.5,
                background:ICM.rowBg, color:ICM.label,
                border:`1px solid ${ICM.border}`,
                borderRadius:8, outline:'none',
                boxSizing:'border-box',
              }}/>
          </div>

          {!form.state && (
            <div style={{display:'flex', alignItems:'center', gap:6, fontSize:12, color:ICM.danger, marginBottom:10}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Please select a state before searching for facilities.
            </div>
          )}

          <label style={{display:'flex', alignItems:'center', gap:8, fontSize:13, color:ICM.label, cursor:'pointer', marginTop:6}}>
            <input type="checkbox" checked={form.authorizeIdMe} onChange={e=>set('authorizeIdMe', e.target.checked)}
              style={{width:15, height:15, accentColor:ICM.primary, cursor:'pointer'}}/>
            <span style={{fontWeight:600}}>Authorize with ID.me</span>
          </label>
        </StepCard>

        {false && (
          <div style={{
            margin:'18px 24px 0', padding:'14px 16px',
            border:'1px solid #c7d2fe', borderRadius:10, background:'#f5f7ff',
          }}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
              <div style={{
                width:24, height:24, borderRadius:6, background:'#eef2ff', color:'#4338ca',
                display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11,
              }}>iT</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:700, color:'#1e293b'}}>InstaTrace Clinical Data</div>
                <div style={{fontSize:11.5, color:'#64748b'}}>Reference these visits to add the right facilities above.</div>
              </div>
              <span style={{
                padding:'2px 8px', borderRadius:99, background:'#dcfce7', color:'#166534',
                border:'1px solid #86efac', fontSize:10.5, fontWeight:600,
              }}>Linked</span>
            </div>
            <div style={{maxHeight:220, overflowY:'auto', border:'1px solid #e5e7eb', borderRadius:8, background:'#fff'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                <thead>
                  <tr style={{background:'#f9fafb', position:'sticky', top:0}}>
                    <th style={{textAlign:'left', padding:'8px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Date</th>
                    <th style={{textAlign:'left', padding:'8px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Visit Name</th>
                    <th style={{textAlign:'left', padding:'8px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Address</th>
                    <th style={{textAlign:'left', padding:'8px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Type</th>
                    <th style={{textAlign:'left', padding:'8px 10px', fontSize:10.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#6b7280', borderBottom:'1px solid #e5e7eb'}}>Specialty</th>
                    <th style={{padding:'8px 10px', borderBottom:'1px solid #e5e7eb'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {(window.SAMPLE_VISITS || []).slice(0, 10).map((v,i) => (
                    <tr key={i} style={{borderTop:'1px solid #f1f5f9'}}>
                      <td style={{padding:'8px 10px', color:'#374151', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap'}}>{v.date}</td>
                      <td style={{padding:'8px 10px', color:'#4338ca', fontWeight:600}}>{v.name}</td>
                      <td style={{padding:'8px 10px', color:'#374151'}}>{v.address}</td>
                      <td style={{padding:'8px 10px'}}>
                        <span style={{padding:'2px 7px', borderRadius:99, background:'#eef2ff', color:'#4338ca', fontSize:10, fontWeight:600, letterSpacing:'0.04em'}}>{v.type}</span>
                      </td>
                      <td style={{padding:'8px 10px', color:'#374151'}}>{v.specialty}</td>
                      <td style={{padding:'8px 10px', textAlign:'right'}}>
                        <button type="button" onClick={()=>setForm(f => ({...f, facilities: [...(f.facilities||[]), v.name]}))} style={{
                          padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600,
                          background:'#fff', color:'#4338ca', border:'1px solid #c7d2fe', cursor:'pointer', whiteSpace:'nowrap',
                        }}>+ Add</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 2 — Client Information */}
        <StepCard step="2" title="Client Information">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            <ICMField label="First Name">
              <ICMInput value={form.firstName} onChange={e=>set('firstName', e.target.value)} placeholder="Enter first name"/>
            </ICMField>
            <ICMField label="Last Name">
              <ICMInput value={form.lastName} onChange={e=>set('lastName', e.target.value)} placeholder="Enter last name"/>
            </ICMField>
            <ICMField label="Email">
              <ICMInput type="email" value={form.email} onChange={e=>set('email', e.target.value)} placeholder="Enter email"/>
            </ICMField>
            <ICMField label="Date of Birth">
              <ICMInput type="date" value={form.dob} onChange={e=>set('dob', e.target.value)} placeholder="Pick a day"/>
            </ICMField>
          </div>

          <div style={{marginBottom:14}}>
            <ICMField label="Quick Input Address">
              <ICMInput value={form.quickAddress} onChange={e=>set('quickAddress', e.target.value)}
                placeholder="Ex: 1600 Pennsylvania Ave NW, Washington, DC 20500"/>
            </ICMField>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            <ICMField label="Street">
              <ICMInput value={form.street} onChange={e=>set('street', e.target.value)} placeholder="Enter street"/>
            </ICMField>
            <ICMField label="State">
              <ICMSelect value={form.stateAddr} onChange={v=>set('stateAddr', v)} placeholder="Select state" options={STATES}/>
            </ICMField>
            <ICMField label="City">
              <ICMSelect value={form.city} onChange={v=>set('city', v)} placeholder="Select city" options={['Salt Lake City','San Francisco','Atlanta','Bronx','Cincinnati','Las Vegas','Seattle']}/>
            </ICMField>
            <ICMField label="Zip">
              <ICMInput value={form.zip} onChange={e=>set('zip', e.target.value)} placeholder="Enter zip"/>
            </ICMField>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            <ICMField label="Gender">
              <ICMSelect value={form.gender} onChange={v=>set('gender', v)} placeholder="Select gender" options={['Male','Female','Other','Prefer not to say']}/>
            </ICMField>
            <ICMField label="Phone Number">
              <div style={{display:'flex', gap:0}}>
                <div style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'9px 10px', fontSize:13,
                  background:'#fff', border:`1px solid ${ICM.inputBorder}`, borderRight:'none',
                  borderRadius:'8px 0 0 8px',
                }}>
                  <span style={{fontSize:14}}>🇺🇸</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ICM.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <ICMInput value={form.phone} onChange={e=>set('phone', e.target.value)} placeholder="Example: 201 555 0123"
                  style={{borderRadius:'0 8px 8px 0'}}/>
              </div>
            </ICMField>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            <ICMField label="Reference Number">
              <ICMInput value={form.referenceNumber} onChange={e=>set('referenceNumber', e.target.value)} placeholder="Enter reference number"/>
            </ICMField>
            <ICMField label="Project">
              <ICMSelect value={form.project} onChange={v=>set('project', v)} placeholder="Select project" options={['Mark Test Project','InstaTrace Test','Internal']}/>
            </ICMField>
            <ICMField label="Preferred Language">
              <ICMSelect value={form.preferredLanguage} onChange={v=>set('preferredLanguage', v)} options={['English','Spanish','French','Mandarin']}/>
            </ICMField>
            <ICMField label="Client Status">
              <ICMSelect value={form.clientStatus} onChange={v=>set('clientStatus', v)} options={['Pending','Imported','Authorized','Partial']}/>
            </ICMField>
          </div>

          <ICMField label="Assigned User">
            <ICMSelect value={form.assignedUser} onChange={v=>set('assignedUser', v)}
              options={['dc599272-9b3f-4084-aca2-4226894c7c26','Matt Cottrell','Johnny Liao','Trevin Facer','Mark Chamberlain']}/>
          </ICMField>
        </StepCard>

        {/* Footer */}
        <div style={{display:'flex', justifyContent:'flex-end', gap:10, paddingTop:6}}>
          <button onClick={onClose} style={{
            padding:'9px 18px', borderRadius:8, fontSize:13, fontWeight:600,
            background:'#fff', color:ICM.label,
            border:`1px solid ${ICM.inputBorder}`, cursor:'pointer',
          }}>Cancel</button>
          <button onClick={()=>{ onCreate && onCreate(form); onClose(); }} style={{
            padding:'9px 22px', borderRadius:8, fontSize:13, fontWeight:600,
            background:ICM.primary, color:'#fff', border:'none', cursor:'pointer',
            boxShadow:'0 1px 2px rgba(37,99,235,.18)',
          }}>{prefill ? 'Save Changes' : 'Create'}</button>
        </div>
      </div>
    </div>
  );
}

window.InstaChartCreateClientModal = InstaChartCreateClientModal;
