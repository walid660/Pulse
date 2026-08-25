"use client";
import { useState } from "react";
import { supabase } from "../supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"technicien" | "manager">("technicien");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const redirectByRole = async (userId: string) => {
    const { data: profil } = await supabase
      .from("profils")
      .select("role")
      .eq("id", userId)
      .maybeSingle();


    if (profil?.role === "manager") {
      window.location.href = "/manager";
    } else {
      window.location.href = "/onboarding";
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          await supabase.from("profils").upsert({
            id: data.user.id,
            role: role,
            nom: email,
          });
          await redirectByRole(data.user.id);
        } else {
          setError("Compte créé mais session non initialisée. Reconnectez-vous.");
          setLoading(false);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError("Email ou mot de passe incorrect.");
          setLoading(false);
          return;
        }
        if (data.user) {
          await redirectByRole(data.user.id);
        } else {
          setError("Connexion échouée, réessayez.");
          setLoading(false);
        }
      }
    } catch (err) {
      setError("Erreur inattendue : " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-black">P</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Pulse</h1>
          <p className="text-gray-400 text-sm mt-1">L'app des techniciens itinérants</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-4">
          <h2 className="text-xl font-black text-gray-900 mb-2">{isSignup ? "Créer un compte" : "Se connecter"}</h2>

          {isSignup && (
            <div>
              <label className="text-gray-500 text-xs font-semibold">Je suis</label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setRole("technicien")}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm ${role === "technicien" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}
                >
                  Technicien
                </button>
                <button
                  type="button"
                  onClick={() => setRole("manager")}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm ${role === "manager" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-500 border border-gray-200"}`}
                >
                  Manager
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-500 text-xs font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thomas@entreprise.fr"
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs font-semibold">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-500 transition disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {loading ? "Chargement..." : isSignup ? "Créer mon compte" : "Se connecter"}
          </button>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-center text-gray-400 text-sm py-2"
          >
            {isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </div>
        <button onClick={() => window.location.href = "/"} className="w-full text-center text-gray-400 text-sm mt-4">
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}