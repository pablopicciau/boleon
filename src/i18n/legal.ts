// Note legali e privacy nelle 7 lingue del sito. Il testo di riferimento è
// quello italiano: le traduzioni lo indicano in fondo alla pagina.
// Nei testi: **grassetto**, {email} = link all'email di contatto, {date} = data
// dell'ultimo aggiornamento scritta nella lingua della pagina.
import type { Locale } from './index';

/** Data dell'ultimo aggiornamento del testo (da cambiare quando lo si modifica). */
export const LEGAL_UPDATED = '2026-10-23';

/** Un paragrafo, oppure un elenco puntato (array di voci). */
export type LegalBlock = string | string[];
export type LegalSection = { h: string; blocks: LegalBlock[] };
export type LegalContent = {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
  /** Nota in fondo, in piccolo */
  footnote: string;
};

export const legal: Record<Locale, LegalContent> = {
  it: {
    title: 'Note legali e Privacy',
    description: 'Informativa privacy, cookie, pagamenti, spedizioni e resi di boleon.it.',
    intro:
      'Questa pagina spiega come trattiamo i tuoi dati e come funzionano acquisti, spedizioni e resi su questo sito.',
    sections: [
      {
        h: 'Titolare e contatti',
        blocks: [
          "Il sito è gestito dall'artista **Boleòn**. Per qualsiasi richiesta sui tuoi dati, sugli ordini o su questo sito puoi scrivere a {email}.",
        ],
      },
      {
        h: 'Dati che raccogliamo e perché',
        blocks: [
          [
            "**Modulo di contatto e richieste:** quando ci scrivi raccogliamo nome, email e messaggio, solo per risponderti. L'email viene recapitata tramite il servizio Resend.",
            "**Acquisti:** i pagamenti sono gestiti da Stripe. I dati della carta sono trattati direttamente da Stripe e non passano né vengono conservati da questo sito. Per spedire l'ordine raccogliamo nome e indirizzo di spedizione (inseriti durante il pagamento), che vengono comunicati al corriere incaricato della consegna e, per gli Stati Uniti, all'intermediario doganale di Poste Italiane.",
            '**Newsletter:** se ti iscrivi conserviamo il tuo indirizzo email e la lingua del sito che stavi usando, solo per mandarti novità su opere e stampe. L’elenco degli iscritti è gestito tramite Resend. Ogni email contiene un link per disiscriverti con un clic; dopo la disiscrizione non riceverai più nulla.',
            '**Statistiche di visita:** usiamo Umami, uno strumento **senza cookie** e in forma anonima, che non identifica le singole persone. Serve solo a capire quante visite riceve il sito e da quali Paesi.',
          ],
          'Non vendiamo né cediamo i tuoi dati a terzi per finalità di marketing.',
        ],
      },
      {
        h: 'Cookie',
        blocks: [
          "Questo sito **non usa cookie di profilazione o pubblicitari**: per questo non vedi banner sui cookie. Usiamo solo l'archiviazione locale del browser (localStorage) per ricordare il carrello, la lingua e il Paese di spedizione che hai scelto: questi dati restano sul tuo dispositivo e non vengono inviati a noi.",
        ],
      },
      {
        h: 'Servizi di cui ci serviamo',
        blocks: [
          'Per far funzionare il sito ci appoggiamo a questi servizi, ciascuno con la propria informativa privacy: **Stripe** (pagamenti), **Resend** (invio email e newsletter), **Cloudflare** (hosting e sicurezza), **Umami** (statistiche anonime senza cookie), **Poste Italiane** e altri **corrieri** (consegna degli ordini).',
        ],
      },
      {
        h: 'Per quanto tempo conserviamo i dati',
        blocks: [
          "Conserviamo le email delle richieste per il tempo necessario a risponderti e a gestire un eventuale ordine; i dati degli ordini per gli obblighi fiscali e di assistenza; l'email della newsletter finché resti iscritto. Puoi chiederci la cancellazione in qualsiasi momento.",
        ],
      },
      {
        h: 'I tuoi diritti',
        blocks: [
          "Hai il diritto di accedere ai tuoi dati, correggerli, chiederne la cancellazione o limitarne l'uso e di opporti al trattamento. Per esercitarli scrivi a {email}. Puoi inoltre rivolgerti all'autorità per la protezione dei dati competente.",
        ],
      },
      {
        h: 'Spedizioni',
        blocks: [
          "Spediamo in Italia, in tutti i Paesi dell'Unione Europea e in alcuni Paesi extra UE (l'elenco completo è nel carrello; per gli altri Paesi si può chiedere un preventivo). Il costo della spedizione dipende dal Paese, viene mostrato nel carrello prima del pagamento e oltre una certa soglia è gratuito. Ogni opera è preparata, firmata e spedita personalmente dall'artista, sempre con spedizione tracciata. Le stampe sono realizzate su richiesta: i tempi indicativi, preparazione compresa, sono di 2–3 settimane in Italia, 2–4 nell'Unione Europea e 3–6 nel resto del mondo.",
        ],
      },
      {
        h: "Dazi e tasse d'importazione",
        blocks: [
          "Per gli Stati Uniti i dazi d'importazione sono stimati e inclusi nel totale: li versiamo noi al momento della spedizione e il destinatario non paga nulla alla consegna. Per gli altri Paesi fuori dall'Unione Europea eventuali dazi, IVA e spese di sdoganamento sono a carico del destinatario e si pagano alla consegna. Nel Regno Unito spediamo solo ordini sopra la soglia indicata nel carrello, per i quali l'IVA britannica è pagata dal destinatario.",
        ],
      },
      {
        h: 'Opere danneggiate',
        blocks: [
          "Se l'opera arriva danneggiata, inviaci una foto dell'opera e dell'imballo entro 48 ore dalla consegna a {email}: la ristampiamo e la rispediamo gratuitamente.",
        ],
      },
      {
        h: 'Resi e diritto di recesso',
        blocks: [
          "Se sei un consumatore puoi recedere dall'acquisto entro **14 giorni** dalla consegna, senza dover dare spiegazioni. L'opera va restituita integra, nella sua confezione, e le spese di reso sono a carico del cliente. Rimborsiamo l'importo pagato, compresa la spedizione iniziale, entro 14 giorni dal ricevimento dell'opera restituita. Per qualsiasi problema con un ordine scrivici a {email}: troveremo una soluzione.",
        ],
      },
      {
        h: 'Aggiornamenti',
        blocks: ['Questa pagina può essere aggiornata nel tempo. Ultimo aggiornamento: {date}.'],
      },
    ],
    footnote:
      'Questo testo è una base pensata per questo sito. Per esigenze specifiche (es. apertura di partita IVA o obblighi particolari) è consigliabile una verifica con un consulente.',
  },

  en: {
    title: 'Legal notice and Privacy',
    description: 'Privacy policy, cookies, payments, shipping and returns for boleon.it.',
    intro:
      'This page explains how we handle your data and how purchases, shipping and returns work on this site.',
    sections: [
      {
        h: 'Data controller and contact',
        blocks: [
          'This site is run by the artist **Boleòn**. For any request about your data, your orders or this site, write to {email}.',
        ],
      },
      {
        h: 'Data we collect and why',
        blocks: [
          [
            '**Contact and request forms:** when you write to us we collect your name, email and message, only to reply to you. The email is delivered through the Resend service.',
            '**Purchases:** payments are handled by Stripe. Card details are processed directly by Stripe and never pass through or remain on this site. To ship your order we collect your name and shipping address (entered during payment), which are shared with the carrier handling the delivery and, for the United States, with the customs intermediary of Poste Italiane.',
            '**Newsletter:** if you subscribe we keep your email address and the language of the site you were using, only to send you news about artworks and prints. The subscriber list is managed through Resend. Every email contains a one-click unsubscribe link; after unsubscribing you will receive nothing more.',
            '**Visit statistics:** we use Umami, a **cookie-free**, anonymous tool that does not identify individual people. It only tells us how many visits the site receives and from which countries.',
          ],
          'We do not sell or hand over your data to third parties for marketing purposes.',
        ],
      },
      {
        h: 'Cookies',
        blocks: [
          'This site **does not use profiling or advertising cookies**, which is why you see no cookie banner. We only use the browser’s local storage (localStorage) to remember your cart, your language and the shipping country you chose: this data stays on your device and is not sent to us.',
        ],
      },
      {
        h: 'Services we use',
        blocks: [
          'To run the site we rely on these services, each with its own privacy policy: **Stripe** (payments), **Resend** (email and newsletter delivery), **Cloudflare** (hosting and security), **Umami** (anonymous cookie-free statistics), **Poste Italiane** and other **carriers** (order delivery).',
        ],
      },
      {
        h: 'How long we keep data',
        blocks: [
          'We keep request emails as long as needed to reply and to handle any resulting order; order data for tax and customer service obligations; your newsletter email for as long as you stay subscribed. You can ask us to delete your data at any time.',
        ],
      },
      {
        h: 'Your rights',
        blocks: [
          'You have the right to access your data, correct it, ask for its deletion or restrict its use, and to object to its processing. To exercise these rights, write to {email}. You can also contact the competent data protection authority.',
        ],
      },
      {
        h: 'Shipping',
        blocks: [
          'We ship to Italy, to all European Union countries and to selected non-EU countries (the full list is in the cart; for other countries you can ask for a quote). The shipping cost depends on the country, is shown in the cart before payment and becomes free above a certain amount. Every artwork is prepared, signed and shipped personally by the artist, always with tracking. Prints are made to order: indicative times, preparation included, are 2–3 weeks in Italy, 2–4 in the European Union and 3–6 in the rest of the world.',
        ],
      },
      {
        h: 'Import duties and taxes',
        blocks: [
          'For the United States, import duties are estimated and included in the total: we pay them when shipping and the recipient pays nothing on delivery. For other countries outside the European Union, any duties, VAT and clearance fees are paid by the recipient on delivery. To the United Kingdom we only ship orders above the threshold shown in the cart, for which UK VAT is paid by the recipient.',
        ],
      },
      {
        h: 'Damaged artworks',
        blocks: [
          'If the artwork arrives damaged, send us a photo of the artwork and the packaging within 48 hours of delivery to {email}: we will reprint it and ship it again free of charge.',
        ],
      },
      {
        h: 'Returns and right of withdrawal',
        blocks: [
          'If you are a consumer you may withdraw from the purchase within **14 days** of delivery, without giving any reason. The artwork must be returned intact, in its packaging, and return shipping is paid by the customer. We refund the amount paid, including the original shipping, within 14 days of receiving the returned artwork. For any problem with an order, write to us at {email}: we will find a solution.',
        ],
      },
      {
        h: 'Updates',
        blocks: ['This page may be updated over time. Last updated: {date}.'],
      },
    ],
    footnote:
      'This translation is provided for convenience. In case of differences, the Italian version of this page prevails.',
  },

  es: {
    title: 'Aviso legal y Privacidad',
    description: 'Política de privacidad, cookies, pagos, envíos y devoluciones de boleon.it.',
    intro:
      'Esta página explica cómo tratamos tus datos y cómo funcionan las compras, los envíos y las devoluciones en este sitio.',
    sections: [
      {
        h: 'Responsable y contacto',
        blocks: [
          'Este sitio lo gestiona el artista **Boleòn**. Para cualquier consulta sobre tus datos, tus pedidos o este sitio, escribe a {email}.',
        ],
      },
      {
        h: 'Datos que recogemos y por qué',
        blocks: [
          [
            '**Formulario de contacto y solicitudes:** cuando nos escribes recogemos tu nombre, correo y mensaje, solo para responderte. El correo se entrega a través del servicio Resend.',
            '**Compras:** los pagos los gestiona Stripe. Los datos de la tarjeta los trata directamente Stripe y ni pasan por este sitio ni se guardan en él. Para enviar el pedido recogemos tu nombre y dirección de envío (introducidos durante el pago), que se comunican al transportista encargado de la entrega y, para Estados Unidos, al intermediario aduanero de Poste Italiane.',
            '**Newsletter:** si te suscribes guardamos tu dirección de correo y el idioma del sitio que estabas usando, solo para enviarte novedades sobre obras y láminas. La lista de suscriptores se gestiona a través de Resend. Cada correo incluye un enlace para darte de baja con un clic; tras darte de baja no recibirás nada más.',
            '**Estadísticas de visitas:** usamos Umami, una herramienta **sin cookies** y anónima que no identifica a las personas. Solo sirve para saber cuántas visitas recibe el sitio y desde qué países.',
          ],
          'No vendemos ni cedemos tus datos a terceros con fines de marketing.',
        ],
      },
      {
        h: 'Cookies',
        blocks: [
          'Este sitio **no usa cookies de perfilado ni publicitarias**: por eso no ves ningún aviso de cookies. Solo usamos el almacenamiento local del navegador (localStorage) para recordar tu carrito, tu idioma y el país de envío que elegiste: estos datos se quedan en tu dispositivo y no se nos envían.',
        ],
      },
      {
        h: 'Servicios que utilizamos',
        blocks: [
          'Para que el sitio funcione nos apoyamos en estos servicios, cada uno con su propia política de privacidad: **Stripe** (pagos), **Resend** (envío de correos y newsletter), **Cloudflare** (alojamiento y seguridad), **Umami** (estadísticas anónimas sin cookies), **Poste Italiane** y otros **transportistas** (entrega de pedidos).',
        ],
      },
      {
        h: 'Cuánto tiempo conservamos los datos',
        blocks: [
          'Conservamos los correos de las solicitudes el tiempo necesario para responderte y gestionar un posible pedido; los datos de los pedidos, para las obligaciones fiscales y de atención al cliente; el correo de la newsletter, mientras sigas suscrito. Puedes pedirnos que los borremos en cualquier momento.',
        ],
      },
      {
        h: 'Tus derechos',
        blocks: [
          'Tienes derecho a acceder a tus datos, corregirlos, pedir su supresión o limitar su uso, y a oponerte a su tratamiento. Para ejercerlos escribe a {email}. También puedes dirigirte a la autoridad de protección de datos competente.',
        ],
      },
      {
        h: 'Envíos',
        blocks: [
          'Enviamos a Italia, a todos los países de la Unión Europea y a algunos países fuera de la UE (la lista completa está en el carrito; para otros países se puede pedir presupuesto). El coste del envío depende del país, se muestra en el carrito antes del pago y a partir de cierto importe es gratuito. Cada obra la prepara, firma y envía personalmente el artista, siempre con seguimiento. Las láminas se imprimen bajo pedido: los plazos orientativos, preparación incluida, son de 2–3 semanas en Italia, 2–4 en la Unión Europea y 3–6 en el resto del mundo.',
        ],
      },
      {
        h: 'Aranceles e impuestos de importación',
        blocks: [
          'Para Estados Unidos los aranceles de importación se calculan y se incluyen en el total: los pagamos nosotros al enviar y el destinatario no paga nada a la entrega. Para los demás países fuera de la Unión Europea, los posibles aranceles, el IVA y los gastos de aduana corren a cargo del destinatario y se pagan a la entrega. Al Reino Unido solo enviamos pedidos por encima del importe indicado en el carrito, cuyo IVA británico paga el destinatario.',
        ],
      },
      {
        h: 'Obras dañadas',
        blocks: [
          'Si la obra llega dañada, envíanos una foto de la obra y del embalaje en las 48 horas siguientes a la entrega a {email}: la volvemos a imprimir y te la enviamos gratis.',
        ],
      },
      {
        h: 'Devoluciones y derecho de desistimiento',
        blocks: [
          'Si eres consumidor puedes desistir de la compra en un plazo de **14 días** desde la entrega, sin tener que dar explicaciones. La obra debe devolverse intacta, en su embalaje, y los gastos de devolución corren a cargo del cliente. Reembolsamos el importe pagado, incluido el envío inicial, en un plazo de 14 días desde la recepción de la obra devuelta. Para cualquier problema con un pedido escríbenos a {email}: encontraremos una solución.',
        ],
      },
      {
        h: 'Actualizaciones',
        blocks: ['Esta página puede actualizarse con el tiempo. Última actualización: {date}.'],
      },
    ],
    footnote:
      'Esta traducción se ofrece por comodidad. En caso de diferencias, prevalece la versión italiana de esta página.',
  },

  fr: {
    title: 'Mentions légales et Confidentialité',
    description: 'Politique de confidentialité, cookies, paiements, livraison et retours de boleon.it.',
    intro:
      'Cette page explique comment nous traitons vos données et comment fonctionnent les achats, la livraison et les retours sur ce site.',
    sections: [
      {
        h: 'Responsable et contact',
        blocks: [
          'Ce site est géré par l’artiste **Boleòn**. Pour toute demande concernant vos données, vos commandes ou ce site, écrivez à {email}.',
        ],
      },
      {
        h: 'Données collectées et finalités',
        blocks: [
          [
            '**Formulaire de contact et demandes :** lorsque vous nous écrivez, nous recueillons votre nom, votre e-mail et votre message, uniquement pour vous répondre. L’e-mail est acheminé par le service Resend.',
            '**Achats :** les paiements sont gérés par Stripe. Les données de carte sont traitées directement par Stripe et ne transitent ni ne sont conservées sur ce site. Pour expédier la commande, nous recueillons votre nom et votre adresse de livraison (saisis lors du paiement), qui sont communiqués au transporteur chargé de la livraison et, pour les États-Unis, à l’intermédiaire douanier de Poste Italiane.',
            '**Newsletter :** si vous vous inscrivez, nous conservons votre adresse e-mail et la langue du site que vous utilisiez, uniquement pour vous envoyer des nouvelles des œuvres et des tirages. La liste des inscrits est gérée via Resend. Chaque e-mail contient un lien de désinscription en un clic ; après la désinscription, vous ne recevrez plus rien.',
            '**Statistiques de visite :** nous utilisons Umami, un outil **sans cookies** et anonyme qui n’identifie pas les personnes. Il sert uniquement à savoir combien de visites reçoit le site et depuis quels pays.',
          ],
          'Nous ne vendons ni ne cédons vos données à des tiers à des fins de marketing.',
        ],
      },
      {
        h: 'Cookies',
        blocks: [
          'Ce site **n’utilise pas de cookies de profilage ni publicitaires** : c’est pourquoi aucun bandeau cookies ne s’affiche. Nous utilisons seulement le stockage local du navigateur (localStorage) pour mémoriser votre panier, votre langue et le pays de livraison choisi : ces données restent sur votre appareil et ne nous sont pas envoyées.',
        ],
      },
      {
        h: 'Services utilisés',
        blocks: [
          'Pour faire fonctionner le site, nous nous appuyons sur ces services, chacun avec sa propre politique de confidentialité : **Stripe** (paiements), **Resend** (envoi d’e-mails et newsletter), **Cloudflare** (hébergement et sécurité), **Umami** (statistiques anonymes sans cookies), **Poste Italiane** et d’autres **transporteurs** (livraison des commandes).',
        ],
      },
      {
        h: 'Durée de conservation',
        blocks: [
          'Nous conservons les e-mails des demandes le temps nécessaire pour vous répondre et gérer une éventuelle commande ; les données des commandes pour les obligations fiscales et le service client ; l’e-mail de la newsletter tant que vous restez inscrit. Vous pouvez demander leur suppression à tout moment.',
        ],
      },
      {
        h: 'Vos droits',
        blocks: [
          'Vous avez le droit d’accéder à vos données, de les rectifier, d’en demander l’effacement ou d’en limiter l’utilisation, et de vous opposer à leur traitement. Pour exercer ces droits, écrivez à {email}. Vous pouvez aussi vous adresser à l’autorité de protection des données compétente.',
        ],
      },
      {
        h: 'Livraison',
        blocks: [
          'Nous livrons en Italie, dans tous les pays de l’Union européenne et dans certains pays hors UE (la liste complète figure dans le panier ; pour les autres pays, un devis peut être demandé). Le coût de la livraison dépend du pays, il s’affiche dans le panier avant le paiement et devient gratuit au-delà d’un certain montant. Chaque œuvre est préparée, signée et expédiée personnellement par l’artiste, toujours avec suivi. Les tirages sont réalisés à la demande : les délais indicatifs, préparation comprise, sont de 2 à 3 semaines en Italie, 2 à 4 dans l’Union européenne et 3 à 6 dans le reste du monde.',
        ],
      },
      {
        h: 'Droits et taxes d’importation',
        blocks: [
          'Pour les États-Unis, les droits d’importation sont estimés et inclus dans le total : nous les payons à l’expédition et le destinataire ne paie rien à la livraison. Pour les autres pays hors Union européenne, les éventuels droits, la TVA et les frais de dédouanement sont à la charge du destinataire et se paient à la livraison. Au Royaume-Uni, nous n’expédions que les commandes au-delà du seuil indiqué dans le panier, pour lesquelles la TVA britannique est payée par le destinataire.',
        ],
      },
      {
        h: 'Œuvres abîmées',
        blocks: [
          'Si l’œuvre arrive abîmée, envoyez-nous une photo de l’œuvre et de l’emballage dans les 48 heures suivant la livraison à {email} : nous la réimprimons et la renvoyons gratuitement.',
        ],
      },
      {
        h: 'Retours et droit de rétractation',
        blocks: [
          'Si vous êtes un consommateur, vous pouvez vous rétracter dans un délai de **14 jours** à compter de la livraison, sans avoir à vous justifier. L’œuvre doit être retournée intacte, dans son emballage, et les frais de retour sont à la charge du client. Nous remboursons le montant payé, frais de livraison initiaux compris, dans les 14 jours suivant la réception de l’œuvre retournée. Pour tout problème avec une commande, écrivez-nous à {email} : nous trouverons une solution.',
        ],
      },
      {
        h: 'Mises à jour',
        blocks: ['Cette page peut être mise à jour au fil du temps. Dernière mise à jour : {date}.'],
      },
    ],
    footnote:
      'Cette traduction est fournie pour plus de commodité. En cas de divergence, la version italienne de cette page prévaut.',
  },

  zh: {
    title: '法律声明与隐私政策',
    description: 'boleon.it 的隐私政策、Cookie、付款、配送与退货说明。',
    intro: '本页说明我们如何处理您的数据，以及本网站的购买、配送和退货流程。',
    sections: [
      {
        h: '数据控制者与联系方式',
        blocks: ['本网站由艺术家 **Boleòn** 运营。如对您的数据、订单或本网站有任何疑问，请写信至 {email}。'],
      },
      {
        h: '我们收集哪些数据及原因',
        blocks: [
          [
            '**联系表单和咨询：**您给我们写信时，我们会收集您的姓名、邮箱和留言，仅用于回复您。邮件通过 Resend 服务发送。',
            '**购买：**付款由 Stripe 处理。银行卡信息由 Stripe 直接处理，不会经过或保存在本网站。为寄送订单，我们会收集您在付款时填写的姓名和收货地址，并提供给负责配送的快递公司；寄往美国的订单还会提供给意大利邮政（Poste Italiane）的清关代理。',
            '**通讯订阅：**如果您订阅，我们会保存您的邮箱地址以及您当时使用的网站语言，仅用于向您发送作品和版画的最新消息。订阅者名单通过 Resend 管理。每封邮件都包含一键退订链接；退订后您将不会再收到任何邮件。',
            '**访问统计：**我们使用 Umami，这是一款**不使用 Cookie** 的匿名统计工具，不会识别具体个人。它只用于了解网站的访问量和访客所在国家。',
          ],
          '我们不会出售或向第三方提供您的数据用于营销目的。',
        ],
      },
      {
        h: 'Cookie',
        blocks: [
          '本网站**不使用用户画像或广告类 Cookie**，因此您不会看到 Cookie 提示横幅。我们只使用浏览器的本地存储（localStorage）来记住您的购物车、语言和所选的收货国家：这些数据保存在您的设备上，不会发送给我们。',
        ],
      },
      {
        h: '我们使用的服务',
        blocks: [
          '为使网站正常运行，我们使用以下服务，各自都有其隐私政策：**Stripe**（付款）、**Resend**（邮件和通讯发送）、**Cloudflare**（托管与安全）、**Umami**（无 Cookie 的匿名统计）、**意大利邮政**及其他**快递公司**（订单配送）。',
        ],
      },
      {
        h: '数据保存期限',
        blocks: [
          '咨询邮件保存至回复您并处理可能产生的订单所需的时间；订单数据按税务和售后服务义务保存；通讯订阅邮箱在您保持订阅期间保存。您可以随时要求我们删除数据。',
        ],
      },
      {
        h: '您的权利',
        blocks: [
          '您有权访问、更正您的数据，要求删除或限制其使用，并有权反对数据处理。如需行使上述权利，请写信至 {email}。您也可以向主管的数据保护机构投诉。',
        ],
      },
      {
        h: '配送',
        blocks: [
          '我们可寄往意大利、所有欧盟国家及部分欧盟以外的国家（完整名单见购物车；其他国家可询价）。运费取决于国家，付款前会在购物车中显示，订单达到一定金额即可包邮。每件作品都由艺术家亲自包装、签名并寄出，全程可追踪。版画按需制作：含制作时间在内，意大利约需 2–3 周，欧盟约需 2–4 周，世界其他地区约需 3–6 周。',
        ],
      },
      {
        h: '进口关税和税费',
        blocks: [
          '寄往美国的订单，进口关税经估算后已计入总价：由我们在寄出时缴纳，收件人收货时无需支付任何费用。寄往其他欧盟以外国家的订单，可能产生的关税、增值税和清关费用由收件人在收货时支付。寄往英国的订单须超过购物车中显示的最低金额，英国增值税由收件人支付。',
        ],
      },
      {
        h: '作品损坏',
        blocks: [
          '如果作品到货时有损坏，请在收货后 48 小时内将作品和包装的照片发送至 {email}：我们将免费重新印制并再次寄出。',
        ],
      },
      {
        h: '退货与撤销权',
        blocks: [
          '如果您是消费者，可在收货后 **14 天**内无理由撤销购买。作品须完好无损并连同包装一起退回，退货运费由客户承担。我们会在收到退回作品后 14 天内退还所付款项，包括最初的运费。订单如有任何问题，请写信至 {email}：我们会找到解决办法。',
        ],
      },
      {
        h: '更新',
        blocks: ['本页内容可能会不时更新。最近更新：{date}。'],
      },
    ],
    footnote: '本译文仅为方便阅读而提供。如有出入，以本页意大利语版本为准。',
  },

  hi: {
    title: 'कानूनी सूचना और गोपनीयता',
    description: 'boleon.it की गोपनीयता नीति, कुकीज़, भुगतान, शिपिंग और वापसी।',
    intro:
      'यह पेज बताता है कि हम आपके डेटा को कैसे संभालते हैं और इस साइट पर ख़रीदारी, शिपिंग और वापसी कैसे होती है।',
    sections: [
      {
        h: 'डेटा नियंत्रक और संपर्क',
        blocks: [
          'यह साइट कलाकार **Boleòn** द्वारा चलाई जाती है। अपने डेटा, ऑर्डर या इस साइट से जुड़े किसी भी अनुरोध के लिए {email} पर लिखें।',
        ],
      },
      {
        h: 'हम कौन-सा डेटा लेते हैं और क्यों',
        blocks: [
          [
            '**संपर्क और अनुरोध फ़ॉर्म:** जब आप हमें लिखते हैं, हम आपका नाम, ईमेल और संदेश केवल आपको जवाब देने के लिए लेते हैं। ईमेल Resend सेवा के ज़रिए पहुँचाया जाता है।',
            '**ख़रीदारी:** भुगतान Stripe संभालता है। कार्ड की जानकारी सीधे Stripe प्रोसेस करता है; वह न इस साइट से होकर गुज़रती है, न यहाँ सहेजी जाती है। ऑर्डर भेजने के लिए हम आपका नाम और शिपिंग पता (भुगतान के दौरान दर्ज) लेते हैं, जो डिलीवरी करने वाले कूरियर को और अमेरिका के लिए Poste Italiane के कस्टम मध्यस्थ को दिया जाता है।',
            '**न्यूज़लेटर:** सदस्यता लेने पर हम आपका ईमेल पता और उस समय इस्तेमाल हो रही साइट की भाषा सहेजते हैं, केवल आपको कलाकृतियों और प्रिंट की ख़बरें भेजने के लिए। सदस्यों की सूची Resend के ज़रिए संभाली जाती है। हर ईमेल में एक क्लिक में सदस्यता छोड़ने का लिंक होता है; सदस्यता छोड़ने के बाद आपको कुछ नहीं भेजा जाएगा।',
            '**विज़िट के आँकड़े:** हम Umami का उपयोग करते हैं, जो **बिना कुकीज़** वाला गुमनाम टूल है और किसी व्यक्ति की पहचान नहीं करता। यह केवल यह जानने के लिए है कि साइट पर कितनी विज़िट आती हैं और किन देशों से।',
          ],
          'हम आपका डेटा मार्केटिंग के लिए किसी तीसरे पक्ष को न बेचते हैं, न देते हैं।',
        ],
      },
      {
        h: 'कुकीज़',
        blocks: [
          'यह साइट **प्रोफ़ाइलिंग या विज्ञापन वाली कुकीज़ का उपयोग नहीं करती**, इसीलिए आपको कुकी बैनर नहीं दिखता। हम केवल ब्राउज़र के लोकल स्टोरेज (localStorage) का उपयोग आपकी कार्ट, भाषा और चुने गए शिपिंग देश को याद रखने के लिए करते हैं: यह डेटा आपके डिवाइस पर ही रहता है और हमें नहीं भेजा जाता।',
        ],
      },
      {
        h: 'हम किन सेवाओं का उपयोग करते हैं',
        blocks: [
          'साइट चलाने के लिए हम इन सेवाओं का उपयोग करते हैं, जिनकी अपनी-अपनी गोपनीयता नीति है: **Stripe** (भुगतान), **Resend** (ईमेल और न्यूज़लेटर), **Cloudflare** (होस्टिंग और सुरक्षा), **Umami** (बिना कुकीज़ के गुमनाम आँकड़े), **Poste Italiane** और अन्य **कूरियर** (ऑर्डर की डिलीवरी)।',
        ],
      },
      {
        h: 'हम डेटा कितने समय तक रखते हैं',
        blocks: [
          'अनुरोध वाले ईमेल हम उतने समय तक रखते हैं जितना आपको जवाब देने और संभावित ऑर्डर संभालने के लिए ज़रूरी हो; ऑर्डर का डेटा कर और ग्राहक सेवा से जुड़े दायित्वों के लिए; न्यूज़लेटर का ईमेल तब तक, जब तक आप सदस्य बने रहते हैं। आप कभी भी डेटा हटाने का अनुरोध कर सकते हैं।',
        ],
      },
      {
        h: 'आपके अधिकार',
        blocks: [
          'आपको अपने डेटा तक पहुँचने, उसे सुधारने, उसे हटाने या उसके उपयोग को सीमित करने का अनुरोध करने और उसकी प्रोसेसिंग पर आपत्ति करने का अधिकार है। इन अधिकारों के लिए {email} पर लिखें। आप संबंधित डेटा संरक्षण प्राधिकरण से भी संपर्क कर सकते हैं।',
        ],
      },
      {
        h: 'शिपिंग',
        blocks: [
          'हम इटली, यूरोपीय संघ के सभी देशों और यूरोपीय संघ से बाहर के कुछ देशों में शिपिंग करते हैं (पूरी सूची कार्ट में है; अन्य देशों के लिए कोटेशन माँगा जा सकता है)। शिपिंग का ख़र्च देश पर निर्भर करता है, भुगतान से पहले कार्ट में दिखाया जाता है और एक तय राशि से ऊपर मुफ़्त हो जाता है। हर कलाकृति कलाकार ख़ुद तैयार करते, हस्ताक्षर करते और भेजते हैं, हमेशा ट्रैकिंग के साथ। प्रिंट ऑर्डर पर बनाए जाते हैं: तैयारी सहित अनुमानित समय इटली में 2–3 सप्ताह, यूरोपीय संघ में 2–4 और बाकी दुनिया में 3–6 सप्ताह है।',
        ],
      },
      {
        h: 'आयात शुल्क और कर',
        blocks: [
          'अमेरिका के लिए आयात शुल्क का अनुमान लगाकर उसे कुल राशि में शामिल किया जाता है: हम इसे भेजते समय चुकाते हैं और प्राप्तकर्ता को डिलीवरी पर कुछ नहीं देना पड़ता। यूरोपीय संघ से बाहर के अन्य देशों में संभावित शुल्क, VAT और कस्टम क्लीयरेंस का ख़र्च प्राप्तकर्ता डिलीवरी पर चुकाता है। यूनाइटेड किंगडम में हम केवल कार्ट में बताई गई न्यूनतम राशि से ऊपर के ऑर्डर भेजते हैं, जिनका ब्रिटिश VAT प्राप्तकर्ता चुकाता है।',
        ],
      },
      {
        h: 'क्षतिग्रस्त कलाकृतियाँ',
        blocks: [
          'अगर कलाकृति क्षतिग्रस्त पहुँचे, तो डिलीवरी के 48 घंटे के भीतर कलाकृति और पैकेजिंग की फ़ोटो {email} पर भेजें: हम उसे दोबारा छापकर मुफ़्त में फिर से भेजेंगे।',
        ],
      },
      {
        h: 'वापसी और ख़रीद रद्द करने का अधिकार',
        blocks: [
          'उपभोक्ता होने पर आप डिलीवरी से **14 दिनों** के भीतर बिना कोई कारण बताए ख़रीदारी रद्द कर सकते हैं। कलाकृति को सही-सलामत, उसकी पैकेजिंग में लौटाना होगा और वापसी की शिपिंग का ख़र्च ग्राहक उठाता है। लौटाई गई कलाकृति मिलने के 14 दिनों के भीतर हम चुकाई गई राशि लौटा देते हैं, जिसमें शुरुआती शिपिंग भी शामिल है। ऑर्डर से जुड़ी किसी भी समस्या के लिए {email} पर लिखें: हम हल निकालेंगे।',
        ],
      },
      {
        h: 'अपडेट',
        blocks: ['यह पेज समय-समय पर अपडेट हो सकता है। अंतिम अपडेट: {date}।'],
      },
    ],
    footnote:
      'यह अनुवाद सुविधा के लिए दिया गया है। किसी भी अंतर की स्थिति में इस पेज का इतालवी संस्करण मान्य होगा।',
  },

  ar: {
    title: 'الإشعار القانوني والخصوصية',
    description: 'سياسة الخصوصية وملفات تعريف الارتباط والدفع والشحن والإرجاع في boleon.it.',
    intro: 'توضح هذه الصفحة كيف نتعامل مع بياناتك وكيف تتم عمليات الشراء والشحن والإرجاع في هذا الموقع.',
    sections: [
      {
        h: 'المسؤول عن البيانات وطرق التواصل',
        blocks: [
          'يدير هذا الموقع الفنان **Boleòn**. لأي طلب يتعلق ببياناتك أو بطلباتك أو بهذا الموقع، راسلنا على {email}.',
        ],
      },
      {
        h: 'البيانات التي نجمعها ولماذا',
        blocks: [
          [
            '**نموذج التواصل والطلبات:** عندما تراسلنا نجمع اسمك وبريدك الإلكتروني ورسالتك، فقط للرد عليك. تُرسَل الرسالة عبر خدمة Resend.',
            '**الشراء:** تتولى Stripe عمليات الدفع. تعالج Stripe بيانات البطاقة مباشرة، فلا تمر عبر هذا الموقع ولا تُحفظ فيه. ولشحن الطلب نجمع اسمك وعنوان الشحن (اللذين تدخلهما أثناء الدفع)، ونشاركهما مع شركة الشحن المكلّفة بالتوصيل، ومع وسيط التخليص الجمركي التابع لـPoste Italiane بالنسبة إلى الولايات المتحدة.',
            '**النشرة البريدية:** إذا اشتركت نحتفظ ببريدك الإلكتروني وبلغة الموقع التي كنت تستخدمها، فقط لنرسل إليك أخبار الأعمال والمطبوعات. تُدار قائمة المشتركين عبر Resend. تحتوي كل رسالة على رابط لإلغاء الاشتراك بنقرة واحدة، ولن تصلك أي رسالة بعد الإلغاء.',
            '**إحصاءات الزيارات:** نستخدم Umami، وهي أداة **لا تستخدم ملفات تعريف الارتباط** ومجهولة الهوية ولا تتعرّف على الأشخاص. تفيدنا فقط في معرفة عدد زيارات الموقع والدول التي تأتي منها.',
          ],
          'لا نبيع بياناتك ولا نتنازل عنها لأطراف ثالثة لأغراض تسويقية.',
        ],
      },
      {
        h: 'ملفات تعريف الارتباط (الكوكيز)',
        blocks: [
          'هذا الموقع **لا يستخدم ملفات تعريف ارتباط للتنميط أو للإعلانات**، ولذلك لا ترى أي شريط خاص بها. نستخدم فقط التخزين المحلي للمتصفح (localStorage) لتذكّر سلة التسوق واللغة وبلد الشحن الذي اخترته: تبقى هذه البيانات على جهازك ولا تُرسَل إلينا.',
        ],
      },
      {
        h: 'الخدمات التي نستعين بها',
        blocks: [
          'لتشغيل الموقع نعتمد على هذه الخدمات، ولكل منها سياسة خصوصية خاصة بها: **Stripe** (الدفع)، **Resend** (إرسال الرسائل والنشرة البريدية)، **Cloudflare** (الاستضافة والأمان)، **Umami** (إحصاءات مجهولة من دون ملفات تعريف ارتباط)، **Poste Italiane** وغيرها من **شركات الشحن** (توصيل الطلبات).',
        ],
      },
      {
        h: 'مدة الاحتفاظ بالبيانات',
        blocks: [
          'نحتفظ برسائل الطلبات للمدة اللازمة للرد عليك وإدارة أي طلب شراء محتمل، وببيانات الطلبات للوفاء بالالتزامات الضريبية وخدمة العملاء، وبالبريد الإلكتروني للنشرة طالما بقيت مشتركًا. يمكنك أن تطلب حذف بياناتك في أي وقت.',
        ],
      },
      {
        h: 'حقوقك',
        blocks: [
          'يحق لك الاطلاع على بياناتك وتصحيحها وطلب حذفها أو تقييد استخدامها والاعتراض على معالجتها. لممارسة هذه الحقوق راسلنا على {email}. ويمكنك أيضًا التوجّه إلى سلطة حماية البيانات المختصة.',
        ],
      },
      {
        h: 'الشحن',
        blocks: [
          'نشحن إلى إيطاليا وجميع دول الاتحاد الأوروبي وبعض الدول خارجه (القائمة الكاملة في سلة التسوق، ويمكن طلب عرض سعر لباقي الدول). تعتمد تكلفة الشحن على البلد، وتظهر في سلة التسوق قبل الدفع، وتصبح مجانية فوق مبلغ معيّن. يحضّر الفنان كل عمل ويوقّعه ويشحنه بنفسه، دائمًا مع خدمة التتبع. تُنفَّذ المطبوعات حسب الطلب: المدة التقريبية، بما فيها التحضير، هي 2–3 أسابيع في إيطاليا و2–4 في الاتحاد الأوروبي و3–6 في باقي العالم.',
        ],
      },
      {
        h: 'رسوم الاستيراد والضرائب',
        blocks: [
          'بالنسبة إلى الولايات المتحدة تُقدَّر رسوم الاستيراد وتُضمَّن في الإجمالي: ندفعها نحن عند الشحن ولا يدفع المستلم شيئًا عند الاستلام. أما في الدول الأخرى خارج الاتحاد الأوروبي فيتحمّل المستلم أي رسوم جمركية وضريبة قيمة مضافة ومصاريف تخليص، وتُدفع عند الاستلام. إلى المملكة المتحدة نشحن فقط الطلبات التي تتجاوز الحد المبيّن في سلة التسوق، ويدفع المستلم ضريبة القيمة المضافة البريطانية عنها.',
        ],
      },
      {
        h: 'الأعمال التالفة',
        blocks: [
          'إذا وصل العمل تالفًا، أرسل إلينا صورة للعمل وللتغليف خلال 48 ساعة من الاستلام على {email}: سنعيد طباعته ونشحنه مجددًا مجانًا.',
        ],
      },
      {
        h: 'الإرجاع وحق التراجع',
        blocks: [
          'إذا كنت مستهلكًا يمكنك التراجع عن الشراء خلال **14 يومًا** من الاستلام من دون إبداء أسباب. يجب إعادة العمل سليمًا وفي تغليفه، ويتحمّل العميل تكلفة شحن الإرجاع. نردّ المبلغ المدفوع، بما في ذلك تكلفة الشحن الأصلية، خلال 14 يومًا من استلام العمل المُرجَع. لأي مشكلة في الطلب راسلنا على {email}: سنجد حلًا.',
        ],
      },
      {
        h: 'التحديثات',
        blocks: ['قد تُحدَّث هذه الصفحة مع مرور الوقت. آخر تحديث: {date}.'],
      },
    ],
    footnote: 'هذه الترجمة مقدَّمة للتيسير. في حال وجود أي اختلاف، تكون النسخة الإيطالية من هذه الصفحة هي المرجع.',
  },
};
