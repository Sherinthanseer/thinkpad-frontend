import { useState } from "react";
import { useEffect } from "react";
import api from "./lib/axios";
import { motion } from "framer-motion";

/* ── Design tokens ── */
const T = {
  bg:       "linear-gradient(135deg, #e8e0f5 0%, #f0e6f6 40%, #e6e0f0 100%)",
  glass:    "rgba(255,255,255,0.38)",
  glassBorder: "rgba(255,255,255,0.6)",
  glassHover:  "rgba(255,255,255,0.52)",
  panelShadow: "0 8px 32px rgba(120,80,180,0.13), 0 1.5px 8px rgba(120,80,180,0.07)",
  accent:   "#7c5cbf",
  accentSoft: "rgba(124,92,191,0.12)",
  accentBtn: "linear-gradient(135deg,#a084e8,#7c5cbf)",
  text:     "#2d1f4e",
  textSub:  "rgba(45,31,78,0.55)",
  textHint: "rgba(45,31,78,0.35)",
  pink:     "#e879b0",
  pinkSoft: "rgba(232,121,176,0.13)",
  radius:   20,
  font:     "'DM Sans', 'Segoe UI', sans-serif",
};

const CATEGORIES = [
  { label:"Work",     color:"#7c5cbf", dot:"rgba(124,92,191,0.18)"  },
  { label:"Research", color:"#5b8dd9", dot:"rgba(91,141,217,0.18)"  },
  { label:"Personal", color:"#e879b0", dot:"rgba(232,121,176,0.18)" },
  { label:"Finance",  color:"#3bbfa0", dot:"rgba(59,191,160,0.18)"  },
  { label:"Health",   color:"#f0953a", dot:"rgba(240,149,58,0.18)"  },
  { label:"Ideas",    color:"#a084e8", dot:"rgba(160,132,232,0.18)" },
];

const SEED_NOTES = [
  { id:"1", title:"Q3 Product Roadmap",       content:"Finalize feature prioritization with engineering. Align on launch windows for v2.4 and deprecation timeline for legacy APIs.", cat:0, pinned:true,  date:"Today, 9:41 AM"  },
  { id:"2", title:"Competitive Analysis",      content:"Deep-dive into Notion and Linear's pricing model shifts. Identify whitespace opportunities in the B2B mid-market segment.",  cat:1, pinned:false, date:"Yesterday"       },
  { id:"3", title:"Weekly Reflection",         content:"Focused well on deep work blocks. Need to reduce context-switching. Block 2–4 PM daily for uninterrupted writing sessions.",   cat:2, pinned:false, date:"Mon, Jul 7"      },
  { id:"4", title:"Investment Thesis – SaaS",  content:"Recurring revenue multiples compressing post-2022. Look for profitable micro-SaaS with NRR above 110% and low CAC.",          cat:3, pinned:false, date:"Sun, Jul 6"      },
  { id:"5", title:"Morning Protocol",          content:"10 min mobility, cold exposure 2 min, 500ml water before caffeine. Track HRV trend over 30 days using Garmin dashboard.",      cat:4, pinned:true,  date:"Sat, Jul 5"      },
  { id:"6", title:"Spatial Computing UX",      content:"Apple Vision Pro interaction patterns diverge from touch paradigms. Gaze + pinch latency thresholds need new design heuristics.", cat:5, pinned:false, date:"Fri, Jul 4"      },
];

/* ── Glass panel base ── */
const glass = (extra = {}) => ({
  background: T.glass,
  border: `1.5px solid ${T.glassBorder}`,
  borderRadius: T.radius,
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: T.panelShadow,
  ...extra,
});

/* ── Accent button ── */
function AccentBtn({ children, onClick, sm, outline }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: T.font, fontWeight: 600,
        fontSize: sm ? 13 : 14,
        padding: sm ? "7px 16px" : "10px 22px",
        borderRadius: 12, border: outline ? `1.5px solid ${T.accent}` : "none",
        background: outline ? "transparent" : (hov ? "linear-gradient(135deg,#b09af0,#8a68d4)" : T.accentBtn),
        color: outline ? T.accent : "#fff",
        cursor: "pointer",
        boxShadow: outline ? "none" : (hov ? "0 6px 20px rgba(124,92,191,0.35)" : "0 4px 14px rgba(124,92,191,0.25)"),
        transform: hov ? "translateY(-1px)" : "none",
        transition: "all .18s ease",
        display: "inline-flex", alignItems: "center", gap: 6,
        whiteSpace: "nowrap", letterSpacing: "0.01em",
      }}>
      {children}
    </button>
  );
}

/* ── Category pill ── */
function CatPill({ cat }) {
  const c = CATEGORIES[cat ?? 0];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, letterSpacing:"0.04em", color:c.color, background:c.dot, padding:"3px 10px", borderRadius:99 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.color, display:"inline-block" }}/>
      {c.label}
    </span>
  );
}

/* ── Note Card ── */
function NoteCard({ note, onClick, onDelete, onPin }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass(),
        background: hov ? T.glassHover : T.glass,
        padding: "20px 20px 16px",
        cursor: "pointer",
        transition: "all .2s ease",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov
  ? "0 0 0 1px rgba(160,132,232,0.25), 0 18px 44px rgba(124,92,191,0.28), 0 2px 12px rgba(124,92,191,0.16)"
  : T.panelShadow,
        display: "flex", flexDirection: "column", gap: 0,
        position: "relative",
      }}>

      {/* pin indicator */}
      {note.pinned && (
        <span style={{ position:"absolute", top:14, right:14, fontSize:13, opacity:0.7 }}>📌</span>
      )}

      {/* category */}
      <div style={{ marginBottom: 12 }}>
        <CatPill cat={note.cat} />
      </div>

      <p style={{ margin:"0 0 8px", fontWeight:700, fontSize:15, color:T.text, lineHeight:1.35, paddingRight:20 }}>{note.title}</p>
      <p style={{ margin:0, fontSize:13, color:T.textSub, lineHeight:1.65, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", flexGrow:1 }}>{note.content}</p>

      <div style={{ marginTop:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, color:T.textHint, fontWeight:500 }}>{note.date}</span>
        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
          <button onClick={e=>{e.stopPropagation();onPin(note._id);}}
            style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, opacity: note.pinned ? 0.85 : 0.35, transition:"opacity .15s", padding:"2px 4px" }}
            title={note.pinned ? "Unpin" : "Pin"}>
            {note.pinned ? "📌" : "🖇"}
          </button>
          <button onClick={e=>{e.stopPropagation();onDelete(note._id);}}
            style={{ background:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.7)", cursor:"pointer", fontSize:12, color:"rgba(45,31,78,0.4)", width:24, height:24, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, transition:"all .15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(232,121,176,0.15)"; e.currentTarget.style.color="#c2185b"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.5)"; e.currentTarget.style.color="rgba(45,31,78,0.4)"; }}
          >✕</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Modal ── */
function Modal({ note, onClose, onSave }) {
  const [title,   setTitle]   = useState(note?.title   ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [cat,     setCat]     = useState(note?.cat     ?? 0);
  const [pinned,  setPinned]  = useState(note?.pinned  ?? false);

  const inputStyle = {
    width:"100%", display:"block", fontFamily:T.font, fontWeight:500, fontSize:14,
    background:"rgba(255,255,255,0.55)", border:"1.5px solid rgba(255,255,255,0.75)",
    borderRadius:12, padding:"10px 14px", color:T.text, outline:"none",
    marginBottom:16, boxSizing:"border-box", lineHeight:1.5,
    boxShadow:"inset 0 1px 4px rgba(120,80,180,0.06)",
    transition:"border-color .18s, background .18s",
  };
  const lbl = { display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.textHint, marginBottom:6 };

 return (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.22 }}
    onClick={e=>e.target===e.currentTarget&&onClose()}
    style={{
      position:"fixed",
      inset:0,
      zIndex:200,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      background:"rgba(180,160,220,0.25)",
      backdropFilter:"blur(12px)",
      WebkitBackdropFilter:"blur(12px)",
      padding:20
    }}>
      <div style={{ ...glass({ borderRadius:24, padding:"30px 28px", width:"100%", maxWidth:460, boxSizing:"border-box", boxShadow:"0 24px 64px rgba(100,60,180,0.18), 0 2px 12px rgba(100,60,180,0.1)" }) }}>

        <h2 style={{ fontFamily:T.font, fontWeight:700, fontSize:18, color:T.text, margin:"0 0 22px" }}>
          {note ? "Edit note" : "New note"}
        </h2>

        <label style={lbl}>Title</label>
        <input style={inputStyle} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give your note a clear title…" maxLength={80}
          onFocus={e=>{ e.target.style.borderColor="rgba(124,92,191,0.5)"; e.target.style.background="rgba(255,255,255,0.72)"; }}
          onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,0.75)"; e.target.style.background="rgba(255,255,255,0.55)"; }}
        />

        <label style={lbl}>Content</label>
        <textarea style={{...inputStyle, resize:"none", height:110, fontFamily:T.font}} value={content} onChange={e=>setContent(e.target.value)} placeholder="Add your notes, thoughts, or context…"
          onFocus={e=>{ e.target.style.borderColor="rgba(124,92,191,0.5)"; e.target.style.background="rgba(255,255,255,0.72)"; }}
          onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,0.75)"; e.target.style.background="rgba(255,255,255,0.55)"; }}
        />

        <label style={lbl}>Category</label>
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          {CATEGORIES.map((c,i)=>(
            <button key={i} onClick={()=>setCat(i)} style={{
              fontFamily:T.font, fontWeight:600, fontSize:12, padding:"5px 14px", borderRadius:99, cursor:"pointer",
              border: cat===i ? `1.5px solid ${c.color}` : "1.5px solid transparent",
              background: cat===i ? c.dot : "rgba(255,255,255,0.35)",
              color: cat===i ? c.color : T.textSub,
              transition:"all .15s",
            }}>{c.label}</button>
          ))}
        </div>

        <label style={{ ...lbl, display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom:22 }}>
          <input type="checkbox" checked={pinned} onChange={e=>setPinned(e.target.checked)} style={{ accentColor:T.accent, width:15, height:15 }}/>
          <span>Pin this note</span>
        </label>

        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <AccentBtn outline sm onClick={onClose}>Cancel</AccentBtn>
          <AccentBtn sm onClick={()=>{
            if(!title.trim()&&!content.trim()) return;
            const now = new Date();
            onSave({ title, content, cat, pinned, date: now.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}) });
          }}>Save note</AccentBtn>
        </div>
      </div>
      </motion.div>
  );
}

/* ── Sidebar stat chip ── */
function StatChip({ label, value, color }) {
  return (
    <div style={{ ...glass({ borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }) }}>
      <span style={{ fontSize:12, fontWeight:500, color:T.textSub }}>{label}</span>
      <span style={{ fontSize:14, fontWeight:700, color: color || T.accent }}>{value}</span>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null); // null = all
  const [modal,  setModal]  = useState(null);
  const [view,   setView]   = useState("all"); // "all" | "pinned"

  const fetchNotes = async () => {
  try {
    const res = await api.get("/notes");
    setNotes(res.data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
      fetchNotes();
  }, []);

  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    const matchQ = !q || (n.title+n.content).toLowerCase().includes(q);
    const matchF = filter === null || n.cat === filter;
    const matchV = view === "all" || (view === "pinned" && n.pinned);
    return matchQ && matchF && matchV;
  });

  const pinned  = notes.filter(n=>n.pinned).length;
  const bycat   = CATEGORIES.map((_,i)=>notes.filter(n=>n.cat===i).length);

const handleSave = async (data) => {
  try {

    if (modal === "new") {

      await api.post("/notes", {
        title: data.title,
        content: data.content,
        cat: data.cat,
        pinned: data.pinned,
        date: data.date,
      });

    } else {

      await api.put(`/notes/${modal._id}`, {
        title: data.title,
        content: data.content,
        cat: data.cat,
        pinned: data.pinned,
        date: data.date,
      });

    }

    fetchNotes();
    setModal(null);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={{ minHeight:"100vh", fontFamily:T.font, background:T.bg, display:"flex", flexDirection:"column", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        body { margin: 0; }
        ::placeholder { color: rgba(45,31,78,0.3); font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,92,191,0.2); border-radius: 99px; }
      `}</style>

      {/* subtle bg shapes */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-120, right:-80, width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(220,180,255,0.35) 0%,transparent 65%)" }}/>
        <div style={{ position:"absolute", bottom:-100, left:-80, width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,121,176,0.2) 0%,transparent 65%)" }}/>
        <div style={{ position:"absolute", top:"38%", left:"42%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(160,132,232,0.15) 0%,transparent 65%)" }}/>
      </div>

      {/* ── Navbar ── */}
      <nav style={{ ...glass({ borderRadius:0, borderLeft:"none", borderRight:"none", borderTop:"none", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", boxShadow:"0 1px 0 rgba(255,255,255,0.6), 0 4px 24px rgba(120,80,180,0.08)" }), position:"sticky", top:0, zIndex:100, padding:"14px 28px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:T.accentBtn, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(124,92,191,0.3)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span style={{ fontSize:17, fontWeight:700, color:T.text, letterSpacing:"-0.01em" }}>ThinkPad</span>
        </div>

        {/* search */}
        <div style={{ flex:1, maxWidth:320, position:"relative" }}>
          <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", opacity:0.35 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes…"
            style={{ width:"100%", fontFamily:T.font, fontSize:13, fontWeight:500, padding:"8px 14px 8px 36px", borderRadius:12, border:"1.5px solid rgba(255,255,255,0.7)", background:"rgba(255,255,255,0.5)", color:T.text, outline:"none", backdropFilter:"blur(8px)", transition:"all .18s" }}
            onFocus={e=>{ e.target.style.background="rgba(255,255,255,0.72)"; e.target.style.borderColor="rgba(124,92,191,0.4)"; }}
            onBlur={e=>{ e.target.style.background="rgba(255,255,255,0.5)"; e.target.style.borderColor="rgba(255,255,255,0.7)"; }}
          />
        </div>

        <div style={{ marginLeft:"auto", display:"flex", gap:8, flexWrap:"wrap" }}>
          <AccentBtn outline sm onClick={()=>setModal("new")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New note
          </AccentBtn>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{ display:"flex", flex:1, gap:0, maxWidth:1200, margin:"0 auto", width:"100%", padding:"28px 24px", gap:20, position:"relative", zIndex:1 }}>

        {/* ── Sidebar ── */}
        <aside style={{ width:210, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>
          {/* views */}
          <div style={{ ...glass({ padding:"8px", borderRadius:16 }) }}>
            {[
              { id:"all",    label:"All notes",   icon:"M4 6h16M4 12h16M4 18h16" },
              { id:"pinned", label:"Pinned",       icon:"M17.657 5.304l-1.414-1.414L14 6.13l-1.414-1.414L9 8.272v2.828l-2 2v1.414h5.172L12 20l1-7.486H18v-1.414l-2-2V8.272z" },
            ].map(v=>(
              <button key={v.id} onClick={()=>setView(v.id)} style={{ width:"100%", fontFamily:T.font, fontWeight:600, fontSize:13, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, background:view===v.id ? T.accentSoft : "transparent", color:view===v.id ? T.accent : T.textSub, transition:"all .15s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={v.icon}/></svg>
                {v.label}
                <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:view===v.id?T.accent:T.textHint }}>
                  {v.id==="all"?notes.length:pinned}
                </span>
              </button>
            ))}
          </div>

          {/* categories */}
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.textHint, padding:"0 4px" }}>Categories</p>
          <div style={{ ...glass({ padding:"8px", borderRadius:16 }) }}>
            <button onClick={()=>setFilter(null)} style={{ width:"100%", fontFamily:T.font, fontWeight:600, fontSize:13, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, background:filter===null?T.accentSoft:"transparent", color:filter===null?T.accent:T.textSub, transition:"all .15s" }}>
              All categories
              <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:filter===null?T.accent:T.textHint }}>{notes.length}</span>
            </button>
            {CATEGORIES.map((c,i)=>(
              <button key={i} onClick={()=>setFilter(filter===i?null:i)} style={{ width:"100%", fontFamily:T.font, fontWeight:600, fontSize:13, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, background:filter===i?c.dot:"transparent", color:filter===i?c.color:T.textSub, transition:"all .15s" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
                {c.label}
                <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700 }}>{bycat[i]}</span>
              </button>
            ))}
          </div>

          {/* stats */}
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.textHint, padding:"0 4px" }}>Overview</p>
          <StatChip label="Total notes"  value={notes.length} />
          <StatChip label="Pinned"       value={pinned}       color={T.pink} />
          <StatChip label="Categories"   value={CATEGORIES.length} color="#3bbfa0" />
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex:1, minWidth:0 }}>
          {/* header row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div>
              <h2 style={{ fontWeight:700, fontSize:20, color:T.text, margin:0, lineHeight:1.2 }}>
                {view==="pinned" ? "Pinned notes" : filter!==null ? CATEGORIES[filter].label : "All notes"}
              </h2>
              <p style={{ fontSize:13, color:T.textHint, marginTop:3 }}>{filtered.length} note{filtered.length!==1?"s":""}</p>
            </div>
            <AccentBtn sm onClick={()=>setModal("new")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New note
            </AccentBtn>
          </div>

          {/* grid */}
          {filtered.length === 0 ? (
            <div style={{ ...glass({ padding:"60px 24px", textAlign:"center", borderRadius:20 }) }}>
              <div style={{ fontSize:36, marginBottom:14, opacity:0.4 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p style={{ fontWeight:600, fontSize:15, color:T.textSub, margin:0 }}>
                {search ? "No notes match your search." : "No notes here yet. Create your first one."}
              </p>
              {!search && <div style={{ marginTop:16 }}><AccentBtn sm onClick={()=>setModal("new")}>Create note</AccentBtn></div>}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,260px),1fr))", gap:16 }}>
              {filtered.map(note=>(
                <NoteCard key={note._id} note={note}
                  onClick={()=>setModal(note)}
                  onDelete={async (id) => {
                   try {
                        await api.delete(`/notes/${id}`);
                          fetchNotes();
                        } catch (error) {
                          console.error(error);
                        }
              }}
                  onPin={id=>setNotes(p=>p.map(n=>n._id===id?{...n,pinned:!n.pinned}:n))}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modal ── */}
      {modal && <Modal note={modal==="new"?null:modal} onClose={()=>setModal(null)} onSave={handleSave}/>}
    </div>
  );
}