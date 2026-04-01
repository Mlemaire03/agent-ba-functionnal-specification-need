// api/feedback-entretien.js — Envoie les feedbacks entretien vers Airtable

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiToken || !baseId) {
    return res.status(500).json({ error: 'Configuration Airtable manquante' });
  }

  const {
    nom,
    departement,
    titreProjet,
    date,
    questionsPertinentes,
    specSatisfaisante,
    pointAmeliorer,
    feraitAppel,
    noteSatisfaction,
    commentaire
  } = req.body;

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/Feedbacks%20entretien`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Nom': nom || '—',
            'Département': departement || '—',
            'Titre projet': titreProjet || '—',
            'Date': date || new Date().toLocaleDateString('fr-FR'),
            'Questions pertinentes': questionsPertinentes || '—',
            'Spec satisfaisante': specSatisfaisante || '—',
            'Point à améliorer': pointAmeliorer || '',
            'Ferait appel à Grace': feraitAppel || '—',
            'Note satisfaction': noteSatisfaction || 0,
            'Commentaire': commentaire || '',
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Airtable error:', data);
      return res.status(500).json({ error: data.error?.message || 'Erreur Airtable' });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error('Feedback entretien error:', err);
    return res.status(500).json({ error: err.message });
  }
};
