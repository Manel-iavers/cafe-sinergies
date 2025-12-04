# ☕ Cafè & Sinergies

Landing page i sistema de gestió per a la comunitat de networking Cafè & Sinergies.

## 🚀 Stack

- **Frontend:** Astro 4 + React + Tailwind CSS
- **Backend:** Airtable
- **Hosting:** Vercel

## 📁 Estructura

```
src/
├── components/       # Components React (formularis)
├── layouts/          # Layouts Astro
├── lib/              # Utilitats (connexió Airtable)
├── pages/
│   ├── api/          # API endpoints
│   ├── alta/         # Formulari d'alta
│   ├── index.astro   # Landing page
│   └── sinergia.astro # Formulari de sinergies
public/
└── favicon.svg
```

## ⚙️ Configuració

1. Copia `.env.example` a `.env`
2. Afegeix les teves credencials d'Airtable:
   ```
   AIRTABLE_TOKEN=pat...
   AIRTABLE_BASE_ID=app...
   ```

## 🛠️ Desenvolupament

```bash
# Instal·lar dependències
npm install

# Executar en mode desenvolupament
npm run dev

# Build per producció
npm run build
```

## 🔗 URLs

- `/` - Landing page
- `/alta/[poble]?t=[token]` - Formulari d'alta (necessita token)
- `/sinergia` - Formulari per registrar sinergies

## 📤 Desplegament a Vercel

1. Puja el projecte a GitHub
2. Connecta el repo a Vercel
3. Afegeix les variables d'entorn:
   - `AIRTABLE_TOKEN`
   - `AIRTABLE_BASE_ID`
4. Desplegeu!

## 📝 Licència

Projecte privat de ComunicAcció.
