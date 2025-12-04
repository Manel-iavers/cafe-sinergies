export const config = {
  runtime: 'edge',
};

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await req.json();

    const fields = {
      Nom: data.nom,
      Cognoms: data.cognoms,
      Email: data.email,
      'Telèfon': data.telefon,
    };

    if (data.empresa) fields.Empresa = data.empresa;
    if (data.web) fields.Web = data.web;
    if (data.adreca) fields['Adreça'] = data.adreca;
    if (data.municipi) fields.Municipi = data.municipi;
    if (data.instagram) fields.Instagram = data.instagram;
    if (data.linkedin) fields.LinkedIn = data.linkedin;
    if (data.youtube) fields.Youtube = data.youtube;
    if (data.altresXxss) fields['Altres XXSS'] = data.altresXxss;
    if (data.descripcio) fields['Descripció'] = data.descripcio;
    if (data.peticio) fields['Petició'] = data.peticio;
    if (data.pobleId) fields.Poble = [data.pobleId];
    if (data.sectors && data.sectors.length > 0) fields.Sector = data.sectors;

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Membres`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable error:', errorData);
      return new Response(JSON.stringify({ error: 'Error en guardar les dades' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
