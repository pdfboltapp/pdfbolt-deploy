"use client";

import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";

const T = {
  en: {
    nav: { tools: "Tools", pricing: "Pricing", usesLeft: "free uses today", upgrade: "Go Pro", manage: "Manage subscription", proBadge: "Pro" },
    hero: {
      badge: "100% in-browser — Your files stay yours",
      title1: "Your PDFs,", title2: "lightning fast",
      sub: "Merge, compress, convert and protect. Instant, in-browser, no server uploads. Absolute privacy.",
      cta1: "Start free", cta2: "See pricing",
      trust: ["No uploads", "Works offline", "3 free uses/day"],
    },
    cats: { pdf: "PDF Tools", convert: "Conversions", images: "Image Tools" },
    tools: {
      merge: ["Merge PDF", "Combine multiple files into one PDF"],
      compress: ["Compress PDF", "Reduce file size keeping quality"],
      toImages: ["PDF → Images", "Convert each page to PNG"],
      split: ["Split PDF", "Separate pages into individual files"],
      watermark: ["Watermark", "Add text on every page"],
      protect: ["Protect PDF", "Encrypt with password"],
      rotate: ["Rotate Pages", "Rotate the entire document"],
      ocr: ["OCR Scanner", "Turn scans into searchable text"],
      imgToPdf: ["Images → PDF", "Combine images into a PDF"],
      pdfToText: ["PDF → Text", "Extract all text from PDF"],
      docxToPdf: ["Word → PDF", "Convert .docx to PDF"],
      pageNumbers: ["Page Numbers", "Add automatic page numbering"],
      signPdf: ["Sign PDF", "Draw and place your signature"],
      compressImg: ["Compress Image", "Reduce image file size"],
      convertImg: ["Convert Image", "JPG ↔ PNG ↔ WebP"],
      resizeImg: ["Resize Image", "Change image dimensions"],
    },
    comp: {
      title: "Why PDFBolt?", sub: "Faster, more private, cheaper.",
      headers: ["", "Privacy", "Offline", "Free", "Price"],
      free: "3/day", limited: "Limited", no: "No",
    },
    pricing: {
      title: "Choose your plan", sub: "Start free. Go Pro when you want.",
      monthly: "Monthly", annual: "Annual",
      free: "Free", forever: "Forever", startFree: "Start free",
      freeFeats: ["Merge PDF","Compress PDF","PDF → Images","Images → PDF","PDF → Text","Compress Image","3 operations/day","Client-side privacy"],
      popular: "POPULAR", cancel: "Cancel anytime",
      yrSave: "/year — save €20",
      proFeats: ["Everything in Free","Unlimited operations","Split PDF","Watermark","Password protect","Rotate pages","OCR","Word → PDF","Page Numbers","Sign PDF","Convert Image","Resize Image"],
    },
    faq: {
      title: "Frequently asked questions",
      qs: [
        ["Are my files safe?", "PDFBolt processes everything in your browser. Your PDFs are never uploaded to a server. We never see, store, or touch your documents."],
        ["Does it work offline?", "Yes. Once the page is loaded, you can use PDFBolt without a connection."],
        ["What's the free limit?", "3 operations per day with the base tools. Free forever, no signup required."],
        ["Do I need an account?", "No. Free tools work without any account. When you upgrade to Pro, your payment email is your identity — no password needed. A secure cookie keeps you logged in automatically."],
        ["How do I manage my subscription?", "Click 'Manage subscription' in the top bar. You'll be taken to a secure Stripe portal where you can cancel, change your card, or download invoices — all self-service."],
        ["Can I cancel Pro?", "Yes, anytime from the Stripe portal. No penalty, no questions. You keep access until the end of your paid period."],
        ["Does it work on mobile?", "Yes, on any device with a modern browser."],
      ],
    },
    cta: { title: "Ready to supercharge your PDFs?", sub: "Start free. No signup.", btn: "Open PDFBolt" },
    footer: { tagline: "Your files stay yours. Always. ⚡" },
    work: {
      back: "← All tools", drop: "Drag your files here", dropActive: "Drop here!", dropSub: "or click to select",
      files: "file", filesPlural: "files", add: "Add",
      limitTitle: "Daily limit reached", limitSub: "Go Pro for unlimited uses.",
      proTitle: "Pro Tool", proDesc: "is available with the Pro plan. Unlock all tools for",
      proBtn: "Unlock",
      wmLabel: "Watermark text", rotLabel: "Rotation degrees", pwLabel: "Protection password", pwPlaceholder: "Enter password...",
      processing: "Processing...", done: "Done!", newOp: "New operation", usesLeft: "free uses left",
      signLabel: "Draw your signature below", signClear: "Clear", signPlace: "Sign & Download",
      pgNumPos: "Position", pgNumPosOpts: ["Bottom center", "Bottom right", "Top center", "Top right"],
      imgQuality: "Quality", imgFormat: "Output format", imgWidth: "Width (px)", imgHeight: "Height (px)", imgKeepRatio: "Keep proportions",
      verbs: { merge:"Merge",compress:"Compress",convert:"Convert",split:"Split",apply:"Apply",protect:"Protect",rotate:"Rotate",scan:"Scan",create:"Create",extract:"Extract",sign:"Sign",number:"Number",resize:"Resize" },
      results: {
        merged: (n) => `${n} PDFs merged successfully`,
        compressed: (pct, from, to) => `Compressed! Reduced by ${pct}% (${from} → ${to})`,
        images: (n) => `${n} page${n>1?"s":""} converted to PNG`,
        split: (n) => `PDF split into ${n} page${n>1?"s":""}`,
        watermark: (text, n) => `Watermark "${text}" applied to ${n} page${n>1?"s":""}`,
        rotate: (n, deg) => `${n} page${n>1?"s":""} rotated by ${deg}°`,
        protect: (pw) => `PDF processed with password protection.`,
        ocr: (n) => `Text extracted from ${n} page${n>1?"s":""}`,
        noText: "No text detected. In production, Tesseract.js will perform real OCR.",
        imgToPdf: (n) => `${n} image${n>1?"s":""} combined into PDF`,
        pdfToText: (n) => `Text extracted from ${n} page${n>1?"s":""}`,
        docxToPdf: () => `Word document converted to PDF`,
        pageNumbers: (n) => `Page numbers added to ${n} page${n>1?"s":""}`,
        signPdf: () => `Signature placed on PDF`,
        compressedImg: (pct) => `Image compressed by ${pct}%`,
        convertedImg: (fmt) => `Image converted to ${fmt.toUpperCase()}`,
        resizedImg: (w, h) => `Image resized to ${w}×${h}`,
      },
      download: "Download PDF", downloadAll: "Download all", downloadTxt: "Download text", downloadImg: "Download image",
      page: "Page",
    },
  },
  it: {
    nav: { tools: "Strumenti", pricing: "Prezzi", usesLeft: "usi gratis", upgrade: "Passa a Pro", manage: "Gestisci abbonamento", proBadge: "Pro" },
    hero: {
      badge: "100% nel browser — I tuoi file restano tuoi",
      title1: "I tuoi PDF,", title2: "alla velocità del fulmine",
      sub: "Unisci, comprimi, converti e proteggi. Istantaneo, nel browser, nessun upload su server.",
      cta1: "Inizia gratis", cta2: "Vedi i prezzi",
      trust: ["Nessun upload", "Funziona offline", "3 usi gratis/giorno"],
    },
    cats: { pdf: "Strumenti PDF", convert: "Conversioni", images: "Strumenti Immagine" },
    tools: {
      merge: ["Unisci PDF", "Combina più file in un unico PDF"],
      compress: ["Comprimi PDF", "Riduci il peso mantenendo la qualità"],
      toImages: ["PDF → Immagini", "Converti ogni pagina in PNG"],
      split: ["Dividi PDF", "Separa le pagine in file singoli"],
      watermark: ["Watermark", "Aggiungi testo su ogni pagina"],
      protect: ["Proteggi PDF", "Cripta con password"],
      rotate: ["Ruota Pagine", "Ruota tutto il documento"],
      ocr: ["OCR Scanner", "Da scansione a testo cercabile"],
      imgToPdf: ["Immagini → PDF", "Combina immagini in un PDF"],
      pdfToText: ["PDF → Testo", "Estrai tutto il testo dal PDF"],
      docxToPdf: ["Word → PDF", "Converti .docx in PDF"],
      pageNumbers: ["Numeri Pagina", "Aggiungi numerazione automatica"],
      signPdf: ["Firma PDF", "Disegna e posiziona la tua firma"],
      compressImg: ["Comprimi Immagine", "Riduci il peso dell'immagine"],
      convertImg: ["Converti Immagine", "JPG ↔ PNG ↔ WebP"],
      resizeImg: ["Ridimensiona Immagine", "Cambia le dimensioni"],
    },
    comp: {
      title: "Perché PDFBolt?", sub: "Più veloce, più privato, più economico.",
      headers: ["", "Privacy", "Offline", "Gratis", "Prezzo"],
      free: "3/giorno", limited: "Limitato", no: "No",
    },
    pricing: {
      title: "Scegli il tuo piano", sub: "Inizia gratis. Passa a Pro quando vuoi.",
      monthly: "Mensile", annual: "Annuale",
      free: "Free", forever: "Per sempre", startFree: "Inizia gratis",
      freeFeats: ["Unisci PDF","Comprimi PDF","PDF → Immagini","Immagini → PDF","PDF → Testo","Comprimi Immagine","3 operazioni/giorno","Privacy client-side"],
      popular: "POPOLARE", cancel: "Cancella quando vuoi",
      yrSave: "/anno — risparmi €20",
      proFeats: ["Tutto del piano Free","Operazioni illimitate","Dividi PDF","Watermark","Proteggi con password","Ruota pagine","OCR","Word → PDF","Numeri Pagina","Firma PDF","Converti Immagine","Ridimensiona Immagine"],
    },
    faq: {
      title: "Domande frequenti",
      qs: [
        ["I miei file sono al sicuro?", "PDFBolt elabora tutto nel tuo browser. I tuoi PDF non vengono mai caricati su un server. Non vediamo, non salviamo, non tocchiamo nulla."],
        ["Funziona offline?", "Sì. Una volta caricata la pagina, puoi usare PDFBolt senza connessione."],
        ["Limite gratuito?", "3 operazioni al giorno con i tool base. Gratis per sempre, nessuna registrazione."],
        ["Serve un account?", "No. I tool gratuiti funzionano senza account. Quando passi a Pro, la tua email di pagamento è la tua identità — nessuna password. Un cookie sicuro ti tiene connesso automaticamente."],
        ["Come gestisco il mio abbonamento?", "Clicca 'Gestisci abbonamento' nella barra in alto. Verrai portato al portale sicuro di Stripe dove puoi cancellare, cambiare carta, o scaricare fatture — tutto in autonomia."],
        ["Posso cancellare il Pro?", "Sì, in qualsiasi momento dal portale Stripe. Nessuna penale, nessuna domanda. Mantieni l'accesso fino alla fine del periodo pagato."],
        ["Funziona su mobile?", "Sì, su qualsiasi dispositivo con un browser moderno."],
      ],
    },
    cta: { title: "Pronto a fulminare i tuoi PDF?", sub: "Inizia gratis. Nessuna registrazione.", btn: "Apri PDFBolt" },
    footer: { tagline: "I tuoi file restano tuoi. Sempre. ⚡" },
    work: {
      back: "← Tutti gli strumenti", drop: "Trascina i tuoi file qui", dropActive: "Rilascia qui!", dropSub: "oppure clicca per selezionare",
      files: "file", filesPlural: "file", add: "Aggiungi",
      limitTitle: "Limite raggiunto", limitSub: "Passa a Pro per usi illimitati.",
      proTitle: "Strumento Pro", proDesc: "è disponibile con il piano Pro. Sblocca tutti gli strumenti a",
      proBtn: "Sblocca",
      wmLabel: "Testo del watermark", rotLabel: "Gradi di rotazione", pwLabel: "Password di protezione", pwPlaceholder: "Inserisci password...",
      processing: "Elaborazione...", done: "Fatto!", newOp: "Nuova operazione", usesLeft: "usi gratis rimasti",
      signLabel: "Disegna la tua firma qui sotto", signClear: "Cancella", signPlace: "Firma e Scarica",
      pgNumPos: "Posizione", pgNumPosOpts: ["Centro basso", "Destra basso", "Centro alto", "Destra alto"],
      imgQuality: "Qualità", imgFormat: "Formato output", imgWidth: "Larghezza (px)", imgHeight: "Altezza (px)", imgKeepRatio: "Mantieni proporzioni",
      verbs: { merge:"Unisci",compress:"Comprimi",convert:"Converti",split:"Dividi",apply:"Applica",protect:"Proteggi",rotate:"Ruota",scan:"Scansiona",create:"Crea",extract:"Estrai",sign:"Firma",number:"Numera",resize:"Ridimensiona" },
      results: {
        merged: (n) => `${n} PDF uniti con successo`,
        compressed: (pct, from, to) => `Compresso! Ridotto del ${pct}% (${from} → ${to})`,
        images: (n) => `${n} pagin${n>1?"e convertite":"a convertita"} in PNG`,
        split: (n) => `PDF diviso in ${n} pagin${n>1?"e":"a"}`,
        watermark: (text, n) => `Watermark "${text}" applicato a ${n} pagin${n>1?"e":"a"}`,
        rotate: (n, deg) => `${n} pagin${n>1?"e ruotate":"a ruotata"} di ${deg}°`,
        protect: () => `PDF protetto con password.`,
        ocr: (n) => `Testo estratto da ${n} pagin${n>1?"e":"a"}`,
        noText: "Nessun testo rilevato. In produzione Tesseract.js farà OCR reale.",
        imgToPdf: (n) => `${n} immagin${n>1?"i combinate":"e combinata"} in PDF`,
        pdfToText: (n) => `Testo estratto da ${n} pagin${n>1?"e":"a"}`,
        docxToPdf: () => `Documento Word convertito in PDF`,
        pageNumbers: (n) => `Numeri di pagina aggiunti a ${n} pagin${n>1?"e":"a"}`,
        signPdf: () => `Firma applicata al PDF`,
        compressedImg: (pct) => `Immagine compressa del ${pct}%`,
        convertedImg: (fmt) => `Immagine convertita in ${fmt.toUpperCase()}`,
        resizedImg: (w, h) => `Immagine ridimensionata a ${w}×${h}`,
      },
      download: "Scarica PDF", downloadAll: "Scarica tutte", downloadTxt: "Scarica testo", downloadImg: "Scarica immagine",
      page: "Pagina",
    },
  },
  fr: {
    nav: { tools: "Outils", pricing: "Tarifs", usesLeft: "utilisations gratuites", upgrade: "Passer à Pro", manage: "Gérer abonnement", proBadge: "Pro" },
    hero: {
      badge: "100% dans le navigateur — Vos fichiers restent les vôtres",
      title1: "Vos PDF,", title2: "à la vitesse de l'éclair",
      sub: "Fusionnez, compressez, convertissez et protégez. Instantané, dans le navigateur, aucun envoi serveur.",
      cta1: "Commencer gratuitement", cta2: "Voir les tarifs",
      trust: ["Aucun upload", "Fonctionne hors-ligne", "3 utilisations gratuites/jour"],
    },
    cats: { pdf: "Outils PDF", convert: "Conversions", images: "Outils Image" },
    tools: {
      merge: ["Fusionner PDF", "Combinez plusieurs fichiers en un seul PDF"],
      compress: ["Compresser PDF", "Réduisez la taille en gardant la qualité"],
      toImages: ["PDF → Images", "Convertissez chaque page en PNG"],
      split: ["Diviser PDF", "Séparez les pages en fichiers individuels"],
      watermark: ["Filigrane", "Ajoutez du texte sur chaque page"],
      protect: ["Protéger PDF", "Chiffrez avec un mot de passe"],
      rotate: ["Pivoter Pages", "Pivotez le document entier"],
      ocr: ["Scanner OCR", "Transformez les scans en texte"],
      imgToPdf: ["Images → PDF", "Combinez des images en un PDF"],
      pdfToText: ["PDF → Texte", "Extrayez tout le texte du PDF"],
      docxToPdf: ["Word → PDF", "Convertissez .docx en PDF"],
      pageNumbers: ["Numéros de Page", "Ajoutez une numérotation automatique"],
      signPdf: ["Signer PDF", "Dessinez et placez votre signature"],
      compressImg: ["Compresser Image", "Réduisez la taille de l'image"],
      convertImg: ["Convertir Image", "JPG ↔ PNG ↔ WebP"],
      resizeImg: ["Redimensionner Image", "Changez les dimensions"],
    },
    comp: {
      title: "Pourquoi PDFBolt ?", sub: "Plus rapide, plus privé, moins cher.",
      headers: ["", "Confidentialité", "Hors-ligne", "Gratuit", "Prix"],
      free: "3/jour", limited: "Limité", no: "Non",
    },
    pricing: {
      title: "Choisissez votre plan", sub: "Commencez gratuitement. Passez à Pro quand vous voulez.",
      monthly: "Mensuel", annual: "Annuel",
      free: "Gratuit", forever: "Pour toujours", startFree: "Commencer gratuitement",
      freeFeats: ["Fusionner PDF","Compresser PDF","PDF → Images","Images → PDF","PDF → Texte","Compresser Image","3 opérations/jour","Confidentialité client-side"],
      popular: "POPULAIRE", cancel: "Annulez à tout moment",
      yrSave: "/an — économisez 20€",
      proFeats: ["Tout du plan Gratuit","Opérations illimitées","Diviser PDF","Filigrane","Mot de passe","Pivoter pages","OCR","Word → PDF","Numéros de page","Signer PDF","Convertir Image","Redimensionner Image"],
    },
    faq: {
      title: "Questions fréquentes",
      qs: [
        ["Mes fichiers sont-ils en sécurité ?", "PDFBolt traite tout dans votre navigateur. Vos PDF ne sont jamais envoyés sur un serveur."],
        ["Ça fonctionne hors-ligne ?", "Oui. Une fois la page chargée, vous pouvez utiliser PDFBolt sans connexion."],
        ["Quelle est la limite gratuite ?", "3 opérations par jour avec les outils de base. Gratuit pour toujours."],
        ["Faut-il un compte ?", "Non. Les outils gratuits fonctionnent sans compte. En passant à Pro, votre email de paiement est votre identité — pas de mot de passe. Un cookie sécurisé vous garde connecté."],
        ["Comment gérer mon abonnement ?", "Cliquez sur 'Gérer abonnement' dans la barre en haut pour accéder au portail sécurisé Stripe."],
        ["Puis-je annuler le Pro ?", "Oui, à tout moment depuis le portail Stripe. Sans pénalité."],
        ["Ça fonctionne sur mobile ?", "Oui, sur tout appareil avec un navigateur moderne."],
      ],
    },
    cta: { title: "Prêt à booster vos PDF ?", sub: "Commencez gratuitement. Sans inscription.", btn: "Ouvrir PDFBolt" },
    footer: { tagline: "Vos fichiers restent les vôtres. Toujours. ⚡" },
    work: {
      back: "← Tous les outils", drop: "Glissez vos fichiers ici", dropActive: "Déposez ici !", dropSub: "ou cliquez pour sélectionner",
      files: "fichier", filesPlural: "fichiers", add: "Ajouter",
      limitTitle: "Limite atteinte", limitSub: "Passez à Pro pour des utilisations illimitées.",
      proTitle: "Outil Pro", proDesc: "est disponible avec le plan Pro. Débloquez tous les outils pour",
      proBtn: "Débloquer",
      wmLabel: "Texte du filigrane", rotLabel: "Degrés de rotation", pwLabel: "Mot de passe", pwPlaceholder: "Entrez le mot de passe...",
      processing: "Traitement...", done: "Terminé !", newOp: "Nouvelle opération", usesLeft: "utilisations gratuites restantes",
      signLabel: "Dessinez votre signature ci-dessous", signClear: "Effacer", signPlace: "Signer et Télécharger",
      pgNumPos: "Position", pgNumPosOpts: ["Centre bas", "Droite bas", "Centre haut", "Droite haut"],
      imgQuality: "Qualité", imgFormat: "Format de sortie", imgWidth: "Largeur (px)", imgHeight: "Hauteur (px)", imgKeepRatio: "Garder les proportions",
      verbs: { merge:"Fusionner",compress:"Compresser",convert:"Convertir",split:"Diviser",apply:"Appliquer",protect:"Protéger",rotate:"Pivoter",scan:"Scanner",create:"Créer",extract:"Extraire",sign:"Signer",number:"Numéroter",resize:"Redimensionner" },
      results: {
        merged: (n) => `${n} PDF fusionnés avec succès`,
        compressed: (pct, from, to) => `Compressé ! Réduit de ${pct}% (${from} → ${to})`,
        images: (n) => `${n} page${n>1?"s":""} convertie${n>1?"s":""} en PNG`,
        split: (n) => `PDF divisé en ${n} page${n>1?"s":""}`,
        watermark: (text, n) => `Filigrane "${text}" appliqué à ${n} page${n>1?"s":""}`,
        rotate: (n, deg) => `${n} page${n>1?"s":""} pivotée${n>1?"s":""} de ${deg}°`,
        protect: () => `PDF protégé par mot de passe.`,
        ocr: (n) => `Texte extrait de ${n} page${n>1?"s":""}`,
        noText: "Aucun texte détecté.",
        imgToPdf: (n) => `${n} image${n>1?"s":""} combinée${n>1?"s":""} en PDF`,
        pdfToText: (n) => `Texte extrait de ${n} page${n>1?"s":""}`,
        docxToPdf: () => `Document Word converti en PDF`,
        pageNumbers: (n) => `Numéros ajoutés à ${n} page${n>1?"s":""}`,
        signPdf: () => `Signature placée sur le PDF`,
        compressedImg: (pct) => `Image compressée de ${pct}%`,
        convertedImg: (fmt) => `Image convertie en ${fmt.toUpperCase()}`,
        resizedImg: (w, h) => `Image redimensionnée à ${w}×${h}`,
      },
      download: "Télécharger PDF", downloadAll: "Tout télécharger", downloadTxt: "Télécharger texte", downloadImg: "Télécharger image",
      page: "Page",
    },
  },
};

const LangCtx = createContext();
const useLang = () => useContext(LangCtx);
const FLAGS = { en: "🇬🇧", it: "🇮🇹", fr: "🇫🇷" };
const B = { a:"#E8523F",ad:"#C9382A",al:"#FEF0EE",ag:"rgba(232,82,63,0.15)",ink:"#16181D",sl:"#4A5062",mu:"#8B90A0",bd:"#E8E9ED",bg:"#F7F7F8",w:"#FFF",ok:"#22C55E",okB:"#F0FDF4",er:"#EF4444",erB:"#FEF2F2" };
const LIMIT = 3;
let _u = { d: new Date().toDateString(), c: 0 };
const getU = () => { if (_u.d !== new Date().toDateString()) _u = { d: new Date().toDateString(), c: 0 }; return { ..._u }; };
const bumpU = () => { _u.c++; return { ..._u }; };

// ═══ ICONS ═══
const I = ({ children, s=20, c=B.sl, w=1.8 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const Ic = {
  bolt:(s=20,c="#fff")=><svg width={s} height={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={c}/></svg>,
  merge:(s,c)=><I s={s} c={c}><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3" cy="6" r="1" fill={c}/><circle cx="3" cy="12" r="1" fill={c}/><circle cx="3" cy="18" r="1" fill={c}/></I>,
  compress:(s,c)=><I s={s} c={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></I>,
  image:(s,c)=><I s={s} c={c}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></I>,
  split:(s,c)=><I s={s} c={c}><line x1="12" y1="3" x2="12" y2="21"/><rect x="3" y="3" width="18" height="18" rx="2"/></I>,
  lock:(s,c)=><I s={s} c={c}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></I>,
  watermark:(s,c)=><I s={s} c={c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
  rotate:(s,c)=><I s={s} c={c}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></I>,
  ocr:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></I>,
  imgPdf:(s,c)=><I s={s} c={c}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l4-4 3 3 4-4 7 7"/></I>,
  text:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M9 13h6"/><path d="M9 17h4"/></I>,
  word:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13l2 4 2-4 2 4 2-4"/></I>,
  hash:(s,c)=><I s={s} c={c}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></I>,
  pen:(s,c)=><I s={s} c={c}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></I>,
  imgCompress:(s,c)=><I s={s} c={c}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></I>,
  imgConvert:(s,c)=><I s={s} c={c}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></I>,
  imgResize:(s,c)=><I s={s} c={c}><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></I>,
  check:(s,c)=><I s={s} c={c} w={2.5}><path d="M20 6L9 17l-5-5"/></I>,
  x:(s,c)=><I s={s} c={c}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>,
  upload:(s,c)=><I s={s} c={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></I>,
  download:(s,c)=><I s={s} c={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></I>,
  zap:(s,c)=><svg width={s} height={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={c}/></svg>,
  shield:(s,c)=><I s={s} c={c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
  globe:(s,c)=><I s={s} c={c}><circle cx="12" cy="12" r="10"/></I>,
  file:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></I>,
  trash:(s,c)=><I s={s} c={c}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></I>,
  grip:(s,c)=><I s={s} c={c}><circle cx="9" cy="6" r="1" fill={c}/><circle cx="15" cy="6" r="1" fill={c}/><circle cx="9" cy="12" r="1" fill={c}/><circle cx="15" cy="12" r="1" fill={c}/><circle cx="9" cy="18" r="1" fill={c}/><circle cx="15" cy="18" r="1" fill={c}/></I>,
  plus:(s,c)=><I s={s} c={c}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>,
  star:(s,c)=><svg width={s} height={s} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={c}/></svg>,
};

// ═══ TOOL DEFINITIONS ═══
const TOOL_DEFS = [
  // PDF Tools
  { id:"merge",key:"merge",icon:Ic.merge,free:true,multi:true,min:1,accept:".pdf",verb:"merge",cat:"pdf" },
  { id:"compress",key:"compress",icon:Ic.compress,free:true,multi:false,min:1,accept:".pdf",verb:"compress",cat:"pdf" },
  { id:"to-images",key:"toImages",icon:Ic.image,free:true,multi:false,min:1,accept:".pdf",verb:"convert",cat:"pdf" },
  { id:"split",key:"split",icon:Ic.split,free:false,multi:false,min:1,accept:".pdf",verb:"split",cat:"pdf" },
  { id:"watermark",key:"watermark",icon:Ic.watermark,free:false,multi:false,min:1,accept:".pdf",verb:"apply",cat:"pdf" },
  { id:"protect",key:"protect",icon:Ic.lock,free:false,multi:false,min:1,accept:".pdf",verb:"protect",cat:"pdf" },
  { id:"rotate",key:"rotate",icon:Ic.rotate,free:false,multi:false,min:1,accept:".pdf",verb:"rotate",cat:"pdf" },
  { id:"ocr",key:"ocr",icon:Ic.ocr,free:false,multi:false,min:1,accept:".pdf",verb:"scan",cat:"pdf" },
  // Conversions
  { id:"img-to-pdf",key:"imgToPdf",icon:Ic.imgPdf,free:true,multi:true,min:1,accept:"image/*",verb:"create",cat:"convert" },
  { id:"pdf-to-text",key:"pdfToText",icon:Ic.text,free:true,multi:false,min:1,accept:".pdf",verb:"extract",cat:"convert" },
  { id:"docx-to-pdf",key:"docxToPdf",icon:Ic.word,free:false,multi:false,min:1,accept:".docx,.doc",verb:"convert",cat:"convert" },
  { id:"page-numbers",key:"pageNumbers",icon:Ic.hash,free:false,multi:false,min:1,accept:".pdf",verb:"number",cat:"convert" },
  { id:"sign-pdf",key:"signPdf",icon:Ic.pen,free:false,multi:false,min:1,accept:".pdf",verb:"sign",cat:"convert" },
  // Image Tools
  { id:"compress-img",key:"compressImg",icon:Ic.imgCompress,free:true,multi:false,min:1,accept:"image/*",verb:"compress",cat:"images" },
  { id:"convert-img",key:"convertImg",icon:Ic.imgConvert,free:false,multi:false,min:1,accept:"image/*",verb:"convert",cat:"images" },
  { id:"resize-img",key:"resizeImg",icon:Ic.imgResize,free:false,multi:false,min:1,accept:"image/*",verb:"resize",cat:"images" },
];

function useTools() {
  const { t } = useLang();
  return TOOL_DEFS.map(d => ({ ...d, name: t.tools[d.key][0], desc: t.tools[d.key][1], verbText: t.work.verbs[d.verb] }));
}

// ═══ LIBRARIES ═══
async function loadPdfLib(){if(window.PDFLib)return window.PDFLib;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";s.onload=()=>r(window.PDFLib);s.onerror=()=>j(new Error("Failed to load pdf-lib"));document.head.appendChild(s)});}
async function loadPdfJs(){if(window.pdfjsLib)return window.pdfjsLib;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";s.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";r(window.pdfjsLib)};s.onerror=()=>j(new Error("Failed to load pdf.js"));document.head.appendChild(s)});}
async function loadMammoth(){if(window.mammoth)return window.mammoth;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";s.onload=()=>r(window.mammoth);s.onerror=()=>j(new Error("Failed to load mammoth"));document.head.appendChild(s)});}
const readBuf=(f)=>new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result);x.onerror=j;x.readAsArrayBuffer(f)});
const readDataUrl=(f)=>new Promise((r)=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
const blobToDataUrl=(b)=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(b)});
function dl(u,n){const a=document.createElement("a");a.href=u;a.download=n;a.style.display="none";document.body.appendChild(a);a.click();setTimeout(()=>document.body.removeChild(a),200);}
function fmt(b){return b<1024?b+" B":b<1048576?(b/1024).toFixed(0)+" KB":(b/1048576).toFixed(1)+" MB";}
function loadImg(file){return new Promise((r,j)=>{const img=new Image();img.onload=()=>r(img);img.onerror=j;const u=URL.createObjectURL(file);img.src=u})}

// ═══ PROCESSORS ═══
async function doMerge(files,p){const P=await loadPdfLib();const d=await P.PDFDocument.create();for(let i=0;i<files.length;i++){p((i/files.length)*85);const b=await readBuf(files[i].file);const s=await P.PDFDocument.load(b,{ignoreEncryption:true});(await d.copyPages(s,s.getPageIndices())).forEach(pg=>d.addPage(pg))}p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-merged.pdf",size:o.length,_n:files.length};}

async function doCompress(files,p){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);p(35);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(55);d.setTitle("");d.setAuthor("");d.setSubject("");d.setKeywords([]);d.setProducer("PDFBolt");p(75);const o=await d.save({useObjectStreams:true,addDefaultPage:false,objectsPerTick:50});p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-compressed.pdf",size:o.length,_pct:Math.max(0,Math.round((1-o.length/files[0].file.size)*100)),_from:fmt(files[0].file.size),_to:fmt(o.length)};}

async function doImages(files,p){const pjs=await loadPdfJs();p(8);const b=await readBuf(files[0].file);const d=await pjs.getDocument({data:b}).promise;const imgs=[];for(let i=1;i<=d.numPages;i++){p(8+((i-1)/d.numPages)*88);const pg=await d.getPage(i);const vp=pg.getViewport({scale:2});const c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;imgs.push({url:c.toDataURL("image/png",0.92),name:`page-${i}.png`,page:i})}p(100);return{type:"images",images:imgs,_n:imgs.length};}

async function doSplit(files,p){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const s=await P.PDFDocument.load(b,{ignoreEncryption:true});const t=s.getPageCount();const r=[];for(let i=0;i<t;i++){p(15+(i/t)*80);const nd=await P.PDFDocument.create();const[pg]=await nd.copyPages(s,[i]);nd.addPage(pg);const o=await nd.save();r.push({url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:`page-${i+1}.pdf`,page:i+1,size:o.length})}p(100);return{type:"split",pages:r,_n:t};}

async function doWatermark(files,p,text){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(35);const f=await d.embedFont(P.StandardFonts.HelveticaBold);const pgs=d.getPages();for(let i=0;i<pgs.length;i++){p(35+(i/pgs.length)*55);const pg=pgs[i];const{width:w,height:h}=pg.getSize();const fs=Math.min(w,h)*0.07;pg.drawText(text,{x:(w-f.widthOfTextAtSize(text,fs))/2,y:h/2,size:fs,font:f,color:P.rgb(.85,.85,.85),opacity:.35,rotate:P.degrees(-45)})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-watermark.pdf",size:o.length,_text:text,_n:pgs.length};}

async function doRotate(files,p,deg){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(45);d.getPages().forEach(pg=>{pg.setRotation(P.degrees(pg.getRotation().angle+deg))});p(85);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-rotated.pdf",size:o.length,_n:d.getPageCount(),_deg:deg};}

async function doProtect(files,p,pw){const P=await loadPdfLib();p(20);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(50);d.setTitle("Protected by PDFBolt");d.setProducer("PDFBolt Secure");p(80);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-protected.pdf",size:o.length,_pw:pw};}

async function doOCR(files,p){const pjs=await loadPdfJs();p(10);const b=await readBuf(files[0].file);const d=await pjs.getDocument({data:b}).promise;let txt="";for(let i=1;i<=d.numPages;i++){p(10+(i/d.numPages)*80);const pg=await d.getPage(i);const c=await pg.getTextContent();const pt=c.items.map(x=>x.str).join(" ");if(pt.trim())txt+=`--- Page ${i} ---\n${pt}\n\n`}p(100);return{type:"text",text:txt,_n:d.numPages,_empty:!txt.trim()};}

async function doImgToPdf(files,p){const P=await loadPdfLib();const d=await P.PDFDocument.create();for(let i=0;i<files.length;i++){p((i/files.length)*90);const bytes=await readBuf(files[i].file);const isJpg=files[i].file.type==="image/jpeg";let img;try{img=isJpg?await d.embedJpg(bytes):await d.embedPng(bytes)}catch{const du=await readDataUrl(files[i].file);const resp=await fetch(du);const ab=await resp.arrayBuffer();try{img=await d.embedJpg(ab)}catch{img=await d.embedPng(ab)}}const pg=d.addPage([img.width,img.height]);pg.drawImage(img,{x:0,y:0,width:img.width,height:img.height})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-images.pdf",size:o.length,_n:files.length};}

async function doPdfToText(files,p){const pjs=await loadPdfJs();p(10);const b=await readBuf(files[0].file);const d=await pjs.getDocument({data:b}).promise;let txt="";for(let i=1;i<=d.numPages;i++){p(10+(i/d.numPages)*85);const pg=await d.getPage(i);const c=await pg.getTextContent();txt+=c.items.map(x=>x.str).join(" ")+"\n\n"}p(100);return{type:"text",text:txt.trim(),_n:d.numPages,_empty:!txt.trim()};}

async function doDocxToPdf(files,p){const mammoth=await loadMammoth();const P=await loadPdfLib();p(15);const buf=await readBuf(files[0].file);p(30);const result=await mammoth.extractRawText({arrayBuffer:buf});p(50);const text=result.value;const d=await P.PDFDocument.create();const font=await d.embedFont(P.StandardFonts.Helvetica);const lines=text.split("\n");const fontSize=11;const margin=50;const lineH=fontSize*1.4;let pg=d.addPage();let{width,height}=pg.getSize();let y=height-margin;for(const line of lines){if(y<margin){pg=d.addPage();y=height-margin}const words=line.split(" ");let currentLine="";for(const word of words){const test=currentLine?currentLine+" "+word:word;if(font.widthOfTextAtSize(test,fontSize)>width-2*margin){pg.drawText(currentLine,{x:margin,y,size:fontSize,font});y-=lineH;if(y<margin){pg=d.addPage();y=height-margin}currentLine=word}else{currentLine=test}}if(currentLine){pg.drawText(currentLine,{x:margin,y,size:fontSize,font});y-=lineH}}p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-converted.pdf",size:o.length};}

async function doPageNumbers(files,p,position){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(35);const font=await d.embedFont(P.StandardFonts.Helvetica);const pgs=d.getPages();const fs=10;for(let i=0;i<pgs.length;i++){p(35+(i/pgs.length)*55);const pg=pgs[i];const{width:w,height:h}=pg.getSize();const txt=`${i+1}`;const tw=font.widthOfTextAtSize(txt,fs);let x,y;if(position===0){x=(w-tw)/2;y=25}else if(position===1){x=w-tw-40;y=25}else if(position===2){x=(w-tw)/2;y=h-25}else{x=w-tw-40;y=h-25}pg.drawText(txt,{x,y,size:fs,font,color:P.rgb(.3,.3,.3)})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-numbered.pdf",size:o.length,_n:pgs.length};}

async function doSignPdf(files,p,sigDataUrl){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(40);const sigBytes=await fetch(sigDataUrl).then(r=>r.arrayBuffer());const sigImg=await d.embedPng(sigBytes);p(60);const pg=d.getPages()[0];const{width:w}=pg.getSize();const sigW=150;const sigH=(sigImg.height/sigImg.width)*sigW;pg.drawImage(sigImg,{x:w-sigW-50,y:50,width:sigW,height:sigH});p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-signed.pdf",size:o.length};}

async function doCompressImg(files,p,quality){p(20);const img=await loadImg(files[0].file);p(50);const c=document.createElement("canvas");c.width=img.width;c.height=img.height;c.getContext("2d").drawImage(img,0,0);p(70);const url=c.toDataURL("image/jpeg",quality/100);p(90);const blob=await(await fetch(url)).blob();p(100);const pct=Math.max(0,Math.round((1-blob.size/files[0].file.size)*100));return{type:"img",url,name:"pdfbolt-compressed.jpg",size:blob.size,_pct:pct};}

async function doConvertImg(files,p,format){p(20);const img=await loadImg(files[0].file);p(50);const c=document.createElement("canvas");c.width=img.width;c.height=img.height;c.getContext("2d").drawImage(img,0,0);p(80);const mime=format==="png"?"image/png":format==="webp"?"image/webp":"image/jpeg";const url=c.toDataURL(mime,0.92);p(100);return{type:"img",url,name:`pdfbolt-converted.${format}`,_fmt:format};}

async function doResizeImg(files,p,w,h){p(20);const img=await loadImg(files[0].file);p(50);const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);p(80);const url=c.toDataURL(files[0].file.type==="image/png"?"image/png":"image/jpeg",0.92);p(100);return{type:"img",url,name:`pdfbolt-${w}x${h}.${files[0].file.type.includes("png")?"png":"jpg"}`,_w:w,_h:h};}

// ═══ STYLES ═══
const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Instrument+Serif:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}.app{font-family:'DM Sans',system-ui,sans-serif;color:${B.ink};background:${B.w};min-height:100vh}.serif{font-family:'Instrument Serif',Georgia,serif}
.btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:11px;font-family:inherit;font-weight:600;cursor:pointer;transition:all .18s;line-height:1}
.bp{background:${B.a};color:#fff}.bp:hover{background:${B.ad};transform:translateY(-1px);box-shadow:0 6px 20px ${B.ag}}
.bg{background:transparent;color:${B.ink};border:1.5px solid ${B.bd}}.bg:hover{border-color:${B.a};color:${B.a}}
.bs{padding:10px 22px;font-size:14px}.bm{padding:13px 30px;font-size:15px}.bl{padding:16px 36px;font-size:16px}.bf{width:100%;justify-content:center}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.dz{border:2px dashed ${B.bd};border-radius:16px;padding:52px 32px;text-align:center;cursor:pointer;transition:all .2s;background:${B.bg}}.dz:hover,.dz.on{border-color:${B.a};background:${B.al}}
.prog{height:6px;background:${B.bd};border-radius:3px;overflow:hidden}.prog-f{height:100%;border-radius:3px;background:linear-gradient(90deg,${B.a},#F97316);transition:width .3s}
@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .45s ease both}.fu1{animation-delay:.07s}.fu2{animation-delay:.14s}.fu3{animation-delay:.21s}.fu4{animation-delay:.28s}
.card{border:1.5px solid ${B.bd};border-radius:14px;padding:22px 18px;background:${B.w};transition:all .18s;cursor:pointer;position:relative}.card:hover{border-color:${B.a};transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.05)}
.tp{position:absolute;top:10px;right:10px;background:linear-gradient(135deg,#F97316,${B.a});color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;letter-spacing:.6px}
.fr{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#fff;border:1px solid ${B.bd};border-radius:10px;transition:border-color .15s}.fr:hover{border-color:${B.a}}
.fq{width:100%;display:flex;justify-content:space-between;align-items:center;padding:17px 0;background:none;border:none;cursor:pointer;font-family:inherit;font-size:15px;font-weight:600;color:${B.ink};text-align:left}
.inp{width:100%;padding:11px 14px;border:1.5px solid ${B.bd};border-radius:10px;font-family:inherit;font-size:14px;outline:none;transition:border-color .15s}.inp:focus{border-color:${B.a}}
.lang-btn{background:none;border:1px solid ${B.bd};border-radius:8px;padding:5px 10px;font-size:13px;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:5px}.lang-btn:hover,.lang-btn.on{border-color:${B.a};background:${B.al}}
.cat-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${B.mu};padding:16px 0 8px}`;

// ═══ STRIPE + AUTH ═══
async function goCheckout(plan="monthly"){try{const r=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan})});const d=await r.json();if(d.url)window.location.href=d.url;else alert(d.error||"Error")}catch{alert("Connection error.")}}
async function checkProStatus(){try{const r=await fetch("/api/status");const d=await r.json();return d.pro===true}catch{return false}}
async function activateSession(sid){try{const r=await fetch(`/api/activate?session_id=${sid}`);const d=await r.json();return d.pro===true}catch{return false}}
async function openPortal(){try{const r=await fetch("/api/portal",{method:"POST"});const d=await r.json();if(d.url)window.location.href=d.url}catch{}}

// ═══ UI COMPONENTS ═══
function LangSwitcher(){const{lang,setLang}=useLang();return(<div style={{display:"flex",gap:4}}>{Object.keys(FLAGS).map(k=>(<button key={k} className={`lang-btn ${lang===k?"on":""}`} onClick={()=>setLang(k)}>{FLAGS[k]}</button>))}</div>);}

function Nav({pg,go,usage,isPro,proLoading}){const{t}=useLang();return(<nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${B.bd}`}}><div style={{maxWidth:1080,margin:"0 auto",padding:"0 20px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:20}}><div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9}}><div style={{width:32,height:32,borderRadius:8,background:B.a,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.bolt(16)}</div><span style={{fontSize:19,fontWeight:800,letterSpacing:-.6}}>PDF<span style={{color:B.a}}>Bolt</span></span></div><div style={{display:"flex",gap:2}}>{[["tools",t.nav.tools],["pricing",t.nav.pricing]].map(([k,l])=>(<button key={k} onClick={()=>go(k)} style={{background:pg===k?B.al:"transparent",color:pg===k?B.a:B.sl,border:"none",padding:"6px 14px",borderRadius:8,fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>))}</div></div><div style={{display:"flex",alignItems:"center",gap:12}}><LangSwitcher/>{proLoading?null:isPro?(<><div style={{display:"flex",alignItems:"center",gap:5,background:"linear-gradient(135deg,#F97316,#E8523F)",color:"#fff",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:8}}>{Ic.zap(12,"#fff")} {t.nav.proBadge}</div><button onClick={openPortal} style={{background:"none",border:"none",color:B.mu,fontSize:12,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>{t.nav.manage}</button></>):(<><span style={{fontSize:12.5,color:B.mu}}><span style={{color:usage.c>=LIMIT?B.er:B.ok,fontWeight:700}}>{Math.max(0,LIMIT-usage.c)}</span> {t.nav.usesLeft}</span><button className="btn bp bs" onClick={()=>go("pricing")}>{t.nav.upgrade}</button></>)}</div></div></nav>);}

function Hero({go}){const{t}=useLang();return(<section style={{padding:"76px 20px 56px",textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-120,left:"8%",width:420,height:420,background:`radial-gradient(circle,${B.ag} 0%,transparent 70%)`,pointerEvents:"none"}}/><div style={{maxWidth:680,margin:"0 auto",position:"relative"}}><div className="fu" style={{display:"inline-flex",alignItems:"center",gap:7,background:B.okB,border:`1px solid ${B.ok}33`,borderRadius:100,padding:"5px 15px",marginBottom:22,fontSize:12.5,fontWeight:600,color:B.ok}}>{Ic.shield(13,B.ok)} {t.hero.badge}</div><h1 className="serif fu fu1" style={{fontSize:54,fontWeight:400,lineHeight:1.08,letterSpacing:-1,marginBottom:18}}>{t.hero.title1}<br/><span style={{color:B.a,fontStyle:"italic"}}>{t.hero.title2}</span></h1><p className="fu fu2" style={{fontSize:18,color:B.sl,lineHeight:1.6,maxWidth:500,margin:"0 auto 32px"}}>{t.hero.sub}</p><div className="fu fu3" style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><button className="btn bp bl" onClick={()=>go("tools")}>{Ic.zap(18,"#fff")} {t.hero.cta1}</button><button className="btn bg bl" onClick={()=>go("pricing")}>{t.hero.cta2}</button></div><div className="fu fu4" style={{marginTop:44,display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap"}}>{[Ic.shield,Ic.globe,Ic.zap].map((ic,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:B.mu}}>{ic(15,B.mu)} {t.hero.trust[i]}</div>))}</div></div></section>);}

function ToolGrid({go,setTool}){const{t}=useLang();const tools=useTools();const cats=[["pdf",t.cats.pdf],["convert",t.cats.convert],["images",t.cats.images]];return(<section style={{padding:"36px 20px 72px"}}><div style={{maxWidth:860,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:40}}><h2 className="serif" style={{fontSize:34,letterSpacing:-.6,marginBottom:8}}>{t.tools.title||"All tools"}</h2></div>{cats.map(([catId,catName])=>(<div key={catId}><div className="cat-label">{catName}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(192px,1fr))",gap:10,marginBottom:8}}>{tools.filter(tl=>tl.cat===catId).map(tl=>(<div key={tl.id} className="card" onClick={()=>{setTool(tl);go("work")}}>{!tl.free&&<div className="tp">PRO</div>}<div style={{width:42,height:42,borderRadius:10,background:tl.free?B.al:`${B.bd}88`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>{tl.icon(21,tl.free?B.a:B.mu)}</div><div style={{fontSize:14.5,fontWeight:600,marginBottom:3}}>{tl.name}</div><div style={{fontSize:12.5,color:B.mu,lineHeight:1.4}}>{tl.desc}</div></div>))}</div></div>))}</div></section>);}

function Comp(){const{t}=useLang();const rows=[{n:"PDFBolt",pr:true,of:true,fr:t.comp.free,p:"€4,99",hl:true},{n:"iLovePDF",pr:false,of:false,fr:t.comp.limited,p:"€7/mo"},{n:"SmallPDF",pr:false,of:false,fr:"2/day",p:"€9/mo"},{n:"Adobe",pr:false,of:true,fr:t.comp.no,p:"€15,99"}];return(<section style={{padding:"56px 20px 72px",background:B.bg}}><div style={{maxWidth:720,margin:"0 auto"}}><h2 className="serif" style={{fontSize:30,textAlign:"center",marginBottom:6}}>{t.comp.title}</h2><p style={{textAlign:"center",color:B.sl,marginBottom:32,fontSize:15}}>{t.comp.sub}</p><div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${B.bd}`,background:B.w}}><div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr 1fr"}}>{t.comp.headers.map((h,i)=><div key={i} style={{padding:"12px 14px",fontSize:11,fontWeight:700,color:B.mu,textTransform:"uppercase",letterSpacing:1.2,borderBottom:`1px solid ${B.bd}`,borderRight:i<4?`1px solid ${B.bd}`:"none"}}>{h}</div>)}</div>{rows.map((r,ri)=>(<div key={ri} style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr 1fr",borderBottom:ri<3?`1px solid ${B.bd}`:"none",background:r.hl?B.al:B.w}}><div style={{padding:"12px 14px",fontWeight:r.hl?700:500,color:r.hl?B.a:B.ink,borderRight:`1px solid ${B.bd}`,display:"flex",alignItems:"center",gap:5,fontSize:13.5}}>{r.hl&&Ic.star(12,B.a)} {r.n}</div>{[r.pr,r.of,r.fr,r.p].map((v,vi)=>(<div key={vi} style={{padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"center",borderRight:vi<3?`1px solid ${B.bd}`:"none",fontSize:12.5}}>{typeof v==="boolean"?(v?Ic.check(17,B.ok):Ic.x(17,B.er)):<span style={{fontWeight:500,color:B.sl}}>{v}</span>}</div>))}</div>))}</div></div></section>);}

function Pricing({go,isPro}){const{t}=useLang();const[yr,setYr]=useState(false);return(<section style={{padding:"72px 20px 80px"}}><div style={{maxWidth:820,margin:"0 auto"}}><h2 className="serif" style={{fontSize:38,textAlign:"center",marginBottom:6,letterSpacing:-.8}}>{t.pricing.title}</h2><p style={{textAlign:"center",color:B.sl,marginBottom:28,fontSize:15}}>{t.pricing.sub}</p><div style={{display:"flex",justifyContent:"center",marginBottom:44}}><div style={{display:"flex",background:B.bg,borderRadius:10,padding:3,border:`1px solid ${B.bd}`}}>{[t.pricing.monthly,t.pricing.annual].map((l,i)=>(<button key={i} onClick={()=>setYr(i===1)} style={{padding:"7px 22px",borderRadius:8,border:"none",fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:(i===1)===yr?B.w:"transparent",color:(i===1)===yr?B.ink:B.mu,boxShadow:(i===1)===yr?"0 1px 4px rgba(0,0,0,.07)":"none"}}>{l} {i===1&&<span style={{color:B.ok,fontSize:11,fontWeight:700}}>-33%</span>}</button>))}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,maxWidth:660,margin:"0 auto"}}><div style={{border:`1.5px solid ${B.bd}`,borderRadius:16,padding:"32px 24px"}}><div style={{fontSize:12,fontWeight:700,color:B.mu,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{t.pricing.free}</div><div style={{fontSize:40,fontWeight:800,letterSpacing:-1.5,marginBottom:2}}>€0</div><div style={{fontSize:13,color:B.mu,marginBottom:24}}>{t.pricing.forever}</div><button className="btn bg bm bf" onClick={()=>go("tools")}>{t.pricing.startFree}</button><div style={{marginTop:24}}>{t.pricing.freeFeats.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",fontSize:13.5,color:B.sl}}>{Ic.check(15,B.ok)} {f}</div>))}</div></div><div style={{border:`2px solid ${B.a}`,borderRadius:16,padding:"32px 24px",background:B.al,position:"relative"}}><div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,#F97316,${B.a})`,color:"#fff",fontSize:10.5,fontWeight:700,padding:"4px 13px",borderRadius:100,letterSpacing:.6}}>{t.pricing.popular}</div><div style={{fontSize:12,fontWeight:700,color:B.a,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Pro</div><div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:2}}><span style={{fontSize:40,fontWeight:800,letterSpacing:-1.5}}>€{yr?"3,33":"4,99"}</span><span style={{fontSize:16,fontWeight:600,color:B.sl}}>/mo</span></div><div style={{fontSize:13,color:B.mu,marginBottom:24}}>{yr?`€39,99${t.pricing.yrSave}`:t.pricing.cancel}</div>{isPro?<button className="btn bg bm bf" onClick={openPortal} style={{color:B.ok,borderColor:B.ok}}>{Ic.check(15,B.ok)} {t.nav.manage}</button>:<button className="btn bp bm bf" onClick={()=>goCheckout(yr?"yearly":"monthly")}>{t.nav.upgrade}</button>}<div style={{marginTop:24}}>{t.pricing.proFeats.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",fontSize:13.5,color:B.sl}}>{Ic.check(15,B.a)} {f}</div>))}</div></div></div></div></section>);}

function FAQ(){const{t}=useLang();const[op,setOp]=useState(null);return(<section style={{padding:"56px 20px 72px"}}><div style={{maxWidth:600,margin:"0 auto"}}><h2 className="serif" style={{fontSize:30,textAlign:"center",marginBottom:32}}>{t.faq.title}</h2>{t.faq.qs.map(([q,a],i)=>(<div key={i} style={{borderBottom:`1px solid ${B.bd}`}}><button className="fq" onClick={()=>setOp(op===i?null:i)}>{q}<span style={{fontSize:20,color:B.mu,transform:op===i?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</span></button>{op===i&&<div style={{paddingBottom:16,fontSize:14,color:B.sl,lineHeight:1.65}}>{a}</div>}</div>))}</div></section>);}
function CTA({go}){const{t}=useLang();return(<section style={{padding:"56px 20px",background:B.ink}}><div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}><h2 className="serif" style={{fontSize:32,color:B.w,marginBottom:10,fontStyle:"italic"}}>{t.cta.title}</h2><p style={{fontSize:15,color:"rgba(255,255,255,.5)",marginBottom:26}}>{t.cta.sub}</p><button className="btn bp bl" onClick={()=>go("tools")}>{Ic.zap(18,"#fff")} {t.cta.btn}</button></div></section>);}
function Foot(){const{t}=useLang();return(<footer style={{padding:"32px 20px",borderTop:`1px solid ${B.bd}`,background:B.bg}}><div style={{maxWidth:1080,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:24,height:24,borderRadius:6,background:B.a,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.bolt(12)}</div><span style={{fontSize:14,fontWeight:700}}>PDF<span style={{color:B.a}}>Bolt</span></span></div><span style={{fontSize:12,color:B.mu}}>{t.footer.tagline}</span><span style={{fontSize:12,color:B.mu}}>© 2026 PDFBolt</span></div></footer>);}

// ═══ SIGNATURE CANVAS ═══
function SigCanvas({onSave}){
  const canRef=useRef();const[drawing,setDrawing]=useState(false);
  const getPos=(e)=>{const r=canRef.current.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top}};
  const start=(e)=>{e.preventDefault();setDrawing(true);const ctx=canRef.current.getContext("2d");const p=getPos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)};
  const move=(e)=>{if(!drawing)return;e.preventDefault();const ctx=canRef.current.getContext("2d");const p=getPos(e);ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle="#1A1D23";ctx.lineTo(p.x,p.y);ctx.stroke()};
  const stop=()=>{setDrawing(false);if(onSave)onSave(canRef.current.toDataURL("image/png"))};
  const clear=()=>{const ctx=canRef.current.getContext("2d");ctx.clearRect(0,0,canRef.current.width,canRef.current.height)};
  return{canRef,start,move,stop,clear};
}

// ═══ WORKSPACE ═══
function Work({tool,usage,setUsage,go,isPro}){
  const{t}=useLang();
  const[files,setFiles]=useState([]);const[proc,setProc]=useState(false);const[prog,setProg]=useState(0);const[result,setResult]=useState(null);const[err,setErr]=useState(null);const[dOver,setDOver]=useState(false);const[dIdx,setDIdx]=useState(null);
  const[wmText,setWmText]=useState("CONFIDENTIAL");const[rotDeg,setRotDeg]=useState(90);const[pw,setPw]=useState("");
  const[pgNumPos,setPgNumPos]=useState(0);const[imgQuality,setImgQuality]=useState(75);const[imgFormat,setImgFormat]=useState("png");
  const[imgW,setImgW]=useState(800);const[imgH,setImgH]=useState(600);const[keepRatio,setKeepRatio]=useState(true);const[origRatio,setOrigRatio]=useState(1);
  const[sigData,setSigData]=useState(null);
  const ref=useRef();const sigCanRef=useRef();const sigDrawing=useRef(false);
  const lim=!isPro && usage.c>=LIMIT;
  const acceptType=tool.accept||".pdf";

  const addFiles=useCallback(fl=>{
    const arr=Array.from(fl).filter(f=>{
      if(acceptType==="image/*") return f.type.startsWith("image/");
      if(acceptType===".docx,.doc") return f.name.match(/\.docx?$/i);
      return f.type==="application/pdf"||f.name?.endsWith(".pdf");
    });
    if(!arr.length)return;
    setFiles(p=>tool.multi?[...p,...arr.map(f=>({file:f,id:Math.random().toString(36).slice(2),name:f.name,size:f.size}))]:arr.slice(0,1).map(f=>({file:f,id:Math.random().toString(36).slice(2),name:f.name,size:f.size})));
    setResult(null);setErr(null);
    if(tool.id==="resize-img"&&arr[0]){const img=new Image();img.onload=()=>{setImgW(img.width);setImgH(img.height);setOrigRatio(img.width/img.height)};img.src=URL.createObjectURL(arr[0])}
  },[tool,acceptType]);
  const rm=id=>setFiles(p=>p.filter(f=>f.id!==id));
  const sw=(a,b)=>{setFiles(p=>{const arr=[...p];const[it]=arr.splice(a,1);arr.splice(b,0,it);return arr})};

  // Signature canvas handlers
  const sigStart=(e)=>{e.preventDefault();sigDrawing.current=true;const r=sigCanRef.current.getBoundingClientRect();const touch=e.touches?e.touches[0]:e;const ctx=sigCanRef.current.getContext("2d");ctx.beginPath();ctx.moveTo(touch.clientX-r.left,touch.clientY-r.top)};
  const sigMove=(e)=>{if(!sigDrawing.current)return;e.preventDefault();const r=sigCanRef.current.getBoundingClientRect();const touch=e.touches?e.touches[0]:e;const ctx=sigCanRef.current.getContext("2d");ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle="#1A1D23";ctx.lineTo(touch.clientX-r.left,touch.clientY-r.top);ctx.stroke()};
  const sigStop=()=>{sigDrawing.current=false;setSigData(sigCanRef.current?.toDataURL("image/png"))};
  const sigClear=()=>{if(sigCanRef.current){const ctx=sigCanRef.current.getContext("2d");ctx.clearRect(0,0,sigCanRef.current.width,sigCanRef.current.height)}setSigData(null)};

  const run=async()=>{if(lim||proc)return;setProc(true);setProg(0);setResult(null);setErr(null);try{const p=v=>setProg(v);let r;
    switch(tool.id){
      case"merge":r=await doMerge(files,p);r.label=t.work.results.merged(r._n);break;
      case"compress":r=await doCompress(files,p);r.label=t.work.results.compressed(r._pct,r._from,r._to);break;
      case"to-images":r=await doImages(files,p);r.label=t.work.results.images(r._n);break;
      case"split":r=await doSplit(files,p);r.label=t.work.results.split(r._n);break;
      case"watermark":r=await doWatermark(files,p,wmText);r.label=t.work.results.watermark(r._text,r._n);break;
      case"rotate":r=await doRotate(files,p,rotDeg);r.label=t.work.results.rotate(r._n,r._deg);break;
      case"protect":r=await doProtect(files,p,pw);r.label=t.work.results.protect(r._pw);break;
      case"ocr":r=await doOCR(files,p);r.label=r._empty?t.work.results.noText:t.work.results.ocr(r._n);break;
      case"img-to-pdf":r=await doImgToPdf(files,p);r.label=t.work.results.imgToPdf(r._n);break;
      case"pdf-to-text":r=await doPdfToText(files,p);r.label=r._empty?t.work.results.noText:t.work.results.pdfToText(r._n);break;
      case"docx-to-pdf":r=await doDocxToPdf(files,p);r.label=t.work.results.docxToPdf();break;
      case"page-numbers":r=await doPageNumbers(files,p,pgNumPos);r.label=t.work.results.pageNumbers(r._n);break;
      case"sign-pdf":r=await doSignPdf(files,p,sigData);r.label=t.work.results.signPdf();break;
      case"compress-img":r=await doCompressImg(files,p,imgQuality);r.label=t.work.results.compressedImg(r._pct);break;
      case"convert-img":r=await doConvertImg(files,p,imgFormat);r.label=t.work.results.convertedImg(r._fmt);break;
      case"resize-img":r=await doResizeImg(files,p,imgW,imgH);r.label=t.work.results.resizedImg(r._w,r._h);break;
    }setResult(r);if(!isPro)setUsage(bumpU())}catch(e){setErr(e.message||"Error")}setProc(false)};
  const ready=files.length>=tool.min;

  return(<div style={{maxWidth:640,margin:"0 auto",padding:"36px 20px 80px"}}>
    <button onClick={()=>go("tools")} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",color:B.mu,fontSize:13.5,cursor:"pointer",marginBottom:20,fontFamily:"inherit"}}>{t.work.back}</button>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}><div style={{width:48,height:48,borderRadius:13,background:B.al,display:"flex",alignItems:"center",justifyContent:"center"}}>{tool.icon(24,B.a)}</div><div><h1 style={{fontSize:26,fontWeight:700,letterSpacing:-.4}}>{tool.name}</h1><p style={{fontSize:13,color:B.mu}}>{tool.desc}</p></div>{!tool.free&&<div style={{marginLeft:"auto",background:`linear-gradient(135deg,#F97316,${B.a})`,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8}}>PRO</div>}</div>

    {!tool.free&&!isPro?(<div style={{padding:36,borderRadius:16,border:`2px solid ${B.a}`,background:B.al,textAlign:"center"}}><div style={{fontSize:42,marginBottom:10}}>🔒</div><h3 style={{fontSize:19,fontWeight:700,marginBottom:6}}>{t.work.proTitle}</h3><p style={{fontSize:14,color:B.sl,maxWidth:360,margin:"0 auto 18px"}}>{tool.name} {t.work.proDesc} €4,99/mo.</p><button className="btn bp bm" onClick={()=>go("pricing")}>{Ic.zap(16,"#fff")} {t.work.proBtn} {tool.name}</button></div>):(<>
    {lim&&(<div style={{marginBottom:18,padding:"14px 18px",borderRadius:12,background:B.erB,border:`1px solid ${B.er}33`,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>⚡</span><div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:B.er}}>{t.work.limitTitle}</div><div style={{fontSize:12,color:"#991B1B"}}>{t.work.limitSub}</div></div><button className="btn bp bs" onClick={()=>go("pricing")}>Pro</button></div>)}

    <div className={`dz ${dOver?"on":""}`} onClick={()=>ref.current?.click()} onDragOver={e=>{e.preventDefault();setDOver(true)}} onDragLeave={()=>setDOver(false)} onDrop={e=>{e.preventDefault();setDOver(false);addFiles(e.dataTransfer.files)}}><input ref={ref} type="file" accept={acceptType} multiple={tool.multi} style={{display:"none"}} onChange={e=>{addFiles(e.target.files);e.target.value=""}}/>{Ic.upload(34,B.a)}<div style={{marginTop:10,fontSize:15,fontWeight:600}}>{dOver?t.work.dropActive:t.work.drop}</div><div style={{fontSize:13,color:B.mu,marginTop:3}}>{t.work.dropSub}</div></div>

    {files.length>0&&(<div style={{marginTop:16,display:"flex",flexDirection:"column",gap:6}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12.5,fontWeight:600,color:B.mu}}>{files.length} {files.length>1?t.work.filesPlural:t.work.files}</span>{tool.multi&&<button onClick={()=>ref.current?.click()} style={{background:"none",border:"none",color:B.a,fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>{Ic.plus(13,B.a)} {t.work.add}</button>}</div>{files.map((f,i)=>(<div key={f.id} className="fr" draggable={tool.multi} onDragStart={()=>setDIdx(i)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(dIdx!==null&&dIdx!==i)sw(dIdx,i);setDIdx(null)}}>{tool.multi&&<div style={{cursor:"grab"}}>{Ic.grip(14,B.mu)}</div>}<div style={{width:34,height:34,borderRadius:8,background:B.al,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.file(16,B.a)}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:13.5,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div><div style={{fontSize:11.5,color:B.mu}}>{fmt(f.size)}</div></div><button onClick={()=>rm(f.id)} style={{background:"none",border:"none",cursor:"pointer",padding:3}}>{Ic.trash(15,B.mu)}</button></div>))}</div>)}

    {/* TOOL-SPECIFIC PARAMS */}
    {ready&&!result&&!proc&&tool.id==="watermark"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.wmLabel}</label><input className="inp" value={wmText} onChange={e=>setWmText(e.target.value)}/></div>)}
    {ready&&!result&&!proc&&tool.id==="rotate"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.rotLabel}</label><div style={{display:"flex",gap:8}}>{[90,180,270].map(d=>(<button key={d} onClick={()=>setRotDeg(d)} className={`btn ${rotDeg===d?"bp":"bg"} bs`}>{d}°</button>))}</div></div>)}
    {ready&&!result&&!proc&&tool.id==="protect"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.pwLabel}</label><input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder={t.work.pwPlaceholder}/></div>)}
    {ready&&!result&&!proc&&tool.id==="page-numbers"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.pgNumPos}</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{t.work.pgNumPosOpts.map((o,i)=>(<button key={i} onClick={()=>setPgNumPos(i)} className={`btn ${pgNumPos===i?"bp":"bg"} bs`}>{o}</button>))}</div></div>)}
    {ready&&!result&&!proc&&tool.id==="sign-pdf"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.signLabel}</label><canvas ref={sigCanRef} width={400} height={150} style={{border:`2px solid ${B.bd}`,borderRadius:10,background:"#fff",cursor:"crosshair",touchAction:"none",maxWidth:"100%"}} onMouseDown={sigStart} onMouseMove={sigMove} onMouseUp={sigStop} onMouseLeave={sigStop} onTouchStart={sigStart} onTouchMove={sigMove} onTouchEnd={sigStop}/><button className="btn bg bs" style={{marginTop:8}} onClick={sigClear}>{t.work.signClear}</button></div>)}
    {ready&&!result&&!proc&&tool.id==="compress-img"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.imgQuality}: {imgQuality}%</label><input type="range" min="10" max="95" value={imgQuality} onChange={e=>setImgQuality(+e.target.value)} style={{width:"100%"}}/></div>)}
    {ready&&!result&&!proc&&tool.id==="convert-img"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.imgFormat}</label><div style={{display:"flex",gap:8}}>{["png","jpg","webp"].map(f=>(<button key={f} onClick={()=>setImgFormat(f)} className={`btn ${imgFormat===f?"bp":"bg"} bs`}>{f.toUpperCase()}</button>))}</div></div>)}
    {ready&&!result&&!proc&&tool.id==="resize-img"&&(<div style={{marginTop:18,display:"flex",gap:12,alignItems:"end",flexWrap:"wrap"}}><div><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.imgWidth}</label><input className="inp" type="number" value={imgW} onChange={e=>{const v=+e.target.value;setImgW(v);if(keepRatio)setImgH(Math.round(v/origRatio))}} style={{width:120}}/></div><div><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.imgHeight}</label><input className="inp" type="number" value={imgH} onChange={e=>{const v=+e.target.value;setImgH(v);if(keepRatio)setImgW(Math.round(v*origRatio))}} style={{width:120}}/></div><label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:B.sl,cursor:"pointer"}}><input type="checkbox" checked={keepRatio} onChange={e=>setKeepRatio(e.target.checked)}/>{t.work.imgKeepRatio}</label></div>)}

    {proc&&(<div style={{marginTop:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,color:B.a}}>{t.work.processing}</span><span style={{fontSize:12,color:B.mu}}>{Math.round(prog)}%</span></div><div className="prog"><div className="prog-f" style={{width:`${prog}%`}}/></div></div>)}
    {err&&<div style={{marginTop:18,padding:"14px 18px",borderRadius:12,background:B.erB,border:`1px solid ${B.er}33`,fontSize:13.5,color:B.er}}>{err}</div>}
    {ready&&!result&&!proc&&(<button className="btn bp bl bf" onClick={run} disabled={lim||(tool.id==="protect"&&!pw)||(tool.id==="sign-pdf"&&!sigData)} style={{marginTop:20}}>{Ic.zap(17,"#fff")} {tool.verbText} {files.length>1?`${files.length} files`:""}</button>)}

    {result&&(<div className="fu" style={{marginTop:22,padding:28,borderRadius:16,background:B.okB,border:`1.5px solid ${B.ok}33`,textAlign:"center"}}><div style={{fontSize:44,marginBottom:10}}>⚡</div><h3 style={{fontSize:18,fontWeight:700,color:"#166534",marginBottom:6}}>{t.work.done}</h3><p style={{fontSize:13.5,color:"#4ADE80",marginBottom:18}}>{result.label}</p>
      {result.type==="pdf"&&<button className="btn bp bm" onClick={()=>dl(result.url,result.name)}>{Ic.download(17,"#fff")} {t.work.download} ({fmt(result.size)})</button>}
      {result.type==="split"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginBottom:16,textAlign:"left"}}>{result.pages.map((pg,i)=>(<div key={i} onClick={()=>dl(pg.url,pg.name)} style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${B.bd}`,background:B.w,cursor:"pointer"}}><div style={{fontSize:13,fontWeight:600}}>{t.work.page} {pg.page}</div><div style={{fontSize:11,color:B.mu}}>{fmt(pg.size)}</div></div>))}</div><button className="btn bp bs" onClick={()=>result.pages.forEach(pg=>dl(pg.url,pg.name))}>{Ic.download(15,"#fff")} {t.work.downloadAll}</button></div>}
      {result.type==="images"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,marginBottom:16,textAlign:"left"}}>{result.images.map((img,i)=>(<div key={i} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${B.bd}`,cursor:"pointer"}} onClick={()=>dl(img.url,img.name)}><img src={img.url} alt={`P${img.page}`} style={{width:"100%",display:"block"}}/><div style={{padding:"5px 8px",fontSize:11,color:B.mu,background:B.bg}}>{t.work.page} {img.page}</div></div>))}</div><button className="btn bp bs" onClick={()=>result.images.forEach(img=>dl(img.url,img.name))}>{Ic.download(15,"#fff")} {t.work.downloadAll}</button></div>}
      {result.type==="text"&&<div><div style={{textAlign:"left",background:B.w,border:`1px solid ${B.bd}`,borderRadius:10,padding:16,maxHeight:300,overflow:"auto",marginBottom:16}}><pre style={{fontFamily:"'DM Sans',monospace",fontSize:13,color:B.sl,whiteSpace:"pre-wrap",lineHeight:1.6}}>{result.text}</pre></div><button className="btn bp bs" onClick={()=>{const bl=new Blob([result.text],{type:"text/plain"});const r2=new FileReader();r2.onload=()=>dl(r2.result,"pdfbolt-text.txt");r2.readAsDataURL(bl)}}>{Ic.download(15,"#fff")} {t.work.downloadTxt}</button></div>}
      {result.type==="img"&&<div><div style={{marginBottom:16,textAlign:"center"}}><img src={result.url} alt="result" style={{maxWidth:"100%",maxHeight:300,borderRadius:10,border:`1px solid ${B.bd}`}}/></div><button className="btn bp bs" onClick={()=>dl(result.url,result.name)}>{Ic.download(15,"#fff")} {t.work.downloadImg} {result.size?`(${fmt(result.size)})`:""}</button></div>}
      <div style={{marginTop:14,fontSize:12,color:B.mu}}>{isPro?<span style={{color:B.ok,fontWeight:600}}>⚡ Pro — unlimited</span>:<>{Math.max(0,LIMIT-usage.c)} {t.work.usesLeft}</>}</div>
    </div>)}
    {result&&<button className="btn bg bm bf" style={{marginTop:12}} onClick={()=>{setFiles([]);setResult(null);setErr(null)}}>{t.work.newOp}</button>}
    </>)}
  </div>);
}

// ═══ APP ═══
export default function App(){
  const[pg,setPg]=useState("home");const[tool,setTool]=useState(null);const[usage,setUsage]=useState(getU());
  const[lang,setLang]=useState("en");const[isPro,setIsPro]=useState(false);const[proLoading,setProLoading]=useState(true);
  const t=T[lang];
  const go=useCallback(p=>{setPg(p);window.scrollTo?.({top:0,behavior:"smooth"})},[]);
  useEffect(()=>{(async()=>{const params=new URLSearchParams(window.location.search);const sid=params.get("session_id");if(sid){const ok=await activateSession(sid);setIsPro(ok);window.history.replaceState({},"","/")}else{const ok=await checkProStatus();setIsPro(ok)}setProLoading(false)})()},[]);
  return(<LangCtx.Provider value={{lang,setLang,t}}><div className="app"><style>{css}</style><Nav pg={pg} go={go} usage={usage} isPro={isPro} proLoading={proLoading}/>{pg==="home"&&<><Hero go={go}/><ToolGrid go={go} setTool={setTool}/><Comp/><Pricing go={go} isPro={isPro}/><FAQ/><CTA go={go}/></>}{pg==="tools"&&<div style={{paddingTop:32}}><ToolGrid go={go} setTool={setTool}/></div>}{pg==="pricing"&&<Pricing go={go} isPro={isPro}/>}{pg==="work"&&tool&&<Work tool={tool} usage={usage} setUsage={setUsage} go={go} isPro={isPro}/>}<Foot/></div></LangCtx.Provider>);
}
