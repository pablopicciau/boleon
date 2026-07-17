// Le impostazioni del sito sono divise in 4 file/sezioni Keystatic
// (Nome e testi, Copertina, Contatti, Vendita stampe) ma il resto del
// codice continua a vederle come un unico oggetto `settings`.
import identity from '../content/site-identity.json';
import cover from '../content/site-cover.json';
import contacts from '../content/site-contacts.json';
import shop from '../content/site-shop.json';

const settings = {
  ...identity,
  ...cover,
  ...contacts,
  ...shop,
  // Il nome può essere lasciato vuoto in Keystatic: c'è un solo artista.
  artistName: identity.artistName || 'Boleòn',
};

export default settings;
