import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type RapportIA = {
  odm: string;
  client: string;
  appareil: string;
  objet: string;
  personne_rencontree: string;
  objectif: string;
  descriptif: string;
  problemes: string;
  tests: string;
  actions: string;
  taches_non_achevees: string;
  retour_materiel: string;
  demande_commerciale: string;
  remarques: string;
};

async function extraireAvecIA(transcription: string): Promise<RapportIA | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Tu es un assistant qui structure les comptes-rendus oraux de techniciens SAV en champs de rapport d'intervention. " +
            "Réponds UNIQUEMENT en JSON avec exactement ces clés (chaînes de texte, en français, rédigées proprement ; laisse une chaîne vide si l'information n'est pas mentionnée, n'invente jamais) : " +
            "odm, client, appareil, objet, personne_rencontree, objectif, descriptif, problemes, tests, actions, taches_non_achevees, retour_materiel, demande_commerciale, remarques. " +
            "\"descriptif\" est un résumé clair et complet de l'intervention (2-4 phrases), rédigé au passé, à partir de tout ce que dit le technicien.",
        },
        { role: "user", content: transcription },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;
    return JSON.parse(raw) as RapportIA;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { transcription, technicien } = await req.json();
    const ia = await extraireAvecIA(transcription);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const { width, height } = page.getSize();
    const marginLeft = 50;
    const marginRight = width - 50;
    const colLabel = marginLeft;
    const colValue = 220;
    let y = height - 50;

    // ── Titre ──
    page.drawText("RAPPORT INTERNE D'INTERVENTION", {
      x: marginLeft, y, font: fontBold, size: 16, color: rgb(0, 0, 0.6),
    });
    y -= 35;

    // ── Ligne de séparation ──
    page.drawLine({ start: { x: marginLeft, y }, end: { x: marginRight, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
    y -= 20;

    // ── Champs d'en-tête ──
    const today = new Date().toLocaleDateString("fr-FR");
    const headerFields = [
      { label: "Date :", value: today },
      { label: "ODM :", value: ia?.odm || extraireChamp(transcription, ["odm", "ordre", "bon"]) },
      { label: "Client :", value: ia?.client || extraireChamp(transcription, ["client", "chez", "pour", "société"]) },
      { label: "N° Appareil(s) :", value: ia?.appareil || extraireChamp(transcription, ["autoclave", "appareil", "machine", "numéro", "numero", "n°"]) },
      { label: "Objet de l'intervention :", value: ia?.objet || extraireChamp(transcription, ["objet", "intervention", "mission", "but"]) },
      { label: "Personne rencontrée :", value: ia?.personne_rencontree || extraireChamp(transcription, ["rencontré", "rencontre", "contact", "interlocuteur"]) },
      { label: "Technicien :", value: technicien || "—" },
    ];

    for (const field of headerFields) {
      page.drawText(field.label, { x: colLabel, y, font: fontBold, size: 10 });
      page.drawText(field.value || "—", { x: colValue, y, font, size: 10 });
      y -= 22;
    }

    y -= 10;
    page.drawLine({ start: { x: marginLeft, y }, end: { x: marginRight, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
    y -= 20;

    // ── Note italique ──
    const noteText = "Les paragraphes suivants ne doivent pas être supprimés du rapport.";
    page.drawText(noteText, { x: marginLeft, y, font: fontItalic, size: 8, color: rgb(0.4, 0.4, 0.4) });
    y -= 25;

    // ── Sections ──
    const sections = [
      {
        title: "Objectif de l'intervention :",
        content: ia?.objectif || extraireSection(transcription, ["objectif", "but", "mission", "raison"]),
      },
      {
        title: "Descriptif de l'intervention :",
        content: ia?.descriptif || transcription,
      },
      {
        title: "Problèmes constatés :",
        content: ia?.problemes || extraireSection(transcription, ["problème", "probleme", "panne", "défaut", "defaut", "anomalie", "erreur"]),
      },
      {
        title: "Tests à effectuer sur la machine :",
        content: ia?.tests || extraireSection(transcription, ["test", "vérification", "verification", "contrôle", "controle"]),
      },
      {
        title: "Actions complémentaires obligatoires :",
        content: ia?.actions || extraireSection(transcription, ["action", "remplacement", "réglage", "reglage", "réparation", "reparation"]),
      },
      {
        title: "Tâches non achevées :",
        content: ia?.taches_non_achevees || extraireSection(transcription, ["non achevé", "non acheve", "à faire", "a faire", "prévoir", "prevoir", "reste"]),
      },
      {
        title: "Retour matériel :",
        content: ia?.retour_materiel || extraireSection(transcription, ["retour", "matériel", "materiel", "pièce", "piece", "ramené", "ramene"]),
      },
      {
        title: "Demande commerciale :",
        content: ia?.demande_commerciale || extraireSection(transcription, ["devis", "commande", "demande", "commercial"]),
      },
      {
        title: "Autres remarques :",
        content: ia?.remarques || extraireSection(transcription, ["remarque", "autre", "divers", "note"]),
      },
    ];

    for (const section of sections) {
      if (y < 80) break;

      page.drawText(section.title, { x: marginLeft, y, font: fontBold, size: 10, color: rgb(0, 0, 0.6) });
      y -= 16;

      const lines = splitText(section.content || "Non renseigné", 90);
      for (const line of lines) {
        if (y < 60) break;
        page.drawText(line, { x: marginLeft + 10, y, font, size: 9, color: rgb(0.2, 0.2, 0.2) });
        y -= 14;
      }
      y -= 10;
    }

    // ── Validation / Signature ──
    if (y > 80) {
      page.drawLine({ start: { x: marginLeft, y }, end: { x: marginRight, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
      y -= 18;
      page.drawText("Validation de l'opération :", { x: marginLeft, y, font: fontBold, size: 10 });
      page.drawText("Signature du technicien :", { x: 320, y, font: fontBold, size: 10 });
      y -= 30;
      page.drawLine({ start: { x: marginLeft, y }, end: { x: 280, y }, thickness: 0.8, color: rgb(0, 0, 0) });
      page.drawLine({ start: { x: 320, y }, end: { x: marginRight, y }, thickness: 0.8, color: rgb(0, 0, 0) });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=rapport-intervention.pdf",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur generation PDF" }, { status: 500 });
  }
}

function extraireChamp(text: string, mots: string[]): string {
  const lower = text.toLowerCase();
  for (const mot of mots) {
    const idx = lower.indexOf(mot);
    if (idx !== -1) {
      const extrait = text.substring(idx, idx + 60).split(/[.,\n]/)[0];
      return extrait.trim();
    }
  }
  return "";
}

function extraireSection(text: string, mots: string[]): string {
  const lower = text.toLowerCase();
  for (const mot of mots) {
    const idx = lower.indexOf(mot);
    if (idx !== -1) {
      return text.substring(Math.max(0, idx - 20), idx + 200).trim();
    }
  }
  return "";
}

function splitText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}