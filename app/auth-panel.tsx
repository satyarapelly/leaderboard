"use client";

import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

export default function AuthPanel(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [user,setUser]=useState<string|null>(null); const [message,setMessage]=useState("");
 const supabase=createClient();
 useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user?.email||null)); const {data}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user.email||null)); return()=>data.subscription.unsubscribe()},[]);
 const login=async(e:React.FormEvent)=>{e.preventDefault();const {error}=await supabase.auth.signInWithPassword({email,password});setMessage(error?.message||"Connected to Supabase")};
 if(user)return <div className="auth-status"><span><i/> Live · {user}</span><button onClick={()=>supabase.auth.signOut()}><LogOut size={14}/> Sign out</button></div>;
 return <form className="auth-panel" onSubmit={login}><strong>Connect to live data</strong><input required type="email" placeholder="Supabase user email" value={email} onChange={e=>setEmail(e.target.value)}/><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button><LogIn size={14}/> Sign in</button>{message&&<small>{message}</small>}</form>
}
