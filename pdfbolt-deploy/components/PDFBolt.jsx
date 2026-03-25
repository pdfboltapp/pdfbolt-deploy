"use client";

import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";

// ═══════════════════════════════════════════
//  TRANSLATIONS — EN (default), IT, FR
// ═══════════════════════════════════════════
const T = {
  en: {
    nav: { tools: "Tools", pricing: "Pricing", usesLeft: "free uses today", upgrade: "Go Pro" },
    hero: {
      badge: "100% in-browser — Your files stay yours",
      title1: "Your PDFs,", title2: "lightning fast",
      sub: "Merge, compress, convert and protect. Instant, in-browser, no server uploads. Absolute privacy.",
      cta1: "Start free", cta2: "See pricing",
      trust: ["No uploads", "Works offline", "3 free uses/day"],
    },
    tools: {
      title: "All tools", sub: "Pick what to do with your PDF",
      merge: ["Merge PDF", "Combine multiple files into one PDF"],
      compress: ["Compress PDF", "Reduce file size while keeping quality"],
      toImages: ["PDF → Images", "Convert each page to PNG"],
      split: ["Split PDF", "Separate pages into individual files"],
      watermark: ["Watermark", "Add text on every page"],
      protect: ["Protect PDF", "Encrypt with password"],
      rotate: ["Rotate Pages", "Rotate the entire document"],
      ocr: ["OCR Scanner", "Turn scans into searchable text"],
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
      freeFeats: ["Merge PDF", "Compress PDF", "PDF → Images", "3 operations/day", "Client-side privacy"],
      popular: "POPULAR", cancel: "Cancel anytime",
      yrSave: "/year — save €20",
      proFeats: ["Everything in Free", "Unlimited operations", "Split PDF", "Watermark", "Password protect", "Rotate pages", "OCR on scans", "Priority support"],
    },
    faq: {
      title: "Frequently asked questions",
      qs: [
        ["Are my files safe?", "PDFBolt processes everything in your browser. Your PDFs are never uploaded to a server."],
        ["Does it work offline?", "Yes. Once the page is loaded, you can use PDFBolt without a connection."],
        ["What's the free limit?", "3 operations per day with the base tools. Free forever, no signup required."],
        ["Can I cancel Pro?", "Yes, anytime. No penalty. Access until end of paid period."],
        ["Does it work on mobile?", "Yes, on any device with a modern browser."],
      ],
    },
    cta: { title: "Ready to supercharge your PDFs?", sub: "Start free. No signup.", btn: "Open PDFBolt" },
    footer: { tagline: "Your files stay yours. Always. ⚡" },
    work: {
      back: "← All tools",
      drop: "Drag your PDFs here", dropActive: "Drop here!", dropSub: "or click to select",
      files: "file", filesPlural: "files", add: "Add",
      limitTitle: "Daily limit reached", limitSub: "Go Pro for unlimited uses.",
      proTitle: "Pro Tool", proDesc: "is available with the Pro plan. Unlock all tools for",
      proBtn: "Unlock",
      wmLabel: "Watermark text", rotLabel: "Rotation degrees", pwLabel: "Protection password", pwPlaceholder: "Enter password...",
      processing: "Processing...",
      done: "Done!", newOp: "New operation",
      usesLeft: "free uses left",
      verbs: { merge: "Merge", compress: "Compress", convert: "Convert", split: "Split", apply: "Apply", protect: "Protect", rotate: "Rotate", scan: "Scan" },
      results: {
        merged: (n) => `${n} PDFs merged successfully`,
        compressed: (pct, from, to) => `Compressed! Reduced by ${pct}% (${from} → ${to})`,
        images: (n) => `${n} page${n > 1 ? "s" : ""} converted to PNG`,
        split: (n) => `PDF split into ${n} page${n > 1 ? "s" : ""}`,
        watermark: (text, n) => `Watermark "${text}" applied to ${n} page${n > 1 ? "s" : ""}`,
        rotate: (n, deg) => `${n} page${n > 1 ? "s" : ""} rotated by ${deg}°`,
        protect: (pw) => `PDF processed. In production: AES-256 encryption with password "${pw}".`,
        ocr: (n) => `Text extracted from ${n} page${n > 1 ? "s" : ""}`,
        noText: "No text detected. In production, Tesseract.js will analyze images with real OCR.",
      },
      download: "Download PDF", downloadAll: "Download all", downloadTxt: "Download text",
      page: "Page",
    },
  },
  it: {
    nav: { tools: "Strumenti", pricing: "Prezzi", usesLeft: "usi gratis", upgrade: "Passa a Pro" },
    hero: {
      badge: "100% nel browser — I tuoi file restano tuoi",
      title1: "I tuoi PDF,", title2: "alla velocità del fulmine",
      sub: "Unisci, comprimi, converti e proteggi. Istantaneo, nel browser, nessun upload su server.",
      cta1: "Inizia gratis", cta2: "Vedi i prezzi",
      trust: ["Nessun upload", "Funziona offline", "3 usi gratis/giorno"],
    },
    tools: {
      title: "Tutti gli strumenti", sub: "Scegli cosa fare con il tuo PDF",
      merge: ["Unisci PDF", "Combina più file in un unico PDF"],
      compress: ["Comprimi PDF", "Riduci il peso mantenendo la qualità"],
      toImages: ["PDF → Immagini", "Converti ogni pagina in PNG"],
      split: ["Dividi PDF", "Separa le pagine in file singoli"],
      watermark: ["Watermark", "Aggiungi testo su ogni pagina"],
      protect: ["Proteggi PDF", "Cripta con password"],
      rotate: ["Ruota Pagine", "Ruota tutto il documento"],
      ocr: ["OCR Scanner", "Da scansione a testo cercabile"],
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
      freeFeats: ["Unisci PDF", "Comprimi PDF", "PDF → Immagini", "3 operazioni/giorno", "Privacy client-side"],
      popular: "POPOLARE", cancel: "Cancella quando vuoi",
      yrSave: "/anno — risparmi €20",
      proFeats: ["Tutto del piano Free", "Operazioni illimitate", "Dividi PDF", "Watermark", "Proteggi con password", "Ruota pagine", "OCR su scansioni", "Supporto prioritario"],
    },
    faq: {
      title: "Domande frequenti",
      qs: [
        ["I miei file sono al sicuro?", "PDFBolt elabora tutto nel tuo browser. I tuoi PDF non vengono mai caricati su un server."],
        ["Funziona offline?", "Sì. Una volta caricata la pagina, puoi usare PDFBolt senza connessione."],
        ["Limite gratuito?", "3 operazioni al giorno con i tool base. Gratis per sempre."],
        ["Posso cancellare il Pro?", "Sì, in qualsiasi momento. Nessuna penale."],
        ["Funziona su mobile?", "Sì, su qualsiasi dispositivo con un browser moderno."],
      ],
    },
    cta: { title: "Pronto a fulminare i tuoi PDF?", sub: "Inizia gratis. Nessuna registrazione.", btn: "Apri PDFBolt" },
    footer: { tagline: "I tuoi file restano tuoi. Sempre. ⚡" },
    work: {
      back: "← Tutti gli strumenti",
      drop: "Trascina i tuoi PDF qui", dropActive: "Rilascia qui!", dropSub: "oppure clicca per selezionare",
      files: "file", filesPlural: "file", add: "Aggiungi",
      limitTitle: "Limite raggiunto", limitSub: "Passa a Pro per usi illimitati.",
      proTitle: "Strumento Pro", proDesc: "è disponibile con il piano Pro. Sblocca tutti gli strumenti a",
      proBtn: "Sblocca",
      wmLabel: "Testo del watermark", rotLabel: "Gradi di rotazione", pwLabel: "Password di protezione", pwPlaceholder: "Inserisci password...",
      processing: "Elaborazione...",
      done: "Fatto!", newOp: "Nuova operazione",
      usesLeft: "usi gratis rimasti",
      verbs: { merge: "Unisci", compress: "Comprimi", convert: "Converti", split: "Dividi", apply: "Applica", protect: "Proteggi", rotate: "Ruota", scan: "Scansiona" },
      results: {
        merged: (n) => `${n} PDF uniti con successo`,
        compressed: (pct, from, to) => `Compresso! Ridotto del ${pct}% (${from} → ${to})`,
        images: (n) => `${n} pagin${n > 1 ? "e convertite" : "a convertita"} in PNG`,
        split: (n) => `PDF diviso in ${n} pagin${n > 1 ? "e" : "a"}`,
        watermark: (text, n) => `Watermark "${text}" applicato a ${n} pagin${n > 1 ? "e" : "a"}`,
        rotate: (n, deg) => `${n} pagin${n > 1 ? "e ruotate" : "a ruotata"} di ${deg}°`,
        protect: (pw) => `PDF elaborato. In produzione: crittografia AES-256 con password "${pw}".`,
        ocr: (n) => `Testo estratto da ${n} pagin${n > 1 ? "e" : "a"}`,
        noText: "Nessun testo rilevato. In produzione Tesseract.js farà OCR reale.",
      },
      download: "Scarica PDF", downloadAll: "Scarica tutte", downloadTxt: "Scarica testo",
      page: "Pagina",
    },
  },
  fr: {
    nav: { tools: "Outils", pricing: "Tarifs", usesLeft: "utilisations gratuites", upgrade: "Passer à Pro" },
    hero: {
      badge: "100% dans le navigateur — Vos fichiers restent les vôtres",
      title1: "Vos PDF,", title2: "à la vitesse de l'éclair",
      sub: "Fusionnez, compressez, convertissez et protégez. Instantané, dans le navigateur, aucun envoi serveur.",
      cta1: "Commencer gratuitement", cta2: "Voir les tarifs",
      trust: ["Aucun upload", "Fonctionne hors-ligne", "3 utilisations gratuites/jour"],
    },
    tools: {
      title: "Tous les outils", sub: "Choisissez quoi faire avec votre PDF",
      merge: ["Fusionner PDF", "Combinez plusieurs fichiers en un seul PDF"],
      compress: ["Compresser PDF", "Réduisez la taille en gardant la qualité"],
      toImages: ["PDF → Images", "Convertissez chaque page en PNG"],
      split: ["Diviser PDF", "Séparez les pages en fichiers individuels"],
      watermark: ["Filigrane", "Ajoutez du texte sur chaque page"],
      protect: ["Protéger PDF", "Chiffrez avec un mot de passe"],
      rotate: ["Pivoter Pages", "Pivotez le document entier"],
      ocr: ["Scanner OCR", "Transformez les scans en texte consultable"],
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
      freeFeats: ["Fusionner PDF", "Compresser PDF", "PDF → Images", "3 opérations/jour", "Confidentialité client-side"],
      popular: "POPULAIRE", cancel: "Annulez à tout moment",
      yrSave: "/an — économisez 20€",
      proFeats: ["Tout du plan Gratuit", "Opérations illimitées", "Diviser PDF", "Filigrane", "Protection par mot de passe", "Pivoter pages", "OCR sur scans", "Support prioritaire"],
    },
    faq: {
      title: "Questions fréquentes",
      qs: [
        ["Mes fichiers sont-ils en sécurité ?", "PDFBolt traite tout dans votre navigateur. Vos PDF ne sont jamais envoyés sur un serveur."],
        ["Ça fonctionne hors-ligne ?", "Oui. Une fois la page chargée, vous pouvez utiliser PDFBolt sans connexion."],
        ["Quelle est la limite gratuite ?", "3 opérations par jour avec les outils de base. Gratuit pour toujours."],
        ["Puis-je annuler le Pro ?", "Oui, à tout moment. Sans pénalité."],
        ["Ça fonctionne sur mobile ?", "Oui, sur tout appareil avec un navigateur moderne."],
      ],
    },
    cta: { title: "Prêt à booster vos PDF ?", sub: "Commencez gratuitement. Sans inscription.", btn: "Ouvrir PDFBolt" },
    footer: { tagline: "Vos fichiers restent les vôtres. Toujours. ⚡" },
    work: {
      back: "← Tous les outils",
      drop: "Glissez vos PDF ici", dropActive: "Déposez ici !", dropSub: "ou cliquez pour sélectionner",
      files: "fichier", filesPlural: "fichiers", add: "Ajouter",
      limitTitle: "Limite atteinte", limitSub: "Passez à Pro pour des utilisations illimitées.",
      proTitle: "Outil Pro", proDesc: "est disponible avec le plan Pro. Débloquez tous les outils pour",
      proBtn: "Débloquer",
      wmLabel: "Texte du filigrane", rotLabel: "Degrés de rotation", pwLabel: "Mot de passe de protection", pwPlaceholder: "Entrez le mot de passe...",
      processing: "Traitement...",
      done: "Terminé !", newOp: "Nouvelle opération",
      usesLeft: "utilisations gratuites restantes",
      verbs: { merge: "Fusionner", compress: "Compresser", convert: "Convertir", split: "Diviser", apply: "Appliquer", protect: "Protéger", rotate: "Pivoter", scan: "Scanner" },
      results: {
        merged: (n) => `${n} PDF fusionnés avec succès`,
        compressed: (pct, from, to) => `Compressé ! Réduit de ${pct}% (${from} → ${to})`,
        images: (n) => `${n} page${n > 1 ? "s" : ""} convertie${n > 1 ? "s" : ""} en PNG`,
        split: (n) => `PDF divisé en ${n} page${n > 1 ? "s" : ""}`,
        watermark: (text, n) => `Filigrane "${text}" appliqué à ${n} page${n > 1 ? "s" : ""}`,
        rotate: (n, deg) => `${n} page${n > 1 ? "s" : ""} pivotée${n > 1 ? "s" : ""} de ${deg}°`,
        protect: (pw) => `PDF traité. En production : chiffrement AES-256 avec mot de passe "${pw}".`,
        ocr: (n) => `Texte extrait de ${n} page${n > 1 ? "s" : ""}`,
        noText: "Aucun texte détecté. En production, Tesseract.js analysera les images avec un vrai OCR.",
      },
      download: "Télécharger PDF", downloadAll: "Tout télécharger", downloadTxt: "Télécharger texte",
      page: "Page",
    },
  },
};

const LangCtx = createContext();
const useLang = () => useContext(LangCtx);
const FLAGS = { en: "🇬🇧", it: "🇮🇹", fr: "🇫🇷" };

// ═══ BRAND + CONSTANTS ═══
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
  check:(s,c)=><I s={s} c={c} w={2.5}><path d="M20 6L9 17l-5-5"/></I>,
  x:(s,c)=><I s={s} c={c}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>,
  upload:(s,c)=><I s={s} c={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></I>,
  download:(s,c)=><I s={s} c={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></I>,
  zap:(s,c)=><svg width={s} height={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={c}/></svg>,
  shield:(s,c)=><I s={s} c={c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
  globe:(s,c)=><I s={s} c={c}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></I>,
  file:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></I>,
  trash:(s,c)=><I s={s} c={c}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></I>,
  grip:(s,c)=><I s={s} c={c}><circle cx="9" cy="6" r="1" fill={c}/><circle cx="15" cy="6" r="1" fill={c}/><circle cx="9" cy="12" r="1" fill={c}/><circle cx="15" cy="12" r="1" fill={c}/><circle cx="9" cy="18" r="1" fill={c}/><circle cx="15" cy="18" r="1" fill={c}/></I>,
  plus:(s,c)=><I s={s} c={c}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>,
  star:(s,c)=><svg width={s} height={s} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={c}/></svg>,
};

const TOOL_KEYS = ["merge","compress","toImages","split","watermark","protect","rotate","ocr"];
const TOOL_IDS = ["merge","compress","to-images","split","watermark","protect","rotate","ocr"];
const TOOL_ICONS = [Ic.merge,Ic.compress,Ic.image,Ic.split,Ic.watermark,Ic.lock,Ic.rotate,Ic.ocr];
const TOOL_FREE = [true,true,true,false,false,false,false,false];
const TOOL_MULTI = [true,false,false,false,false,false,false,false];
const TOOL_MIN = [2,1,1,1,1,1,1,1];
const TOOL_VERB_KEYS = ["merge","compress","convert","split","apply","protect","rotate","scan"];

function useTools() {
  const { t } = useLang();
  return TOOL_KEYS.map((k,i) => ({
    id: TOOL_IDS[i], key: k, name: t.tools[k][0], desc: t.tools[k][1],
    icon: TOOL_ICONS[i], free: TOOL_FREE[i], multi: TOOL_MULTI[i], min: TOOL_MIN[i],
    verb: t.work.verbs[TOOL_VERB_KEYS[i]],
  }));
}

// ═══ PDF PROCESSING ═══
async function loadPdfLib(){if(window.PDFLib)return window.PDFLib;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";s.onload=()=>r(window.PDFLib);s.onerror=()=>j(new Error("Failed to load pdf-lib"));document.head.appendChild(s)});}
async function loadPdfJs(){if(window.pdfjsLib)return window.pdfjsLib;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";s.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";r(window.pdfjsLib)};s.onerror=()=>j(new Error("Failed to load pdf.js"));document.head.appendChild(s)});}
const readBuf=(f)=>new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result);x.onerror=j;x.readAsArrayBuffer(f)});
const blobToDataUrl=(b)=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(b)});
function dl(u,n){const a=document.createElement("a");a.href=u;a.download=n;a.style.display="none";document.body.appendChild(a);a.click();setTimeout(()=>document.body.removeChild(a),200);}
function fmt(b){return b<1024?b+" B":b<1048576?(b/1024).toFixed(0)+" KB":(b/1048576).toFixed(1)+" MB";}

async function doMerge(files,p){const P=await loadPdfLib();const d=await P.PDFDocument.create();for(let i=0;i<files.length;i++){p((i/files.length)*85);const b=await readBuf(files[i].file);const s=await P.PDFDocument.load(b,{ignoreEncryption:true});(await d.copyPages(s,s.getPageIndices())).forEach(pg=>d.addPage(pg))}p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-merged.pdf",size:o.length,_n:files.length};}
async function doCompress(files,p){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);p(35);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(55);d.setTitle("");d.setAuthor("");d.setSubject("");d.setKeywords([]);d.setProducer("PDFBolt");p(75);const o=await d.save({useObjectStreams:true,addDefaultPage:false,objectsPerTick:50});p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-compressed.pdf",size:o.length,_pct:Math.max(0,Math.round((1-o.length/files[0].file.size)*100)),_from:fmt(files[0].file.size),_to:fmt(o.length)};}
async function doImages(files,p){const pjs=await loadPdfJs();p(8);const b=await readBuf(files[0].file);const d=await pjs.getDocument({data:b}).promise;const imgs=[];for(let i=1;i<=d.numPages;i++){p(8+((i-1)/d.numPages)*88);const pg=await d.getPage(i);const vp=pg.getViewport({scale:2});const c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;imgs.push({url:c.toDataURL("image/png",0.92),name:`page-${i}.png`,page:i})}p(100);return{type:"images",images:imgs,_n:imgs.length};}
async function doSplit(files,p){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const s=await P.PDFDocument.load(b,{ignoreEncryption:true});const t=s.getPageCount();const r=[];for(let i=0;i<t;i++){p(15+(i/t)*80);const nd=await P.PDFDocument.create();const[pg]=await nd.copyPages(s,[i]);nd.addPage(pg);const o=await nd.save();r.push({url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:`page-${i+1}.pdf`,page:i+1,size:o.length})}p(100);return{type:"split",pages:r,_n:t};}
async function doWatermark(files,p,text){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(35);const f=await d.embedFont(P.StandardFonts.HelveticaBold);const pgs=d.getPages();for(let i=0;i<pgs.length;i++){p(35+(i/pgs.length)*55);const pg=pgs[i];const{width:w,height:h}=pg.getSize();const fs=Math.min(w,h)*0.07;pg.drawText(text,{x:(w-f.widthOfTextAtSize(text,fs))/2,y:h/2,size:fs,font:f,color:P.rgb(.85,.85,.85),opacity:.35,rotate:P.degrees(-45)})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-watermark.pdf",size:o.length,_text:text,_n:pgs.length};}
async function doRotate(files,p,deg){const P=await loadPdfLib();p(15);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(45);d.getPages().forEach(pg=>{pg.setRotation(P.degrees(pg.getRotation().angle+deg))});p(85);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-rotated.pdf",size:o.length,_n:d.getPageCount(),_deg:deg};}
async function doProtect(files,p,pw){const P=await loadPdfLib();p(20);const b=await readBuf(files[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(50);d.setTitle("Protected by PDFBolt");d.setProducer("PDFBolt Secure");p(80);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-protected.pdf",size:o.length,_pw:pw};}
async function doOCR(files,p){const pjs=await loadPdfJs();p(10);const b=await readBuf(files[0].file);const d=await pjs.getDocument({data:b}).promise;let txt="";for(let i=1;i<=d.numPages;i++){p(10+(i/d.numPages)*80);const pg=await d.getPage(i);const c=await pg.getTextContent();const pt=c.items.map(x=>x.str).join(" ");if(pt.trim())txt+=`--- Page ${i} ---\n${pt}\n\n`}p(100);return{type:"text",text:txt,_n:d.numPages,_empty:!txt.trim()};}

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
.lang-btn{background:none;border:1px solid ${B.bd};border-radius:8px;padding:5px 10px;font-size:13px;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;gap:5px}
.lang-btn:hover,.lang-btn.on{border-color:${B.a};background:${B.al}}`;

// ═══ COMPONENTS ═══
function LangSwitcher(){const{lang,setLang}=useLang();return(<div style={{display:"flex",gap:4}}>{Object.keys(FLAGS).map(k=>(<button key={k} className={`lang-btn ${lang===k?"on":""}`} onClick={()=>setLang(k)}>{FLAGS[k]}</button>))}</div>);}

function Nav({pg,go,usage}){const{t}=useLang();return(<nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${B.bd}`}}><div style={{maxWidth:1080,margin:"0 auto",padding:"0 20px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:20}}><div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9}}><div style={{width:32,height:32,borderRadius:8,background:B.a,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.bolt(16)}</div><span style={{fontSize:19,fontWeight:800,letterSpacing:-.6}}>PDF<span style={{color:B.a}}>Bolt</span></span></div><div style={{display:"flex",gap:2}}>{[["tools",t.nav.tools],["pricing",t.nav.pricing]].map(([k,l])=>(<button key={k} onClick={()=>go(k)} style={{background:pg===k?B.al:"transparent",color:pg===k?B.a:B.sl,border:"none",padding:"6px 14px",borderRadius:8,fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>))}</div></div><div style={{display:"flex",alignItems:"center",gap:12}}><LangSwitcher/><span style={{fontSize:12.5,color:B.mu}}><span style={{color:usage.c>=LIMIT?B.er:B.ok,fontWeight:700}}>{Math.max(0,LIMIT-usage.c)}</span> {t.nav.usesLeft}</span><button className="btn bp bs" onClick={()=>go("pricing")}>{t.nav.upgrade}</button></div></div></nav>);}

function Hero({go}){const{t}=useLang();return(<section style={{padding:"76px 20px 56px",textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-120,left:"8%",width:420,height:420,background:`radial-gradient(circle,${B.ag} 0%,transparent 70%)`,pointerEvents:"none"}}/><div style={{maxWidth:680,margin:"0 auto",position:"relative"}}><div className="fu" style={{display:"inline-flex",alignItems:"center",gap:7,background:B.okB,border:`1px solid ${B.ok}33`,borderRadius:100,padding:"5px 15px",marginBottom:22,fontSize:12.5,fontWeight:600,color:B.ok}}>{Ic.shield(13,B.ok)} {t.hero.badge}</div><h1 className="serif fu fu1" style={{fontSize:54,fontWeight:400,lineHeight:1.08,letterSpacing:-1,marginBottom:18}}>{t.hero.title1}<br/><span style={{color:B.a,fontStyle:"italic"}}>{t.hero.title2}</span></h1><p className="fu fu2" style={{fontSize:18,color:B.sl,lineHeight:1.6,maxWidth:500,margin:"0 auto 32px"}}>{t.hero.sub}</p><div className="fu fu3" style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><button className="btn bp bl" onClick={()=>go("tools")}>{Ic.zap(18,"#fff")} {t.hero.cta1}</button><button className="btn bg bl" onClick={()=>go("pricing")}>{t.hero.cta2}</button></div><div className="fu fu4" style={{marginTop:44,display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap"}}>{[Ic.shield,Ic.globe,Ic.zap].map((ic,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:B.mu}}>{ic(15,B.mu)} {t.hero.trust[i]}</div>))}</div></div></section>);}

function ToolGrid({go,setTool}){const{t}=useLang();const tools=useTools();return(<section style={{padding:"36px 20px 72px"}}><div style={{maxWidth:860,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:40}}><h2 className="serif" style={{fontSize:34,letterSpacing:-.6,marginBottom:8}}>{t.tools.title}</h2><p style={{fontSize:15,color:B.sl}}>{t.tools.sub}</p></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(192px,1fr))",gap:10}}>{tools.map(tl=>(<div key={tl.id} className="card" onClick={()=>{setTool(tl);go("work")}}>{!tl.free&&<div className="tp">PRO</div>}<div style={{width:42,height:42,borderRadius:10,background:tl.free?B.al:`${B.bd}88`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>{tl.icon(21,tl.free?B.a:B.mu)}</div><div style={{fontSize:14.5,fontWeight:600,marginBottom:3}}>{tl.name}</div><div style={{fontSize:12.5,color:B.mu,lineHeight:1.4}}>{tl.desc}</div></div>))}</div></div></section>);}

function Comp(){const{t}=useLang();const rows=[{n:"PDFBolt",pr:true,of:true,fr:t.comp.free,p:"€4,99",hl:true},{n:"iLovePDF",pr:false,of:false,fr:t.comp.limited,p:"€7/mo"},{n:"SmallPDF",pr:false,of:false,fr:"2/day",p:"€9/mo"},{n:"Adobe",pr:false,of:true,fr:t.comp.no,p:"€15,99"}];return(<section style={{padding:"56px 20px 72px",background:B.bg}}><div style={{maxWidth:720,margin:"0 auto"}}><h2 className="serif" style={{fontSize:30,textAlign:"center",marginBottom:6}}>{t.comp.title}</h2><p style={{textAlign:"center",color:B.sl,marginBottom:32,fontSize:15}}>{t.comp.sub}</p><div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${B.bd}`,background:B.w}}><div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr 1fr"}}>{t.comp.headers.map((h,i)=><div key={i} style={{padding:"12px 14px",fontSize:11,fontWeight:700,color:B.mu,textTransform:"uppercase",letterSpacing:1.2,borderBottom:`1px solid ${B.bd}`,borderRight:i<4?`1px solid ${B.bd}`:"none"}}>{h}</div>)}</div>{rows.map((r,ri)=>(<div key={ri} style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr 1fr",borderBottom:ri<3?`1px solid ${B.bd}`:"none",background:r.hl?B.al:B.w}}><div style={{padding:"12px 14px",fontWeight:r.hl?700:500,color:r.hl?B.a:B.ink,borderRight:`1px solid ${B.bd}`,display:"flex",alignItems:"center",gap:5,fontSize:13.5}}>{r.hl&&Ic.star(12,B.a)} {r.n}</div>{[r.pr,r.of,r.fr,r.p].map((v,vi)=>(<div key={vi} style={{padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"center",borderRight:vi<3?`1px solid ${B.bd}`:"none",fontSize:12.5}}>{typeof v==="boolean"?(v?Ic.check(17,B.ok):Ic.x(17,B.er)):<span style={{fontWeight:500,color:B.sl}}>{v}</span>}</div>))}</div>))}</div></div></section>);}

function Pricing({go}){const{t}=useLang();const[yr,setYr]=useState(false);return(<section style={{padding:"72px 20px 80px"}}><div style={{maxWidth:820,margin:"0 auto"}}><h2 className="serif" style={{fontSize:38,textAlign:"center",marginBottom:6,letterSpacing:-.8}}>{t.pricing.title}</h2><p style={{textAlign:"center",color:B.sl,marginBottom:28,fontSize:15}}>{t.pricing.sub}</p><div style={{display:"flex",justifyContent:"center",marginBottom:44}}><div style={{display:"flex",background:B.bg,borderRadius:10,padding:3,border:`1px solid ${B.bd}`}}>{[t.pricing.monthly,t.pricing.annual].map((l,i)=>(<button key={i} onClick={()=>setYr(i===1)} style={{padding:"7px 22px",borderRadius:8,border:"none",fontSize:13.5,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:(i===1)===yr?B.w:"transparent",color:(i===1)===yr?B.ink:B.mu,boxShadow:(i===1)===yr?"0 1px 4px rgba(0,0,0,.07)":"none"}}>{l} {i===1&&<span style={{color:B.ok,fontSize:11,fontWeight:700}}>-33%</span>}</button>))}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,maxWidth:660,margin:"0 auto"}}><div style={{border:`1.5px solid ${B.bd}`,borderRadius:16,padding:"32px 24px"}}><div style={{fontSize:12,fontWeight:700,color:B.mu,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{t.pricing.free}</div><div style={{fontSize:40,fontWeight:800,letterSpacing:-1.5,marginBottom:2}}>€0</div><div style={{fontSize:13,color:B.mu,marginBottom:24}}>{t.pricing.forever}</div><button className="btn bg bm bf" onClick={()=>go("tools")}>{t.pricing.startFree}</button><div style={{marginTop:24}}>{t.pricing.freeFeats.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",fontSize:13.5,color:B.sl}}>{Ic.check(15,B.ok)} {f}</div>))}</div></div><div style={{border:`2px solid ${B.a}`,borderRadius:16,padding:"32px 24px",background:B.al,position:"relative"}}><div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,#F97316,${B.a})`,color:"#fff",fontSize:10.5,fontWeight:700,padding:"4px 13px",borderRadius:100,letterSpacing:.6}}>{t.pricing.popular}</div><div style={{fontSize:12,fontWeight:700,color:B.a,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Pro</div><div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:2}}><span style={{fontSize:40,fontWeight:800,letterSpacing:-1.5}}>€{yr?"3,33":"4,99"}</span><span style={{fontSize:16,fontWeight:600,color:B.sl}}>/mo</span></div><div style={{fontSize:13,color:B.mu,marginBottom:24}}>{yr?`€39,99${t.pricing.yrSave}`:t.pricing.cancel}</div><button className="btn bp bm bf">{t.nav.upgrade}</button><div style={{marginTop:24}}>{t.pricing.proFeats.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",fontSize:13.5,color:B.sl}}>{Ic.check(15,B.a)} {f}</div>))}</div></div></div></div></section>);}

function FAQ(){const{t}=useLang();const[op,setOp]=useState(null);return(<section style={{padding:"56px 20px 72px"}}><div style={{maxWidth:600,margin:"0 auto"}}><h2 className="serif" style={{fontSize:30,textAlign:"center",marginBottom:32}}>{t.faq.title}</h2>{t.faq.qs.map(([q,a],i)=>(<div key={i} style={{borderBottom:`1px solid ${B.bd}`}}><button className="fq" onClick={()=>setOp(op===i?null:i)}>{q}<span style={{fontSize:20,color:B.mu,transform:op===i?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</span></button>{op===i&&<div style={{paddingBottom:16,fontSize:14,color:B.sl,lineHeight:1.65}}>{a}</div>}</div>))}</div></section>);}

function CTA({go}){const{t}=useLang();return(<section style={{padding:"56px 20px",background:B.ink}}><div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}><h2 className="serif" style={{fontSize:32,color:B.w,marginBottom:10,fontStyle:"italic"}}>{t.cta.title}</h2><p style={{fontSize:15,color:"rgba(255,255,255,.5)",marginBottom:26}}>{t.cta.sub}</p><button className="btn bp bl" onClick={()=>go("tools")}>{Ic.zap(18,"#fff")} {t.cta.btn}</button></div></section>);}
function Foot(){const{t}=useLang();return(<footer style={{padding:"32px 20px",borderTop:`1px solid ${B.bd}`,background:B.bg}}><div style={{maxWidth:1080,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:24,height:24,borderRadius:6,background:B.a,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.bolt(12)}</div><span style={{fontSize:14,fontWeight:700}}>PDF<span style={{color:B.a}}>Bolt</span></span></div><span style={{fontSize:12,color:B.mu}}>{t.footer.tagline}</span><span style={{fontSize:12,color:B.mu}}>© 2026 PDFBolt</span></div></footer>);}

// ═══ WORKSPACE ═══
function Work({tool,usage,setUsage,go}){
  const{t}=useLang();
  const[files,setFiles]=useState([]);const[proc,setProc]=useState(false);const[prog,setProg]=useState(0);const[result,setResult]=useState(null);const[err,setErr]=useState(null);const[dOver,setDOver]=useState(false);const[dIdx,setDIdx]=useState(null);
  const[wmText,setWmText]=useState("CONFIDENTIAL");const[rotDeg,setRotDeg]=useState(90);const[pw,setPw]=useState("");const ref=useRef();
  const lim=usage.c>=LIMIT;
  const add=useCallback(fl=>{const pdfs=Array.from(fl).filter(f=>f.type==="application/pdf"||f.name?.endsWith(".pdf"));if(!pdfs.length)return;setFiles(p=>tool.multi?[...p,...pdfs.map(f=>({file:f,id:Math.random().toString(36).slice(2),name:f.name,size:f.size}))]:pdfs.slice(0,1).map(f=>({file:f,id:Math.random().toString(36).slice(2),name:f.name,size:f.size})));setResult(null);setErr(null)},[tool]);
  const rm=id=>setFiles(p=>p.filter(f=>f.id!==id));
  const sw=(a,b)=>{setFiles(p=>{const arr=[...p];const[it]=arr.splice(a,1);arr.splice(b,0,it);return arr})};
  const run=async()=>{if(lim||proc)return;setProc(true);setProg(0);setResult(null);setErr(null);try{const p=v=>setProg(v);let r;switch(tool.id){case"merge":r=await doMerge(files,p);r.label=t.work.results.merged(r._n);break;case"compress":r=await doCompress(files,p);r.label=t.work.results.compressed(r._pct,r._from,r._to);break;case"to-images":r=await doImages(files,p);r.label=t.work.results.images(r._n);break;case"split":r=await doSplit(files,p);r.label=t.work.results.split(r._n);break;case"watermark":r=await doWatermark(files,p,wmText);r.label=t.work.results.watermark(r._text,r._n);break;case"rotate":r=await doRotate(files,p,rotDeg);r.label=t.work.results.rotate(r._n,r._deg);break;case"protect":r=await doProtect(files,p,pw);r.label=t.work.results.protect(r._pw);break;case"ocr":r=await doOCR(files,p);r.label=r._empty?t.work.results.noText:t.work.results.ocr(r._n);break}setResult(r);setUsage(bumpU())}catch(e){setErr(e.message||"Error")}setProc(false)};
  const ready=files.length>=tool.min;
  return(<div style={{maxWidth:640,margin:"0 auto",padding:"36px 20px 80px"}}>
    <button onClick={()=>go("tools")} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",color:B.mu,fontSize:13.5,cursor:"pointer",marginBottom:20,fontFamily:"inherit"}}>{t.work.back}</button>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}><div style={{width:48,height:48,borderRadius:13,background:B.al,display:"flex",alignItems:"center",justifyContent:"center"}}>{tool.icon(24,B.a)}</div><div><h1 style={{fontSize:26,fontWeight:700,letterSpacing:-.4}}>{tool.name}</h1><p style={{fontSize:13,color:B.mu}}>{tool.desc}</p></div>{!tool.free&&<div style={{marginLeft:"auto",background:`linear-gradient(135deg,#F97316,${B.a})`,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8}}>PRO</div>}</div>
    {!tool.free?(<div style={{padding:36,borderRadius:16,border:`2px solid ${B.a}`,background:B.al,textAlign:"center"}}><div style={{fontSize:42,marginBottom:10}}>🔒</div><h3 style={{fontSize:19,fontWeight:700,marginBottom:6}}>{t.work.proTitle}</h3><p style={{fontSize:14,color:B.sl,maxWidth:360,margin:"0 auto 18px"}}>{tool.name} {t.work.proDesc} €4,99/mo.</p><button className="btn bp bm" onClick={()=>go("pricing")}>{Ic.zap(16,"#fff")} {t.work.proBtn} {tool.name}</button></div>):(<>
    {lim&&(<div style={{marginBottom:18,padding:"14px 18px",borderRadius:12,background:B.erB,border:`1px solid ${B.er}33`,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>⚡</span><div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:B.er}}>{t.work.limitTitle}</div><div style={{fontSize:12,color:"#991B1B"}}>{t.work.limitSub}</div></div><button className="btn bp bs" onClick={()=>go("pricing")}>Pro</button></div>)}
    <div className={`dz ${dOver?"on":""}`} onClick={()=>ref.current?.click()} onDragOver={e=>{e.preventDefault();setDOver(true)}} onDragLeave={()=>setDOver(false)} onDrop={e=>{e.preventDefault();setDOver(false);add(e.dataTransfer.files)}}><input ref={ref} type="file" accept=".pdf,application/pdf" multiple={tool.multi} style={{display:"none"}} onChange={e=>{add(e.target.files);e.target.value=""}}/>{Ic.upload(34,B.a)}<div style={{marginTop:10,fontSize:15,fontWeight:600}}>{dOver?t.work.dropActive:t.work.drop}</div><div style={{fontSize:13,color:B.mu,marginTop:3}}>{t.work.dropSub}</div></div>
    {files.length>0&&(<div style={{marginTop:16,display:"flex",flexDirection:"column",gap:6}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12.5,fontWeight:600,color:B.mu}}>{files.length} {files.length>1?t.work.filesPlural:t.work.files}</span>{tool.multi&&<button onClick={()=>ref.current?.click()} style={{background:"none",border:"none",color:B.a,fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>{Ic.plus(13,B.a)} {t.work.add}</button>}</div>{files.map((f,i)=>(<div key={f.id} className="fr" draggable={tool.multi} onDragStart={()=>setDIdx(i)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(dIdx!==null&&dIdx!==i)sw(dIdx,i);setDIdx(null)}}>{tool.multi&&<div style={{cursor:"grab"}}>{Ic.grip(14,B.mu)}</div>}<div style={{width:34,height:34,borderRadius:8,background:B.al,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.file(16,B.a)}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:13.5,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div><div style={{fontSize:11.5,color:B.mu}}>{fmt(f.size)}</div></div><button onClick={()=>rm(f.id)} style={{background:"none",border:"none",cursor:"pointer",padding:3}}>{Ic.trash(15,B.mu)}</button></div>))}</div>)}
    {ready&&!result&&!proc&&tool.id==="watermark"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.wmLabel}</label><input className="inp" value={wmText} onChange={e=>setWmText(e.target.value)}/></div>)}
    {ready&&!result&&!proc&&tool.id==="rotate"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.rotLabel}</label><div style={{display:"flex",gap:8}}>{[90,180,270].map(d=>(<button key={d} onClick={()=>setRotDeg(d)} className={`btn ${rotDeg===d?"bp":"bg"} bs`}>{d}°</button>))}</div></div>)}
    {ready&&!result&&!proc&&tool.id==="protect"&&(<div style={{marginTop:18}}><label style={{fontSize:13,fontWeight:600,color:B.sl,display:"block",marginBottom:6}}>{t.work.pwLabel}</label><input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder={t.work.pwPlaceholder}/></div>)}
    {proc&&(<div style={{marginTop:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,color:B.a}}>{t.work.processing}</span><span style={{fontSize:12,color:B.mu}}>{Math.round(prog)}%</span></div><div className="prog"><div className="prog-f" style={{width:`${prog}%`}}/></div></div>)}
    {err&&<div style={{marginTop:18,padding:"14px 18px",borderRadius:12,background:B.erB,border:`1px solid ${B.er}33`,fontSize:13.5,color:B.er}}>{err}</div>}
    {ready&&!result&&!proc&&(<button className="btn bp bl bf" onClick={run} disabled={lim||(tool.id==="protect"&&!pw)} style={{marginTop:20}}>{Ic.zap(17,"#fff")} {tool.verb} {files.length>1?`${files.length} PDF`:"PDF"}</button>)}
    {result&&(<div className="fu" style={{marginTop:22,padding:28,borderRadius:16,background:B.okB,border:`1.5px solid ${B.ok}33`,textAlign:"center"}}><div style={{fontSize:44,marginBottom:10}}>⚡</div><h3 style={{fontSize:18,fontWeight:700,color:"#166534",marginBottom:6}}>{t.work.done}</h3><p style={{fontSize:13.5,color:"#4ADE80",marginBottom:18}}>{result.label}</p>
      {result.type==="pdf"&&<button className="btn bp bm" onClick={()=>dl(result.url,result.name)}>{Ic.download(17,"#fff")} {t.work.download} ({fmt(result.size)})</button>}
      {result.type==="split"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8,marginBottom:16,textAlign:"left"}}>{result.pages.map((pg,i)=>(<div key={i} onClick={()=>dl(pg.url,pg.name)} style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${B.bd}`,background:B.w,cursor:"pointer"}}><div style={{fontSize:13,fontWeight:600}}>{t.work.page} {pg.page}</div><div style={{fontSize:11,color:B.mu}}>{fmt(pg.size)}</div></div>))}</div><button className="btn bp bs" onClick={()=>result.pages.forEach(pg=>dl(pg.url,pg.name))}>{Ic.download(15,"#fff")} {t.work.downloadAll}</button></div>}
      {result.type==="images"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,marginBottom:16,textAlign:"left"}}>{result.images.map((img,i)=>(<div key={i} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${B.bd}`,cursor:"pointer"}} onClick={()=>dl(img.url,img.name)}><img src={img.url} alt={`P${img.page}`} style={{width:"100%",display:"block"}}/><div style={{padding:"5px 8px",fontSize:11,color:B.mu,background:B.bg}}>{t.work.page} {img.page}</div></div>))}</div><button className="btn bp bs" onClick={()=>result.images.forEach(img=>dl(img.url,img.name))}>{Ic.download(15,"#fff")} {t.work.downloadAll}</button></div>}
      {result.type==="text"&&<div><div style={{textAlign:"left",background:B.w,border:`1px solid ${B.bd}`,borderRadius:10,padding:16,maxHeight:300,overflow:"auto",marginBottom:16}}><pre style={{fontFamily:"'DM Sans',monospace",fontSize:13,color:B.sl,whiteSpace:"pre-wrap",lineHeight:1.6}}>{result.text}</pre></div><button className="btn bp bs" onClick={()=>{const bl=new Blob([result.text],{type:"text/plain"});const r2=new FileReader();r2.onload=()=>dl(r2.result,"pdfbolt-ocr.txt");r2.readAsDataURL(bl)}}>{Ic.download(15,"#fff")} {t.work.downloadTxt}</button></div>}
      <div style={{marginTop:14,fontSize:12,color:B.mu}}>{Math.max(0,LIMIT-usage.c)} {t.work.usesLeft}</div>
    </div>)}
    {result&&<button className="btn bg bm bf" style={{marginTop:12}} onClick={()=>{setFiles([]);setResult(null);setErr(null)}}>{t.work.newOp}</button>}
    </>)}
  </div>);
}

// ═══ APP ═══
export default function App(){
  const[pg,setPg]=useState("home");const[tool,setTool]=useState(null);const[usage,setUsage]=useState(getU());
  const[lang,setLang]=useState("en");
  const t=T[lang];
  const go=useCallback(p=>{setPg(p);window.scrollTo?.({top:0,behavior:"smooth"})},[]);
  return(<LangCtx.Provider value={{lang,setLang,t}}><div className="app"><style>{css}</style><Nav pg={pg} go={go} usage={usage}/>{pg==="home"&&<><Hero go={go}/><ToolGrid go={go} setTool={setTool}/><Comp/><Pricing go={go}/><FAQ/><CTA go={go}/></>}{pg==="tools"&&<div style={{paddingTop:32}}><ToolGrid go={go} setTool={setTool}/></div>}{pg==="pricing"&&<Pricing go={go}/>}{pg==="work"&&tool&&<Work tool={tool} usage={usage} setUsage={setUsage} go={go}/>}<Foot/></div></LangCtx.Provider>);
}
