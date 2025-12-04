import { useState } from 'react';

interface Props {
  pobleId: string;
  pobleName: string;
  sectors: { id: string; nom: string }[];
}

interface FormData {
  nom: string;
  cognoms: string;
  empresa: string;
  web: string;
  email: string;
  telefon: string;
  adreca: string;
  municipi: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  altresXxss: string;
  descripcio: string;
  peticio: string;
  sectors: string[];
}

export default function FormulariAlta({ pobleId, pobleName, sectors }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    cognoms: '',
    empresa: '',
    web: '',
    email: '',
    telefon: '',
    adreca: '',
    municipi: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    altresXxss: '',
    descripcio: '',
    peticio: '',
    sectors: [],
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSector = (sectorId: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sectorId)
        ? prev.sectors.filter(id => id !== sectorId)
        : [...prev.sectors, sectorId]
    }));
  };

  const validateStep1 = () => {
    if (!formData.nom.trim()) return 'El nom és obligatori';
    if (!formData.cognoms.trim()) return 'Els cognoms són obligatoris';
    if (!formData.email.trim()) return 'L\'email és obligatori';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'L\'email no és vàlid';
    if (!formData.telefon.trim()) return 'El telèfon és obligatori';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.descripcio.trim()) return 'La descripció és obligatòria';
    return null;
  };

  const handleNext = () => {
    const error = step === 1 ? validateStep1() : validateStep2();
    if (error) {
      setError(error);
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/alta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pobleId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error en enviar el formulari');
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
          ✅
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Registre completat!
        </h2>
        <p className="text-gray-600 mb-6">
          Benvingut/da a Cafè & Sinergies {pobleName}. Aviat rebràs informació sobre les properes trobades.
        </p>
        <a 
          href="/"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Tornar a l'inici
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Dades personals */}
      {step === 1 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
            Dades personals i contacte
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => updateField('nom', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cognoms *
                </label>
                <input
                  type="text"
                  value={formData.cognoms}
                  onChange={(e) => updateField('cognoms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <input
                type="text"
                value={formData.empresa}
                onChange={(e) => updateField('empresa', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telèfon *
                </label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => updateField('telefon', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipi
                </label>
                <input
                  type="text"
                  value={formData.municipi}
                  onChange={(e) => updateField('municipi', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="On vius/treballes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Web
                </label>
                <input
                  type="url"
                  value={formData.web}
                  onChange={(e) => updateField('web', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adreça (si tens local físic)
              </label>
              <input
                type="text"
                value={formData.adreca}
                onChange={(e) => updateField('adreca', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Perfil professional */}
      {step === 2 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
            Perfil professional
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Què fas? (Descripció) *
              </label>
              <textarea
                value={formData.descripcio}
                onChange={(e) => updateField('descripcio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Explica breument a què et dediques i què ofereixes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Què busques al grup? (Petició)
              </label>
              <textarea
                value={formData.peticio}
                onChange={(e) => updateField('peticio', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Quin tipus de contactes o col·laboracions t'interessarien..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sectors on operes (pots marcar varis)
              </label>
              <div className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => toggleSector(sector.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      formData.sectors.includes(sector.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sector.nom}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Xarxes socials
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => updateField('instagram', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Instagram (URL o @usuari)"
                />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="LinkedIn (URL)"
                />
                <input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => updateField('youtube', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Youtube (URL)"
                />
                <input
                  type="text"
                  value={formData.altresXxss}
                  onChange={(e) => updateField('altresXxss', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Altres xarxes socials"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
            Confirma les teves dades
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-medium">{formData.nom} {formData.cognoms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{formData.empresa || '-'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telèfon</p>
                <p className="font-medium">{formData.telefon}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Descripció</p>
              <p className="font-medium">{formData.descripcio}</p>
            </div>

            {formData.peticio && (
              <div>
                <p className="text-sm text-gray-500">Petició al grup</p>
                <p className="font-medium">{formData.peticio}</p>
              </div>
            )}

            {formData.sectors.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Sectors</p>
                <div className="flex flex-wrap gap-2">
                  {formData.sectors.map((sectorId) => {
                    const sector = sectors.find(s => s.id === sectorId);
                    return sector && (
                      <span key={sectorId} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                        {sector.nom}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 mt-6 cursor-pointer">
            <input type="checkbox" required className="mt-1" />
            <span className="text-sm text-gray-600">
              Accepto que les meves dades siguin compartides amb els altres membres del grup 
              Cafè & Sinergies per facilitar la creació de sinergies professionals.
            </span>
          </label>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Enrere
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors"
          >
            Continuar →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviant...' : '✓ Enviar registre'}
          </button>
        )}
      </div>
    </div>
  );
}
