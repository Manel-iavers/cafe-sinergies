import type { APIRoute } from 'astro';

export const prerender = false;

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Prepare fields for Airtable
    const fields: Record<string, unknown> = {
      Nom: data.nom,
      Cognoms: data.cognoms,
      Empresa: data.empresa || undefined,
      Web: data.web || undefined,
      Email: data.email,
      Telèfon: data.telefon,
      Adreça: data.adreca || undefined,
      Municipi: data.municipi || undefined,
      Instagram: data.instagram || undefined,
      LinkedIn: data.linkedin || undefined,
      Youtube: data.youtube || undefined,
      'Altres XXSS': data.altresXxss || undefined,
      Descripció: data.descripcio,
      Petició: data.peticio || undefined,
    };

    // Add linked fields
    if (data.pobleId) {
      fields.Poble = [data.pobleId];
    }
    
    if (data.sectors && data.sectors.length > 0) {
      fields.Sector = data.sectors;
    }

    // Remove undefined values
    Object.keys(fields).forEach(key => {
      if (fields[key] === undefined) {
        delete fields[key];
      }
    });

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
      const error = await response.json();
      console.error('Airtable error:', error);
      return new Response(
        JSON.stringify({ error: 'Error en guardar les dades' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
