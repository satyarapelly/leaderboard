"use client";

import { useState } from "react";
import { AlertCircle, ArrowUpRight, Bell, Clock3, CalendarDays, ChevronRight, CircleDollarSign, Flame, HeartPulse, MapPin, MoreHorizontal, Plus, Search, Sparkles, Trophy, UserRoundPlus, Users } from "lucide-react";

const mandals = [
  { name: "Kagaznagar", score: 91, contacts: 342, activities: 28, programs: 4, reached: "3.8k", color: "#e85d3f" },
  { name: "Sirpur (T)", score: 78, contacts: 286, activities: 22, programs: 3, reached: "2.9k", color: "#f19a50" },
  { name: "Kouthala", score: 66, contacts: 194, activities: 19, programs: 3, reached: "2.1k", color: "#eebd54" },
  { name: "Bejjur", score: 54, contacts: 161, activities: 14, programs: 2, reached: "1.6k", color: "#71aa84" },
  { name: "Dahegaon", score: 47, contacts: 128, activities: 11, programs: 2, reached: "1.1k", color: "#78a7a2" },
  { name: "Penchikalpet", score: 32, contacts: 82, activities: 7, programs: 1, reached: "640", color: "#8f9daf" },
  { name: "Chintalamanepally", score: 21, contacts: 51, activities: 4, programs: 1, reached: "310", color: "#a8a8ad" },
];

const kpis = [
  { label: "Funds mobilized", value: "₹2.84 Cr", note: "71% of ₹4 Cr goal", pct: 71, icon: CircleDollarSign, tone: "coral" },
  { label: "People reached", value: "12,450", note: "+1,240 this month", pct: 83, icon: HeartPulse, tone: "green" },
  { label: "Contact pool", value: "1,244", note: "+86 this week", pct: 62, icon: Users, tone: "blue" },
  { label: "Field activities", value: "32", note: "This month · 7 day streak", pct: 80, icon: CalendarDays, tone: "gold" },
];

const alerts = [
  { tone: "high", label: "Follow-up overdue", detail: "Call Rajesh Sharma · due yesterday", meta: "Contact", icon: AlertCircle },
  { tone: "high", label: "Activity overdue", detail: "Village health camp · mark done?", meta: "Activity", icon: CalendarDays },
  { tone: "medium", label: "Funding is getting stale", detail: "SCCL health van · 24 days in Submitted", meta: "Funding", icon: Clock3 },
  { tone: "info", label: "Upcoming tomorrow", detail: "Meet Bejjur community leaders", meta: "Activity", icon: CalendarDays },
];

export default function Dashboard() {
  const [scope, setScope] = useState("Constituency");
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return <div className="dashboard-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">M<span>28</span></div><div><strong>Mission 2028</strong><small>Command center</small></div></div>
      <div className="top-actions"><button className="search"><Search size={17}/> Search anything <kbd>⌘ K</kbd></button><button className="icon-button bell" aria-label="4 unread notifications"><Bell size={18}/><b>4</b></button><div className="avatar">AK</div></div>
    </header>

    <main>
      <section className="welcome">
        <div><p className="eyebrow"><Sparkles size={14}/> {today}</p><h1>Good morning, <em>Arun.</em></h1><p>Every conversation moves the mission forward. Here’s today’s pulse.</p></div>
        <div className="welcome-actions"><div className="scope-toggle">{["Constituency","State"].map(x=><button key={x} onClick={()=>setScope(x)} className={scope===x?"active":""}>{x}</button>)}</div><a className="primary" href="/contacts?add=1"><Plus size={18}/> Add contact</a></div>
      </section>

      <section className="attention panel">
        <div className="panel-head"><div><p className="eyebrow"><Bell size={14}/> Needs attention</p><h2>Four things to move today</h2></div><button className="text-button">View all <ChevronRight size={15}/></button></div>
        <div className="alert-grid">{alerts.map(({icon:Icon,...alert})=><button className={`alert-item ${alert.tone}`} key={alert.detail}><span><Icon size={17}/></span><div><small>{alert.label}</small><strong>{alert.detail}</strong><em>{alert.meta}</em></div><ChevronRight size={16}/></button>)}</div>
      </section>

      <section className="kpi-grid">{kpis.map(({icon:Icon,...k})=><article className={`kpi ${k.tone}`} key={k.label}><div className="kpi-head"><span><Icon size={18}/></span><small><ArrowUpRight size={13}/> 12.4%</small></div><p>{k.label}</p><h2>{k.value}</h2><div className="progress"><i style={{width:`${k.pct}%`}}/></div><footer>{k.note}<b>{k.pct}%</b></footer></article>)}</section>

      <section className="content-grid">
        <article className="panel leaderboard">
          <div className="panel-head"><div><p className="eyebrow"><Trophy size={14}/> Coverage leaderboard</p><h2>{scope === "Constituency" ? "Mandal momentum" : "District momentum"}</h2></div><button className="text-button">View details <ChevronRight size={15}/></button></div>
          <div className="leader-list">{mandals.map((m,i)=><div className={`leader-row ${i>4?"gap":""}`} key={m.name}><b className="rank">{i+1}</b><div className="leader-main"><div className="leader-title"><strong>{m.name}</strong><span>{i===0&&<small>Leading</small>}<b>{m.score}</b></span></div><div className="bar"><i style={{width:`${m.score}%`,background:m.color}}/></div><p>{m.contacts} contacts <span/> {m.activities} activities <span/> {m.programs} programs <span/> {m.reached} reached</p></div></div>)}</div>
        </article>

        <aside className="side-stack">
          <article className="panel focus"><div className="panel-head"><div><p className="eyebrow"><MapPin size={14}/> Focus next</p><h2>Close the coverage gap</h2></div><button className="more"><MoreHorizontal/></button></div><div className="focus-card"><div className="map-pin"><MapPin size={20}/></div><div><strong>Chintalamanepally</strong><p>Lowest coverage · 21 score</p></div><ChevronRight size={18}/></div><div className="tasks"><p><i/> Meet 3 community leaders <b>0/3</b></p><p><i/> Schedule health camp <b>Due Fri</b></p><p><i/> Add village coordinator <b>Open</b></p></div><button className="outline">Plan a field visit <ArrowUpRight size={15}/></button></article>
          <article className="panel streak"><div className="flame"><Flame size={28}/></div><div><p>Field momentum</p><h2>7 week streak</h2><small>Best streak yet — keep showing up.</small></div><div className="week">{[1,2,3,4,5,6,7].map(x=><i key={x}>{x<7?"✓":""}</i>)}</div></article>
          <article className="panel follow"><div className="panel-head"><div><p className="eyebrow"><UserRoundPlus size={14}/> Follow-ups</p><h2>5 due today</h2></div><span className="badge">2 overdue</span></div><div className="people"><span>RS</span><span>VK</span><span>SM</span><span>+2</span></div><button className="outline">Open follow-up list <ChevronRight size={15}/></button></article>
        </aside>
      </section>
    </main>
    <nav className="mobile-nav"><button className="active"><Trophy/>Home</button><a href="/contacts"><Users/>Contacts</a><button className="nav-add"><Plus/></button><button><CircleDollarSign/>Funding</button><button><MoreHorizontal/>More</button></nav>
  </div>
}
