import type { APIRoute } from 'astro';

export const prerender = false;

const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;

export const POST: APIRoute = async ({ request }) => {
  try {
    const text = await request.text();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No s\'han rebut dades' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = JSON.parse(text);
    
    const fields: Record<string, unknown> = {
      Títol: data.titol,
      Descripció: data.descripcio || undefined,
      Data: new Date().toISOString().split('T')[0],
    };

    if (data.membres && data.membres.length > 0) {
      fields.Membres = data.membres;
    }
    
    if (data.tipus && data.tipus.length > 0) {
      fields.Tipus = data.tipus;
    }

    // Remove undefined values
    Object.keys(fields).forEach(key => {
      if (fields[key] === undefined) {
        delete fields[key];
      }
    });

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
      const error = await response.json();
      console.error('Airtable error:', error);
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
