"use client";
import { useState } from "react";
import { supabase } from "./supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [signupRole, setSignupRole] = useState<"technicien" | "manager">("technicien");

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Créer le profil avec le rôle choisi
        await supabase.from("profils").insert({
          id: data.user.id,
          role: signupRole,
          nom: email,
        });
        setError("Vérifiez votre email pour confirmer votre compte.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email ou mot de passe incorrect.");
      } else if (data.user) {
        // Récupérer le rôle et rediriger
        const { data: profil } = await supabase
          .from("profils")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profil?.role === "manager") {
          window.location.href = "/manager";
        } else {
          window.location.href = "/";
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pulse</h1>
          <p className="text-gray-400 text-sm mt-1">L'app des techniciens itinérants</p>
        </div>

        <div className="space-y-4">

          {/* Choix du rôle à l'inscription */}
          {isSignup && (
            <div className="flex gap-3">
              <button
                onClick={() => setSignupRole("technicien")}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition ${signupRole === "technicien" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200"}`}>
                Technicien
              </button>
              <button
                onClick={() => setSignupRole("manager")}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition ${signupRole === "manager" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200"}`}>
                Manager
              </button>
            </div>
          )}

          <div>
            <label className="text-gray-500 text-xs font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thomas@entreprise.fr"
              className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs font-medium">Mot de passe</label>
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
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition disabled:opacity-50">
            {loading ? "Chargement..." : isSignup ? "Créer mon compte" : "Se connecter"}
          </button>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-center text-gray-400 text-sm py-2">
            {isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}