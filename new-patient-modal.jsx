// Create New Client modal — original sections, styled per reference
const { useState: useStateNP, useEffect: useEffectNP } = React;

const C = {
  primary: '#0d9488',
  primaryDark: '#0f766e',
  primarySoft: '#ccfbf1',
  cardBorder: '#e5e7eb',
  inputBorder: '#d1d5db',
  inputBg: '#fff',
  text: '#111827',
  textMuted: '#6b7280',
  label: '#1f2937',
  placeholder: '#9ca3af',
  required: '#e11d48',
  sectionHeaderBg: '#f5f7ff',
};

function FieldLabel({ children, required, optional }) {
  return (
    <label style={{display:'block', fontSize:13, fontWeight:600, color:C.label, marginBottom:7}}>
      {children}
      {required && <span style={{color:C.required, marginLeft:3}}>*</span>}
      {optional && <span style={{color:C.textMuted, marginLeft:6, fontWeight:500, fontSize:12}}>(optional)</span>}
    </label>
  );
}

const npInput = {
  width:'100%', padding:'11px 14px',
  background:C.inputBg, border:`1px solid ${C.inputBorder}`, borderRadius:8,
  fontSize:13.5, color:C.text, outline:'none',
  fontFamily:'inherit',
  transition:'border-color .15s, box-shadow .15s',
};

function NPInput(props) {
  return <input {...props} style={{...npInput, ...(props.style||{})}}
    onFocus={e=>{e.target.style.borderColor=C.primary; e.target.style.boxShadow=`0 0 0 3px ${C.primarySoft}`;}}
    onBlur={e=>{e.target.style.borderColor=C.inputBorder; e.target.style.boxShadow='none';}}/>;
}

function NPSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useStateNP(false);
  const ref = React.useRef(null);

  useEffectNP(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} style={{position:'relative'}}>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{
        ...npInput, paddingRight:36, cursor:'pointer', textAlign:'left',
        color: value ? C.text : C.placeholder,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        ...(open ? { borderColor: C.primary, boxShadow: `0 0 0 3px ${C.primarySoft}` } : {}),
      }}>
        <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{value || placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{transform: open ? 'rotate(180deg)' : 'none', transition:'transform .15s', flexShrink:0}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 6px)', left:0, right:0, zIndex:10,
          background:'#fff', border:`1px solid ${C.cardBorder}`, borderRadius:10,
          boxShadow:'0 12px 32px -8px rgba(15,23,42,.18), 0 2px 4px rgba(0,0,0,.04)',
          padding:6, maxHeight:240, overflowY:'auto',
        }}>
          {options.map(o => {
            const selected = o === value;
            return (
              <button key={o} type="button"
                onClick={()=>{ onChange(o); setOpen(false); }}
                style={{
                  width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:7,
                  background: selected ? C.primarySoft : 'transparent',
                  color: selected ? C.primaryDark : C.text,
                  fontSize:13.5, fontWeight: selected ? 600 : 500, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}
                onMouseEnter={e=>{ if(!selected) e.currentTarget.style.background='#f3f4f6'; }}
                onMouseLeave={e=>{ if(!selected) e.currentTarget.style.background='transparent'; }}>
                <span>{o}</span>
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div style={{
      background:'#fff', border:`1px solid ${C.cardBorder}`, borderRadius:12,
      marginBottom:18, overflow:'hidden',
    }}>
      <div style={{
        background: C.sectionHeaderBg,
        padding:'14px 20px',
        borderBottom: `1px solid ${C.cardBorder}`,
        display:'flex', alignItems:'center', gap:10,
      }}>
        <span style={{color: C.primary, display:'flex'}}>{icon}</span>
        <h3 style={{margin:0, fontSize:15, fontWeight:700, color:C.label}}>{title}</h3>
      </div>
      <div style={{padding:'20px'}}>{children}</div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{
        fontSize:13, fontWeight:600, color:C.label, paddingBottom:8,
        borderBottom:`1px solid ${C.cardBorder}`, marginBottom:14,
      }}>{title}</div>
      {children}
    </div>
  );
}

function NewPatientModal({ open, onClose, prefill }) {
  const blank = {
    clientId:'', firstName:'', lastName:'', dob:'', sex:'',
    mobile:'', email:'', ssn:'', zip:'', zips:[],
    startDate:'', endDate:'', authExpiration:'', authType:'HIPAA',
    capacity:'Self-Authorizing', uploadFile:null, retainerFile:null,
    referenceNumber:'', project:'', assignedUser:'Johnny Liao (johnny+01@insta-chart.ai)',
    address:'', city:'', state:'',
  };
  const [form, setForm] = useStateNP(blank);
  const [dragOver, setDragOver] = useStateNP(false);
  const [dragOverR, setDragOverR] = useStateNP(false);
  const [minorWarning, setMinorWarning] = useStateNP(false);

  // Reusable upload-field UI
  const UploadField = ({ label, fieldKey, file, dragging, setDragging }) => (
    <div>
      <FieldLabel required>{label}</FieldLabel>
      {file && (
        <div
          onClick={()=>window.alert(`Opening ${file} preview\u2026`)}
          style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', marginBottom:10,
            background:'#fff', border:`1px solid ${C.inputBorder}`, borderRadius:8,
            cursor:'pointer', transition:'border-color 120ms ease, box-shadow 120ms ease',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.boxShadow=`0 0 0 3px ${C.primarySoft}`; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.inputBorder; e.currentTarget.style.boxShadow='none'; }}
        >
          <div style={{
            width:34, height:42, flexShrink:0,
            background:'#fef2f2', border:'1px solid #fecaca', borderRadius:5,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:9, fontWeight:700, color:'#b91c1c', letterSpacing:'0.04em',
          }}>PDF</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, fontWeight:600, color:C.label, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{file}</div>
            <div style={{fontSize:11.5, color:C.textMuted, marginTop:2}}>Uploaded \u2022 Click to view</div>
          </div>
          <button
            type="button"
            onClick={e=>{ e.stopPropagation(); set(fieldKey, null); }}
            title="Remove file"
            style={{
              background:'transparent', border:'none', cursor:'pointer',
              color:C.textMuted, padding:6, borderRadius:6,
              display:'inline-flex', alignItems:'center', justifyContent:'center',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.color='#b91c1c'; e.currentTarget.style.background='#fef2f2'; }}
            onMouseLeave={e=>{ e.currentTarget.style.color=C.textMuted; e.currentTarget.style.background='transparent'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
      <label
        onDragOver={e=>{ e.preventDefault(); setDragging(true); }}
        onDragEnter={e=>{ e.preventDefault(); setDragging(true); }}
        onDragLeave={e=>{ e.preventDefault(); setDragging(false); }}
        onDrop={e=>{
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (f) set(fieldKey, f.name);
        }}
        style={{
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'24px 16px', borderRadius:9,
          background: dragging ? C.primarySoft : '#f9fafb',
          border:`2px dashed ${dragging ? C.primary : C.inputBorder}`,
          cursor:'pointer', textAlign:'center',
          transition:'background 120ms ease, border-color 120ms ease',
        }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <div style={{fontSize:13, fontWeight:600, color:C.primaryDark, marginTop:8}}>
          {dragging ? 'Drop to upload' : (file ? 'Replace file' : 'Click or drag PDF to upload')}
        </div>
        <div style={{fontSize:11.5, color:C.textMuted, marginTop:4}}>PDFs up to 10MB</div>
        <input type="file" accept="application/pdf" style={{display:'none'}}
          onChange={e=>{ if(e.target.files[0]) set(fieldKey, e.target.files[0].name); }}/>
      </label>
    </div>
  );

  // Reload form whenever modal opens — with prefill if present, else blank
  useEffectNP(() => {
    if (open) setForm({ ...blank, ...(prefill || {}) });
  }, [open, prefill]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const addZip = () => {
    if (form.zip && !form.zips.includes(form.zip)) {
      setForm(f=>({...f, zips:[...f.zips, f.zip], zip:''}));
    }
  };

  useEffectNP(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow=''; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <React.Fragment>
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(31,41,55,.55)',
      backdropFilter:'blur(4px)', zIndex:1000,
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'40px 24px', overflowY:'auto',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', maxWidth:780,
        background:'#fff', borderRadius:14,
        boxShadow:'0 25px 80px -10px rgba(15,23,42,.35), 0 1px 3px rgba(0,0,0,.08)',
        border:`1px solid ${C.cardBorder}`,
        position:'relative',
      }}>
        {/* Header */}
        <div style={{
          padding:'22px 28px',
          borderBottom:`1px solid ${C.cardBorder}`,
          display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16,
        }}>
          <div>
            <h2 style={{margin:0, fontSize:20, fontWeight:700, color:C.label, letterSpacing:'-0.01em'}}>
              {prefill ? 'Edit Client' : 'Create New Client'}
            </h2>
            <div style={{fontSize:13, color:C.textMuted, marginTop:4}}>{prefill ? 'Update this client\u2019s record' : 'Complete the form below to add a new client to the system'}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:C.textMuted, cursor:'pointer',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='#f3f4f6'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{padding:'24px', maxHeight:'calc(100vh - 200px)', overflowY:'auto'}}>
          <div style={{
            padding:'10px 14px', borderRadius:8, marginBottom:18,
            background:C.primarySoft, border:`1px solid ${C.primarySoft}`,
            fontSize:12.5, color:C.primaryDark,
          }}>
            <b>Note:</b> Ensure all required information is accurate. A valid client authorization document is required.
          </div>

          {/* Missing information banner */}
          {prefill && prefill.missingReason && (
            <div style={{
              display:'flex', alignItems:'flex-start', gap:12,
              padding:'14px 16px', borderRadius:10,
              background:'#fffbeb', border:'1px solid #fde68a',
              marginBottom:0,
            }}>
              <div style={{
                flexShrink:0, width:28, height:28, borderRadius:'50%',
                background:'#fef3c7', color:'#b45309',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13.5, fontWeight:700, color:'#92400e'}}>Missing Information</div>
                <div style={{fontSize:13, color:'#78350f', marginTop:2, lineHeight:1.5}}>
                  {prefill.missingReason}
                </div>
                <div style={{fontSize:12, color:'#a16207', marginTop:6, fontStyle:'italic'}}>
                  Update the authorization PDF below and click Save Changes to resubmit.
                </div>
              </div>
            </div>
          )}

          {/* Client Information */}
          <SectionCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            title="Client Information">

            <SubSection title="Personal Details">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
                <div>
                  <FieldLabel required>First Name</FieldLabel>
                  <NPInput value={form.firstName} onChange={e=>set('firstName', e.target.value)} placeholder="Enter first name"/>
                </div>
                <div>
                  <FieldLabel required>Last Name</FieldLabel>
                  <NPInput value={form.lastName} onChange={e=>set('lastName', e.target.value)} placeholder="Enter last name"/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div>
                  <FieldLabel required>Date of Birth</FieldLabel>
                  <NPInput type="date" value={form.dob} onChange={e=>set('dob', e.target.value)}/>
                </div>
                <div>
                  <FieldLabel required>Sex</FieldLabel>
                  <NPSelect value={form.sex} onChange={v=>set('sex', v)} placeholder="Select sex" options={['Female','Male','Other','Prefer not to say']}/>
                </div>
              </div>
            </SubSection>

            <SubSection title="Contact Information">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
                <div>
                  <FieldLabel>Mobile Phone</FieldLabel>
                  <NPInput value={form.mobile} onChange={e=>set('mobile', e.target.value)} placeholder="(XXX) XXX-XXXX"/>
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <NPInput value={form.email} onChange={e=>set('email', e.target.value)} placeholder="client@example.com"/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div>
                  <FieldLabel>Social Security Number</FieldLabel>
                  <NPInput value={form.ssn} onChange={e=>set('ssn', e.target.value)} placeholder="XXX-XX-XXXX"/>
                </div>
                <div>
                  <FieldLabel required>ZIP Codes</FieldLabel>
                  <div style={{display:'flex', gap:8}}>
                    <NPInput value={form.zip} onChange={e=>set('zip', e.target.value)} placeholder="Enter ZIP code" style={{flex:1}}
                      onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addZip(); } }}/>
                    <button onClick={addZip} style={{
                      padding:'0 16px', borderRadius:8,
                      background:'#fff', border:`1px solid ${C.inputBorder}`, color:C.label,
                      fontSize:12.5, fontWeight:600, cursor:'pointer',
                      display:'inline-flex', alignItems:'center', gap:5,
                    }}>+ Add</button>
                  </div>
                  {form.zips.length > 0 && (
                    <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:8}}>
                      {form.zips.map(z=>(
                        <span key={z} style={{
                          display:'inline-flex', alignItems:'center', gap:6,
                          padding:'3px 8px 3px 10px', borderRadius:99,
                          background:C.primarySoft, color:C.primaryDark, fontSize:12, fontWeight:500,
                        }}>{z}
                          <button onClick={()=>setForm(f=>({...f, zips: f.zips.filter(x=>x!==z)}))} style={{
                            color:C.primary, cursor:'pointer', padding:0, display:'flex',
                          }}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{fontSize:11.5, color:C.textMuted, marginTop:6}}>
                    Enter any ZIP codes where the client may have lived when receiving care.
                  </div>
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16}}>
                <div>
                  <FieldLabel>Reference Number</FieldLabel>
                  <NPInput value={form.referenceNumber || ''} onChange={e=>set('referenceNumber', e.target.value)} placeholder="Enter reference number"/>
                </div>
                <div>
                  <FieldLabel>Project</FieldLabel>
                  <NPSelect value={form.project || ''} onChange={v=>set('project', v)} placeholder="Select project"
                    options={['InstaTrace Test','Case Number','General Intake','Discovery Phase']}/>
                </div>
              </div>

              <div style={{marginTop:16}}>
                <FieldLabel>Assigned User</FieldLabel>
                <NPSelect value={form.assignedUser || 'Johnny Liao (johnny+01@insta-chart.ai)'} onChange={v=>set('assignedUser', v)} placeholder="Select user"
                  options={['Johnny Liao (johnny+01@insta-chart.ai)','Matt Reinbold (matthew@insta-chart.ai)','Trevin Facer (trevin@insta-chart.ai)']}/>
              </div>
            </SubSection>
          </SectionCard>

          {/* Authorization Information */}
          <SectionCard
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            title="Authorization Information">
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
              <div>
                <FieldLabel required>Earliest Date of Care</FieldLabel>
                <NPInput type="date" value={form.startDate} onChange={e=>set('startDate', e.target.value)}/>
                <div style={{fontSize:11.5, color:C.textMuted, marginTop:6}}>The earliest date the client visited a facility or doctor</div>
              </div>
              <div>
                <FieldLabel required>Most Recent Date of Care</FieldLabel>
                <NPInput type="date" value={form.endDate} onChange={e=>set('endDate', e.target.value)}/>
                <div style={{fontSize:11.5, color:C.textMuted, marginTop:6}}>The most recent date the client received care</div>
              </div>
              <div>
                <FieldLabel required>Authorization Valid Through</FieldLabel>
                <NPInput type="date" value={form.authExpiration} onChange={e=>set('authExpiration', e.target.value)}/>
                <div style={{fontSize:11.5, color:C.textMuted, marginTop:6}}>The date through which you authorize our system to retrieve records</div>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div>
                <FieldLabel>Client Capacity</FieldLabel>
                <NPSelect value={form.capacity} onChange={v=>{ set('capacity', v); if (v === 'Minor') setMinorWarning(true); }} options={['Self-Authorizing','Guardian','Power of Attorney','Minor']}/>
                <div style={{fontSize:11.5, color:C.textMuted, marginTop:6}}>Select who can authorize release of medical records for this client</div>
                <div style={{
                  marginTop:10, padding:'8px 12px', borderRadius:7,
                  background:C.primarySoft, border:`1px solid ${C.primarySoft}`,
                  fontSize:12, color:C.primaryDark, display:'inline-flex', alignItems:'center', gap:6,
                }}>
                  <b>Accepted format:</b> PDF only
                </div>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              <UploadField
                label="Upload HIPAA Authorization"
                fieldKey="uploadFile"
                file={form.uploadFile}
                dragging={dragOver}
                setDragging={setDragOver}
              />
              <UploadField
                label="Upload Retainer Agreement"
                fieldKey="retainerFile"
                file={form.retainerFile}
                dragging={dragOverR}
                setDragging={setDragOverR}
              />
            </div>
          </SectionCard>

          {/* Footer */}
          <div style={{
            display:'flex', justifyContent:'flex-end', gap:10,
            paddingTop:6,
          }}>
            <button onClick={onClose} style={{
              padding:'10px 20px', borderRadius:999,
              background:'#fff', border:`1px solid ${C.inputBorder}`, color:C.textMuted,
              fontSize:13.5, fontWeight:600, cursor:'pointer',
            }}>Cancel</button>
            <button onClick={()=>{ alert('Client submitted for review'); onClose(); }} style={{
              padding:'10px 24px', borderRadius:999,
              background: C.primary, color:'#fff',
              fontSize:13.5, fontWeight:600, cursor:'pointer',
              boxShadow:'0 4px 12px -2px rgba(79,70,229,.4)',
            }}
            onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
            onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
              {prefill ? 'Save Changes' : 'Create Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
    {minorWarning && (
      <div onClick={()=>setMinorWarning(false)} style={{
        position:'fixed', inset:0, background:'rgba(15,23,42,.55)',
        backdropFilter:'blur(4px)', zIndex:1100,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px',
      }}>
        <div onClick={e=>e.stopPropagation()} style={{
          width:'100%', maxWidth:440,
          background:'#fff', borderRadius:14,
          boxShadow:'0 25px 80px -10px rgba(15,23,42,.45), 0 1px 3px rgba(0,0,0,.08)',
          border:`1px solid ${C.cardBorder}`,
          padding:'24px 26px',
        }}>
          <div style={{display:'flex', alignItems:'flex-start', gap:14, marginBottom:14}}>
            <div style={{
              width:40, height:40, flexShrink:0, borderRadius:10,
              background:'#fef3c7', border:'1px solid #fde68a',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#b45309',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <h3 style={{margin:0, fontSize:16, fontWeight:700, color:C.label, letterSpacing:'-0.01em'}}>
                Client is a Minor
              </h3>
              <div style={{fontSize:13.5, color:C.text, marginTop:6, lineHeight:1.5}}>
                Because this client is a minor, the HIPAA authorization upload <b>must include a legal release signed by a parent or legal guardian</b>.
              </div>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:6}}>
            <button onClick={()=>setMinorWarning(false)} style={{
              padding:'9px 20px', borderRadius:999,
              background: C.primary, color:'#fff', border:'none',
              fontSize:13, fontWeight:600, cursor:'pointer',
              boxShadow:'0 4px 12px -2px rgba(79,70,229,.4)',
            }}
            onMouseEnter={e=>e.currentTarget.style.background=C.primaryDark}
            onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
              I Understand
            </button>
          </div>
        </div>
      </div>
    )}
    </React.Fragment>
  );
}

window.NewPatientModal = NewPatientModal;
