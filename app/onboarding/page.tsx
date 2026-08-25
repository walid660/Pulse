"use client";
import { useState } from "react";
import { supabase } from "../supabase";

export default function OnboardingPage() {
  const [step, setStep] = useState<"code" | "info">("code");
  const [joinCode, setJoinCode] = useState("");
  const [entrepriseId, setEntrepriseId] = useState<string | null>(null);
  const [entrepriseNom, setEntrepriseNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    setError("");
    setLoading(true);
    const { data, error } = await supabase
      .from("entreprises")
      .select("id, nom")
      .eq("code", joinCode.trim())
      .single();

    if (error || !data) {
      setError("Code invalide. Vérifiez auprès de votre manager.");
    } else {
      setEntrepriseId(data.id);
      setEntrepriseNom(data.nom);
      setStep("info");
    }
    setLoading(false);
  };

  const handleSubmitInfo = async () => {
    setError("");
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expirée, reconnectez-vous.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profils")
      .update({
        prenom: prenom.trim(),
        nom: nom.trim(),
        entreprise_id: entrepriseId,
        entreprise_nom: entrepriseNom,
      })
      .eq("id", user.id);

    if (error) {
      setError("Erreur lors de l'enregistrement. Réessayez.");
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-black">P</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Pulse</h1>
          <p className="text-gray-400 text-sm mt-1">
            {step === "code" ? "Rejoignez votre entreprise" : "Dernière étape"}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-4">
          {step === "code" ? (
            <>
              <h2 className="text-xl font-black text-gray-900 mb-2">Code entreprise</h2>
              <div>
                <label className="text-gray-500 text-xs font-semibold">
                  Code fourni par votre manager
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Code entreprise"
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 tracking-widest text-center font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleVerifyCode}
                disabled={loading || joinCode.trim().length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-500 transition disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {loading ? "Vérification..." : "Valider le code"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black text-gray-900 mb-1">{entrepriseNom}</h2>
              <p className="text-gray-400 text-sm mb-3">Entrez vos informations</p>
              <div>
                <label className="text-gray-500 text-xs font-semibold">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Thomas"
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs font-semibold">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dupont"
                  className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleSubmitInfo}
                disabled={loading || !prenom.trim() || !nom.trim()}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-500 transition disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {loading ? "Enregistrement..." : "Rejoindre l'équipe"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}