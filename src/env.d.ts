/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly AIRTABLE_TOKEN: string;
  readonly AIRTABLE_BASE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
