"use client";
import { useEffect, useState as useStateAuth } from "react";
import { useState } from "react";
import { Mic, FileText, DollarSign, User, Home, Plus, CheckCircle, TrendingUp, Clock, Award } from "lucide-react";
import { supabase } from "./supabase";
import Landing from "./landing";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [user, setUser] = useStateAuth<any>(null);
  const [profil, setProfil] = useStateAuth<any>(null);
  const [checking, setChecking] = useStateAuth(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) {
        const { data: p } = await supabase
          .from("profils")
          .select("*, entreprises(*)")
          .eq("id", u.id)
          .single();
        setProfil(p);
      }
      setChecking(false);
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (checking) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
          <span className="text-white font-black text-xl">P</span>
        </div>
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    </div>
  );

  if (!user) return <Landing />;

  const bg = dark ? "#0d0d14" : "#f5f5f7";
  const card = dark ? "bg-[#1a1a2e] border-white/5" : "bg-white border-gray-100";
  const nav = dark ? "bg-[#1a1a2e] border-white/5" : "bg-white border-gray-100";
  const text = dark ? "text-white" : "text-gray-900";
  const sub = dark ? "text-gray-400" : "text-gray-500";
  const muted = dark ? "text-gray-600" : "text-gray-400";
  const t = { bg, card, nav, text, sub, muted };

  const nomTechnicien = profil?.nom?.split("@")[0] || "Technicien";
  const nomEntreprise = profil?.entreprises?.nom || "";

  return (
    <div style={{ backgroundColor: bg }} className={`min-h-screen ${text} flex flex-col w-full relative`}>
      {page === "dashboard" && <Dashboard setPage={setPage} t={t} dark={dark} nomTechnicien={nomTechnicien} nomEntreprise={nomEntreprise} />}
      {page === "rapport" && <Rapport setPage={setPage} t={t} entrepriseId={profil?.entreprise_id} />}
      {page === "interventions" && <Interventions t={t} />}
      {page === "frais" && <Frais t={t} />}
      {page === "profil" && <Profil t={t} dark={dark} setDark={setDark} profil={profil} user={user} />}

      <nav className={`fixed bottom-0 w-full ${nav} border-t shadow-lg flex justify-around py-4 px-2 z-50`}>
        {[
          { id: "dashboard", icon: <Home size={22} />, label: "Accueil" },
          { id: "interventions", icon: <FileText size={22} />, label: "Rapports" },
          { id: "rapport", icon: <Mic size={24} />, label: "", special: true },
          { id: "frais", icon: <DollarSign size={22} />, label: "Frais" },
          { id: "profil", icon: <User size={22} />, label: "Profil" },
        ].map((item) =>
          item.special ? (
            <button key={item.id} onClick={() => setPage(item.id)}
              className="bg-blue-600 rounded-2xl p-4 -mt-8 shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all hover:scale-105">
              <Mic size={24} className="text-white" />
            </button>
          ) : (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-all ${page === item.id ? "text-blue-600 scale-105" : sub}`}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        )}
      </nav>
    </div>
  );
}

function Dashboard({ setPage, t, dark, nomTechnicien, nomEntreprise }: any) {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex-1 pb-28 overflow-y-auto">
      <div className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div>
          {nomEntreprise && (
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{nomEntreprise}</span>
          )}
          <p className={`${t.sub} text-sm font-medium mt-2`}>{today}</p>
          <h1 className={`text-3xl font-black mt-1 ${t.text}`}>Bonjour, {nomTechnicien} 👋</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/30">
          {nomTechnicien[0]?.toUpperCase()}
        </div>
      </div>

      <div className="mx-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 mb-6">
        <p className="text-blue-100 text-sm font-medium mb-1">Ce mois-ci</p>
        <p className="text-4xl font-black mb-1">12 interventions</p>
        <p className="text-blue-200 text-sm">+3 par rapport au mois dernier</p>
        <div className="mt-4 flex gap-4">
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-xs text-blue-100">Frais</p>
            <p className="font-bold text-lg">1 250€</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-xs text-blue-100">Heures</p>
            <p className="font-bold text-lg">96h30</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2">
            <p className="text-xs text-blue-100">Primes</p>
            <p className="font-bold text-lg">650€</p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-6">
        <button onClick={() => setPage("rapport")}
          className="w-full bg-gray-900 text-white rounded-2xl py-5 flex items-center justify-center gap-3 font-bold text-lg hover:opacity-90 transition shadow-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
            <Mic size={18} />
          </div>
          Nouveau rapport vocal
        </button>
      </div>

      <div className="px-6 grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: <TrendingUp size={18} />, label: "Taux réussite", value: "98%", color: "text-green-500" },
          { icon: <Clock size={18} />, label: "Moy. durée", value: "2h15", color: "text-blue-500" },
          { icon: <Award size={18} />, label: "Satisfaction", value: "4.9/5", color: "text-yellow-500" },
        ].map((s) => (
          <div key={s.label} className={`${t.card} border rounded-2xl p-3 text-center shadow-sm`}>
            <div className={`${s.color} flex justify-center mb-1`}>{s.icon}</div>
            <p className={`text-xs ${t.sub} mb-1`}>{s.label}</p>
            <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`font-black text-lg ${t.text}`}>Récentes</h2>
          <button className="text-blue-500 text-sm font-semibold">Voir tout →</button>
        </div>
        <div className="space-y-3">
          {[
            { title: "Autoclave BAT1600", client: "Danone", lieu: "Villecomtal", date: "21/05", ok: true },
            { title: "Maintenance préventive", client: "Nestlé", lieu: "Vittel", date: "18/05", ok: false },
            { title: "Dépannage automate", client: "Lactalis", lieu: "Laval", date: "12/05", ok: true },
          ].map((i) => (
            <div key={i.title} className={`${t.card} border rounded-2xl p-4 flex justify-between items-center shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i.ok ? "bg-green-50" : "bg-yellow-50"}`}>
                  <FileText size={18} className={i.ok ? "text-green-500" : "text-yellow-500"} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${t.text}`}>{i.title}</p>
                  <p className={`${t.sub} text-xs mt-0.5`}>{i.client} · {i.lieu}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${i.ok ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                  {i.ok ? "Terminé" : "En cours"}
                </span>
                <span className={`text-xs ${t.muted}`}>{i.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Rapport({ setPage, t, entrepriseId }: any) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const audioChunks: any[] = [];

    recorder.ondataavailable = (e) => { audioChunks.push(e.data); };

    recorder.onstop = async () => {
      setLoading(true);
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      const file = new File([blob], "audio.webm", { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", file);
      try {
        const res = await fetch("/api/transcribe", { method: "POST", body: formData });
        const data = await res.json();
        setTranscription(data.text || "Erreur de transcription");
        setDone(true);
      } catch {
        setTranscription("Erreur de transcription");
        setDone(true);
      }
      setLoading(false);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div className="flex-1 pb-28 px-6 pt-12">
      <button onClick={() => setPage("dashboard")} className={`${t.sub} text-sm font-semibold mb-8`}>← Retour</button>
      <h1 className={`text-3xl font-black mb-2 ${t.text}`}>Rapport vocal</h1>
      <p className={`${t.sub} text-sm mb-10`}>Parlez, l'IA remplit votre rapport automatiquement.</p>

      <div className="flex flex-col items-center gap-8">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all shadow-2xl ${recording ? "bg-red-50 shadow-red-200 animate-pulse" : "bg-blue-50 shadow-blue-100"}`}>
          <div className={`w-28 h-28 rounded-full flex items-center justify-center ${recording ? "bg-red-100" : "bg-blue-100"}`}>
            <Mic size={52} className={recording ? "text-red-500" : "text-blue-500"} />
          </div>
        </div>

        <button onClick={recording ? stopRecording : startRecording}
          className={`px-10 py-4 rounded-2xl font-black text-lg text-white transition shadow-lg ${recording ? "bg-red-500 shadow-red-200" : "bg-blue-600 shadow-blue-200"}`}>
          {recording ? "⏹ Arrêter l'enregistrement" : "🎙️ Démarrer"}
        </button>

        {loading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className={`${t.sub} text-sm`}>Transcription en cours...</p>
          </div>
        )}

        {recording && (
          <div className="flex gap-1 items-end h-8">
            {[3, 5, 7, 4, 6, 8, 5, 3, 6, 4, 7, 5].map((h, i) => (
              <div key={i} style={{ height: `${h * 4}px` }} className="w-1.5 bg-red-400 rounded-full animate-pulse" />
            ))}
          </div>
        )}

        {done && (
          <div className="w-full bg-white rounded-3xl p-6 border border-gray-100 shadow-lg mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle size={18} className="text-green-500" />
              </div>
              <p className="text-green-600 font-bold">Transcription générée</p>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{transcription}</p>
            <button
              onClick={async () => {
                const res = await fetch("/api/generate-pdf", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ transcription, entrepriseId }),
                });
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "rapport-intervention.pdf";
                a.click();
              }}
              className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-200">
              📄 Générer le rapport PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Interventions({ t }: any) {
  return (
    <div className="flex-1 pb-28 px-6 pt-12">
      <h1 className={`text-3xl font-black mb-6 ${t.text}`}>Interventions</h1>
      <div className="space-y-3">
        {[
          { title: "Autoclave BAT1600", client: "Danone", lieu: "Villecomtal", date: "21/05/2025", ok: true },
          { title: "Maintenance préventive", client: "Nestlé", lieu: "Vittel", date: "18/05/2025", ok: false },
          { title: "Dépannage automate", client: "Lactalis", lieu: "Laval", date: "12/05/2025", ok: true },
          { title: "Mise en service", client: "Bonduelle", lieu: "Amiens", date: "05/05/2025", ok: true },
        ].map((i) => (
          <div key={i.title} className={`${t.card} border rounded-2xl p-4 flex justify-between items-center shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i.ok ? "bg-green-50" : "bg-yellow-50"}`}>
                <FileText size={18} className={i.ok ? "text-green-500" : "text-yellow-500"} />
              </div>
              <div>
                <p className={`font-bold text-sm ${t.text}`}>{i.title}</p>
                <p className={`${t.sub} text-xs mt-0.5`}>{i.client} · {i.lieu}</p>
                <p className={`${t.muted} text-xs`}>{i.date}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${i.ok ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
              {i.ok ? "Terminé" : "En cours"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Frais({ t }: any) {
  return (
    <div className="flex-1 pb-28 px-6 pt-12">
      <h1 className={`text-3xl font-black mb-1 ${t.text}`}>Frais du mois</h1>
      <p className="text-green-500 text-4xl font-black mb-2">1 250,45 €</p>
      <p className={`${t.sub} text-sm mb-6`}>Mai 2025</p>
      <div className="space-y-3">
        {[
          { type: "Hôtel", montant: "600€", date: "20/05/2025", icon: "🏨", color: "bg-purple-50" },
          { type: "Péage", montant: "185€", date: "19/05/2025", icon: "🛣️", color: "bg-blue-50" },
          { type: "Repas", montant: "254€", date: "18/05/2025", icon: "🍽️", color: "bg-orange-50" },
          { type: "Carburant", montant: "132€", date: "15/05/2025", icon: "⛽", color: "bg-green-50" },
        ].map((f) => (
          <div key={f.type} className={`${t.card} border rounded-2xl p-4 flex justify-between items-center shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-2xl`}>{f.icon}</div>
              <div>
                <p className={`font-bold ${t.text}`}>{f.type}</p>
                <p className={`${t.sub} text-xs`}>{f.date}</p>
              </div>
            </div>
            <p className="font-black text-green-500 text-lg">{f.montant}</p>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 bg-blue-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition shadow-lg shadow-blue-200">
        <Plus size={20} /> Ajouter un frais
      </button>
    </div>
  );
}

function Profil({ t, dark, setDark, profil, user }: any) {
  const nom = profil?.nom || user?.email || "Technicien";
  const entreprise = profil?.entreprises?.nom || "—";

  return (
    <div className="flex-1 pb-28 px-6 pt-12">
      <h1 className={`text-3xl font-black mb-6 ${t.text}`}>Profil</h1>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-blue-200">
          {nom[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className={`text-xl font-black ${t.text}`}>{nom}</h2>
          <p className={`${t.sub} text-sm`}>Technicien SAV itinérant</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: "Entreprise", value: entreprise },
          { label: "Email", value: user?.email || "—" },
        ].map((item) => (
          <div key={item.label} className={`${t.card} border rounded-2xl p-4 shadow-sm`}>
            <p className={`${t.sub} text-xs font-medium`}>{item.label}</p>
            <p className={`font-bold mt-1 ${t.text}`}>{item.value}</p>
          </div>
        ))}
        <div className={`${t.card} border rounded-2xl p-4 flex justify-between items-center shadow-sm`}>
          <div>
            <p className={`${t.sub} text-xs font-medium`}>Thème</p>
            <p className={`font-bold mt-1 ${t.text}`}>{dark ? "Mode sombre" : "Mode clair"}</p>
          </div>
          <button onClick={() => setDark(!dark)} className={`w-12 h-6 rounded-full transition-all ${dark ? "bg-blue-600" : "bg-gray-200"} relative`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${dark ? "left-6" : "left-0.5"}`}></div>
          </button>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); }}
          className="w-full mt-2 bg-red-50 text-red-500 rounded-2xl py-4 font-bold hover:bg-red-100 transition border border-red-100">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}