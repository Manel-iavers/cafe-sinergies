import type { APIRoute } from 'astro';

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const fields: Record<string, unknown> = {
      Títol: data.titol,
      Membres: data.membres,
      Tipus: data.tipus,
      Data: new Date().toISOString().split('T')[0],
    };

    if (data.descripcio) fields['Descripció'] = data.descripcio;

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Sinergies`,
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
      return new Response(
        JSON.stringify({ error: 'Error en guardar la sinergia' }),
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
