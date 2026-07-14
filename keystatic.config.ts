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
    navigation: {
      Galleria: ['artworks', 'collections'],
      Sito: ['identity', 'cover', 'contacts', 'shop'],
    },
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
        showAvailability: fields.checkbox({
          label: 'Mostra la disponibilità ai visitatori',
          description:
            'Se attivo, il sito mostra quante copie restano (del pezzo base e di ogni formato di stampa qui sotto), es. "7 di 30 disponibili". Se disattivo, questi numeri restano privati.',
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
            editionSize: fields.integer({
              label: 'Tiratura',
              description:
                'Facoltativo: numero totale di copie di questo formato. Vuoto = edizione aperta (si mostrano solo le copie rimaste, non il totale).',
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
        bestseller: fields.checkbox({
          label: 'Tra i più venduti',
          description:
            'Mostra l’opera nella sottosezione "I più venduti", quella che si apre per prima nella galleria.',
        }),
        collections: fields.array(
          fields.relationship({
            label: 'Collezione',
            collection: 'collections',
            validation: { isRequired: true },
          }),
          {
            label: 'Collezioni',
            description:
              'Le collezioni a cui appartiene l’opera (es. "Bianco e nero"). Un’opera può stare in più collezioni.',
            itemLabel: (props) => props.value ?? 'Collezione',
          }
        ),
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
    collections: collection({
      label: 'Collezioni',
      slugField: 'name',
      path: 'src/content/collections/*',
      format: { data: 'json' },
      columns: ['sortOrder'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Nome (Italiano)',
            description: 'Il nome della collezione, es. "Bianco e nero".',
          },
        }),
        names: localizedText('Nome nelle altre lingue'),
        sortOrder: fields.integer({
          label: 'Ordinamento',
          description: 'Numero più basso = mostrata prima tra le linguette della galleria.',
          defaultValue: 0,
        }),
      },
    }),
  },
  singletons: {
    identity: singleton({
      label: 'Nome e testi',
      path: 'src/content/site-identity',
      format: { data: 'json' },
      schema: {
        artistName: fields.text({
          label: 'Nome artista',
          validation: { isRequired: true },
        }),
        taglines: localizedText('Tagline'),
        bios: localizedText('Breve bio', true),
      },
    }),
    cover: singleton({
      label: 'Sfondi della copertina',
      path: 'src/content/site-cover',
      format: { data: 'json' },
      schema: {
        heroImages: fields.array(
          fields.image({
            label: 'Immagine',
            directory: 'src/assets/hero',
            publicPath: '../../assets/hero/',
            validation: { isRequired: true },
          }),
          {
            label: 'Sfondi della copertina',
            description:
              'Le immagini della schermata iniziale: una a caso all’apertura, poi si alternano ogni 10 secondi.',
            itemLabel: () => 'Immagine di sfondo',
          }
        ),
      },
    }),
    contacts: singleton({
      label: 'Contatti e social',
      path: 'src/content/site-contacts',
      format: { data: 'json' },
      schema: {
        contactEmail: fields.text({ label: 'Email di contatto' }),
        instagram: fields.url({ label: 'Instagram (URL)' }),
        facebook: fields.url({ label: 'Facebook (URL)' }),
      },
    }),
    shop: singleton({
      label: 'Vendita e stampe',
      path: 'src/content/site-shop',
      format: { data: 'json' },
      schema: {
        printMaterials: localizedText('Materiali di stampa (mostrato sotto i formati)', true),
      },
    }),
  },
});
