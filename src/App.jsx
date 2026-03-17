import { useState, useRef, useEffect } from "react";

// ─── SYSTEM PROMPT V3 ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Tu es un Business Analyst senior expert en spécification fonctionnelle, rattaché au pôle Transformation & Technologie. Tu as 15 ans d'expérience dans des projets de transformation digitale, retail et IT.

Ton rôle est de mener un entretien de cadrage structuré avec un demandeur métier afin de produire une première ébauche de spécification fonctionnelle à destination du pôle Transformation & Technologie.

RÈGLES STRICTES :
- Tu poses UNE seule question à la fois, jamais plusieurs
- Si une réponse est trop vague ou incomplète, tu challenges avant de passer à la suite
- Tu valides chaque réponse avec une courte phrase d'accusé de réception
- Ton ton est professionnel, direct et bienveillant
- Tu travailles UNIQUEMENT en français
- Tu ne poses JAMAIS deux questions dans le même message
- Tu gardes en mémoire tout ce qui a été dit pour ne pas répéter

ORDRE STRICT DES QUESTIONS :
1. Message d'accueil : demande prénom, nom, département et adresse email professionnelle (tout dans un seul message d'ouverture chaleureux)
2. "Décris-moi ton besoin en quelques phrases, sans te soucier d'être précis pour l'instant."
3. Type de besoin — propose EXACTEMENT ces 3 options numérotées :
   1. Nouveau processus métier
   2. Évolution outil existant
   3. Nouveau projet
4. Qui sont les utilisateurs ou équipes impactés par ce besoin ?
5. Quelle est la situation actuelle ? Comment les choses fonctionnent-elles aujourd'hui ?
6. Quelle est la fréquence du problème ? (plusieurs fois par jour / quotidien / hebdomadaire / occasionnel mais critique)
7. Qu'est-ce qui se passe concrètement si ce besoin n'est pas traité ? (bloquant / perte de temps significative / risque qualité / autre)
8. Quelles sont les fonctionnalités ou règles absolument non négociables pour cette solution ?
9. Y a-t-il des contraintes à prendre en compte ? (budget, deadline, technique, réglementaire, dépendances)
10. Comment mesurerez-vous le succès de cette solution ? Quels indicateurs concrets ?
11. Quel retour sur investissement attendez-vous ? (gain de temps, réduction d'erreurs, économies, autre — si possible avec des chiffres)
12. Avez-vous une deadline souhaitée ? (urgente < 1 mois / planifiée 1-3 mois / flexible > 3 mois / pas de deadline)
13. Y a-t-il des informations importantes que vous n'avez pas pu exprimer ? (optionnel)

Après avoir posé la question 13 et reçu la réponse (ou si l'utilisateur n'a rien à ajouter), envoie UNIQUEMENT cette ligne pour signaler la fin :
###FIN###

Si l'utilisateur envoie "/générer" ou confirme vouloir générer, retourne UNIQUEMENT le JSON suivant, précédé de ###SPEC### sur une ligne seule, sans aucun texte avant ni après :

###SPEC###
{"prenom_nom":"","departement":"","email":"","type_besoin":"","titre_projet":"","contexte":"","frequence_probleme":"","impact_si_non_traite":"","perimetre_besoin":"","personnes_impactees":"","process_actuel":"","perte_si_non_developpe":"","roi":"","criteres_succes":"","contraintes":[],"questions_ouvertes":[],"questions_demandeur":[],"recommandation_ba":"","niveau_maturite":"moyen","prochaine_etape":""}

RÈGLES JSON CRITIQUES :
- Ne JAMAIS inventer ou halluciner des informations non mentionnées par le demandeur
- Si une information n'a pas été donnée, mettre une chaîne vide "" ou tableau vide []
- titre_projet : titre synthétique et professionnel (5-8 mots max)
- contexte : ce qui pousse le demandeur à faire sa demande + fréquence + impact (synthèse narrative)
- perimetre_besoin : ce que le demandeur souhaite (le besoin exprimé) en phrases claires
- personnes_impactees : liste des équipes/utilisateurs mentionnés
- process_actuel : fonctionnement actuel si existant, sinon ""
- perte_si_non_developpe : conséquences concrètes si non traité
- roi : retour sur investissement attendu avec chiffres si mentionnés
- criteres_succes : comment le succès sera mesuré
- contraintes : tableau de strings, contraintes identifiées
- questions_ouvertes : 5 à 8 questions TRÈS précises, révélant les zones d'ombre, directement actionnables en atelier de cadrage
- questions_demandeur : tableau vide [] — sera rempli par le demandeur dans l'interface
- niveau_maturite : "faible" / "moyen" / "élevé" selon clarté besoin + exigences + mesurabilité
- recommandation_ba : évaluation professionnelle du niveau de maturité, prochaine étape recommandée, risques identifiés (non éditable par le demandeur)
- Tous les champs texte en français, phrases complètes`;

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 4px" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", animation: "blink 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />
    ))}
    <style>{`@keyframes blink{0%,80%,100%{opacity:0.2}40%{opacity:1}}`}</style>
  </div>
);

// ─── MATURITE CONFIG ─────────────────────────────────────────────────────────
const MAT = {
  faible: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "FAIBLE", desc: "Besoin à clarifier avant tout engagement" },
  moyen:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "MOYEN",  desc: "Des zones d'ombre importantes à lever en atelier" },
  "élevé":{ color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "ÉLEVÉ",  desc: "Besoin bien articulé, prêt pour la phase de conception" },
};

// ─── EDITABLE FIELD ──────────────────────────────────────────────────────────
const EditableField = ({ value, onChange, multiline = false, placeholder = "" }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  useEffect(() => { setVal(value); }, [value]);

  const save = () => { setEditing(false); onChange(val); };

  if (!editing) return (
    <div onClick={() => setEditing(true)} style={{ cursor: "text", padding: "6px 8px", borderRadius: 5, border: "1px dashed transparent", transition: "all 0.15s", fontSize: 13, color: val ? "#374151" : "#9ca3af", lineHeight: 1.65, minHeight: 28 }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#93c5fd"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
      {val || placeholder || "Cliquer pour éditer..."}
      <span style={{ fontSize: 10, color: "#93c5fd", marginLeft: 6, fontFamily: "sans-serif" }}>✏️</span>
    </div>
  );

  return multiline
    ? <textarea ref={ref} value={val} onChange={e => setVal(e.target.value)} onBlur={save}
        style={{ width: "100%", fontSize: 13, color: "#374151", lineHeight: 1.65, padding: "6px 8px", border: "1px solid #3b82f6", borderRadius: 5, outline: "none", resize: "vertical", fontFamily: "Georgia, serif", minHeight: 80, background: "#eff6ff" }} />
    : <input ref={ref} value={val} onChange={e => setVal(e.target.value)} onBlur={save}
        style={{ width: "100%", fontSize: 13, color: "#374151", padding: "6px 8px", border: "1px solid #3b82f6", borderRadius: 5, outline: "none", fontFamily: "Georgia, serif", background: "#eff6ff" }} />;
};

// ─── SPEC DOCUMENT ───────────────────────────────────────────────────────────
function SpecDoc({ spec, onUpdate, validated, onValidate }) {
  const m = MAT[spec.niveau_maturite] || MAT.moyen;
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const upd = (field) => (val) => onUpdate({ ...spec, [field]: val });
  const updArr = (field, i) => (val) => {
    const arr = [...(spec[field] || [])];
    arr[i] = val;
    onUpdate({ ...spec, [field]: arr });
  };

  const Section = ({ num, title, editable = true, children, noBorder = false }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 6, borderBottom: noBorder ? "none" : "1px solid #e5e7eb" }}>
        <span style={{ background: validated ? "#1e3a5f" : "#2563eb", color: "white", width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, fontFamily: "sans-serif" }}>{num}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em", fontFamily: "sans-serif" }}>{title}</span>
        {editable && !validated && <span style={{ fontSize: 10, color: "#93c5fd", fontFamily: "sans-serif" }}>— éditable</span>}
      </div>
      {children}
    </div>
  );

  return (
    <div id="spec-doc" style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid #dbeafe", maxWidth: 700, boxShadow: "0 4px 24px rgba(37,99,235,0.07)" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)", padding: "28px 32px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 8, fontFamily: "sans-serif" }}>
          Spécification Fonctionnelle — Version 1.0
        </div>
        <div style={{ fontSize: 21, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 6, letterSpacing: "-0.02em" }}>
          {spec.titre_projet || "Titre du projet"}
        </div>
        <div style={{ fontSize: 11, color: "#93c5fd", fontFamily: "sans-serif", marginBottom: 20 }}>
          À destination du pôle Transformation &amp; Technologie
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px 24px" }}>
          {[
            ["Demandeur", spec.prenom_nom],
            ["Département", spec.departement],
            ["Email", spec.email],
            ["Date", today],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 9, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "sans-serif", marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 12, color: "#dbeafe", fontFamily: "sans-serif" }}>{v || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bandeau validation */}
      {!validated ? (
        <div style={{ background: "#fffbeb", borderLeft: "4px solid #f59e0b", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16 }}>✏️</span>
          <div style={{ flex: 1, fontSize: 12, color: "#92400e", fontFamily: "sans-serif", lineHeight: 1.5 }}>
            <strong>Relecture requise</strong> — Vérifiez et corrigez les informations ci-dessous avant validation. Cliquez sur un champ pour l'éditer.
          </div>
          <button onClick={onValidate} style={{ background: "#1e3a5f", color: "white", border: "none", padding: "9px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
            ✓ Valider le document
          </button>
        </div>
      ) : (
        <div style={{ background: "#ecfdf5", borderLeft: "4px solid #059669", padding: "12px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 12, color: "#065f46", fontFamily: "sans-serif", fontWeight: 600 }}>Document validé — prêt à être transmis au pôle Transformation &amp; Technologie</span>
        </div>
      )}

      {/* Maturité */}
      <div style={{ background: m.bg, borderLeft: `4px solid ${m.color}`, borderTop: `1px solid ${m.border}`, padding: "12px 28px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: m.color, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
            Maturité du besoin : {m.label}
          </div>
          <div style={{ fontSize: 12, color: m.color, fontFamily: "sans-serif", opacity: 0.85 }}>{m.desc}</div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: "24px 32px" }}>

        {/* 1. Contexte */}
        <Section num="1" title="Contexte">
          {validated
            ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.contexte}</p>
            : <EditableField value={spec.contexte} onChange={upd("contexte")} multiline placeholder="Ce qui pousse le demandeur à faire sa demande, fréquence et impact..." />
          }
        </Section>

        {/* 2. Périmètre */}
        <Section num="2" title="Périmètre du besoin">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "sans-serif" }}>Besoin exprimé</div>
            {validated
              ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.perimetre_besoin}</p>
              : <EditableField value={spec.perimetre_besoin} onChange={upd("perimetre_besoin")} multiline placeholder="Ce que le demandeur souhaite obtenir..." />
            }
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "sans-serif" }}>Personnes & équipes impactées</div>
            {validated
              ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.personnes_impactees}</p>
              : <EditableField value={spec.personnes_impactees} onChange={upd("personnes_impactees")} placeholder="Équipes et utilisateurs concernés..." />
            }
          </div>
        </Section>

        {/* 3. Process actuel */}
        <Section num="3" title="Process actuel">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "sans-serif" }}>Fonctionnement actuel</div>
            {validated
              ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.process_actuel || "Aucun process existant identifié."}</p>
              : <EditableField value={spec.process_actuel} onChange={upd("process_actuel")} multiline placeholder="Comment les choses fonctionnent aujourd'hui..." />
            }
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "sans-serif" }}>Perte si non développé</div>
            {validated
              ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.perte_si_non_developpe}</p>
              : <EditableField value={spec.perte_si_non_developpe} onChange={upd("perte_si_non_developpe")} multiline placeholder="Conséquences concrètes si ce besoin n'est pas traité..." />
            }
          </div>
        </Section>

        {/* 4. ROI */}
        <Section num="4" title="Retour sur investissement attendu">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "sans-serif" }}>ROI mesurable</div>
            {validated
              ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.roi}</p>
              : <EditableField value={spec.roi} onChange={upd("roi")} multiline placeholder="Gains attendus, chiffrés si possible..." />
            }
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "sans-serif" }}>Critères de réussite</div>
            {validated
              ? <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.75, margin: 0 }}>{spec.criteres_succes}</p>
              : <EditableField value={spec.criteres_succes} onChange={upd("criteres_succes")} multiline placeholder="Comment évaluerons-nous que c'est réussi..." />
            }
          </div>
        </Section>

        {/* 5. Contraintes */}
        {spec.contraintes?.length > 0 && (
          <Section num="5" title="Contraintes & Dépendances">
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {spec.contraintes.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#d97706", fontWeight: 700, flexShrink: 0, marginTop: 2, fontFamily: "sans-serif" }}>⚠</span>
                  {validated
                    ? <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{c}</span>
                    : <div style={{ flex: 1 }}><EditableField value={c} onChange={updArr("contraintes", i)} /></div>
                  }
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 6. Questions ouvertes */}
        {(spec.questions_ouvertes?.length > 0 || !validated) && (
          <Section num="6" title="Questions ouvertes — Atelier de cadrage">
            <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, color: "#92400e", fontFamily: "sans-serif", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Points à résoudre avant tout engagement projet
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Questions IA — toujours en lecture seule */}
                {spec.questions_ouvertes?.map((q, i) => (
                  <div key={`ia-${i}`} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ background: "#2563eb", color: "white", width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, fontFamily: "sans-serif" }}>{i+1}</span>
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, flex: 1 }}>{q}</span>
                  </div>
                ))}

                {/* Questions ajoutées par le demandeur — éditables */}
                {(spec.questions_demandeur || []).map((q, i) => (
                  <div key={`user-${i}`} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ background: "#7c3aed", color: "white", width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, fontFamily: "sans-serif" }}>+{i+1}</span>
                    {validated
                      ? <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{q}</span>
                      : <div style={{ flex: 1, display: "flex", gap: 6 }}>
                          <div style={{ flex: 1 }}>
                            <EditableField value={q} onChange={(val) => {
                              const arr = [...(spec.questions_demandeur || [])];
                              arr[i] = val;
                              onUpdate({ ...spec, questions_demandeur: arr });
                            }} placeholder="Votre question..." />
                          </div>
                          <button onClick={() => {
                            const arr = (spec.questions_demandeur || []).filter((_, j) => j !== i);
                            onUpdate({ ...spec, questions_demandeur: arr });
                          }} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 16, padding: "0 4px", flexShrink: 0 }}>✕</button>
                        </div>
                    }
                  </div>
                ))}

                {/* Bouton ajouter une question — uniquement avant validation */}
                {!validated && (
                  <button onClick={() => {
                    const arr = [...(spec.questions_demandeur || []), ""];
                    onUpdate({ ...spec, questions_demandeur: arr });
                  }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px dashed #d97706", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12, color: "#92400e", fontFamily: "sans-serif", marginTop: 4, alignSelf: "flex-start" }}>
                    <span style={{ fontSize: 14 }}>+</span> Ajouter une question
                  </button>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* 7. Recommandation BA — non éditable */}
        {spec.recommandation_ba && (
          <Section num="7" title="Recommandation BA" editable={false}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "14px 20px", position: "relative" }}>
              <div style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif" }}>non éditable</div>
              <p style={{ fontSize: 13, color: "#14532d", lineHeight: 1.75, margin: 0 }}>{spec.recommandation_ba}</p>
            </div>
          </Section>
        )}

      </div>

      <div style={{ padding: "12px 32px", background: "#f8faff", borderTop: "1px solid #dbeafe", textAlign: "center", fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif" }}>
        Agent Spec IA — Pôle Transformation &amp; Technologie · Document à valider avant transmission
      </div>
    </div>
  );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const labels = ["", "Insuffisant", "Passable", "Correct", "Bien", "Excellent"];

  if (sent) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: "white", borderRadius: 16, padding: "40px 32px", maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8, fontFamily: "sans-serif" }}>Merci pour votre retour !</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, fontFamily: "sans-serif", lineHeight: 1.5 }}>Votre feedback nous aide à améliorer l'agent pour mieux répondre aux besoins du pôle métier.</div>
        <button onClick={onClose} style={{ background: "#1e3a5f", color: "white", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>Fermer</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: "white", borderRadius: 16, padding: "32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", fontFamily: "sans-serif", marginBottom: 4 }}>Évaluer cet entretien</div>
            <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "sans-serif" }}>Votre retour nous aide à améliorer l'agent</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>✕</button>
        </div>

        {/* Étoiles */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
              style={{ fontSize: 32, cursor: "pointer", transition: "transform 0.1s", transform: (hover || rating) >= s ? "scale(1.15)" : "scale(1)" }}>
              {(hover || rating) >= s ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        {(hover || rating) > 0 && (
          <div style={{ textAlign: "center", fontSize: 13, color: "#2563eb", fontWeight: 600, fontFamily: "sans-serif", marginBottom: 16 }}>{labels[hover || rating]}</div>
        )}

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            "Les questions posées étaient pertinentes",
            "Le document généré reflète bien mon besoin",
            "Je referai appel à cet agent pour une prochaine demande",
          ].map((q, i) => {
            const [v, setV] = useState(null);
            return (
              <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#374151", fontFamily: "sans-serif", flex: 1 }}>{q}</span>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {["👍", "👎"].map(e => (
                    <span key={e} onClick={() => setV(e)} style={{ fontSize: 18, cursor: "pointer", opacity: v && v !== e ? 0.3 : 1, transition: "opacity 0.15s" }}>{e}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Un commentaire libre ? (optionnel)" rows={3}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "sans-serif", resize: "none", outline: "none", color: "#374151", marginBottom: 16 }} />

        <button onClick={() => setSent(true)} disabled={rating === 0}
          style={{ width: "100%", background: rating > 0 ? "#1e3a5f" : "#e5e7eb", color: rating > 0 ? "white" : "#9ca3af", border: "none", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: rating > 0 ? "pointer" : "default", fontFamily: "sans-serif", transition: "background 0.15s" }}>
          Envoyer mon évaluation
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AgentSpecV3() {
  const [phase, setPhase] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState(null);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [readyToGenerate, setReadyToGenerate] = useState(false); // NEW: shows generate button
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, spec]);

  const callClaude = async (msgs, maxTokens = 800) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system: SYSTEM_PROMPT, messages: msgs })
    });
    if (!res.ok) throw new Error(`Erreur API ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  };

  const generateSpec = async () => {
    const msgs = [...history, { role: "user", content: "/générer" }];
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SYSTEM_PROMPT + "\n\nL'utilisateur demande la génération maintenant. Retourne UNIQUEMENT le bloc ###SPEC### suivi du JSON complet et valide. Aucun texte avant ni après. Ne jamais halluciner — utilise uniquement les informations données pendant l'entretien.",
        messages: msgs
      })
    });
    if (!res.ok) throw new Error(`Erreur API ${res.status}`);
    const data = await res.json();
    return data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  };

  const parseSpec = (reply) => {
    if (!reply.includes("###SPEC###")) return null;
    const after = reply.split("###SPEC###")[1]?.trim() || "";
    const start = after.indexOf("{");
    const end = after.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(after.slice(start, end + 1));
  };

  const start = async () => {
    setPhase("chat"); setLoading(true); setError(null);
    try {
      const init = [{ role: "user", content: "Bonjour, je souhaite soumettre une demande au pôle Transformation & Technologie." }];
      const reply = await callClaude(init, 400);
      setHistory([...init, { role: "assistant", content: reply }]);
      setMessages([{ role: "assistant", content: reply }]);
    } catch (e) { setError("Connexion impossible. Réessaie."); setPhase("landing"); }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const triggerGenerate = async () => {
    setLoading(true); setError(null);
    setMessages(prev => [...prev, { role: "assistant", content: "⏳ Génération de votre spécification en cours, merci de patienter..." }]);
    try {
      const reply = await generateSpec();
      const parsed = parseSpec(reply);
      if (parsed) {
        setSpec(parsed);
        setPhase("done");
        setReadyToGenerate(false);
        setMessages(prev => {
          const filtered = prev.filter(m => !m.content.includes("⏳"));
          return [...filtered, { role: "assistant", content: "✅ Votre spécification a été générée. Veuillez la relire et la valider avant transmission." }];
        });
      } else {
        setMessages(prev => {
          const filtered = prev.filter(m => !m.content.includes("⏳"));
          return [...filtered, { role: "assistant", content: "Une erreur est survenue lors de la génération. Réessayez." }];
        });
      }
    } catch (e) {
      setError(`Erreur : ${e.message}`);
      setMessages(prev => prev.filter(m => !m.content.includes("⏳")));
    }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    const isGen = ["/générer", "/generer", "générer", "generer"].includes(txt.toLowerCase().trim());
    const newMsgs = [...messages, { role: "user", content: txt }];
    const newHist = [...history, { role: "user", content: txt }];
    setMessages(newMsgs);
    setLoading(true); setError(null);
    try {
      if (isGen) {
        await triggerGenerate();
        return;
      } else {
        const reply = await callClaude(newHist, 800);
        if (reply.includes("###FIN###")) {
          // Interview complete — show generate button
          const cleanReply = reply.replace("###FIN###", "").trim();
          const displayMsg = cleanReply || "Merci pour toutes ces informations. Votre dossier est complet.";
          setMessages([...newMsgs, { role: "assistant", content: displayMsg }]);
          setHistory([...newHist, { role: "assistant", content: displayMsg }]);
          setReadyToGenerate(true);
        } else if (reply.includes("###SPEC###")) {
          const parsed = parseSpec(reply);
          if (parsed) {
            setSpec(parsed);
            setPhase("done");
            setReadyToGenerate(false);
            setMessages([...newMsgs, { role: "assistant", content: "✅ Votre spécification a été générée. Veuillez la relire et la valider avant transmission." }]);
          }
        } else {
          setMessages([...newMsgs, { role: "assistant", content: reply }]);
          setHistory([...newHist, { role: "assistant", content: reply }]);
        }
      }
    } catch (e) {
      setError(`Erreur : ${e.message}`);
      setMessages(newMsgs);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const reset = () => { setPhase("landing"); setMessages([]); setHistory([]); setSpec(null); setValidated(false); setInput(""); setError(null); setReadyToGenerate(false); };

  const handleValidate = () => {
    setValidated(true);
  };

  const downloadPDF = () => {
    const el = document.getElementById("spec-doc");
    if (!el) return;
    // Clone and clean for print (remove edit hints, dashed borders)
    const clone = el.cloneNode(true);
    // Remove editable hints
    clone.querySelectorAll('[style*="dashed"]').forEach(n => n.style.border = "none");

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${spec?.titre_projet || "Specification Fonctionnelle"}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;background:white;padding:32px;color:#111}
  @page{margin:20mm}
  @media print{body{padding:0}}
  h1,h2,h3,div{font-family:inherit}
</style>
</head><body>${clone.outerHTML}</body></html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Spec_${(spec?.titre_projet || "fonctionnelle").replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`*{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} textarea:focus,input:focus{outline:none}`}</style>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      {/* Header */}
      <div style={{ background: "#1e3a5f", padding: "15px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: phase === "chat" ? "#4ade80" : "#475569", boxShadow: phase === "chat" ? "0 0 8px #4ade80" : "none", transition: "all 0.3s" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>Agent Spec IA</div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Pôle Transformation & Technologie</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {phase === "done" && <button onClick={() => setShowFeedback(true)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#93c5fd", fontSize: 12, padding: "7px 14px", borderRadius: 7, cursor: "pointer" }}>💬 Feedback</button>}
          {phase !== "landing" && <button onClick={reset} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 12, padding: "7px 14px", borderRadius: 7, cursor: "pointer" }}>↺ Nouveau</button>}
        </div>
      </div>

      {/* LANDING */}
      {phase === "landing" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 500, width: "100%", animation: "fadeUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>📋</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                Soumettez votre besoin au pôle<br/><span style={{ color: "#2563eb" }}>Transformation & Technologie</span>
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 auto", maxWidth: 400 }}>
                Un agent BA vous guide avec les bonnes questions pour produire une première ébauche de spécification fonctionnelle en 10 minutes.
              </p>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>{error}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
              {[
                ["🎯", "Entretien guidé", "Questions ciblées pour structurer votre besoin, même s'il est peu défini."],
                ["✏️", "Document éditable", "Relisez et corrigez la spécification générée avant de la valider."],
                ["📄", "Téléchargement PDF", "Exportez le document finalisé à destination du pôle T&T."],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 12, background: "white", border: "1px solid #dbeafe", borderRadius: 10, padding: "11px 15px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 1 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={start}
              style={{ width: "100%", background: "#1e3a5f", color: "white", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.target.style.background = "#2563eb"}
              onMouseLeave={e => e.target.style.background = "#1e3a5f"}>
              Démarrer l'entretien →
            </button>
          </div>
        </div>
      )}

      {/* CHAT + DONE */}
      {(phase === "chat" || phase === "done") && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px" }}>
            <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.2s ease" }}>
                  <div style={{
                    maxWidth: "80%",
                    background: msg.role === "user" ? "#1e3a5f" : "white",
                    color: msg.role === "user" ? "white" : "#111827",
                    padding: "11px 16px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    fontSize: 14, lineHeight: 1.65, border: msg.role === "user" ? "none" : "1px solid #dbeafe",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap"
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex" }}>
                  <div style={{ background: "white", border: "1px solid #dbeafe", borderRadius: "14px 14px 14px 4px", padding: "4px 12px" }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              {phase === "done" && spec && (
                <div style={{ animation: "fadeUp 0.4s ease" }}>
                  <SpecDoc spec={spec} onUpdate={setSpec} validated={validated} onValidate={handleValidate} />
                  {validated && (
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      <button onClick={downloadPDF} style={{ flex: 1, minWidth: 180, background: "#1e3a5f", color: "white", border: "none", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => e.target.style.background = "#2563eb"}
                        onMouseLeave={e => e.target.style.background = "#1e3a5f"}>
                        ⬇ Télécharger le document
                      </button>
                      <button onClick={() => setShowFeedback(true)} style={{ background: "white", color: "#1e3a5f", border: "1px solid #dbeafe", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                        💬 Faire un feedback
                      </button>
                      <button onClick={reset} style={{ background: "white", color: "#6b7280", border: "1px solid #e5e7eb", padding: "13px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
                        ↺ Nouvel entretien
                      </button>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#dc2626" }}>
                  ⚠️ {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {phase === "chat" && (
            <div style={{ background: "white", borderTop: "1px solid #dbeafe", padding: "14px 16px", flexShrink: 0 }}>
              <div style={{ maxWidth: 740, margin: "0 auto" }}>
                {/* Bouton Générer — affiché quand l'entretien est terminé */}
                {readyToGenerate && !loading && (
                  <div style={{ marginBottom: 12, animation: "fadeUp 0.3s ease" }}>
                    <button onClick={triggerGenerate}
                      style={{ width: "100%", background: "linear-gradient(135deg, #1e3a5f, #2563eb)", color: "white", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                      <span style={{ fontSize: 18 }}>📋</span>
                      Générer ma spécification fonctionnelle
                    </button>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6, textAlign: "center" }}>
                      Vous pouvez aussi continuer à préciser des informations avant de générer
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <textarea ref={inputRef} value={input}
                    onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                    onKeyDown={handleKey} placeholder={readyToGenerate ? "Précisions supplémentaires ? (optionnel)" : "Votre réponse... (Entrée pour envoyer)"} rows={1} disabled={loading}
                    style={{ flex: 1, border: "1px solid #dbeafe", borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "sans-serif", resize: "none", lineHeight: 1.5, background: "#f8faff", color: "#111827", minHeight: 44, maxHeight: 120, transition: "border-color 0.15s" }} />
                  <button onClick={send} disabled={!input.trim() || loading}
                    style={{ background: input.trim() && !loading ? "#2563eb" : "#e5e7eb", color: input.trim() && !loading ? "white" : "#9ca3af", border: "none", width: 44, height: 44, borderRadius: 10, cursor: input.trim() && !loading ? "pointer" : "default", fontSize: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                    →
                  </button>
                </div>
                {!readyToGenerate && (
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 7, textAlign: "center" }}>
                    Tapez <strong>/générer</strong> à tout moment pour produire la spécification
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
