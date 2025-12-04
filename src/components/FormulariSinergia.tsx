import { useState } from 'react';

interface Props {
  membres: { id: string; nom: string; empresa: string }[];
}

const TIPUS_SINERGIA = [
  'Comercial',
  'Contacte',
  'Col·laboració',
  'Formació',
  'Altres',
];

export default function FormulariSinergia({ membres }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [email, setEmail] = useState('');
  const [emailValidat, setEmailValidat] = useState(false);
  const [membreActual, setMembreActual] = useState<string | null>(null);
  
  const [membresSeleccionats, setMembresSeleccionats] = useState<string[]>([]);
  const [tipus, setTipus] = useState<string[]>([]);
  const [descripcio, setDescripcio] = useState('');

  const validarEmail = async () => {
    setError('');
    
    // Simple validation - check if email exists in membres
    const membre = membres.find(m => 
      m.nom.toLowerCase().includes(email.toLowerCase()) ||
      m.empresa.toLowerCase().includes(email.toLowerCase())
    );
    
    if (!membre) {
      // For now, just allow anyone with an email
      setEmailValidat(true);
      return;
    }
    
    setMembreActual(membre.id);
    setEmailValidat(true);
  };

  const toggleMembre = (membreId: string) => {
    if (membreId === membreActual) return; // Can't select yourself
    
    setMembresSeleccionats(prev =>
      prev.includes(membreId)
        ? prev.filter(id => id !== membreId)
        : [...prev, membreId]
    );
  };

  const toggleTipus = (t: string) => {
    setTipus(prev =>
      prev.includes(t)
        ? prev.filter(x => x !== t)
        : [...prev, t]
    );
  };

  const handleSubmit = async () => {
    if (membresSeleccionats.length === 0) {
      setError('Selecciona almenys un membre amb qui has col·laborat');
      return;
    }
    if (tipus.length === 0) {
      setError('Selecciona almenys un tipus de sinergia');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Build title from selected members
      const membresNoms = membresSeleccionats
        .map(id => membres.find(m => m.id === id)?.nom || '')
        .filter(Boolean);
      
      const titol = membresNoms.join(' + ');

      const response = await fetch('/api/sinergia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titol,
          membres: membreActual 
            ? [membreActual, ...membresSeleccionats]
            : membresSeleccionats,
          tipus,
          descripcio,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en enviar la sinergia');
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
          🤝
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Sinergia registrada!
        </h2>
        <p className="text-gray-600 mb-6">
          Gràcies per compartir la teva col·laboració. Això ajuda a fer créixer la comunitat!
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setSuccess(false);
              setMembresSeleccionats([]);
              setTipus([]);
              setDescripcio('');
            }}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors"
          >
            Registrar una altra
          </button>
          <a 
            href="/"
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Tornar a l'inici
          </a>
        </div>
      </div>
    );
  }

  if (!emailValidat) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
          Identifica't
        </h2>
        <p className="text-gray-600 mb-4">
          Introdueix el teu email o nom per identificar-te
        </p>
        
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="El teu email o nom"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
        />
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={validarEmail}
          disabled={!email.trim()}
          className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
        Amb qui has col·laborat?
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona els membres (pots marcar varis)
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {membres
              .filter(m => m.id !== membreActual)
              .map((membre) => (
                <button
                  key={membre.id}
                  type="button"
                  onClick={() => toggleMembre(membre.id)}
                  className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    membresSeleccionats.includes(membre.id)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-medium">{membre.nom}</span>
                  {membre.empresa && (
                    <span className="block text-xs opacity-75">{membre.empresa}</span>
                  )}
                </button>
              ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quin tipus de sinergia?
          </label>
          <div className="flex flex-wrap gap-2">
            {TIPUS_SINERGIA.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTipus(t)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  tipus.includes(t)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripció de la sinergia
          </label>
          <textarea
            value={descripcio}
            onChange={(e) => setDescripcio(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Explica breument en què ha consistit la col·laboració..."
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Enviant...' : '🤝 Registrar sinergia'}
        </button>
      </div>
    </div>
  );
}
