// Domande frequenti nelle 7 lingue del sito. Tariffe e tempi di spedizione
// arrivano dalle impostazioni (Keystatic → Vendita e stampe → Spedizioni):
// se cambiano lì, le risposte si aggiornano da sole in tutte le lingue.
import { formatPrice, localeMeta, type Locale } from './index';
import type { ShippingConfig, ShippingZone, ZoneRate } from '../lib/shipping';

export type FaqItem = { q: string; a: string };
export type FaqContent = {
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  items: FaqItem[];
};

type Ctx = {
  /** Tariffa di una zona già scritta nella lingua, es. "8 €, gratuita da 90 €" */
  rate: (zone: ShippingZone) => string;
  /** Tempi di consegna di una zona, es. "2–3 settimane" */
  weeks: (zone: ShippingZone) => string;
  /** Minimo d'ordine per il Regno Unito, già formattato */
  ukMin: string;
  /** Testo del tasto rosso della pagina opera, uguale a quello del sito */
  button: string;
};

const content: Record<Locale, (c: Ctx) => FaqContent> = {
  it: (c) => ({
    title: 'Domande frequenti',
    metaTitle: 'Domande frequenti (FAQ)',
    description:
      'Domande e risposte su opere originali, stampe fine art, spedizioni, pagamenti, resi e autenticità di Boleòn.',
    intro:
      "Le risposte alle domande più comuni su opere, stampe, spedizioni e acquisti. Non trovi quello che cerchi? Scrivi pure all'artista.",
    items: [
      {
        q: 'Chi è Boleòn?',
        a: 'Boleòn è un artista che dipinge ad acquerello e sceglie di restare anonimo: preferisce che a parlare siano le opere, non il nome di chi le firma. Crea pezzi unici e ne propone anche stampe fine art.',
      },
      {
        q: 'Che cosa posso acquistare su boleon.it?',
        a: 'Due tipi di opere: le opere originali, pezzi unici dipinti a mano, e le stampe fine art delle opere, disponibili in diversi formati.',
      },
      {
        q: "Come acquisto un'opera originale?",
        a: `L'opera originale è un pezzo unico e non si acquista direttamente online. Dalla pagina dell'opera invii una richiesta con il tasto «${c.button}»: Boleòn ti risponde personalmente via email per concordare prezzo, spedizione e dettagli.`,
      },
      {
        q: 'Come funzionano le stampe?',
        a: 'Sono stampe fine art realizzate su richiesta, disponibili in vari formati (dalle misure serie A alle misure in pollici), a scelta su carta fine art o su tela. Vengono spedite senza cornice, così puoi scegliere la cornice più adatta al tuo spazio.',
      },
      {
        q: 'Le stampe sono subito disponibili?',
        a: "Al momento le stampe sono in preordine: completi l'acquisto e il pagamento adesso e ricevi la stampa appena è pronta. Essendo preparata su richiesta, la lavorazione richiede un po' più di tempo del solito.",
      },
      {
        q: 'Quali metodi di pagamento accettate?',
        a: 'I pagamenti si effettuano con carta, in modo sicuro tramite Stripe. I dati della carta sono gestiti direttamente da Stripe e non vengono conservati dal sito.',
      },
      {
        q: 'In quali Paesi spedite?',
        a: `In Italia, in tutti i Paesi dell'Unione Europea, in Svizzera, Norvegia e Regno Unito (per ordini da ${c.ukMin} in su), negli Stati Uniti, in Canada, Giappone, Corea del Sud, Singapore, Australia, Nuova Zelanda ed Emirati Arabi Uniti. Per gli altri Paesi scrivi all'artista e riceverai un preventivo. Boleòn prepara e spedisce personalmente ogni opera, sempre con spedizione tracciata.`,
      },
      {
        q: 'Quanto costa la spedizione?',
        a: `Il costo si vede nel carrello prima di pagare, scegliendo il Paese di spedizione. Italia ${c.rate('italy')}. Unione Europea ${c.rate('eu')}. Svizzera, Norvegia e Regno Unito ${c.rate('europe')}. Resto del mondo ${c.rate('world')}. Stati Uniti ${c.rate('usa')}, più i dazi d'importazione già inclusi nel totale. Si paga una sola spedizione per ordine, anche con più stampe.`,
      },
      {
        q: "Quanto tempo ci vuole per ricevere l'opera?",
        a: `Le stampe sono preparate su richiesta, firmate e spedite personalmente dall'artista. In genere servono ${c.weeks('italy')} in Italia, ${c.weeks('eu')} nell'Unione Europea e ${c.weeks('world')} nel resto del mondo, dogana compresa. Per le opere originali i tempi si concordano direttamente con l'artista.`,
      },
      {
        q: 'Devo pagare dazi o tasse alla consegna?',
        a: "Nell'Unione Europea no. Negli Stati Uniti nemmeno, perché i dazi d'importazione sono già inclusi nel totale e li versa l'artista al momento della spedizione. In Svizzera, Norvegia, Regno Unito e negli altri Paesi fuori dall'UE eventuali dazi, IVA e spese di sdoganamento sono a carico del destinatario e si pagano alla consegna.",
      },
      {
        q: 'La mia opera è arrivata danneggiata, cosa faccio?',
        a: "Manda all'artista una foto dell'opera e dell'imballo entro 48 ore dalla consegna. L'opera verrà ristampata e rispedita gratuitamente.",
      },
      {
        q: "Le opere sono firmate? C'è un certificato di autenticità?",
        a: 'Sì: ogni opera, originale o stampa, è firmata e accompagnata da un certificato di autenticità.',
      },
      {
        q: "Posso restituire un'opera?",
        a: "Sì. Se sei un consumatore hai 14 giorni dalla consegna per recedere dall'acquisto, senza dover dare spiegazioni. L'opera deve tornare integra e le spese di reso sono a carico del cliente; il rimborso comprende la spedizione pagata all'acquisto. Per qualsiasi problema con un ordine scrivi all'artista e troverete una soluzione.",
      },
      {
        q: 'Come resto aggiornato sulle nuove opere?',
        a: 'Iscriviti alla newsletter in fondo a ogni pagina: riceverai poche email, solo quando ci sono nuove opere o stampe. Puoi disiscriverti quando vuoi con un clic.',
      },
      {
        q: 'In quante lingue è disponibile il sito?',
        a: 'Il sito è disponibile in 7 lingue: italiano, inglese, spagnolo, francese, cinese, hindi e arabo.',
      },
      {
        q: "Come posso contattare l'artista?",
        a: `Puoi scrivere dalla pagina Contatti oppure contattare Boleòn su Instagram; per un'opera originale usa il tasto «${c.button}» nella sua pagina. Le richieste arrivano direttamente all'artista.`,
      },
      {
        q: 'I colori della stampa saranno identici a quelli che vedo sullo schermo?',
        a: "Le immagini sono curate per essere fedeli, ma ogni schermo mostra i colori in modo leggermente diverso. La stampa fine art punta a restare il più possibile vicina all'opera originale.",
      },
    ],
  }),

  en: (c) => ({
    title: 'Frequently asked questions',
    metaTitle: 'Frequently asked questions (FAQ)',
    description:
      'Questions and answers about Boleòn’s original artworks, fine art prints, shipping, payment, returns and authenticity.',
    intro:
      'Answers to the most common questions about artworks, prints, shipping and orders. Can’t find what you’re looking for? Feel free to write to the artist.',
    items: [
      {
        q: 'Who is Boleòn?',
        a: 'Boleòn is a watercolor artist who chooses to remain anonymous, preferring the works to speak rather than the name behind them. Boleòn creates one-of-a-kind pieces and also offers fine art prints of them.',
      },
      {
        q: 'What can I buy on boleon.it?',
        a: 'Two kinds of works: original artworks, unique hand-painted pieces, and fine art prints of the works, available in several sizes.',
      },
      {
        q: 'How do I buy an original artwork?',
        a: `An original is a unique piece and cannot be bought directly online. On the artwork page, send a request with the “${c.button}” button: Boleòn replies personally by email to agree on price, shipping and details.`,
      },
      {
        q: 'How do the prints work?',
        a: 'They are fine art prints made to order, available in many sizes (from European A sizes to inch sizes), on fine art paper or canvas. They are shipped unframed, so you can choose the frame that best suits your space.',
      },
      {
        q: 'Are the prints available right away?',
        a: 'Prints are currently available for pre-order: you complete the purchase and payment now and receive the print as soon as it is ready. Since each one is made to order, it takes a little longer than usual.',
      },
      {
        q: 'Which payment methods do you accept?',
        a: 'Payments are made by card, securely through Stripe. Card details are handled directly by Stripe and are never stored by the site.',
      },
      {
        q: 'Which countries do you ship to?',
        a: `Italy, all European Union countries, Switzerland, Norway and the United Kingdom (orders from ${c.ukMin}), the United States, Canada, Japan, South Korea, Singapore, Australia, New Zealand and the United Arab Emirates. For other countries, write to the artist for a quote. Boleòn personally prepares and ships every piece, always with tracking.`,
      },
      {
        q: 'How much does shipping cost?',
        a: `You see the cost in the cart before paying, once you choose the destination country. Italy ${c.rate('italy')}. European Union ${c.rate('eu')}. Switzerland, Norway and United Kingdom ${c.rate('europe')}. Rest of the world ${c.rate('world')}. United States ${c.rate('usa')}, plus import duties already included in the total. You pay a single shipping fee per order, even with several prints.`,
      },
      {
        q: 'How long does delivery take?',
        a: `Prints are made to order, signed and shipped personally by the artist. It usually takes ${c.weeks('italy')} in Italy, ${c.weeks('eu')} in the European Union and ${c.weeks('world')} elsewhere, customs included. Timelines for original artworks are agreed directly with the artist.`,
      },
      {
        q: 'Will I have to pay duties or taxes on delivery?',
        a: 'Not in the European Union. Not in the United States either: import duties are already included in the total and paid by the artist when shipping. In Switzerland, Norway, the United Kingdom and other non-EU countries, any duties, VAT and clearance fees are paid by the recipient on delivery.',
      },
      {
        q: 'My artwork arrived damaged. What should I do?',
        a: 'Send the artist a photo of the artwork and the packaging within 48 hours of delivery. The artwork will be reprinted and reshipped free of charge.',
      },
      {
        q: 'Are the works signed? Is there a certificate of authenticity?',
        a: 'Yes: every work, original or print, is signed and comes with a certificate of authenticity.',
      },
      {
        q: 'Can I return an artwork?',
        a: 'Yes. If you are a consumer, you have 14 days from delivery to withdraw from the purchase without giving any reason. The artwork must come back intact and return shipping is paid by the customer; the refund includes the shipping paid at purchase. For any problem with an order, write to the artist and you will find a solution together.',
      },
      {
        q: 'How can I stay updated on new works?',
        a: 'Subscribe to the newsletter at the bottom of every page: you will receive only a few emails, when there are new works or prints. You can unsubscribe at any time with one click.',
      },
      {
        q: 'In how many languages is the site available?',
        a: 'The site is available in 7 languages: Italian, English, Spanish, French, Chinese, Hindi and Arabic.',
      },
      {
        q: 'How can I contact the artist?',
        a: `You can write from the Contact page or reach Boleòn on Instagram; for an original artwork, use the “${c.button}” button on its page. Messages go straight to the artist.`,
      },
      {
        q: 'Will the print colors be identical to what I see on screen?',
        a: 'The images are carefully prepared to be faithful, but every screen shows colors slightly differently. The fine art print aims to stay as close as possible to the original artwork.',
      },
    ],
  }),

  es: (c) => ({
    title: 'Preguntas frecuentes',
    metaTitle: 'Preguntas frecuentes (FAQ)',
    description:
      'Preguntas y respuestas sobre las obras originales, las láminas fine art, los envíos, los pagos, las devoluciones y la autenticidad de Boleòn.',
    intro:
      'Las respuestas a las preguntas más habituales sobre obras, láminas, envíos y compras. ¿No encuentras lo que buscas? Escribe al artista cuando quieras.',
    items: [
      {
        q: '¿Quién es Boleòn?',
        a: 'Boleòn es un artista que pinta con acuarela y elige permanecer en el anonimato: prefiere que hablen las obras y no el nombre de quien las firma. Crea piezas únicas y también ofrece láminas fine art de ellas.',
      },
      {
        q: '¿Qué puedo comprar en boleon.it?',
        a: 'Dos tipos de obras: las obras originales, piezas únicas pintadas a mano, y las láminas fine art de las obras, disponibles en varios formatos.',
      },
      {
        q: '¿Cómo compro una obra original?',
        a: `La obra original es una pieza única y no se compra directamente en línea. Desde la página de la obra envías una solicitud con el botón «${c.button}»: Boleòn te responde personalmente por correo para acordar precio, envío y detalles.`,
      },
      {
        q: '¿Cómo funcionan las láminas?',
        a: 'Son láminas fine art impresas bajo pedido, disponibles en varios formatos (desde los tamaños de la serie A hasta los tamaños en pulgadas), en papel fine art o en lienzo. Se envían sin marco, para que puedas elegir el que mejor encaje en tu espacio.',
      },
      {
        q: '¿Las láminas están disponibles de inmediato?',
        a: 'Por ahora las láminas están en preventa: completas la compra y el pago ahora y recibes la lámina en cuanto esté lista. Como se prepara bajo pedido, el proceso tarda un poco más de lo habitual.',
      },
      {
        q: '¿Qué métodos de pago aceptáis?',
        a: 'Los pagos se realizan con tarjeta, de forma segura a través de Stripe. Los datos de la tarjeta los gestiona directamente Stripe y el sitio no los guarda.',
      },
      {
        q: '¿A qué países enviáis?',
        a: `A Italia, a todos los países de la Unión Europea, a Suiza, Noruega y el Reino Unido (pedidos desde ${c.ukMin}), a Estados Unidos, Canadá, Japón, Corea del Sur, Singapur, Australia, Nueva Zelanda y Emiratos Árabes Unidos. Para otros países escribe al artista y recibirás un presupuesto. Boleòn prepara y envía personalmente cada obra, siempre con seguimiento.`,
      },
      {
        q: '¿Cuánto cuesta el envío?',
        a: `El coste aparece en el carrito antes de pagar, al elegir el país de envío. Italia ${c.rate('italy')}. Unión Europea ${c.rate('eu')}. Suiza, Noruega y Reino Unido ${c.rate('europe')}. Resto del mundo ${c.rate('world')}. Estados Unidos ${c.rate('usa')}, más los aranceles de importación ya incluidos en el total. Se paga un solo envío por pedido, aunque incluya varias láminas.`,
      },
      {
        q: '¿Cuánto tarda en llegar la obra?',
        a: `Las láminas se preparan bajo pedido y el artista las firma y envía personalmente. Normalmente tardan ${c.weeks('italy')} en Italia, ${c.weeks('eu')} en la Unión Europea y ${c.weeks('world')} en el resto del mundo, aduana incluida. Los plazos de las obras originales se acuerdan directamente con el artista.`,
      },
      {
        q: '¿Tengo que pagar aranceles o impuestos a la entrega?',
        a: 'En la Unión Europea, no. En Estados Unidos tampoco, porque los aranceles de importación ya están incluidos en el total y los paga el artista al enviar. En Suiza, Noruega, el Reino Unido y otros países fuera de la UE, los posibles aranceles, el IVA y los gastos de aduana corren a cargo del destinatario y se pagan a la entrega.',
      },
      {
        q: 'Mi obra ha llegado dañada, ¿qué hago?',
        a: 'Envía al artista una foto de la obra y del embalaje en las 48 horas siguientes a la entrega. La obra se volverá a imprimir y a enviar gratis.',
      },
      {
        q: '¿Las obras están firmadas? ¿Incluyen certificado de autenticidad?',
        a: 'Sí: cada obra, original o lámina, está firmada e incluye un certificado de autenticidad.',
      },
      {
        q: '¿Puedo devolver una obra?',
        a: 'Sí. Si eres consumidor tienes 14 días desde la entrega para desistir de la compra sin dar explicaciones. La obra debe volver intacta y los gastos de devolución corren a cargo del cliente; el reembolso incluye el envío pagado en la compra. Para cualquier problema con un pedido escribe al artista y encontraréis una solución.',
      },
      {
        q: '¿Cómo me entero de las nuevas obras?',
        a: 'Suscríbete a la newsletter al final de cada página: recibirás pocos correos, solo cuando haya obras o láminas nuevas. Puedes darte de baja cuando quieras con un clic.',
      },
      {
        q: '¿En cuántos idiomas está disponible el sitio?',
        a: 'El sitio está disponible en 7 idiomas: italiano, inglés, español, francés, chino, hindi y árabe.',
      },
      {
        q: '¿Cómo puedo contactar con el artista?',
        a: `Puedes escribir desde la página de Contacto o contactar con Boleòn en Instagram; para una obra original usa el botón «${c.button}» en su página. Los mensajes llegan directamente al artista.`,
      },
      {
        q: '¿Los colores de la lámina serán idénticos a los que veo en pantalla?',
        a: 'Las imágenes están cuidadas para ser fieles, pero cada pantalla muestra los colores de forma un poco distinta. La lámina fine art busca mantenerse lo más cerca posible de la obra original.',
      },
    ],
  }),

  fr: (c) => ({
    title: 'Questions fréquentes',
    metaTitle: 'Questions fréquentes (FAQ)',
    description:
      'Questions et réponses sur les œuvres originales, les tirages d’art, la livraison, le paiement, les retours et l’authenticité des œuvres de Boleòn.',
    intro:
      'Les réponses aux questions les plus courantes sur les œuvres, les tirages, la livraison et les commandes. Vous ne trouvez pas ce que vous cherchez ? N’hésitez pas à écrire à l’artiste.',
    items: [
      {
        q: 'Qui est Boleòn ?',
        a: 'Boleòn est un artiste qui peint à l’aquarelle et choisit de rester anonyme : il préfère que ce soient les œuvres qui parlent, et non le nom de celui qui les signe. Il crée des pièces uniques et en propose aussi des tirages d’art.',
      },
      {
        q: 'Que puis-je acheter sur boleon.it ?',
        a: 'Deux types d’œuvres : les œuvres originales, pièces uniques peintes à la main, et les tirages d’art des œuvres, disponibles en plusieurs formats.',
      },
      {
        q: 'Comment acheter une œuvre originale ?',
        a: `L’œuvre originale est une pièce unique et ne s’achète pas directement en ligne. Depuis la page de l’œuvre, envoyez une demande avec le bouton « ${c.button} » : Boleòn vous répond personnellement par e-mail pour convenir du prix, de la livraison et des détails.`,
      },
      {
        q: 'Comment fonctionnent les tirages ?',
        a: 'Ce sont des tirages d’art réalisés à la demande, disponibles en plusieurs formats (des formats de la série A aux formats en pouces), sur papier d’art ou sur toile. Ils sont expédiés sans cadre, pour que vous puissiez choisir celui qui convient le mieux à votre intérieur.',
      },
      {
        q: 'Les tirages sont-ils disponibles tout de suite ?',
        a: 'Pour le moment, les tirages sont en précommande : vous finalisez l’achat et le paiement maintenant et recevez le tirage dès qu’il est prêt. Comme il est réalisé à la demande, la préparation prend un peu plus de temps que d’habitude.',
      },
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Le paiement se fait par carte, en toute sécurité via Stripe. Les données de la carte sont traitées directement par Stripe et ne sont jamais conservées par le site.',
      },
      {
        q: 'Dans quels pays livrez-vous ?',
        a: `En Italie, dans tous les pays de l’Union européenne, en Suisse, en Norvège et au Royaume-Uni (commandes à partir de ${c.ukMin}), aux États-Unis, au Canada, au Japon, en Corée du Sud, à Singapour, en Australie, en Nouvelle-Zélande et aux Émirats arabes unis. Pour les autres pays, écrivez à l’artiste pour obtenir un devis. Boleòn prépare et expédie personnellement chaque œuvre, toujours avec suivi.`,
      },
      {
        q: 'Combien coûte la livraison ?',
        a: `Le coût s’affiche dans le panier avant le paiement, une fois le pays de livraison choisi. Italie ${c.rate('italy')}. Union européenne ${c.rate('eu')}. Suisse, Norvège et Royaume-Uni ${c.rate('europe')}. Reste du monde ${c.rate('world')}. États-Unis ${c.rate('usa')}, plus les droits d’importation déjà inclus dans le total. Une seule livraison est facturée par commande, même avec plusieurs tirages.`,
      },
      {
        q: 'Quel est le délai de livraison ?',
        a: `Les tirages sont réalisés à la demande, signés et expédiés personnellement par l’artiste. Comptez en général ${c.weeks('italy')} en Italie, ${c.weeks('eu')} dans l’Union européenne et ${c.weeks('world')} dans le reste du monde, douane comprise. Pour les œuvres originales, les délais se décident directement avec l’artiste.`,
      },
      {
        q: 'Dois-je payer des droits ou des taxes à la livraison ?',
        a: 'Pas dans l’Union européenne. Pas non plus aux États-Unis : les droits d’importation sont déjà inclus dans le total et payés par l’artiste à l’expédition. En Suisse, en Norvège, au Royaume-Uni et dans les autres pays hors UE, les éventuels droits, la TVA et les frais de dédouanement sont à la charge du destinataire et se paient à la livraison.',
      },
      {
        q: 'Mon œuvre est arrivée abîmée, que faire ?',
        a: 'Envoyez à l’artiste une photo de l’œuvre et de l’emballage dans les 48 heures suivant la livraison. L’œuvre sera réimprimée et renvoyée gratuitement.',
      },
      {
        q: 'Les œuvres sont-elles signées ? Y a-t-il un certificat d’authenticité ?',
        a: 'Oui : chaque œuvre, originale ou tirage, est signée et accompagnée d’un certificat d’authenticité.',
      },
      {
        q: 'Puis-je retourner une œuvre ?',
        a: 'Oui. Si vous êtes un consommateur, vous disposez de 14 jours après la livraison pour vous rétracter, sans avoir à vous justifier. L’œuvre doit revenir intacte et les frais de retour sont à la charge du client ; le remboursement comprend les frais de livraison payés lors de l’achat. Pour tout problème avec une commande, écrivez à l’artiste et vous trouverez une solution ensemble.',
      },
      {
        q: 'Comment être informé des nouvelles œuvres ?',
        a: 'Inscrivez-vous à la newsletter en bas de chaque page : vous recevrez peu d’e-mails, seulement quand il y a de nouvelles œuvres ou de nouveaux tirages. Désinscription possible à tout moment en un clic.',
      },
      {
        q: 'En combien de langues le site est-il disponible ?',
        a: 'Le site est disponible en 7 langues : italien, anglais, espagnol, français, chinois, hindi et arabe.',
      },
      {
        q: 'Comment contacter l’artiste ?',
        a: `Vous pouvez écrire depuis la page Contact ou joindre Boleòn sur Instagram ; pour une œuvre originale, utilisez le bouton « ${c.button} » sur sa page. Les messages arrivent directement à l’artiste.`,
      },
      {
        q: 'Les couleurs du tirage seront-elles identiques à celles de mon écran ?',
        a: 'Les images sont préparées avec soin pour être fidèles, mais chaque écran affiche les couleurs un peu différemment. Le tirage d’art cherche à rester le plus proche possible de l’œuvre originale.',
      },
    ],
  }),

  zh: (c) => ({
    title: '常见问题',
    metaTitle: '常见问题（FAQ）',
    description: '关于 Boleòn 原作、艺术微喷版画、配送、付款、退货及作品真伪的常见问题与解答。',
    intro: '这里解答了关于作品、版画、配送和购买的常见问题。没有找到答案？欢迎直接写信给艺术家。',
    items: [
      {
        q: 'Boleòn 是谁？',
        a: 'Boleòn 是一位水彩艺术家，选择保持匿名：他更希望由作品本身说话，而不是签名者的名字。他创作独一无二的原作，也提供这些作品的艺术微喷版画。',
      },
      {
        q: '在 boleon.it 上可以买到什么？',
        a: '两类作品：手绘的独一无二的原作，以及作品的艺术微喷版画，提供多种尺寸。',
      },
      {
        q: '如何购买原作？',
        a: `原作是独一无二的作品，不能直接在线购买。请在作品页面点击「${c.button}」按钮发送咨询，Boleòn 会亲自通过邮件回复您，商定价格、配送和细节。`,
      },
      {
        q: '版画是怎样的？',
        a: '版画为按需制作的艺术微喷，提供多种尺寸（从欧洲 A 系列尺寸到英寸尺寸），可选艺术纸或画布。版画不带画框寄出，方便您挑选最适合自己空间的画框。',
      },
      {
        q: '版画可以马上发货吗？',
        a: '目前版画为预售：您现在完成购买和付款，版画制作完成后即寄出。由于每幅都是按需制作，所需时间会比平时稍长。',
      },
      {
        q: '接受哪些付款方式？',
        a: '通过 Stripe 使用银行卡安全付款。卡片信息由 Stripe 直接处理，网站不会保存。',
      },
      {
        q: '可以寄往哪些国家？',
        a: `意大利、所有欧盟国家、瑞士、挪威和英国（订单满 ${c.ukMin} 起）、美国、加拿大、日本、韩国、新加坡、澳大利亚、新西兰和阿拉伯联合酋长国。其他国家请写信给艺术家获取报价。每件作品都由 Boleòn 亲自包装和寄出，全程可追踪。`,
      },
      {
        q: '运费是多少？',
        a: `选择收货国家后，付款前即可在购物车中看到运费。意大利 ${c.rate('italy')}。欧盟 ${c.rate('eu')}。瑞士、挪威和英国 ${c.rate('europe')}。世界其他地区 ${c.rate('world')}。美国 ${c.rate('usa')}，另加已计入总价的进口关税。每笔订单只收一次运费，即使包含多幅版画。`,
      },
      {
        q: '多久能收到作品？',
        a: `版画按需制作，由艺术家亲自签名并寄出。通常意大利需要 ${c.weeks('italy')}，欧盟需要 ${c.weeks('eu')}，世界其他地区需要 ${c.weeks('world')}（含清关时间）。原作的时间直接与艺术家商定。`,
      },
      {
        q: '收货时需要支付关税或税费吗？',
        a: '欧盟境内不需要。美国也不需要：进口关税已计入总价，由艺术家在寄出时缴纳。在瑞士、挪威、英国及其他欧盟以外的国家，可能产生的关税、增值税和清关费用由收件人在收货时支付。',
      },
      {
        q: '作品到货时有损坏，怎么办？',
        a: '请在收货后 48 小时内将作品和包装的照片发给艺术家。作品将免费重新印制并再次寄出。',
      },
      {
        q: '作品有签名吗？有真品证书吗？',
        a: '有：每件作品，无论原作还是版画，都有签名并附真品证书。',
      },
      {
        q: '可以退货吗？',
        a: '可以。如果您是消费者，自收货之日起 14 天内可无理由撤销购买。作品须完好退回，退货运费由客户承担；退款包含购买时支付的运费。订单有任何问题，请写信给艺术家，一起找到解决办法。',
      },
      {
        q: '如何了解新作品？',
        a: '在每个页面底部订阅通讯：邮件很少，只在有新作品或新版画时发送。可随时一键退订。',
      },
      {
        q: '网站支持多少种语言？',
        a: '网站提供 7 种语言：意大利语、英语、西班牙语、法语、中文、印地语和阿拉伯语。',
      },
      {
        q: '如何联系艺术家？',
        a: `您可以通过联系页面写信，或在 Instagram 上联系 Boleòn；如需咨询原作，请使用作品页面上的「${c.button}」按钮。所有消息都会直接送达艺术家。`,
      },
      {
        q: '版画的颜色会和屏幕上看到的完全一样吗？',
        a: '图片经过精心处理以尽量还原，但每块屏幕显示的颜色都略有不同。艺术微喷版画力求尽可能接近原作。',
      },
    ],
  }),

  hi: (c) => ({
    title: 'अक्सर पूछे जाने वाले प्रश्न',
    metaTitle: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    description:
      'Boleòn की मूल कलाकृतियों, फ़ाइन आर्ट प्रिंट, शिपिंग, भुगतान, वापसी और प्रामाणिकता से जुड़े प्रश्न और उत्तर।',
    intro:
      'कलाकृतियों, प्रिंट, शिपिंग और ख़रीदारी से जुड़े सबसे आम सवालों के जवाब। जो ढूँढ रहे हैं वह नहीं मिला? बेझिझक कलाकार को लिखें।',
    items: [
      {
        q: 'Boleòn कौन है?',
        a: 'Boleòn एक जलरंग कलाकार हैं जो गुमनाम रहना पसंद करते हैं: वे चाहते हैं कि बात कलाकृतियाँ करें, उन पर हस्ताक्षर करने वाले का नाम नहीं। वे अनोखी मूल कलाकृतियाँ बनाते हैं और उनके फ़ाइन आर्ट प्रिंट भी उपलब्ध कराते हैं।',
      },
      {
        q: 'boleon.it पर मैं क्या ख़रीद सकता हूँ?',
        a: 'दो तरह की कलाकृतियाँ: मूल कलाकृतियाँ, यानी हाथ से बनाई गई अनोखी कृतियाँ, और इन कृतियों के फ़ाइन आर्ट प्रिंट, जो कई आकारों में उपलब्ध हैं।',
      },
      {
        q: 'मूल कलाकृति कैसे ख़रीदें?',
        a: `मूल कलाकृति एक अनोखी कृति है और सीधे ऑनलाइन नहीं ख़रीदी जा सकती। कलाकृति के पेज पर «${c.button}» बटन से अनुरोध भेजें: Boleòn कीमत, शिपिंग और बाकी बातें तय करने के लिए आपको ख़ुद ईमेल से जवाब देंगे।`,
      },
      {
        q: 'प्रिंट कैसे होते हैं?',
        a: 'ये ऑर्डर पर बनाए जाने वाले फ़ाइन आर्ट प्रिंट हैं, जो कई आकारों में (यूरोपीय A सीरीज़ से लेकर इंच वाले आकार तक) फ़ाइन आर्ट पेपर या कैनवास पर उपलब्ध हैं। ये बिना फ़्रेम के भेजे जाते हैं, ताकि आप अपनी जगह के लिए सबसे सही फ़्रेम चुन सकें।',
      },
      {
        q: 'क्या प्रिंट तुरंत उपलब्ध हैं?',
        a: 'फ़िलहाल प्रिंट प्री-ऑर्डर पर हैं: आप अभी ख़रीदारी और भुगतान पूरा करते हैं और प्रिंट तैयार होते ही आपको मिल जाता है। हर प्रिंट ऑर्डर पर बनता है, इसलिए इसमें सामान्य से थोड़ा ज़्यादा समय लगता है।',
      },
      {
        q: 'आप कौन-से भुगतान तरीक़े स्वीकार करते हैं?',
        a: 'भुगतान कार्ड से, Stripe के ज़रिए सुरक्षित रूप से होता है। कार्ड की जानकारी सीधे Stripe संभालता है और साइट उसे कभी सहेजती नहीं है।',
      },
      {
        q: 'आप किन देशों में शिपिंग करते हैं?',
        a: `इटली, यूरोपीय संघ के सभी देश, स्विट्ज़रलैंड, नॉर्वे और यूनाइटेड किंगडम (${c.ukMin} से अधिक के ऑर्डर), अमेरिका, कनाडा, जापान, दक्षिण कोरिया, सिंगापुर, ऑस्ट्रेलिया, न्यूज़ीलैंड और संयुक्त अरब अमीरात। अन्य देशों के लिए कलाकार को लिखें, आपको कोटेशन मिलेगा। Boleòn हर कलाकृति ख़ुद पैक करके भेजते हैं, हमेशा ट्रैकिंग के साथ।`,
      },
      {
        q: 'शिपिंग का ख़र्च कितना है?',
        a: `शिपिंग का देश चुनने पर भुगतान से पहले ही कार्ट में ख़र्च दिख जाता है। इटली ${c.rate('italy')}। यूरोपीय संघ ${c.rate('eu')}। स्विट्ज़रलैंड, नॉर्वे और यूनाइटेड किंगडम ${c.rate('europe')}। बाकी दुनिया ${c.rate('world')}। अमेरिका ${c.rate('usa')}, साथ में आयात शुल्क जो कुल राशि में पहले से शामिल है। हर ऑर्डर पर एक ही बार शिपिंग लगती है, चाहे उसमें कई प्रिंट हों।`,
      },
      {
        q: 'कलाकृति पहुँचने में कितना समय लगता है?',
        a: `प्रिंट ऑर्डर पर बनाए जाते हैं और कलाकार ख़ुद उन पर हस्ताक्षर करके भेजते हैं। आमतौर पर इटली में ${c.weeks('italy')}, यूरोपीय संघ में ${c.weeks('eu')} और बाकी दुनिया में ${c.weeks('world')} लगते हैं, कस्टम सहित। मूल कलाकृतियों का समय सीधे कलाकार के साथ तय होता है।`,
      },
      {
        q: 'क्या डिलीवरी पर मुझे शुल्क या कर देना होगा?',
        a: 'यूरोपीय संघ में नहीं। अमेरिका में भी नहीं, क्योंकि आयात शुल्क कुल राशि में पहले से शामिल है और कलाकार इसे भेजते समय चुका देते हैं। स्विट्ज़रलैंड, नॉर्वे, यूनाइटेड किंगडम और यूरोपीय संघ से बाहर के अन्य देशों में संभावित शुल्क, VAT और कस्टम क्लीयरेंस का ख़र्च प्राप्तकर्ता डिलीवरी के समय चुकाता है।',
      },
      {
        q: 'मेरी कलाकृति क्षतिग्रस्त पहुँची है, मैं क्या करूँ?',
        a: 'डिलीवरी के 48 घंटे के भीतर कलाकृति और पैकेजिंग की फ़ोटो कलाकार को भेजें। कलाकृति दोबारा मुफ़्त में छापकर भेजी जाएगी।',
      },
      {
        q: 'क्या कलाकृतियों पर हस्ताक्षर होते हैं? क्या प्रामाणिकता प्रमाणपत्र मिलता है?',
        a: 'हाँ: हर कलाकृति, चाहे मूल हो या प्रिंट, पर हस्ताक्षर होते हैं और उसके साथ प्रामाणिकता प्रमाणपत्र मिलता है।',
      },
      {
        q: 'क्या मैं कलाकृति वापस कर सकता हूँ?',
        a: 'हाँ। उपभोक्ता होने पर आपके पास डिलीवरी से 14 दिन होते हैं, जिनमें आप बिना कोई कारण बताए ख़रीदारी रद्द कर सकते हैं। कलाकृति सही-सलामत लौटनी चाहिए और वापसी की शिपिंग का ख़र्च ग्राहक उठाता है; रिफ़ंड में ख़रीद के समय चुकाई गई शिपिंग भी शामिल होती है। ऑर्डर से जुड़ी किसी भी समस्या के लिए कलाकार को लिखें, मिलकर हल निकाला जाएगा।',
      },
      {
        q: 'नई कलाकृतियों की जानकारी कैसे मिलेगी?',
        a: 'हर पेज के नीचे न्यूज़लेटर की सदस्यता लें: आपको बहुत कम ईमेल मिलेंगे, सिर्फ़ तब जब नई कलाकृतियाँ या प्रिंट आएँ। आप कभी भी एक क्लिक में सदस्यता छोड़ सकते हैं।',
      },
      {
        q: 'साइट कितनी भाषाओं में उपलब्ध है?',
        a: 'साइट 7 भाषाओं में उपलब्ध है: इतालवी, अंग्रेज़ी, स्पेनिश, फ़्रेंच, चीनी, हिंदी और अरबी।',
      },
      {
        q: 'कलाकार से संपर्क कैसे करें?',
        a: `आप संपर्क पेज से लिख सकते हैं या Instagram पर Boleòn से संपर्क कर सकते हैं; मूल कलाकृति के लिए उसके पेज पर «${c.button}» बटन का उपयोग करें। संदेश सीधे कलाकार तक पहुँचते हैं।`,
      },
      {
        q: 'क्या प्रिंट के रंग स्क्रीन पर दिखने वाले रंगों जैसे ही होंगे?',
        a: 'तस्वीरें मूल के प्रति वफ़ादार रहने के लिए सावधानी से तैयार की गई हैं, लेकिन हर स्क्रीन रंगों को थोड़ा अलग दिखाती है। फ़ाइन आर्ट प्रिंट की कोशिश रहती है कि वह मूल कलाकृति के जितना हो सके उतना क़रीब रहे।',
      },
    ],
  }),

  ar: (c) => ({
    title: 'الأسئلة الشائعة',
    metaTitle: 'الأسئلة الشائعة',
    description:
      'أسئلة وأجوبة حول الأعمال الأصلية لـBoleòn والمطبوعات الفنية والشحن والدفع والإرجاع وأصالة الأعمال.',
    intro:
      'إجابات عن أكثر الأسئلة شيوعًا حول الأعمال والمطبوعات والشحن والشراء. لم تجد ما تبحث عنه؟ يمكنك مراسلة الفنان مباشرة.',
    items: [
      {
        q: 'من هو Boleòn؟',
        a: 'Boleòn فنان يرسم بالألوان المائية ويختار أن يبقى مجهول الهوية: يفضّل أن تتحدث الأعمال لا اسم من يوقّعها. يبدع قطعًا فريدة ويقدّم أيضًا مطبوعات فنية منها.',
      },
      {
        q: 'ماذا يمكنني أن أشتري من boleon.it؟',
        a: 'نوعان من الأعمال: الأعمال الأصلية، وهي قطع فريدة مرسومة باليد، والمطبوعات الفنية لهذه الأعمال، المتوفرة بعدة مقاسات.',
      },
      {
        q: 'كيف أشتري عملًا أصليًا؟',
        a: `العمل الأصلي قطعة فريدة ولا يُشترى مباشرة عبر الإنترنت. من صفحة العمل أرسل طلبًا عبر زر «${c.button}»، وسيرد عليك Boleòn شخصيًا عبر البريد الإلكتروني للاتفاق على السعر والشحن والتفاصيل.`,
      },
      {
        q: 'كيف تعمل المطبوعات؟',
        a: 'هي مطبوعات فنية تُنفَّذ حسب الطلب، متوفرة بعدة مقاسات (من مقاسات السلسلة A الأوروبية إلى المقاسات بالبوصة)، على ورق فني أو قماش. تُشحن من دون إطار، لتختار الإطار الأنسب لمساحتك.',
      },
      {
        q: 'هل المطبوعات متوفرة فورًا؟',
        a: 'المطبوعات حاليًا متاحة للطلب المسبق: تُتمّ الشراء والدفع الآن وتصلك المطبوعة فور جهوزها. ولأن كل مطبوعة تُنفَّذ حسب الطلب، يستغرق تحضيرها وقتًا أطول قليلًا من المعتاد.',
      },
      {
        q: 'ما طرق الدفع المقبولة؟',
        a: 'يتم الدفع بالبطاقة بأمان عبر Stripe. تتولى Stripe معالجة بيانات البطاقة مباشرة ولا يحتفظ بها الموقع.',
      },
      {
        q: 'إلى أي دول تشحنون؟',
        a: `إلى إيطاليا وجميع دول الاتحاد الأوروبي وسويسرا والنرويج والمملكة المتحدة (للطلبات ابتداءً من ${c.ukMin})، وإلى الولايات المتحدة وكندا واليابان وكوريا الجنوبية وسنغافورة وأستراليا ونيوزيلندا والإمارات العربية المتحدة. لباقي الدول راسل الفنان لتحصل على عرض سعر. يحضّر Boleòn كل عمل ويشحنه بنفسه، دائمًا مع خدمة التتبع.`,
      },
      {
        q: 'كم تبلغ تكلفة الشحن؟',
        a: `تظهر التكلفة في سلة التسوق قبل الدفع عند اختيار بلد الشحن. إيطاليا ${c.rate('italy')}. الاتحاد الأوروبي ${c.rate('eu')}. سويسرا والنرويج والمملكة المتحدة ${c.rate('europe')}. باقي العالم ${c.rate('world')}. الولايات المتحدة ${c.rate('usa')}، إضافة إلى رسوم الاستيراد المضمّنة مسبقًا في الإجمالي. تُدفع رسوم شحن واحدة لكل طلب، حتى مع عدة مطبوعات.`,
      },
      {
        q: 'كم يستغرق وصول العمل؟',
        a: `تُنفَّذ المطبوعات حسب الطلب ويوقّعها الفنان ويشحنها بنفسه. يستغرق ذلك عادةً ${c.weeks('italy')} في إيطاليا و${c.weeks('eu')} في الاتحاد الأوروبي و${c.weeks('world')} في باقي العالم، بما في ذلك الجمارك. أما مواعيد الأعمال الأصلية فتُتفق مباشرة مع الفنان.`,
      },
      {
        q: 'هل سأدفع رسومًا أو ضرائب عند الاستلام؟',
        a: 'لا داخل الاتحاد الأوروبي. ولا في الولايات المتحدة أيضًا، لأن رسوم الاستيراد مضمّنة في الإجمالي ويدفعها الفنان عند الشحن. في سويسرا والنرويج والمملكة المتحدة وغيرها من الدول خارج الاتحاد الأوروبي، يتحمّل المستلم أي رسوم جمركية وضريبة قيمة مضافة ومصاريف تخليص، وتُدفع عند الاستلام.',
      },
      {
        q: 'وصل العمل تالفًا، ماذا أفعل؟',
        a: 'أرسل إلى الفنان صورة للعمل وللتغليف خلال 48 ساعة من الاستلام. ستُعاد طباعة العمل وشحنه مجانًا.',
      },
      {
        q: 'هل الأعمال موقّعة؟ وهل توجد شهادة أصالة؟',
        a: 'نعم: كل عمل، أصليًا كان أو مطبوعة، موقّع ومرفق بشهادة أصالة.',
      },
      {
        q: 'هل يمكنني إرجاع عمل؟',
        a: 'نعم. إذا كنت مستهلكًا فلديك 14 يومًا من الاستلام للتراجع عن الشراء من دون إبداء أسباب. يجب أن يعود العمل سليمًا، ويتحمّل العميل تكلفة شحن الإرجاع؛ ويشمل المبلغ المسترد تكلفة الشحن المدفوعة عند الشراء. لأي مشكلة في الطلب راسل الفنان وستجدان حلًا معًا.',
      },
      {
        q: 'كيف أبقى على اطلاع على الأعمال الجديدة؟',
        a: 'اشترك في النشرة البريدية أسفل كل صفحة: ستصلك رسائل قليلة، فقط عند وجود أعمال أو مطبوعات جديدة. ويمكنك إلغاء الاشتراك في أي وقت بنقرة واحدة.',
      },
      {
        q: 'بكم لغة يتوفر الموقع؟',
        a: 'يتوفر الموقع بسبع لغات: الإيطالية والإنجليزية والإسبانية والفرنسية والصينية والهندية والعربية.',
      },
      {
        q: 'كيف أتواصل مع الفنان؟',
        a: `يمكنك الكتابة من صفحة التواصل أو مراسلة Boleòn على Instagram؛ وللعمل الأصلي استخدم زر «${c.button}» في صفحته. تصل الرسائل مباشرة إلى الفنان.`,
      },
      {
        q: 'هل ستكون ألوان المطبوعة مطابقة لما أراه على الشاشة؟',
        a: 'الصور معدّة بعناية لتكون أمينة للأصل، لكن كل شاشة تعرض الألوان بشكل مختلف قليلًا. تسعى المطبوعة الفنية إلى البقاء أقرب ما يمكن إلى العمل الأصلي.',
      },
    ],
  }),
};

const rateWords: Record<Locale, (price: string, free: string | null) => string> = {
  it: (p, f) => (f ? `${p}, gratuita da ${f}` : p),
  en: (p, f) => (f ? `${p}, free from ${f}` : p),
  es: (p, f) => (f ? `${p}, gratis desde ${f}` : p),
  fr: (p, f) => (f ? `${p}, offerte dès ${f}` : p),
  zh: (p, f) => (f ? `${p}，满 ${f} 包邮` : p),
  hi: (p, f) => (f ? `${p}, ${f} या उससे अधिक पर मुफ़्त` : p),
  ar: (p, f) => (f ? `${p}، ومجانًا ابتداءً من ${f}` : p),
};

const weekWords: Record<Locale, (min: string, max: string) => string> = {
  it: (a, b) => `${a}–${b} settimane`,
  en: (a, b) => `${a}–${b} weeks`,
  es: (a, b) => `${a}–${b} semanas`,
  fr: (a, b) => `${a} à ${b} semaines`,
  zh: (a, b) => `${a}–${b} 周`,
  hi: (a, b) => `${a}–${b} सप्ताह`,
  ar: (a, b) => `${a}–${b} أسابيع`,
};

export function getFaq(
  locale: Locale,
  ship: ShippingConfig,
  deliveryWeeks: Record<ShippingZone, [number, number]>,
  button: string
): FaqContent {
  const num = new Intl.NumberFormat(localeMeta[locale].lang);
  const money = (n: number) => formatPrice(n, locale);
  const rate = (z: ZoneRate) =>
    rateWords[locale](money(z.price), z.freeOver > 0 ? money(z.freeOver) : null);
  return content[locale]({
    rate: (zone) => rate(ship.zones[zone]),
    weeks: (zone) => {
      const [min, max] = deliveryWeeks[zone];
      return weekWords[locale](num.format(min), num.format(max));
    },
    ukMin: money(ship.ukMinOrder),
    button,
  });
}
