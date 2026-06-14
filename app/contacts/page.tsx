"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Check, MessageCircle, Phone, Plus, Search, UserRoundPlus, X } from "lucide-react";

type Contact = { id:string; name:string; phone:string; category:string; affiliation?:string; last_contact?:string; next_action?:string; next_action_date?:string; archived_at?:string };
const KEY = "mission-2028-contacts";
const starter: Contact[] = [
  { id:"1", name:"Rajesh Sharma", phone:"919876543210", category:"Community leader", affiliation:"Bejjur Farmers Collective", next_action:"Confirm village meeting", next_action_date:"2026-06-15" },
  { id:"2", name:"Dr. Kavitha Rao", phone:"919812345678", category:"Professional", affiliation:"Sirpur Health Network", last_contact:"2026-06-10" },
];

export default function ContactsPage() {
  const [contacts,setContacts]=useState<Contact[]>([]); const [ready,setReady]=useState(false); const [open,setOpen]=useState(false); const [query,setQuery]=useState(""); const [toast,setToast]=useState("");
  const [form,setForm]=useState({name:"",phone:"",category:"Community leader"});
  useEffect(()=>{ const saved=localStorage.getItem(KEY); setContacts(saved?JSON.parse(saved):starter); setReady(true); if(new URLSearchParams(location.search).has("add")) setOpen(true); },[]);
  useEffect(()=>{ if(ready)localStorage.setItem(KEY,JSON.stringify(contacts)); },[contacts,ready]);
  const notify=(message:string)=>{setToast(message);setTimeout(()=>setToast(""),2200)};
  const visible=useMemo(()=>contacts.filter(c=>!c.archived_at&&`${c.name} ${c.phone} ${c.category} ${c.affiliation||""}`.toLowerCase().includes(query.toLowerCase())),[contacts,query]);
  const add=(e:React.FormEvent)=>{e.preventDefault();setContacts(x=>[{...form,id:crypto.randomUUID()},...x]);setForm({name:"",phone:"",category:"Community leader"});setOpen(false);notify("Contact saved locally");};
  const touch=(id:string)=>{setContacts(x=>x.map(c=>c.id===id?{...c,last_contact:new Date().toISOString().slice(0,10)}:c));notify("Touch logged · last contact updated");};
  const archive=(id:string)=>{if(confirm("Archive this contact?")){setContacts(x=>x.map(c=>c.id===id?{...c,archived_at:new Date().toISOString()}:c));notify("Contact archived");}};
  return <div className="contacts-shell"><header className="contacts-top"><a href="/" className="brand"><div className="brand-mark">M<span>28</span></div><div><strong>Mission 2028</strong><small>Command center</small></div></a><a href="/">Dashboard</a></header><main className="contacts-main">
    <section className="contacts-heading"><div><p className="eyebrow"><UserRoundPlus size={14}/> Contact pool</p><h1>People powering the mission</h1><p>Fast-capture a contact, log every touch, and take action in one tap.</p></div><button className="primary" onClick={()=>setOpen(true)}><Plus size={18}/> Add contact</button></section>
    <div className="contact-toolbar"><label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, phone, category…"/></label><b>{visible.length} active contacts</b></div>
    <section className="contact-list">{visible.map(c=><article className="contact-card" key={c.id}><div className="contact-avatar">{c.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div className="contact-info"><div><h2>{c.name}</h2><span>{c.category}</span></div><p>{c.affiliation||"No affiliation added"}</p><small>{c.last_contact?`Last touch ${c.last_contact}`:"New · no touch logged"}{c.next_action&&` · Next: ${c.next_action}`}</small></div><div className="contact-actions"><a href={`tel:${c.phone}`} aria-label="Call"><Phone size={16}/></a><a href={`https://wa.me/${c.phone}`} aria-label="WhatsApp"><MessageCircle size={16}/></a><button onClick={()=>touch(c.id)}><Check size={16}/> Log touch</button><button className="archive" onClick={()=>archive(c.id)} aria-label="Archive"><Archive size={16}/></button></div></article>)}{ready&&visible.length===0&&<div className="empty">No contacts match this view. Add the first one.</div>}</section>
  </main>{open&&<div className="modal-backdrop" onMouseDown={()=>setOpen(false)}><form className="contact-modal" onSubmit={add} onMouseDown={e=>e.stopPropagation()}><button type="button" className="modal-close" onClick={()=>setOpen(false)}><X/></button><p className="eyebrow">Fast capture</p><h2>Add a contact</h2><label>Name<input required autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Phone<input required type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Community leader</option><option>Official</option><option>Donor</option><option>Corporate CSR</option><option>Media</option><option>Professional</option><option>Youth volunteer</option></select></label><button className="primary" type="submit"><Plus size={17}/> Save contact</button><small>Saved in this browser so the demo works without Supabase.</small></form></div>}{toast&&<div className="toast"><Check size={16}/>{toast}</div>}</div>
}
