// Configuració Airtable
const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;

const TABLES = {
  membres: 'Membres',
  pobles: 'Pobles',
  sectors: 'Sectors',
  sinergies: 'Sinergies',
};

interface AirtableRecord<T = Record<string, unknown>> {
  id: string;
  fields: T;
  createdTime: string;
}

interface AirtableResponse<T = Record<string, unknown>> {
  records: AirtableRecord<T>[];
  offset?: string;
}

async function fetchTable<T>(tableName: string, options?: {
  filterByFormula?: string;
  maxRecords?: number;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
}): Promise<AirtableRecord<T>[]> {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`);
  
  if (options?.filterByFormula) {
    url.searchParams.set('filterByFormula', options.filterByFormula);
  }
  if (options?.maxRecords) {
    url.searchParams.set('maxRecords', options.maxRecords.toString());
  }
  if (options?.sort) {
    options.sort.forEach((s, i) => {
      url.searchParams.set(`sort[${i}][field]`, s.field);
      url.searchParams.set(`sort[${i}][direction]`, s.direction);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.status}`);
  }

  const data: AirtableResponse<T> = await response.json();
  return data.records;
}

async function createRecord<T>(tableName: string, fields: Partial<T>): Promise<AirtableRecord<T>> {
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`,
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
    throw new Error(`Airtable error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Funcions específiques
export interface Membre {
  Nom: string;
  Cognoms: string;
  Poble: string[];
  Empresa: string;
  Sector: string[];
  Web: string;
  Email: string;
  Telèfon: string;
  Adreça: string;
  Municipi: string;
  Instagram: string;
  LinkedIn: string;
  Youtube: string;
  'Altres XXSS': string;
  Descripció: string;
  Petició: string;
}

export interface Poble {
  Nom: string;
  Token: string;
  Actiu: boolean;
}

export interface Sector {
  Nom: string;
}

export interface Sinergia {
  Títol: string;
  Membres: string[];
  Tipus: string[];
  Descripció: string;
  Data: string;
}

export async function getMembres() {
  return fetchTable<Membre>(TABLES.membres);
}

export async function getPobles() {
  return fetchTable<Poble>(TABLES.pobles, {
    filterByFormula: '{Actiu} = TRUE()',
  });
}

export async function getSectors() {
  return fetchTable<Sector>(TABLES.sectors, {
    sort: [{ field: 'Nom', direction: 'asc' }],
  });
}

export async function getSinergies() {
  return fetchTable<Sinergia>(TABLES.sinergies, {
    sort: [{ field: 'Data', direction: 'desc' }],
  });
}

export async function getPobleByToken(token: string) {
  const records = await fetchTable<Poble>(TABLES.pobles, {
    filterByFormula: `AND({Token} = '${token}', {Actiu} = TRUE())`,
    maxRecords: 1,
  });
  return records[0] || null;
}

export async function createMembre(data: Partial<Membre>) {
  return createRecord<Membre>(TABLES.membres, data);
}

export async function createSinergia(data: Partial<Sinergia>) {
  return createRecord<Sinergia>(TABLES.sinergies, data);
}

export async function getAllData() {
  const [membres, sectors, sinergies, pobles] = await Promise.all([
    getMembres(),
    getSectors(),
    getSinergies(),
    getPobles(),
  ]);

  return {
    membres,
    sectors,
    sinergies,
    pobles,
    stats: {
      totalMembres: membres.length,
      totalSectors: sectors.length,
      totalSinergies: sinergies.length,
      totalPobles: pobles.length,
    },
  };
}
