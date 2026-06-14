"use client";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Building2, Upload, Users, LogOut, CheckCircle, FileText, Copy } from "lucide-react";

export default function Manager() {
  const [user, setUser] = useState<any>(null);
  const [entreprise, setEntreprise] = useState<any>(null);
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [techniciens, setTechniciens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (!u) return;
      setUser(u);

      const { data: p } = await supabase
        .from("profils")
        .select("*, entreprises(*)")
        .eq("id", u.id)
        .single();

      if (p?.entreprises) {
        setEntreprise(p.entreprises);

        const { data: techs } = await supabase
          .from("profils")
          .select("*")
          .eq("entreprise_id", p.entreprise_id)
          .eq("role", "technicien");
        setTechniciens(techs || []);

        const { data: tpl } = await supabase
          .from("templates")
          .select("*")
          .eq("entreprise_id", p.entreprise_id)
          .single();
        if (tpl) setUploaded(true);
      }

      setLoading(false);
    });
  }, []);

  const creerEntreprise = async () => {
    if (!nomEntreprise.trim() || !user) return;

    const { data: ent } = await supabase
      .from("entreprises")
      .insert({ nom: nomEntreprise.trim() })
      .select()
      .single();

    if (!ent) return;

    await supabase.from("profils").upsert({
      id: user.id,
      entreprise_id: ent.id,
      role: "manager",
      nom: user.email,
    });

    setEntreprise(ent);
  };

  const uploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !entreprise) return;

    setUploading(true);

    const path = `${entreprise.id}/${file.name}`;
    const { error } = await supabase.storage
      .from("templates")
      .upload(path, file, { upsert: true });

    if (!error) {
      const { data: urlData } = supabase.storage
        .from("templates")
        .getPublicUrl(path);

      await supabase.from("templates").upsert({
        entreprise_id: entreprise.id,
        fichier_url: urlData.publicUrl,
      });

      setUploaded(true);
    }

    setUploading(false);
  };

  const copierCode = () => {
    if (entreprise?.code) {
      navigator.clipboard.writeText(entreprise.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 pt-12 pb-20">

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-black">P</span>
          </div>
          <div>
            <h1 className="font-black text-xl text-gray-900">Pulse Manager</h1>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-gray-700 transition">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {!entreprise ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-md mx-auto mt-20">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <Building2 size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Créer votre entreprise</h2>
          <p className="text-gray-400 text-sm mb-6">Donnez un nom à votre entreprise pour commencer.</p>
          <input
            type="text"
            placeholder="Nom de l'entreprise"
            value={nomEntreprise}
            onChange={(e) => setNomEntreprise(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-blue-400"
          />
          <button
            onClick={creerEntreprise}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold hover:bg-blue-500 transition">
            Créer l'entreprise
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-black text-lg text-gray-900">{entreprise.nom}</h2>
                <p className="text-gray-400 text-xs">Votre entreprise</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Code d'invitation techniciens</p>
                <p className="font-black text-2xl text-gray-900 tracking-widest">{entreprise.code}</p>
              </div>
              <button
                onClick={copierCode}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-500 transition">
                <Copy size={14} />
                {codeCopied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="font-black text-lg text-gray-900">Template de rapport</h2>
                <p className="text-gray-400 text-xs">Déposez votre modèle Word ou PDF</p>
              </div>
            </div>

            {uploaded && (
              <div className="flex items-center gap-3 bg-green-50 rounded-2xl px-4 py-3 mb-4">
                <CheckCircle size={20} className="text-green-500" />
                <p className="text-green-700 font-semibold text-sm">Template uploadé avec succès</p>
              </div>
            )}

            <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl py-8 cursor-pointer transition ${uploaded ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-blue-300 bg-gray-50"}`}>
              <Upload size={28} className={uploaded ? "text-green-400" : "text-gray-400"} />
              <p className="text-sm text-gray-400 mt-2">
                {uploading ? "Upload en cours..." : uploaded ? "Remplacer le template" : "Cliquez pour uploader votre template"}
              </p>
              <p className="text-xs text-gray-300 mt-1">.doc, .docx, .pdf acceptés</p>
              <input type="file" accept=".doc,.docx,.pdf" onChange={uploadTemplate} className="hidden" />
            </label>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                <Users size={20} className="text-orange-500" />
              </div>
              <div>
                <h2 className="font-black text-lg text-gray-900">Techniciens</h2>
                <p className="text-gray-400 text-xs">{techniciens.length} technicien(s) rattaché(s)</p>
              </div>
            </div>

            {techniciens.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aucun technicien pour l'instant.</p>
            ) : (
              <div className="space-y-3">
                {techniciens.map((t) => (
                  <div key={t.id} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{t.nom?.[0]?.toUpperCase() || "T"}</span>
                      </div>
                      <p className="font-semibold text-sm text-gray-700">{t.nom || "Technicien"}</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-semibold">Actif</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}