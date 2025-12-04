import { useState } from 'react';

interface Membre {
  id: string;
  nom: string;
  empresa?: string;
}

interface Props {
  membres: Membre[];
}

const AIRTABLE_TOKEN = 'patTv1BqX9fDHTs96.f6600aa8289df9930fb8d402292176267eab5bb66cbb41489db4156b77634ed5';
const AIRTABLE_BASE_ID = 'app5KbgovIUVTlfB1';

const TIPUS_SINERGIA = [
  'Comercial',
  'Contacte', 
  'Col·laboració',
  'Formació',
  'Altres',
];

export default function FormulariSinergia({ membres }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    membreActual: '',
    membresColaboradors: [] as string[],
    tipus: [] as string[],
    descripcio: '',
  });

  const toggleMembre = (membreId: string) => {
    setFormData(prev => ({
      ...prev,
      membresColaboradors: prev.membresColaboradors.includes(membreId)
        ? prev.membresColaboradors.filter(id => id !== membreId)
        : [...prev.membresColaboradors, membreId]
    }));
  };

  const toggleTipus = (tipus: string) => {
    setFormData(prev => ({
      ...prev,
      tipus: prev.tipus.includes(tipus)
        ? prev.tipus.filter(t => t !== tipus)
        : [...prev.tipus, tipus]
    }));
  };

  const handleSubmit = async () => {
    if (formData.membresColaboradors.length === 0) {
      setError('Has de seleccionar almenys un membre col·laborador');
      return;
    }
    if (formData.tipus.length === 0) {
      setError('Has de seleccionar almenys un tipus de sinergia');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generar títol automàtic
      const membresNoms = formData.membresColaboradors.map(id => {
        const m = membres.find(mem => mem.id === id);
        return m?.empresa || m?.nom || '';
      }).filter(Boolean);

      const membreActualData = membres.find(m => m.id === formData.membreActual);
      const nomActual = membreActualData?.empresa || membreActualData?.nom || '';
      
      const titol = [nomActual, ...membresNoms].join(' + ');

      const fields: Record<string, unknown> = {
        Títol: titol,
        Membres: [formData.membreActual, ...formData.membresColaboradors],
        Tipus: formData.tipus,
        Descripció: formData.descripcio || undefined,
        Data: new Date().toISOString().split('T')[0],
      };

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
        const errorData = await response.json();
        console.error('Airtable error:', errorData);
        throw new Error('Error en guardar la sinergia');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          🎉
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Sinergia registrada!
        </h2>
        <p className="text-gray-600 mb-6">
          Gràcies per compartir la teva col·laboració. Les sinergies són el motor del grup!
        </p>
        <div className="flex items-center justify-center gap-4">
          <a 
            href="/"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Tornar a l'inici
          </a>
          <button
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setFormData({
                membreActual: '',
                membresColaboradors: [],
                tipus: [],
                descripcio: '',
              });
            }}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            Registrar altra sinergia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      {/* Step 1: Identificar-se */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">
            Qui ets?
          </h2>
          <p className="text-gray-600 mb-6">
            Selecciona el teu nom de la llista de membres.
          </p>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {membres.map((membre) => (
              <button
                key={membre.id}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, membreActual: membre.id }));
                  setStep(2);
                }}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{membre.nom}</span>
                {membre.empresa && (
                  <span className="text-gray-500 ml-2">({membre.empresa})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Detalls de la sinergia */}
      {step === 2 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
            Detalls de la sinergia
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amb qui has col·laborat? *
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {membres
                  .filter(m => m.id !== formData.membreActual)
                  .map((membre) => (
                    <button
                      key={membre.id}
                      type="button"
                      onClick={() => toggleMembre(membre.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        formData.membresColaboradors.includes(membre.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{membre.nom}</span>
                      {membre.empresa && (
                        <span className="text-gray-500 ml-2">({membre.empresa})</span>
                      )}
                      {formData.membresColaboradors.includes(membre.id) && (
                        <span className="float-right text-primary-500">✓</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipus de sinergia *
              </label>
              <div className="flex flex-wrap gap-2">
                {TIPUS_SINERGIA.map((tipus) => (
                  <button
                    key={tipus}
                    type="button"
                    onClick={() => toggleTipus(tipus)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      formData.tipus.includes(tipus)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tipus}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripció (opcional)
              </label>
              <textarea
                value={formData.descripcio}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Breu descripció de la col·laboració..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      {step === 2 && (
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Enrere
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviant...' : '✓ Registrar sinergia'}
          </button>
        </div>
      )}
    </div>
  );
}
