"use client";

export default function Landing() {
  const goToLogin = () => window.location.href = "/login";

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-gray-900 font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-[#f8f7f4] border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-lg">Pulse</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <a href="#fonctionnalites" className="hover:text-gray-900 transition">Fonctionnalités</a>
          <a href="#tarifs" className="hover:text-gray-900 transition">Tarifs</a>
          <a href="#contact" className="hover:text-gray-900 transition">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goToLogin} className="hidden md:block text-sm text-gray-500 hover:text-gray-900 transition">Se connecter</button>
          <button onClick={goToLogin} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition">Essai gratuit</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
          🎙️ Propulsé par l'IA vocale
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight max-w-4xl">
          Vos rapports d'intervention
          <span className="text-blue-600"> en 30 secondes.</span>
        </h1>
        <p className="text-gray-500 text-lg mt-6 max-w-xl leading-relaxed">
          Pulse transforme votre voix en rapport PDF professionnel. Plus de paperasse, plus de perte de temps. Juste parlez.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <button onClick={goToLogin} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
            Essayer gratuitement
          </button>
          <button className="text-gray-500 px-8 py-4 rounded-xl font-semibold text-lg hover:text-gray-900 transition flex items-center gap-2">
            ▶ Voir la démo
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-4">Aucune carte bancaire requise · 14 jours gratuits</p>

        {/* App preview */}
        <div className="mt-16 w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-2 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-400 text-xs ml-4">pulse-delta-silk.vercel.app</span>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Interventions", value: "12", color: "text-gray-900" },
                { label: "Frais du mois", value: "1 250€", color: "text-green-600" },
                { label: "Heures", value: "96h30", color: "text-gray-900" },
                { label: "Primes", value: "650€", color: "text-yellow-500" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-gray-400 text-xs">{s.label}</p>
                  <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-600 rounded-2xl py-4 flex items-center justify-center gap-3 text-white font-bold">
              🎙️ Nouveau rapport vocal
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-10 border-y border-gray-200 bg-white">
        <p className="text-center text-gray-400 text-sm mb-6">Utilisé par des techniciens dans ces entreprises</p>
        <div className="flex items-center justify-center gap-12 flex-wrap px-6">
          {["Danone", "Nestlé", "Lactalis", "Bonduelle", "Schneider"].map((c) => (
            <span key={c} className="text-gray-300 font-bold text-lg">{c}</span>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-4">Tout ce dont vous avez besoin</h2>
        <p className="text-gray-400 text-center mb-12">Une seule app pour gérer toute votre activité terrain.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🎙️", title: "Rapport vocal IA", desc: "Parlez, l'IA transcrit et remplit votre rapport PDF automatiquement en quelques secondes." },
            { icon: "📄", title: "PDF personnalisé", desc: "Chaque entreprise a son propre modèle. Pulse s'adapte au format de votre client." },
            { icon: "💰", title: "Suivi des frais", desc: "Hôtel, péage, repas, carburant. Tout est tracé en temps réel avec justificatifs." },
            { icon: "⏱️", title: "Temps & heures", desc: "Calculez vos heures travaillées, supplémentaires et de déplacement automatiquement." },
            { icon: "📱", title: "100% mobile", desc: "Conçu pour le terrain. Fonctionne sur tous les téléphones, même hors ligne." },
            { icon: "📊", title: "Tableau de bord", desc: "Vue complète de votre activité mensuelle — interventions, frais, primes estimées." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-bold text-lg mt-3 mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-black text-center mb-4">Tarifs simples</h2>
        <p className="text-gray-400 text-center mb-12">Sans engagement. Annulez à tout moment.</p>
        <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto">
          {[
            { name: "Technicien", price: "19€", period: "/mois", desc: "Pour les techniciens indépendants", features: ["Rapports vocaux illimités", "Suivi des frais", "Export PDF", "Support email"], highlight: false },
            { name: "Entreprise", price: "49€", period: "/mois", desc: "Pour les équipes SAV", features: ["Tout Technicien inclus", "Jusqu'à 10 techniciens", "Tableau de bord manager", "Support prioritaire"], highlight: true },
          ].map((p) => (
            <div key={p.name} className={`flex-1 rounded-2xl p-8 border ${p.highlight ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-100"}`}>
              <p className={`text-sm font-semibold ${p.highlight ? "text-blue-200" : "text-gray-400"}`}>{p.name}</p>
              <div className="flex items-end gap-1 mt-2 mb-1">
                <span className="text-4xl font-black">{p.price}</span>
                <span className={`text-sm mb-1 ${p.highlight ? "text-blue-200" : "text-gray-400"}`}>{p.period}</span>
              </div>
              <p className={`text-sm mb-6 ${p.highlight ? "text-blue-200" : "text-gray-400"}`}>{p.desc}</p>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={goToLogin} className={`w-full py-3 rounded-xl font-bold transition ${p.highlight ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-gray-900 text-white hover:bg-gray-700"}`}>
                Commencer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-black mb-4">Prêt à gagner du temps ?</h2>
        <p className="text-gray-400 mb-8">Rejoignez les techniciens qui utilisent déjà Pulse.</p>
        <button onClick={goToLogin} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
          Essayer gratuitement
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-bold text-sm">Pulse</span>
        </div>
        <p className="text-gray-400 text-sm mt-4 md:mt-0">© 2025 Pulse. Tous droits réservés.</p>
      </footer>

    </div>
  );
}