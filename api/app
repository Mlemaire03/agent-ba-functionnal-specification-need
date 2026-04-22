import { useState, useRef, useEffect } from "react";

// ─── SYSTEM PROMPT — BONGENIE ENRICHI ───────────────────────────────────────
// ─── SYSTEM PROMPT — GRACE CONVERSATIONNEL ──────────────────────────────────
const SYSTEM_PROMPT = `Tu es Grace, Business Analyst senior rattachée au pôle Transformation & Technologie de Bongenie. Tu as 15 ans d'expérience en transformation digitale retail et IT. Tu es reconnue pour ta capacité à aider les équipes métier à formaliser leurs besoins de façon claire et exploitable.

Aujourd'hui tu joues le rôle de BA qui accompagne un demandeur métier dans la première phase de recueil de son besoin fonctionnel. Ton objectif est de produire, au terme de la conversation, une spécification fonctionnelle V1 complète à destination du pôle T&T.

═══════════════════════════════
CONTEXTE BONGENIE — À UTILISER ACTIVEMENT
═══════════════════════════════

DÉPARTEMENTS ET MISSIONS :
- Transformation & Technologie (T&T) : IT applicatif, infra, BA, chefs de projet, DSI. Destinataire de toutes les specs.
- Commercial : e-commerce, omnicanalité, acheteurs, data analyst. Pilotage de l'offre et du CA.
- Marketing : pôle créatif offline, CRM, Traffic Manager, copywriting, trade marketing, événementiel.
- Logistique : flux produits, enrichissements e-commerce, expédition, réassort.
- Finance : comptabilité, service clients, payroll.
- Direction, RH, Forces de vente (magasin, restauration).

STACK SI :
Architecture centrale :
- Business Central : ERP cœur — prix, stocks, commandes, clients, autorisations (FAC, KDO, CBRW, VOUCHER). Montée de version dès mai 2026.
- ESB : bus d'intégration — orchestre les flux entre outils. Impliqué uniquement si plusieurs outils communiquent entre eux.
- Sylius : moteur e-commerce. Montée de version majeure avril–septembre 2026.

Produit & Contenu :
- Akeneo : PIM — données produit froides. Enrichissement mutuel avec Keepeek.
- Bee App : génération contenu produit IA → alimente Akeneo.
- Keepeek : Data Asset Management — assets marketing.
- Middleware : transformation et archivage data produit et médias.
- Sanity : CMS / Content — menus, home pages, landing pages, contenu personnalisé.
- Lokalise : traductions.

E-commerce & Merchandising :
- Attraqt : Merchandising / Searchandising — ranking produits, recommandations, résultats de recherche.
- Channable : product feed management.
- Redirection.io : gestion des redirections URL.
- Optimi : Content Delivery Network.
- Bridge : Store Locator — infos magasins, horaires.

CRM & Communication :
- Salesforce : CRM — emails transactionnels, préférences, wallet.
- Captain Wallet : Mobile Wallet.
- Postman : Emulation & Testing.

Paiement & Finance :
- Safepay : paiement + 3D Secure.
- CRIF : solvency check.

Monitoring & Infrastructure :
- New Relic : monitoring.
- Azure : Blob Storage.
- Clarity : Heatmaps & Sessions.
- Smart Tribune : FAQ dynamique.

Pricing :
- ODR (Offre De Remise) : fichier gestion des prix rouges.
- 603 : site e-commerce full price.
- 605 : site e-commerce outlet.

RÈGLES DE DÉPENDANCES SI :
- Besoin touchant prix, stocks, commandes, clients → Business Central.
- Besoin e-commerce front, tunnel d'achat, compte client → Sylius.
- Besoin catalogue produit, enrichissement → Akeneo, Keepeek, Bee App.
- Besoin contenu, pages, CMS → Sanity.
- Besoin CRM, email, fidélité → Salesforce.
- Besoin merchandising, recherche → Attraqt.
- Besoin multi-outils → ESB impliqué — complexité accrue.
- L'ESB n'est pas systématiquement impliqué — uniquement si flux inter-systèmes.

PROJETS STRUCTURANTS 2026 :
- Restructuration organisationnelle : Q1 2026 (en cours).
- Montée de version Sylius : avril–septembre 2026 ⚠️
- Montée de version ERP (Business Central) : dès mai 2026 ⚠️
→ Toute deadline entre avril et septembre 2026 est potentiellement en conflit. À signaler explicitement quand la deadline est mentionnée — pas avant.

VOCABULAIRE INTERNE :
- Prix noir : prix plein (sans remise).
- Prix rouge : prix remisé.
- ODR : Offre De Remise — fichier gestion des prix rouges.
- 603 : site full price. 605 : site outlet.
- T&T : pôle Transformation & Technologie.
- PLP : Product Listing Page. PDP : Product Detail Page.

═══════════════════════════════
TON RÔLE ET TA POSTURE
═══════════════════════════════

Tu es un BA senior, pas un formulaire. Tu mènes une vraie conversation :
- Tu accueilles chaleureusement le demandeur et l'invites à te décrire son besoin librement.
- Tu écoutes, reformules ce que tu as compris, et confirmes avant d'aller plus loin.
- Tu creuses les zones floues avec des questions ciblées — une seule à la fois.
- Tu ne suis pas une liste de questions dans l'ordre : tu t'adaptes à ce que le métier exprime.
- Tu utilises le contexte Bongenie pour poser des questions pertinentes et anticiper les dépendances SI.
- Tu valides chaque information importante avant de continuer.
- Ton ton est professionnel, bienveillant et direct — jamais condescendant.
- Tu travailles exclusivement en français.
- Tu ne poses jamais deux questions dans le même message.
- Si le demandeur aborde plusieurs thèmes en une réponse, tu en prends note et tu creuses uniquement ce qui reste flou.

INFORMATIONS À COLLECTER au fil de la conversation (dans n'importe quel ordre) :
- Identité : prénom, nom, département.
- Besoin exprimé librement — tu le reformules pour valider.
- Type de demande : évolution outil existant / évolution processus métier / nouvel outil.
- Outils SI concernés si connus.
- Utilisateurs et équipes impactés.
- Situation actuelle — comment ça fonctionne aujourd'hui.
- Fréquence du problème ou besoin.
- Impact si non traité.
- Exigences non négociables (must-have).
- Contraintes : budget, technique, réglementaire, dépendances.
- KPIs identifiés à ce stade.
- Critères de succès de la livraison.
- ROI attendu — même estimatif.
- Deadline souhaitée — avec exemple concret (COMEX, opération commerciale).
- Informations complémentaires éventuelles.

═══════════════════════════════
DÉTECTION DE FIN D'ENTRETIEN
═══════════════════════════════

Quand tu estimes avoir collecté suffisamment d'informations pour produire une spec V1 exploitable, propose naturellement de clore :
"Je pense avoir une bonne compréhension de votre besoin. Souhaitez-vous ajouter quelque chose avant que je génère la spécification ?"

Si le demandeur confirme ou n'a rien à ajouter, envoie UNIQUEMENT :
###FIN###

Si le demandeur envoie "/générer", génère directement la spec sans attendre.

═══════════════════════════════
GÉNÉRATION DE LA SPÉCIFICATION
═══════════════════════════════

Retourne UNIQUEMENT le JSON suivant précédé de ###SPEC### sur une ligne seule, sans aucun texte avant ni après :

###SPEC###
{"prenom_nom":"","departement":"","type_besoin":"","titre_projet":"","contexte":"","perimetre_besoin":"","personnes_impactees":"","process_actuel":"","perte_si_non_developpe":"","roi":"","criteres_succes":"","contraintes":[],"questions_ouvertes":[],"questions_demandeur":[],"recommandation_ba":"","niveau_maturite":"moyen","prochaine_etape":""}

RÈGLES DE GÉNÉRATION :
- Ne jamais inventer — uniquement ce qui a été dit pendant la conversation.
- Si une information n'a pas été abordée : "Non spécifié par le demandeur".
- Tous les champs commencent par une majuscule.
- titre_projet : 5 à 8 mots, synthétique et professionnel.
- contexte : synthèse narrative — ce qui pousse le demandeur + fréquence + impact.
- perimetre_besoin : le besoin exprimé en phrases claires.
- contraintes : inclure explicitement les conflits Sylius/ERP si la deadline le justifie.
- questions_ouvertes : 5 à 8 questions précises, contextualisées Bongenie, actionnables en atelier de cadrage. Révèlent ce que le métier n'a pas su exprimer.
- recommandation_ba : évaluation professionnelle — maturité, risques SI et organisationnels, prochaine étape. Non éditable.
- niveau_maturite : "faible" / "moyen" / "élevé" selon clarté du besoin, complétude des exigences, mesurabilité.
- questions_demandeur : tableau vide [] — sera rempli par le demandeur dans l'interface.`;

// ─── TYPING INDICATOR ────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 4px" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#b8963e", animation: "blink 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />
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
      onMouseEnter={e => e.currentTarget.style.borderColor = "#b8963e"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
      {val || placeholder || "Cliquer pour éditer..."}
      <span style={{ fontSize: 10, color: "#b8963e", marginLeft: 6, fontFamily: "sans-serif" }}>✏️</span>
    </div>
  );

  return multiline
    ? <textarea ref={ref} value={val} onChange={e => setVal(e.target.value)} onBlur={save}
        style={{ width: "100%", fontSize: 13, color: "#374151", lineHeight: 1.65, padding: "6px 8px", border: "1px solid #3b82f6", borderRadius: 5, outline: "none", resize: "vertical", fontFamily: "Georgia, serif", minHeight: 80, background: "#eff6ff" }} />
    : <input ref={ref} value={val} onChange={e => setVal(e.target.value)} onBlur={save}
        style={{ width: "100%", fontSize: 13, color: "#374151", padding: "6px 8px", border: "1px solid #3b82f6", borderRadius: 5, outline: "none", fontFamily: "Georgia, serif", background: "#eff6ff" }} />;
};

// ─── SPEC DOCUMENT ───────────────────────────────────────────────────────────
function SpecDoc({ spec, onUpdate, validated, onValidate, onUnvalidate }) {
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
        <span style={{ background: "#1a3a2a", color: "white", width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, fontFamily: "sans-serif" }}>{num}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em", fontFamily: "sans-serif" }}>{title}</span>
        {editable && !validated && <span style={{ fontSize: 10, color: "#b8963e", fontFamily: "sans-serif" }}>— éditable</span>}
      </div>
      {children}
    </div>
  );

  return (
    <div id="spec-doc" style={{ background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid #e8f0eb", maxWidth: 700, boxShadow: "0 4px 24px rgba(37,99,235,0.07)" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a40 100%)", padding: "28px 32px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8963e", marginBottom: 8, fontFamily: "sans-serif" }}>
          Spécification Fonctionnelle — Version 1.0
        </div>
        <div style={{ fontSize: 21, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 6, letterSpacing: "-0.02em" }}>
          {spec.titre_projet || "Titre du projet"}
        </div>
        <div style={{ fontSize: 11, color: "#b8963e", fontFamily: "sans-serif", marginBottom: 20 }}>
          À destination du pôle Transformation &amp; Technologie
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px 24px" }}>
          {[
            ["Demandeur", spec.prenom_nom],
            ["Département", spec.departement],
            ["Date", today],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 9, color: "#d4a820", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "sans-serif", marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 12, color: "#e8f0eb", fontFamily: "sans-serif" }}>{v || "—"}</div>
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
          <button onClick={onValidate} style={{ background: "#1a3a2a", color: "white", border: "none", padding: "9px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
            ✓ Valider le document
          </button>
        </div>
      ) : (
        <div style={{ background: "#ecfdf5", borderLeft: "4px solid #059669", padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ flex: 1, fontSize: 12, color: "#065f46", fontFamily: "sans-serif", fontWeight: 600 }}>Document validé — prêt à être transmis au pôle Transformation &amp; Technologie</span>
          <button onClick={onUnvalidate} style={{ background: "transparent", color: "#065f46", border: "1px solid #059669", padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
            ✏️ Revenir en mode édition
          </button>
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
                    <span style={{ background: "#1a3a2a", color: "white", width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, fontFamily: "sans-serif" }}>{i+1}</span>
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

      <div style={{ padding: "12px 32px", background: "#f7f5f1", borderTop: "1px solid #e8f0eb", textAlign: "center", fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif" }}>
        Grace · Définition du besoin — Pôle Transformation &amp; Technologie · Document à valider avant transmission
      </div>
    </div>
  );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({ onClose, spec }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [questionsPertinentes, setQuestionsPertinentes] = useState(null);
  const [specSatisfaisante, setSpecSatisfaisante] = useState(null);
  const [pointAmeliorer, setPointAmeliorer] = useState("");
  const [feraitAppel, setFeraitAppel] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const labels = ["", "Insuffisant", "Passable", "Correct", "Bien", "Excellent"];

  const canSubmit = rating > 0;

  const submit = async () => {
    if (!canSubmit || sending) return;
    setSending(true); setError(null);
    try {
      const res = await fetch("/api/feedback-entretien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: spec?.prenom_nom || "—",
          departement: spec?.departement || "—",
          titreProjet: spec?.titre_projet || "—",
          date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
          questionsPertinentes: questionsPertinentes || "Non répondu",
          specSatisfaisante: specSatisfaisante || "Non répondu",
          pointAmeliorer: pointAmeliorer || "",
          feraitAppel: feraitAppel || "Non répondu",
          noteSatisfaction: rating,
          commentaire: commentaire || "",
        })
      });
      const data = await res.json();
      if (data.success) { setSent(true); }
      else { setError("Erreur lors de l'envoi. Réessayez."); }
    } catch (e) {
      setError("Erreur réseau. Réessayez.");
    }
    setSending(false);
  };

  const YesNo = ({ value, onChange }) => (
    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
      {[["Oui", "👍"], ["Non", "👎"]].map(([label, emoji]) => (
        <span key={label} onClick={() => onChange(label)}
          style={{ fontSize: 20, cursor: "pointer", opacity: value && value !== label ? 0.25 : 1, transition: "opacity 0.15s" }}>
          {emoji}
        </span>
      ))}
    </div>
  );

  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 };
  const modal = { background: "white", borderRadius: 12, padding: "28px 28px 24px", maxWidth: 460, width: "100%", maxHeight: "90vh", overflowY: "auto" };

  if (sent) return (
    <div style={overlay}>
      <div style={{ ...modal, textAlign: "center", padding: "40px 32px" }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🙏</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 8, fontFamily: "sans-serif" }}>Merci pour votre retour !</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, fontFamily: "sans-serif", lineHeight: 1.6 }}>Votre évaluation a bien été enregistrée et sera exploitée par le pôle T&T.</div>
        <button onClick={onClose} style={{ background: "#1a3a2a", color: "white", border: "none", padding: "10px 28px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>Fermer</button>
      </div>
    </div>
  );

  return (
    <div style={overlay}>
      <div style={modal}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#2d5a40", fontFamily: "sans-serif", marginBottom: 4 }}>Grace — Définition du besoin</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111827", fontFamily: "sans-serif" }}>Évaluer cet entretien</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af", flexShrink: 0 }}>✕</button>
        </div>

        {/* Q1 — questions pertinentes */}
        <div style={{ background: "#f7f5f1", borderRadius: 8, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#374151", fontFamily: "sans-serif", flex: 1, lineHeight: 1.5 }}>Les questions posées étaient-elles pertinentes ?</span>
          <YesNo value={questionsPertinentes} onChange={setQuestionsPertinentes} />
        </div>

        {/* Q2 — spec satisfaisante */}
        <div style={{ background: "#f7f5f1", borderRadius: 8, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#374151", fontFamily: "sans-serif", flex: 1, lineHeight: 1.5 }}>La spécification fonctionnelle vous semble-t-elle satisfaisante ?</span>
          <YesNo value={specSatisfaisante} onChange={setSpecSatisfaisante} />
        </div>

        {/* Q3 — point à améliorer */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: "#374151", fontFamily: "sans-serif", marginBottom: 6, lineHeight: 1.5 }}>Si vous deviez améliorer un point dans cet entretien, quel serait-il ?</div>
          <input value={pointAmeliorer} onChange={e => setPointAmeliorer(e.target.value)} placeholder="Optionnel — réponse courte"
            style={{ width: "100%", border: "1px solid #e8e0d3", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "sans-serif", outline: "none", color: "#374151", background: "#f7f5f1" }} />
        </div>

        {/* Q4 — ferait appel */}
        <div style={{ background: "#f7f5f1", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#374151", fontFamily: "sans-serif", flex: 1, lineHeight: 1.5 }}>Feriez-vous de nouveau appel à Grace pour définir votre besoin ?</span>
          <YesNo value={feraitAppel} onChange={setFeraitAppel} />
        </div>

        {/* Q5 — note étoiles */}
        <div style={{ borderTop: "1px solid #e8e0d3", paddingTop: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#374151", fontFamily: "sans-serif", marginBottom: 10 }}>Quel est votre niveau de satisfaction globale de cet entretien ?</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                style={{ fontSize: 28, cursor: "pointer", transition: "transform 0.1s", transform: (hover || rating) >= s ? "scale(1.1)" : "scale(1)" }}>
                {(hover || rating) >= s ? "⭐" : "☆"}
              </span>
            ))}
            {(hover || rating) > 0 && (
              <span style={{ fontSize: 13, color: "#2d5a40", fontWeight: 600, fontFamily: "sans-serif", marginLeft: 6 }}>{labels[hover || rating]}</span>
            )}
          </div>
        </div>

        {/* Commentaire libre */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#374151", fontFamily: "sans-serif", marginBottom: 6 }}>Commentaire libre <span style={{ color: "#9ca3af" }}>(optionnel)</span></div>
          <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)} placeholder="Un retour, une suggestion, quelque chose qui manquait…" rows={3}
            style={{ width: "100%", border: "1px solid #e8e0d3", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "sans-serif", resize: "none", outline: "none", color: "#374151", background: "#f7f5f1" }} />
        </div>

        {/* Note confidentialité */}
        <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>
          Ces données seront uniquement exploitées par le département T&T afin d'améliorer la qualité de ses services et répondre au mieux à vos besoins.
        </div>

        {error && <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 10, fontFamily: "sans-serif" }}>⚠️ {error}</div>}

        {/* Bouton envoi */}
        <button onClick={submit} disabled={!canSubmit || sending}
          style={{ width: "100%", background: canSubmit && !sending ? "#1a3a2a" : "#e5e7eb", color: canSubmit && !sending ? "white" : "#9ca3af", border: "none", padding: "12px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: canSubmit && !sending ? "pointer" : "default", fontFamily: "sans-serif", transition: "background 0.15s" }}>
          {sending ? "Envoi en cours…" : "Envoyer mon évaluation"}
        </button>
        {!canSubmit && <div style={{ fontSize: 11, color: "#b8963e", textAlign: "center", marginTop: 6, fontFamily: "sans-serif" }}>Veuillez attribuer une note étoile pour soumettre</div>}

      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GraceDefinitionBesoin() {
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
      const init = [{ role: "user", content: "Bonjour Grace, j'ai un besoin à te soumettre." }];
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
    <div style={{ minHeight: "100vh", background: "#f7f5f1", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`*{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} textarea:focus,input:focus{outline:none}`}</style>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} spec={spec} />}

      {/* Header */}
      <div style={{ background: "#1a3a2a", padding: "15px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: phase === "chat" ? "#4ade80" : "#475569", boxShadow: phase === "chat" ? "0 0 8px #4ade80" : "none", transition: "all 0.3s" }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 300, color: "#b8963e", letterSpacing: "0.14em", fontFamily: "Georgia, serif" }}>GRACE</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.18em" }}>Définition du besoin</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {phase === "done" && <button onClick={() => setShowFeedback(true)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#b8963e", fontSize: 12, padding: "7px 14px", borderRadius: 7, cursor: "pointer" }}>💬 Feedback</button>}
          {phase !== "landing" && <button onClick={reset} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 12, padding: "7px 14px", borderRadius: 7, cursor: "pointer" }}>↺ Nouveau</button>}
        </div>
      </div>

      {/* LANDING */}
      {phase === "landing" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#f7f5f1" }}>
          <div style={{ maxWidth: 500, width: "100%", animation: "fadeUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 300, color: "#1a3a2a", letterSpacing: "0.2em", marginBottom: 4 }}>GRACE</div>
              <div style={{ fontSize: 11, color: "#7a756e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>Définition du besoin</div>
              <div style={{ width: 40, height: 2, background: "#b8963e", margin: "0 auto 24px" }}></div>
              <p style={{ fontSize: 13, color: "#7a756e", lineHeight: 1.65, margin: "0 auto", maxWidth: 400 }}>
                Une conversation avec Grace, votre BA senior, pour structurer votre besoin et produire une première ébauche de spécification fonctionnelle à destination du pôle Transformation & Technologie.
              </p>
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, padding: "12px 16px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>{error}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[
                ["💬", "Conversation naturelle", "Exprimez votre besoin librement — Grace s'adapte à vous, pas l'inverse."],
                ["✏️", "Document éditable", "Relisez et corrigez la spécification générée avant de la valider."],
                ["📄", "Téléchargement", "Exportez le document finalisé à destination du pôle T&T."],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 12, background: "white", border: "1px solid #e8f0eb", borderLeft: "3px solid #b8963e", padding: "11px 15px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3a2a", marginBottom: 1 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#7a756e", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={start}
              style={{ width: "100%", background: "#1a3a2a", color: "white", border: "none", padding: "14px 24px", borderRadius: 2, fontSize: 13, fontWeight: 500, cursor: "pointer", letterSpacing: "0.08em", transition: "background 0.15s" }}
              onMouseEnter={e => e.target.style.background = "#2d5a40"}
              onMouseLeave={e => e.target.style.background = "#1a3a2a"}>
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
                    background: msg.role === "user" ? "#1a3a2a" : "white",
                    color: msg.role === "user" ? "white" : "#111827",
                    padding: "11px 16px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    fontSize: 14, lineHeight: 1.65, border: msg.role === "user" ? "none" : "1px solid #e8f0eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap"
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex" }}>
                  <div style={{ background: "white", border: "1px solid #e8f0eb", borderRadius: "14px 14px 14px 4px", padding: "4px 12px" }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              {phase === "done" && spec && (
                <div style={{ animation: "fadeUp 0.4s ease" }}>
                  <SpecDoc spec={spec} onUpdate={setSpec} validated={validated} onValidate={handleValidate} onUnvalidate={() => setValidated(false)} />
                  {validated && (
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      <button onClick={downloadPDF} style={{ flex: 1, minWidth: 180, background: "#1a3a2a", color: "white", border: "none", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => e.target.style.background = "#1a3a2a"}
                        onMouseLeave={e => e.target.style.background = "#1a3a2a"}>
                        ⬇ Télécharger le document
                      </button>
                      <button onClick={() => setShowFeedback(true)} style={{ background: "white", color: "#1a3a2a", border: "1px solid #e8f0eb", padding: "13px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
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
            <div style={{ background: "white", borderTop: "1px solid #e8f0eb", padding: "14px 16px", flexShrink: 0 }}>
              <div style={{ maxWidth: 740, margin: "0 auto" }}>
                {/* Bouton Générer — affiché quand l'entretien est terminé */}
                {readyToGenerate && !loading && (
                  <div style={{ marginBottom: 12, animation: "fadeUp 0.3s ease" }}>
                    <button onClick={triggerGenerate}
                      style={{ width: "100%", background: "linear-gradient(135deg, #1a3a2a, #2d5a40)", color: "white", border: "none", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
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
                    style={{ flex: 1, border: "1px solid #e8e0d3", borderRadius: 4, padding: "11px 14px", fontSize: 14, fontFamily: "sans-serif", resize: "none", lineHeight: 1.5, background: "#f7f5f1", color: "#111827", minHeight: 44, maxHeight: 120, transition: "border-color 0.15s" }} />
                  <button onClick={send} disabled={!input.trim() || loading}
                    style={{ background: input.trim() && !loading ? "#2d5a40" : "#e5e7eb", color: input.trim() && !loading ? "white" : "#9ca3af", border: "none", width: 44, height: 44, borderRadius: 10, cursor: input.trim() && !loading ? "pointer" : "default", fontSize: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                    →
                  </button>
                </div>
                {!readyToGenerate && (
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 7, textAlign: "center" }}>
                    Tapez <strong>/générer</strong> à tout moment pour produire la spécification — ou laissez Grace vous le proposer naturellement
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
