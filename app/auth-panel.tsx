"use client";

import { useEffect, useMemo, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { describeSupabaseError } from "@/lib/supabase/errors";

export default function AuthPanel() {
  const configured = hasSupabaseConfig();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setUser(data.user?.email || null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user.email || null)
    );
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) {
    return (
      <div className="config-error">
        <strong>Supabase is not configured.</strong>
        <span>
          To use live hosted data, copy <code>.env.example</code> to <code>.env.local</code>, add your remote project URL and anon key, then restart <code>npm run dev</code>.
        </span>
      </div>
    );
  }

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Connecting…");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error?.message || "Connected to Supabase");
    } catch (error) {
      setMessage(describeSupabaseError(error));
    }
  };

  if (user) {
    return (
      <div className="auth-status">
        <span><i /> Live · {user}</span>
        <button onClick={() => supabase.auth.signOut()}><LogOut size={14} /> Sign out</button>
      </div>
    );
  }

  return (
    <form className="auth-panel" onSubmit={login}>
      <strong>Connect to live data</strong>
      <input required type="email" placeholder="Supabase user email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input required type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button><LogIn size={14} /> Sign in</button>
      {message && <small>{message}</small>}
    </form>
  );
export default function AuthPanel(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [user,setUser]=useState<string|null>(null); const [message,setMessage]=useState("");
 const supabase=createClient();
 useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user?.email||null)); const {data}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user.email||null)); return()=>data.subscription.unsubscribe()},[]);
 const login=async(e:React.FormEvent)=>{e.preventDefault();const {error}=await supabase.auth.signInWithPassword({email,password});setMessage(error?.message||"Connected to Supabase")};
 if(user)return <div className="auth-status"><span><i/> Live · {user}</span><button onClick={()=>supabase.auth.signOut()}><LogOut size={14}/> Sign out</button></div>;
 return <form className="auth-panel" onSubmit={login}><strong>Connect to live data</strong><input required type="email" placeholder="Supabase user email" value={email} onChange={e=>setEmail(e.target.value)}/><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button><LogIn size={14}/> Sign in</button>{message&&<small>{message}</small>}</form>
}
