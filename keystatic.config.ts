import { config, fields, collection, singleton } from '@keystatic/core';

const localizedText = (label: string, multiline = false) =>
  fields.object(
    {
      it: fields.text({ label: `${label} (Italiano)`, multiline }),
      en: fields.text({ label: `${label} (English)`, multiline }),
      es: fields.text({ label: `${label} (Español)`, multiline }),
      fr: fields.text({ label: `${label} (Français)`, multiline }),
      zh: fields.text({ label: `${label} (中文)`, multiline }),
      hi: fields.text({ label: `${label} (हिन्दी)`, multiline }),
      ar: fields.text({ label: `${label} (العربية)`, multiline }),
    },
    { label, description: 'Se una lingua è vuota viene usato l’italiano.' }
  );

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: 'pablopicciau/boleon' },
  ui: {
    brand: { name: 'Boleon' },
  },
  collections: {
    artworks: collection({
      label: 'Opere',
      slugField: 'title',
      path: 'src/content/artworks/*',
      format: { data: 'json' },
      columns: ['year', 'kind', 'price'],
      schema: {
        title: fields.slug({ name: { label: 'Titolo' } }),
        year: fields.integer({
          label: 'Anno',
          validation: { isRequired: true },
        }),
        technique: fields.text({
          label: 'Tecnica',
          description: 'Es. "Olio su tela", "Acrilico su legno"…',
        }),
        dimensions: fields.text({
          label: 'Dimensioni',
          description: 'Es. "70 × 100 cm"',
        }),
        kind: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Opera originale (pezzo unico)', value: 'original' },
            { label: 'Stampa / edizione limitata', value: 'print' },
          ],
          defaultValue: 'original',
        }),
        price: fields.number({
          label: 'Prezzo (EUR)',
          validation: { isRequired: true, min: 0 },
        }),
        sold: fields.checkbox({
          label: 'Venduta',
          description: 'Solo per le opere originali: spunta dopo la vendita.',
        }),
        editionSize: fields.integer({
          label: 'Tiratura',
          description: 'Solo per le stampe: numero totale di copie dell’edizione.',
        }),
        stock: fields.integer({
          label: 'Copie disponibili',
          description: 'Solo per le stampe: aggiorna dopo ogni vendita.',
        }),
        printSizes: fields.array(
          fields.object({
            size: fields.text({
              label: 'Formato',
              description: 'Es. "30 × 40 cm"',
              validation: { isRequired: true },
            }),
            price: fields.number({
              label: 'Prezzo (EUR)',
              validation: { isRequired: true, min: 1 },
            }),
            stock: fields.integer({
              label: 'Copie disponibili',
              description: 'A 0 il formato risulta esaurito.',
              defaultValue: 0,
            }),
          }),
          {
            label: 'Stampe in vari formati',
            description:
              'Opzionale: formati in cui l’opera è ordinabile come stampa, oltre all’eventuale originale.',
            itemLabel: (props) =>
              `${props.fields.size.value || 'Formato'} — ${props.fields.price.value ?? '?'} €`,
          }
        ),
        featured: fields.checkbox({
          label: 'In evidenza',
          description: 'Mostra l’opera nella sezione in evidenza della home.',
        }),
        sortOrder: fields.integer({
          label: 'Ordinamento',
          description: 'Numero più basso = mostrata prima.',
          defaultValue: 0,
        }),
        images: fields.array(
          fields.image({
            label: 'Immagine',
            directory: 'src/assets/artworks',
            publicPath: '../../assets/artworks/',
            validation: { isRequired: true },
          }),
          {
            label: 'Immagini',
            description: 'La prima immagine è la copertina.',
            itemLabel: () => 'Immagine',
            validation: { length: { min: 1 } },
          }
        ),
        descriptions: localizedText('Descrizione', true),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Impostazioni sito',
      path: 'src/content/settings',
      format: { data: 'json' },
      schema: {
        artistName: fields.text({
          label: 'Nome artista',
          validation: { isRequired: true },
        }),
        taglines: localizedText('Tagline'),
        bios: localizedText('Breve bio', true),
        contactEmail: fields.text({ label: 'Email di contatto' }),
        instagram: fields.url({ label: 'Instagram (URL)' }),
        facebook: fields.url({ label: 'Facebook (URL)' }),
      },
    }),
  },
});
