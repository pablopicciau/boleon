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
    {
      label,
      description:
        'Scrivi almeno l’italiano: le lingue lasciate vuote mostrano automaticamente il testo italiano.',
    }
  );

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: 'pablopicciau/boleon' },
  ui: {
    brand: { name: 'Boleon' },
    navigation: {
      Galleria: ['artworks'],
      Sito: ['settings'],
    },
  },
  collections: {
    artworks: collection({
      label: 'Opere',
      slugField: 'title',
      path: 'src/content/artworks/*',
      format: { data: 'json' },
      columns: ['year', 'sortOrder'],
      schema: {
        title: fields.slug({ name: { label: 'Titolo' } }),
        year: fields.integer({
          label: 'Anno',
          validation: { isRequired: true },
        }),
        technique: fields.text({
          label: 'Tecnica',
          description: 'Tecnica dell’opera: es. "Olio su tela", "Acrilico su legno"…',
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
        original: fields.object(
          {
            forSale: fields.checkbox({
              label: 'Originale in vendita sul sito',
              description:
                'Spunta se il pezzo unico è (o è stato) in vendita. Se vendi solo stampe di quest’opera, lascia vuoto.',
            }),
            dimensions: fields.text({
              label: 'Dimensioni',
              description: 'Es. "70 × 100 cm"',
            }),
            price: fields.number({
              label: 'Prezzo (EUR)',
              validation: { min: 0 },
            }),
            sold: fields.checkbox({
              label: 'Venduta',
              description: 'Spunta dopo la vendita: sul sito l’originale apparirà "Venduta".',
            }),
          },
          {
            label: 'Opera originale (pezzo unico)',
            description: 'La prima possibilità di acquisto: il quadro originale.',
          }
        ),
        printTechnique: fields.text({
          label: 'Tecnica di stampa',
          description:
            'Es. "Stampa fine art giclée su carta cotone". Vale per tutti i formati di stampa qui sotto.',
        }),
        prints: fields.array(
          fields.object({
            dimensions: fields.text({
              label: 'Dimensioni',
              description: 'Es. "30 × 40 cm"',
            }),
            price: fields.number({
              label: 'Prezzo (EUR)',
              validation: { isRequired: true, min: 0 },
            }),
            editionSize: fields.integer({
              label: 'Tiratura',
              description: 'Numero totale di copie dell’edizione. Vuoto = edizione aperta.',
            }),
            stock: fields.integer({
              label: 'Copie disponibili',
              description: 'A 0 il formato risulta esaurito. Aggiorna dopo ogni vendita.',
              defaultValue: 0,
            }),
          }),
          {
            label: 'Stampe / edizioni',
            description:
              'La seconda possibilità di acquisto: aggiungi un elemento per ogni formato di stampa, ognuno con misure e prezzo propri.',
            itemLabel: (props) => {
              const dims = props.fields.dimensions.value || 'Formato';
              const price = props.fields.price.value;
              const stock = props.fields.stock.value ?? 0;
              return `${dims} — € ${price ?? '?'} — ${stock} disponibili`;
            },
          }
        ),
        showAvailability: fields.checkbox({
          label: 'Mostra la disponibilità ai visitatori',
          description:
            'Se attivo, il sito mostra quante copie restano di ogni formato (es. "7 di 30 disponibili").',
        }),
        featured: fields.checkbox({
          label: 'In evidenza',
          description: 'Mostra l’opera nella sezione in evidenza della home.',
        }),
        sortOrder: fields.integer({
          label: 'Ordinamento',
          description: 'Numero più basso = mostrata prima.',
          defaultValue: 0,
        }),
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
