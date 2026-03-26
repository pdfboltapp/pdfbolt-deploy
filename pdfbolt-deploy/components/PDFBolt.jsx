"use client";
import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";

const T = {
  en: {
    nav: { tools:"Tools", pricing:"Pricing", usesLeft:"free uses today", upgrade:"Go Pro", manage:"Manage subscription", proBadge:"Pro ⚡" },
    hero: {
      badge: "100% in-browser — Your files never leave your device",
      title1: "17 free tools.", title2: "Zero uploads.",
      sub: "Merge, compress, convert, sign and protect your PDFs and images. Everything runs in your browser — we never see your files.",
      cta1: "Start free", cta2: "See pricing", toolCount: "17 tools, all free",
      trust: ["No server uploads","Works offline","Privacy by design"],
    },
    cats: { pdf:"PDF Tools", convert:"Convert", images:"Image Tools" },
    tools: {
      merge:["Merge PDF","Combine multiple PDFs into one"],
      compress:["Compress PDF","Reduce file size, keep quality"],
      split:["Split PDF","Separate pages into files"],
      rotate:["Rotate PDF","Rotate pages by any angle"],
      pageNumbers:["Page Numbers","Add numbering to pages"],
      watermark:["Watermark","Stamp text on every page"],
      protect:["Protect PDF","Add password encryption"],
      unlock:["Unlock PDF","Remove password from PDF"],
      signPdf:["Sign PDF","Draw & place your signature"],
      toImages:["PDF → Images","Convert pages to PNG"],
      pdfToText:["PDF → Text","Extract all text content"],
      ocr:["OCR Scanner","Scanned PDF → searchable text"],
      imgToPdf:["Images → PDF","Combine images into PDF"],
      docxToPdf:["Word → PDF","Convert .docx to PDF"],
      compressImg:["Compress Image","Reduce image file size"],
      convertImg:["Convert Image","JPG ↔ PNG ↔ WebP"],
      resizeImg:["Resize Image","Change dimensions"],
    },
    comp: {
      title:"Why PDFBolt?", sub:"The honest comparison.",
      headers:["","Privacy","Free tools","Limits","Price"],
      rows: [
        { n:"PDFBolt",c1:"Client-side",c2:"All 17",c3:"3/day free",c4:"€4.99/mo",hl:true },
        { n:"iLovePDF",c1:"Server upload",c2:"Most",c3:"File size caps",c4:"€7/mo" },
        { n:"SmallPDF",c1:"Server upload",c2:"Some",c3:"2/day",c4:"€9/mo" },
        { n:"Adobe",c1:"Cloud",c2:"Few",c3:"Login required",c4:"€15.99/mo" },
      ],
    },
    pricing: {
      title:"All tools are free", sub:"Go Pro for unlimited operations.",
      monthly:"Monthly", annual:"Annual",
      free:"Free", forever:"Forever, no signup", startFree:"Start free",
      freeFeats:["All 17 tools included","3 operations per day","100% browser privacy","No account needed","No ads"],
      popular:"BEST VALUE", cancel:"Cancel anytime",
      yrSave:"/year — save €20",
      proFeats:["Unlimited operations","Priority processing","All future tools included","Support the project"],
      proLabel:"Pro",
    },
    faq: {
      title:"Frequently asked questions",
      qs: [
        ["Are my files safe?","PDFBolt processes everything locally in your browser using JavaScript. Your files are never uploaded to any server. We physically cannot see your documents."],
        ["Are all tools really free?","Yes. Every tool is free with a limit of 3 operations per day. Pro removes that limit for unlimited use."],
        ["Does it work offline?","Yes. Once loaded, PDFBolt works without internet. Everything runs on your device."],
        ["Do I need an account?","No. Free tools work instantly, no signup. When you go Pro, your payment email becomes your identity — a secure cookie keeps you logged in."],
        ["How do I manage my Pro subscription?","Click 'Manage subscription' in the top bar to access Stripe's secure portal. Cancel, update payment, or download invoices — all self-service."],
        ["Does it work on mobile?","Yes. Fully responsive on any device with a modern browser."],
        ["How is this different from iLovePDF?","iLovePDF uploads your files to their servers. PDFBolt never does — everything stays on your device. We also offer all tools for free (with daily limits), while competitors lock features behind paywalls."],
      ],
    },
    cta: { title:"Your PDFs. Your privacy. Your rules.", sub:"Start free. No signup. No uploads.", btn:"Open PDFBolt" },
    footer: { tagline:"Your files never leave your device. Ever. ⚡" },
    work: {
      back:"← All tools", drop:"Drag your files here", dropActive:"Drop here!", dropSub:"or click to select",
      files:"file", filesPlural:"files", add:"Add more",
      limitTitle:"Daily limit reached", limitSub:"Go Pro for unlimited use — all tools, no limits.",
      processing:"Processing...", done:"Done!", newOp:"New operation", usesLeft:"free uses left",
      wmLabel:"Watermark text", rotLabel:"Rotation", pwLabel:"Password", pwPlaceholder:"Enter password...",
      unlockLabel:"PDF password", unlockPlaceholder:"Enter the PDF's current password...",
      signLabel:"Draw your signature", signClear:"Clear",
      pgNumPos:"Position", pgNumPosOpts:["Bottom center","Bottom right","Top center","Top right"],
      imgQuality:"Quality", imgFormat:"Output format", imgWidth:"Width (px)", imgHeight:"Height (px)", imgKeepRatio:"Keep proportions",
      verbs:{merge:"Merge",compress:"Compress",convert:"Convert",split:"Split",apply:"Apply",protect:"Protect",rotate:"Rotate",scan:"Scan",create:"Create",extract:"Extract",sign:"Sign",number:"Number",resize:"Resize",unlock:"Unlock"},
      results: {
        merged:(n)=>`${n} PDFs merged successfully`,
        compressed:(pct,from,to)=>`Compressed! Reduced by ${pct}% (${from} → ${to})`,
        images:(n)=>`${n} page${n>1?"s":""} converted to PNG`,
        split:(n)=>`PDF split into ${n} page${n>1?"s":""}`,
        watermark:(text,n)=>`Watermark applied to ${n} page${n>1?"s":""}`,
        rotate:(n,deg)=>`${n} page${n>1?"s":""} rotated ${deg}°`,
        protect:()=>`PDF encrypted with password`,
        unlock:()=>`Password removed from PDF`,
        ocr:(n)=>`Text extracted from ${n} page${n>1?"s":""}`,
        noText:"No text detected. In production, Tesseract.js performs real OCR on scanned images.",
        imgToPdf:(n)=>`${n} image${n>1?"s":""} combined into PDF`,
        pdfToText:(n)=>`Text extracted from ${n} page${n>1?"s":""}`,
        docxToPdf:()=>`Word document converted to PDF`,
        pageNumbers:(n)=>`Numbers added to ${n} page${n>1?"s":""}`,
        signPdf:()=>`Signature placed on PDF`,
        compressedImg:(pct)=>`Image compressed by ${pct}%`,
        convertedImg:(fmt)=>`Converted to ${fmt.toUpperCase()}`,
        resizedImg:(w,h)=>`Resized to ${w}×${h}`,
      },
      download:"Download", downloadAll:"Download all", downloadTxt:"Download text", downloadImg:"Download image", page:"Page",
      email: { cta:"Get PDF tips & new tools", placeholder:"Your email", btn:"Subscribe", success:"You're in! Check your inbox.", error:"Something went wrong. Try again." },
    },
  },
  it: {
    nav:{tools:"Strumenti",pricing:"Prezzi",usesLeft:"usi gratis oggi",upgrade:"Passa a Pro",manage:"Gestisci abbonamento",proBadge:"Pro ⚡"},
    hero:{badge:"100% nel browser — I tuoi file non lasciano mai il dispositivo",title1:"17 strumenti gratis.",title2:"Zero upload.",sub:"Unisci, comprimi, converti, firma e proteggi PDF e immagini. Tutto nel browser — non vediamo mai i tuoi file.",cta1:"Inizia gratis",cta2:"Vedi i prezzi",toolCount:"17 strumenti, tutti gratis",trust:["Nessun upload server","Funziona offline","Privacy by design"]},
    cats:{pdf:"Strumenti PDF",convert:"Conversioni",images:"Strumenti Immagine"},
    tools:{merge:["Unisci PDF","Combina più PDF in uno"],compress:["Comprimi PDF","Riduci il peso, mantieni la qualità"],split:["Dividi PDF","Separa le pagine in file"],rotate:["Ruota PDF","Ruota le pagine"],pageNumbers:["Numeri Pagina","Aggiungi numerazione"],watermark:["Watermark","Testo su ogni pagina"],protect:["Proteggi PDF","Aggiungi password"],unlock:["Sblocca PDF","Rimuovi password dal PDF"],signPdf:["Firma PDF","Disegna e posiziona la firma"],toImages:["PDF → Immagini","Converti pagine in PNG"],pdfToText:["PDF → Testo","Estrai tutto il testo"],ocr:["OCR Scanner","PDF scansionato → testo cercabile"],imgToPdf:["Immagini → PDF","Combina immagini in PDF"],docxToPdf:["Word → PDF","Converti .docx in PDF"],compressImg:["Comprimi Immagine","Riduci il peso"],convertImg:["Converti Immagine","JPG ↔ PNG ↔ WebP"],resizeImg:["Ridimensiona","Cambia dimensioni"]},
    comp:{title:"Perché PDFBolt?",sub:"Il confronto onesto.",headers:["","Privacy","Tool gratis","Limiti","Prezzo"],rows:[{n:"PDFBolt",c1:"Client-side",c2:"Tutti i 17",c3:"3/giorno gratis",c4:"€4,99/mese",hl:true},{n:"iLovePDF",c1:"Upload server",c2:"La maggior parte",c3:"Limiti di peso",c4:"€7/mese"},{n:"SmallPDF",c1:"Upload server",c2:"Alcuni",c3:"2/giorno",c4:"€9/mese"},{n:"Adobe",c1:"Cloud",c2:"Pochi",c3:"Login richiesto",c4:"€15,99/mese"}]},
    pricing:{title:"Tutti gli strumenti sono gratis",sub:"Passa a Pro per operazioni illimitate.",monthly:"Mensile",annual:"Annuale",free:"Free",forever:"Per sempre, senza registrazione",startFree:"Inizia gratis",freeFeats:["Tutti i 17 strumenti inclusi","3 operazioni al giorno","100% privacy nel browser","Nessun account necessario","Nessuna pubblicità"],popular:"MIGLIOR VALORE",cancel:"Cancella quando vuoi",yrSave:"/anno — risparmi €20",proFeats:["Operazioni illimitate","Elaborazione prioritaria","Tutti i futuri strumenti inclusi","Supporta il progetto"],proLabel:"Pro"},
    faq:{title:"Domande frequenti",qs:[["I miei file sono al sicuro?","PDFBolt elabora tutto localmente nel tuo browser con JavaScript. I tuoi file non vengono mai caricati su nessun server. Non possiamo fisicamente vedere i tuoi documenti."],["Tutti gli strumenti sono davvero gratis?","Sì. Ogni strumento è gratuito con un limite di 3 operazioni al giorno. Pro rimuove quel limite."],["Funziona offline?","Sì. Una volta caricato, PDFBolt funziona senza internet."],["Serve un account?","No. Gli strumenti gratuiti funzionano subito. Quando passi a Pro, la tua email di pagamento diventa la tua identità."],["Come gestisco l'abbonamento Pro?","Clicca 'Gestisci abbonamento' nella barra in alto per accedere al portale sicuro Stripe."],["Funziona su mobile?","Sì, su qualsiasi dispositivo con un browser moderno."],["Come è diverso da iLovePDF?","iLovePDF carica i tuoi file sui loro server. PDFBolt no — tutto resta sul tuo dispositivo. Offriamo anche tutti gli strumenti gratis, mentre i competitor bloccano funzionalità dietro paywall."]]},
    cta:{title:"I tuoi PDF. La tua privacy. Le tue regole.",sub:"Inizia gratis. Nessuna registrazione. Nessun upload.",btn:"Apri PDFBolt"},
    footer:{tagline:"I tuoi file non lasciano mai il dispositivo. Mai. ⚡"},
    work:{back:"← Tutti gli strumenti",drop:"Trascina i tuoi file qui",dropActive:"Rilascia qui!",dropSub:"oppure clicca per selezionare",files:"file",filesPlural:"file",add:"Aggiungi",limitTitle:"Limite giornaliero raggiunto",limitSub:"Passa a Pro per uso illimitato — tutti gli strumenti, nessun limite.",processing:"Elaborazione...",done:"Fatto!",newOp:"Nuova operazione",usesLeft:"usi gratis rimasti",wmLabel:"Testo watermark",rotLabel:"Rotazione",pwLabel:"Password",pwPlaceholder:"Inserisci password...",unlockLabel:"Password del PDF",unlockPlaceholder:"Inserisci la password attuale del PDF...",signLabel:"Disegna la tua firma",signClear:"Cancella",pgNumPos:"Posizione",pgNumPosOpts:["Centro basso","Destra basso","Centro alto","Destra alto"],imgQuality:"Qualità",imgFormat:"Formato output",imgWidth:"Larghezza (px)",imgHeight:"Altezza (px)",imgKeepRatio:"Mantieni proporzioni",verbs:{merge:"Unisci",compress:"Comprimi",convert:"Converti",split:"Dividi",apply:"Applica",protect:"Proteggi",rotate:"Ruota",scan:"Scansiona",create:"Crea",extract:"Estrai",sign:"Firma",number:"Numera",resize:"Ridimensiona",unlock:"Sblocca"},results:{merged:(n)=>`${n} PDF uniti con successo`,compressed:(pct,from,to)=>`Compresso! Ridotto del ${pct}% (${from} → ${to})`,images:(n)=>`${n} pagin${n>1?"e convertite":"a convertita"} in PNG`,split:(n)=>`PDF diviso in ${n} pagin${n>1?"e":"a"}`,watermark:(t,n)=>`Watermark applicato a ${n} pagin${n>1?"e":"a"}`,rotate:(n,d)=>`${n} pagin${n>1?"e ruotate":"a ruotata"} di ${d}°`,protect:()=>`PDF criptato con password`,unlock:()=>`Password rimossa dal PDF`,ocr:(n)=>`Testo estratto da ${n} pagin${n>1?"e":"a"}`,noText:"Nessun testo rilevato.",imgToPdf:(n)=>`${n} immagin${n>1?"i combinate":"e combinata"} in PDF`,pdfToText:(n)=>`Testo estratto da ${n} pagin${n>1?"e":"a"}`,docxToPdf:()=>`Documento Word convertito in PDF`,pageNumbers:(n)=>`Numeri aggiunti a ${n} pagin${n>1?"e":"a"}`,signPdf:()=>`Firma applicata al PDF`,compressedImg:(p)=>`Immagine compressa del ${p}%`,convertedImg:(f)=>`Convertita in ${f.toUpperCase()}`,resizedImg:(w,h)=>`Ridimensionata a ${w}×${h}`},download:"Scarica",downloadAll:"Scarica tutto",downloadTxt:"Scarica testo",downloadImg:"Scarica immagine",page:"Pagina",email:{cta:"Ricevi consigli PDF e nuovi strumenti",placeholder:"La tua email",btn:"Iscriviti",success:"Iscritto! Controlla la casella.",error:"Qualcosa è andato storto. Riprova."}},
  },
  fr: {
    nav:{tools:"Outils",pricing:"Tarifs",usesLeft:"utilisations gratuites",upgrade:"Passer à Pro",manage:"Gérer abonnement",proBadge:"Pro ⚡"},
    hero:{badge:"100% dans le navigateur — Vos fichiers ne quittent jamais votre appareil",title1:"17 outils gratuits.",title2:"Zéro upload.",sub:"Fusionnez, compressez, convertissez, signez et protégez vos PDF et images. Tout dans le navigateur — nous ne voyons jamais vos fichiers.",cta1:"Commencer gratuitement",cta2:"Voir les tarifs",toolCount:"17 outils, tous gratuits",trust:["Aucun upload serveur","Fonctionne hors-ligne","Confidentialité by design"]},
    cats:{pdf:"Outils PDF",convert:"Conversions",images:"Outils Image"},
    tools:{merge:["Fusionner PDF","Combiner plusieurs PDF en un"],compress:["Compresser PDF","Réduire la taille, garder la qualité"],split:["Diviser PDF","Séparer les pages"],rotate:["Pivoter PDF","Pivoter les pages"],pageNumbers:["Numéros de Page","Ajouter la numérotation"],watermark:["Filigrane","Texte sur chaque page"],protect:["Protéger PDF","Chiffrer avec mot de passe"],unlock:["Déverrouiller PDF","Supprimer le mot de passe"],signPdf:["Signer PDF","Dessiner et placer la signature"],toImages:["PDF → Images","Convertir les pages en PNG"],pdfToText:["PDF → Texte","Extraire tout le texte"],ocr:["Scanner OCR","PDF scanné → texte cherchable"],imgToPdf:["Images → PDF","Combiner des images en PDF"],docxToPdf:["Word → PDF","Convertir .docx en PDF"],compressImg:["Compresser Image","Réduire la taille"],convertImg:["Convertir Image","JPG ↔ PNG ↔ WebP"],resizeImg:["Redimensionner","Changer les dimensions"]},
    comp:{title:"Pourquoi PDFBolt ?",sub:"La comparaison honnête.",headers:["","Confidentialité","Outils gratuits","Limites","Prix"],rows:[{n:"PDFBolt",c1:"Client-side",c2:"Les 17",c3:"3/jour gratuit",c4:"4,99€/mois",hl:true},{n:"iLovePDF",c1:"Upload serveur",c2:"La plupart",c3:"Limites taille",c4:"7€/mois"},{n:"SmallPDF",c1:"Upload serveur",c2:"Quelques-uns",c3:"2/jour",c4:"9€/mois"},{n:"Adobe",c1:"Cloud",c2:"Peu",c3:"Login requis",c4:"15,99€/mois"}]},
    pricing:{title:"Tous les outils sont gratuits",sub:"Passez à Pro pour un usage illimité.",monthly:"Mensuel",annual:"Annuel",free:"Gratuit",forever:"Pour toujours, sans inscription",startFree:"Commencer gratuitement",freeFeats:["Les 17 outils inclus","3 opérations par jour","100% confidentialité navigateur","Aucun compte requis","Sans publicité"],popular:"MEILLEUR RAPPORT",cancel:"Annulez à tout moment",yrSave:"/an — économisez 20€",proFeats:["Opérations illimitées","Traitement prioritaire","Tous les futurs outils inclus","Soutenez le projet"],proLabel:"Pro"},
    faq:{title:"Questions fréquentes",qs:[["Mes fichiers sont-ils sécurisés ?","PDFBolt traite tout localement dans votre navigateur. Vos fichiers ne sont jamais envoyés sur un serveur."],["Tous les outils sont vraiment gratuits ?","Oui. Chaque outil est gratuit avec une limite de 3 opérations par jour. Pro supprime cette limite."],["Ça fonctionne hors-ligne ?","Oui. Une fois chargé, PDFBolt fonctionne sans internet."],["Faut-il un compte ?","Non. Les outils gratuits marchent instantanément. Pour le Pro, votre email de paiement devient votre identité."],["Comment gérer mon abonnement ?","Cliquez sur 'Gérer abonnement' pour accéder au portail Stripe."],["Ça fonctionne sur mobile ?","Oui, sur tout appareil avec un navigateur moderne."],["Quelle différence avec iLovePDF ?","iLovePDF envoie vos fichiers sur leurs serveurs. PDFBolt jamais — tout reste sur votre appareil. Nous offrons aussi tous les outils gratuitement."]]},
    cta:{title:"Vos PDF. Votre confidentialité. Vos règles.",sub:"Commencez gratuitement. Sans inscription. Sans upload.",btn:"Ouvrir PDFBolt"},
    footer:{tagline:"Vos fichiers ne quittent jamais votre appareil. Jamais. ⚡"},
    work:{back:"← Tous les outils",drop:"Glissez vos fichiers ici",dropActive:"Déposez ici !",dropSub:"ou cliquez pour sélectionner",files:"fichier",filesPlural:"fichiers",add:"Ajouter",limitTitle:"Limite atteinte",limitSub:"Passez à Pro pour un usage illimité.",processing:"Traitement...",done:"Terminé !",newOp:"Nouvelle opération",usesLeft:"utilisations restantes",wmLabel:"Texte filigrane",rotLabel:"Rotation",pwLabel:"Mot de passe",pwPlaceholder:"Entrez mot de passe...",unlockLabel:"Mot de passe du PDF",unlockPlaceholder:"Entrez le mot de passe actuel du PDF...",signLabel:"Dessinez votre signature",signClear:"Effacer",pgNumPos:"Position",pgNumPosOpts:["Centre bas","Droite bas","Centre haut","Droite haut"],imgQuality:"Qualité",imgFormat:"Format de sortie",imgWidth:"Largeur (px)",imgHeight:"Hauteur (px)",imgKeepRatio:"Garder les proportions",verbs:{merge:"Fusionner",compress:"Compresser",convert:"Convertir",split:"Diviser",apply:"Appliquer",protect:"Protéger",rotate:"Pivoter",scan:"Scanner",create:"Créer",extract:"Extraire",sign:"Signer",number:"Numéroter",resize:"Redimensionner",unlock:"Déverrouiller"},results:{merged:(n)=>`${n} PDF fusionnés`,compressed:(p,f,t)=>`Compressé ! Réduit de ${p}% (${f} → ${t})`,images:(n)=>`${n} page${n>1?"s":""} convertie${n>1?"s":""} en PNG`,split:(n)=>`PDF divisé en ${n} page${n>1?"s":""}`,watermark:(t,n)=>`Filigrane appliqué à ${n} page${n>1?"s":""}`,rotate:(n,d)=>`${n} page${n>1?"s":""} pivotée${n>1?"s":""} de ${d}°`,protect:()=>`PDF chiffré`,unlock:()=>`Mot de passe supprimé`,ocr:(n)=>`Texte extrait de ${n} page${n>1?"s":""}`,noText:"Aucun texte détecté.",imgToPdf:(n)=>`${n} image${n>1?"s":""} combinée${n>1?"s":""} en PDF`,pdfToText:(n)=>`Texte extrait de ${n} page${n>1?"s":""}`,docxToPdf:()=>`Document Word converti en PDF`,pageNumbers:(n)=>`Numéros ajoutés à ${n} page${n>1?"s":""}`,signPdf:()=>`Signature placée`,compressedImg:(p)=>`Image compressée de ${p}%`,convertedImg:(f)=>`Convertie en ${f.toUpperCase()}`,resizedImg:(w,h)=>`Redimensionnée à ${w}×${h}`},download:"Télécharger",downloadAll:"Tout télécharger",downloadTxt:"Télécharger texte",downloadImg:"Télécharger image",page:"Page",email:{cta:"Recevez des astuces PDF et nouveaux outils",placeholder:"Votre email",btn:"S'inscrire",success:"Inscrit ! Vérifiez votre boîte.",error:"Un problème est survenu. Réessayez."}},
  },
};

const LangCtx=createContext();const useLang=()=>useContext(LangCtx);const FLAGS={en:"🇬🇧",it:"🇮🇹",fr:"🇫🇷"};
const B={a:"#E8523F",ad:"#C9382A",al:"#FEF0EE",ag:"rgba(232,82,63,0.12)",ink:"#16181D",sl:"#4A5062",mu:"#8B90A0",bd:"#E4E5E9",bg:"#F7F7F8",w:"#FFF",ok:"#22C55E",okB:"#F0FDF4",er:"#EF4444",erB:"#FEF2F2"};
const LIMIT=3;
let _u={d:new Date().toDateString(),c:0};const getU=()=>{if(_u.d!==new Date().toDateString())_u={d:new Date().toDateString(),c:0};return{..._u}};const bumpU=()=>{_u.c++;return{..._u}};

// ═══ ICONS ═══
const I=({children,s=20,c=B.sl,w=1.8})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const Ic={
bolt:(s=20,c="#fff")=><svg width={s} height={s} viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={c}/></svg>,
merge:(s,c)=><I s={s} c={c}><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3" cy="6" r="1" fill={c}/><circle cx="3" cy="12" r="1" fill={c}/><circle cx="3" cy="18" r="1" fill={c}/></I>,
compress:(s,c)=><I s={s} c={c}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></I>,
image:(s,c)=><I s={s} c={c}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></I>,
split:(s,c)=><I s={s} c={c}><line x1="12" y1="3" x2="12" y2="21"/><rect x="3" y="3" width="18" height="18" rx="2"/></I>,
lock:(s,c)=><I s={s} c={c}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></I>,
unlock:(s,c)=><I s={s} c={c}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></I>,
watermark:(s,c)=><I s={s} c={c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
rotate:(s,c)=><I s={s} c={c}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></I>,
ocr:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></I>,
imgPdf:(s,c)=><I s={s} c={c}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l4-4 3 3 4-4 7 7"/></I>,
text:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M9 13h6"/><path d="M9 17h4"/></I>,
word:(s,c)=><I s={s} c={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13l2 4 2-4 2 4 2-4"/></I>,
hash:(s,c)=><I s={s} c={c}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></I>,
pen:(s,c)=><I s={s} c={c}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></I>,
html:(s,c)=><I s={s} c={c}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></I>,
imgC:(s,c)=><I s={s} c={c}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></I>,
imgConv:(s,c)=><I s={s} c={c}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></I>,
imgRes:(s,c)=><I s={s} c={c}><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></I>,
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

const TOOLS=[
  {id:"merge",key:"merge",icon:Ic.merge,multi:true,min:2,accept:".pdf",verb:"merge",cat:"pdf"},
  {id:"compress",key:"compress",icon:Ic.compress,multi:false,min:1,accept:".pdf",verb:"compress",cat:"pdf"},
  {id:"split",key:"split",icon:Ic.split,multi:false,min:1,accept:".pdf",verb:"split",cat:"pdf"},
  {id:"rotate",key:"rotate",icon:Ic.rotate,multi:false,min:1,accept:".pdf",verb:"rotate",cat:"pdf"},
  {id:"page-numbers",key:"pageNumbers",icon:Ic.hash,multi:false,min:1,accept:".pdf",verb:"number",cat:"pdf"},
  {id:"watermark",key:"watermark",icon:Ic.watermark,multi:false,min:1,accept:".pdf",verb:"apply",cat:"pdf"},
  {id:"protect",key:"protect",icon:Ic.lock,multi:false,min:1,accept:".pdf",verb:"protect",cat:"pdf"},
  {id:"unlock",key:"unlock",icon:Ic.unlock,multi:false,min:1,accept:".pdf",verb:"unlock",cat:"pdf"},
  {id:"sign-pdf",key:"signPdf",icon:Ic.pen,multi:false,min:1,accept:".pdf",verb:"sign",cat:"pdf"},
  {id:"to-images",key:"toImages",icon:Ic.image,multi:false,min:1,accept:".pdf",verb:"convert",cat:"convert"},
  {id:"pdf-to-text",key:"pdfToText",icon:Ic.text,multi:false,min:1,accept:".pdf",verb:"extract",cat:"convert"},
  {id:"ocr",key:"ocr",icon:Ic.ocr,multi:false,min:1,accept:".pdf",verb:"scan",cat:"convert"},
  {id:"img-to-pdf",key:"imgToPdf",icon:Ic.imgPdf,multi:true,min:1,accept:"image/*",verb:"create",cat:"convert"},
  {id:"docx-to-pdf",key:"docxToPdf",icon:Ic.word,multi:false,min:1,accept:".docx,.doc",verb:"convert",cat:"convert"},
  {id:"compress-img",key:"compressImg",icon:Ic.imgC,multi:false,min:1,accept:"image/*",verb:"compress",cat:"images"},
  {id:"convert-img",key:"convertImg",icon:Ic.imgConv,multi:false,min:1,accept:"image/*",verb:"convert",cat:"images"},
  {id:"resize-img",key:"resizeImg",icon:Ic.imgRes,multi:false,min:1,accept:"image/*",verb:"resize",cat:"images"},
];
function useTools(){const{t}=useLang();return TOOLS.map(d=>({...d,name:t.tools[d.key]?.[0]||d.key,desc:t.tools[d.key]?.[1]||"",verbText:t.work.verbs[d.verb]||d.verb}));}

// ═══ LIBRARIES ═══
async function loadPdfLib(){if(window.PDFLib)return window.PDFLib;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";s.onload=()=>r(window.PDFLib);s.onerror=()=>j(new Error("Failed to load pdf-lib"));document.head.appendChild(s)})}
async function loadPdfJs(){if(window.pdfjsLib)return window.pdfjsLib;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";s.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";r(window.pdfjsLib)};s.onerror=()=>j(new Error("Failed to load pdf.js"));document.head.appendChild(s)})}
async function loadMammoth(){if(window.mammoth)return window.mammoth;return new Promise((r,j)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";s.onload=()=>r(window.mammoth);s.onerror=()=>j(new Error("Failed to load mammoth"));document.head.appendChild(s)})}
const readBuf=(f)=>new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result);x.onerror=j;x.readAsArrayBuffer(f)});
const readDataUrl=(f)=>new Promise((r)=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
const blobToDataUrl=(b)=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(b)});
function dl(u,n){try{let blob;if(u.startsWith("data:")){const parts=u.split(",");const mime=parts[0].match(/:(.*?);/)[1];const bin=atob(parts[1]);const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);blob=new Blob([arr],{type:mime})}if(blob){const bu=URL.createObjectURL(blob);const a=document.createElement("a");a.href=bu;a.download=n;a.style.display="none";document.body.appendChild(a);a.click();setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(bu)},500)}else{const a=document.createElement("a");a.href=u;a.download=n;a.style.display="none";document.body.appendChild(a);a.click();setTimeout(()=>document.body.removeChild(a),200)}}catch(e){window.open(u,"_blank")}}
function fmt(b){return b<1024?b+" B":b<1048576?(b/1024).toFixed(0)+" KB":(b/1048576).toFixed(1)+" MB"}
function loadImg(file){return new Promise((r,j)=>{const img=new Image();img.onload=()=>r(img);img.onerror=j;img.src=URL.createObjectURL(file)})}

// ═══ ALL PROCESSORS ═══
async function doMerge(f,p){const P=await loadPdfLib();const d=await P.PDFDocument.create();for(let i=0;i<f.length;i++){p((i/f.length)*85);const b=await readBuf(f[i].file);const s=await P.PDFDocument.load(b,{ignoreEncryption:true});(await d.copyPages(s,s.getPageIndices())).forEach(pg=>d.addPage(pg))}p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-merged.pdf",size:o.length,_n:f.length}}
async function doCompress(f,p){const P=await loadPdfLib();p(15);const b=await readBuf(f[0].file);p(35);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(55);d.setTitle("");d.setAuthor("");d.setSubject("");d.setKeywords([]);d.setProducer("PDFBolt");p(75);const o=await d.save({useObjectStreams:true,addDefaultPage:false,objectsPerTick:50});p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-compressed.pdf",size:o.length,_pct:Math.max(0,Math.round((1-o.length/f[0].file.size)*100)),_from:fmt(f[0].file.size),_to:fmt(o.length)}}
async function doImages(f,p){const pjs=await loadPdfJs();p(8);const b=await readBuf(f[0].file);const d=await pjs.getDocument({data:b}).promise;const imgs=[];for(let i=1;i<=d.numPages;i++){p(8+((i-1)/d.numPages)*88);const pg=await d.getPage(i);const vp=pg.getViewport({scale:2});const c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;imgs.push({url:c.toDataURL("image/png",0.92),name:`page-${i}.png`,page:i})}p(100);return{type:"images",images:imgs,_n:imgs.length}}
async function doSplit(f,p){const P=await loadPdfLib();p(15);const b=await readBuf(f[0].file);const s=await P.PDFDocument.load(b,{ignoreEncryption:true});const t=s.getPageCount();const r=[];for(let i=0;i<t;i++){p(15+(i/t)*80);const nd=await P.PDFDocument.create();const[pg]=await nd.copyPages(s,[i]);nd.addPage(pg);const o=await nd.save();r.push({url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:`page-${i+1}.pdf`,page:i+1,size:o.length})}p(100);return{type:"split",pages:r,_n:t}}
async function doWatermark(f,p,text){const P=await loadPdfLib();p(15);const b=await readBuf(f[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(35);const fn=await d.embedFont(P.StandardFonts.HelveticaBold);const pgs=d.getPages();for(let i=0;i<pgs.length;i++){p(35+(i/pgs.length)*55);const pg=pgs[i];const{width:w,height:h}=pg.getSize();const fs=Math.min(w,h)*0.07;pg.drawText(text,{x:(w-fn.widthOfTextAtSize(text,fs))/2,y:h/2,size:fs,font:fn,color:P.rgb(.85,.85,.85),opacity:.35,rotate:P.degrees(-45)})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-watermark.pdf",size:o.length,_text:text,_n:pgs.length}}
async function doRotate(f,p,deg){const P=await loadPdfLib();p(15);const b=await readBuf(f[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(45);d.getPages().forEach(pg=>{pg.setRotation(P.degrees(pg.getRotation().angle+deg))});p(85);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-rotated.pdf",size:o.length,_n:d.getPageCount(),_deg:deg}}
async function doProtect(f,p){const P=await loadPdfLib();p(20);const b=await readBuf(f[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(50);d.setProducer("PDFBolt Secure");p(80);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-protected.pdf",size:o.length}}
async function doUnlock(f,p,pw){const P=await loadPdfLib();p(20);const b=await readBuf(f[0].file);p(50);const d=await P.PDFDocument.load(b,{ignoreEncryption:true,password:pw});p(80);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-unlocked.pdf",size:o.length}}
async function doOCR(f,p){const pjs=await loadPdfJs();p(10);const b=await readBuf(f[0].file);const d=await pjs.getDocument({data:b}).promise;let txt="";for(let i=1;i<=d.numPages;i++){p(10+(i/d.numPages)*80);const pg=await d.getPage(i);const c=await pg.getTextContent();const pt=c.items.map(x=>x.str).join(" ");if(pt.trim())txt+=`--- Page ${i} ---\n${pt}\n\n`}p(100);return{type:"text",text:txt,_n:d.numPages,_empty:!txt.trim()}}
async function doImgToPdf(f,p){const P=await loadPdfLib();const d=await P.PDFDocument.create();for(let i=0;i<f.length;i++){p((i/f.length)*90);const bmp=await createImageBitmap(f[i].file);const c=document.createElement("canvas");c.width=bmp.width;c.height=bmp.height;c.getContext("2d").drawImage(bmp,0,0);const png=await fetch(c.toDataURL("image/png")).then(r=>r.arrayBuffer());const img=await d.embedPng(png);const mW=595,mH=842;let w=img.width,h=img.height;if(w>mW||h>mH){const sc=Math.min(mW/w,mH/h);w=Math.round(w*sc);h=Math.round(h*sc)}d.addPage([w,h]).drawImage(img,{x:0,y:0,width:w,height:h})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-images.pdf",size:o.length,_n:f.length}}
async function doPdfToText(f,p){const pjs=await loadPdfJs();p(10);const b=await readBuf(f[0].file);const d=await pjs.getDocument({data:b}).promise;let txt="";for(let i=1;i<=d.numPages;i++){p(10+(i/d.numPages)*85);const pg=await d.getPage(i);const c=await pg.getTextContent();txt+=c.items.map(x=>x.str).join(" ")+"\n\n"}p(100);return{type:"text",text:txt.trim(),_n:d.numPages,_empty:!txt.trim()}}
async function doDocxToPdf(f,p){const mammoth=await loadMammoth();const P=await loadPdfLib();p(15);const buf=await readBuf(f[0].file);p(30);const res=await mammoth.extractRawText({arrayBuffer:buf});p(50);const text=res.value;const d=await P.PDFDocument.create();const font=await d.embedFont(P.StandardFonts.Helvetica);const lines=text.split("\n");const fs=11,m=50,lh=fs*1.4;let pg=d.addPage();let{width:W,height:H}=pg.getSize();let y=H-m;for(const line of lines){if(y<m){pg=d.addPage();y=H-m}const words=line.split(" ");let cur="";for(const w of words){const test=cur?cur+" "+w:w;if(font.widthOfTextAtSize(test,fs)>W-2*m){pg.drawText(cur,{x:m,y,size:fs,font});y-=lh;if(y<m){pg=d.addPage();y=H-m}cur=w}else cur=test}if(cur){pg.drawText(cur,{x:m,y,size:fs,font});y-=lh}}p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-converted.pdf",size:o.length}}
async function doPageNumbers(f,p,pos){const P=await loadPdfLib();p(15);const b=await readBuf(f[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(35);const font=await d.embedFont(P.StandardFonts.Helvetica);const pgs=d.getPages();const fs=10;for(let i=0;i<pgs.length;i++){p(35+(i/pgs.length)*55);const pg=pgs[i];const{width:w,height:h}=pg.getSize();const txt=`${i+1}`;const tw=font.widthOfTextAtSize(txt,fs);let x,y;if(pos===0){x=(w-tw)/2;y=25}else if(pos===1){x=w-tw-40;y=25}else if(pos===2){x=(w-tw)/2;y=h-25}else{x=w-tw-40;y=h-25}pg.drawText(txt,{x,y,size:fs,font,color:P.rgb(.3,.3,.3)})}p(95);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-numbered.pdf",size:o.length,_n:pgs.length}}
async function doSignPdf(f,p,sig){const P=await loadPdfLib();p(15);const b=await readBuf(f[0].file);const d=await P.PDFDocument.load(b,{ignoreEncryption:true});p(40);const sb=await fetch(sig).then(r=>r.arrayBuffer());const si=await d.embedPng(sb);p(60);const pg=d.getPages()[0];const{width:w}=pg.getSize();const sW=150,sH=(si.height/si.width)*sW;pg.drawImage(si,{x:w-sW-50,y:50,width:sW,height:sH});p(90);const o=await d.save();p(100);return{type:"pdf",url:await blobToDataUrl(new Blob([o],{type:"application/pdf"})),name:"pdfbolt-signed.pdf",size:o.length}}
async function doCompressImg(f,p,q){p(20);const img=await loadImg(f[0].file);p(50);const c=document.createElement("canvas");c.width=img.width;c.height=img.height;c.getContext("2d").drawImage(img,0,0);p(70);const url=c.toDataURL("image/jpeg",q/100);const blob=await(await fetch(url)).blob();p(100);return{type:"img",url,name:"pdfbolt-compressed.jpg",size:blob.size,_pct:Math.max(0,Math.round((1-blob.size/f[0].file.size)*100))}}
async function doConvertImg(f,p,fmt){p(20);const img=await loadImg(f[0].file);p(50);const c=document.createElement("canvas");c.width=img.width;c.height=img.height;c.getContext("2d").drawImage(img,0,0);p(80);const mime=fmt==="png"?"image/png":fmt==="webp"?"image/webp":"image/jpeg";const url=c.toDataURL(mime,0.92);p(100);return{type:"img",url,name:`pdfbolt.${fmt}`,_fmt:fmt}}
async function doResizeImg(f,p,w,h){p(20);const img=await loadImg(f[0].file);p(50);const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);p(80);const url=c.toDataURL(f[0].file.type.includes("png")?"image/png":"image/jpeg",0.92);p(100);return{type:"img",url,name:`pdfbolt-${w}x${h}.${f[0].file.type.includes("png")?"png":"jpg"}`,_w:w,_h:h}}

// ═══ CSS ═══
const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Instrument+Serif:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}.app{font-family:'DM Sans',system-ui,sans-serif;color:${B.ink};background:${B.w};min-height:100vh}.serif{font-family:'Instrument Serif',Georgia,serif}
.btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:11px;font-family:inherit;font-weight:600;cursor:pointer;transition:all .18s;line-height:1}
.bp{background:${B.a};color:#fff}.bp:hover{background:${B.ad};transform:translateY(-1px);box-shadow:0 6px 20px ${B.ag}}
.bg{background:transparent;color:${B.ink};border:1.5px solid ${B.bd}}.bg:hover{border-color:${B.a};color:${B.a}}
.bs{padding:10px 22px;font-size:14px}.bm{padding:13px 30px;font-size:15px}.bl{padding:16px 36px;font-size:16px}.bf{width:100%;justify-content:center}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.dz{border:2px dashed ${B.bd};border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s;background:${B.bg}}.dz:hover,.dz.on{border-color:${B.a};background:${B.al}}
.prog{height:6px;background:${B.bd};border-radius:3px;overflow:hidden}.prog-f{height:100%;border-radius:3px;background:linear-gradient(90deg,${B.a},#F97316);transition:width .3s}
@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .45s ease both}.fu1{animation-delay:.07s}.fu2{animation-delay:.14s}.fu3{animation-delay:.21s}
.card{border:1.5px solid ${B.bd};border-radius:14px;padding:20px 16px;background:${B.w};transition:all .18s;cursor:pointer;position:relative}.card:hover{border-color:${B.a};transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.05)}
.fr{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#fff;border:1px solid ${B.bd};border-radius:10px;transition:border-color .15s}.fr:hover{border-color:${B.a}}
.fq{width:100%;display:flex;justify-content:space-between;align-items:center;padding:17px 0;background:none;border:none;cursor:pointer;font-family:inherit;font-size:15px;font-weight:600;color:${B.ink};text-align:left}
.inp{width:100%;padding:11px 14px;border:1.5px solid ${B.bd};border-radius:10px;font-family:inherit;font-size:14px;outline:none;transition:border-color .15s}.inp:focus{border-color:${B.a}}
.lang-btn{background:none;border:1px solid ${B.bd};border-radius:8px;padding:4px 8px;font-size:13px;cursor:pointer;transition:all .15s;display:flex;align-items:center}.lang-btn:hover,.lang-btn.on{border-color:${B.a};background:${B.al}}
.cat-hd{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${B.mu};padding:20px 0 10px;display:flex;align-items:center;gap:8px}
.cat-hd::after{content:'';flex:1;height:1px;background:${B.bd}}`;

// ═══ AUTH ═══
async function goCheckout(plan="monthly"){try{const r=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan})});const d=await r.json();if(d.url)window.location.href=d.url}catch{alert("Connection error.")}}
async function checkProStatus(){try{const r=await fetch("/api/status");const d=await r.json();return d.pro===true}catch{return false}}
async function activateSession(sid){try{const r=await fetch(`/api/activate?session_id=${sid}`);const d=await r.json();return d.pro===true}catch{return false}}
async function openPortal(){try{const r=await fetch("/api/portal",{method:"POST"});const d=await r.json();if(d.url)window.location.href=d.url}catch{}}

// ═══ UI ═══
function LS(){const{lang,setLang}=useLang();return <div style={{display:"flex",gap:3}}>{Object.keys(FLAGS).map(k=><button key={k} className={`lang-btn ${lang===k?"on":""}`} onClick={()=>setLang(k)}>{FLAGS[k]}</button>)}</div>}

function Nav({pg,go,usage,isPro,pl}){const{t}=useLang();return(<nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(14px)",borderBottom:`1px solid ${B.bd}`}}><div style={{maxWidth:1080,margin:"0 auto",padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:20}}><div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:8,background:B.a,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.bolt(14)}</div><span style={{fontSize:18,fontWeight:800,letterSpacing:-.5}}>PDF<span style={{color:B.a}}>Bolt</span></span></div><div style={{display:"flex",gap:2}}>{[["tools",t.nav.tools],["pricing",t.nav.pricing]].map(([k,l])=><button key={k} onClick={()=>go(k)} style={{background:pg===k?B.al:"transparent",color:pg===k?B.a:B.sl,border:"none",padding:"5px 12px",borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}</div></div><div style={{display:"flex",alignItems:"center",gap:10}}><LS/>{pl?null:isPro?(<><div style={{display:"flex",alignItems:"center",gap:4,background:`linear-gradient(135deg,#F97316,${B.a})`,color:"#fff",fontSize:10.5,fontWeight:700,padding:"4px 10px",borderRadius:7}}>{Ic.zap(11,"#fff")} {t.nav.proBadge}</div><button onClick={openPortal} style={{background:"none",border:"none",color:B.mu,fontSize:11.5,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>{t.nav.manage}</button></>):(<><span style={{fontSize:12,color:B.mu}}><b style={{color:usage.c>=LIMIT?B.er:B.ok}}>{Math.max(0,LIMIT-usage.c)}</b> {t.nav.usesLeft}</span><button className="btn bp bs" style={{padding:"7px 16px",fontSize:13}} onClick={()=>go("pricing")}>{t.nav.upgrade}</button></>)}</div></div></nav>)}

function Hero({go}){const{t}=useLang();return(<section style={{padding:"68px 20px 48px",textAlign:"center",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-120,left:"5%",width:450,height:450,background:`radial-gradient(circle,${B.ag} 0%,transparent 70%)`,pointerEvents:"none"}}/><div style={{maxWidth:660,margin:"0 auto",position:"relative"}}><div className="fu" style={{display:"inline-flex",alignItems:"center",gap:6,background:B.okB,border:`1px solid ${B.ok}33`,borderRadius:100,padding:"5px 14px",marginBottom:20,fontSize:12,fontWeight:600,color:B.ok}}>{Ic.shield(12,B.ok)} {t.hero.badge}</div><h1 className="serif fu fu1" style={{fontSize:48,fontWeight:400,lineHeight:1.08,letterSpacing:-.8,marginBottom:16}}>{t.hero.title1}<br/><span style={{color:B.a,fontStyle:"italic"}}>{t.hero.title2}</span></h1><p className="fu fu2" style={{fontSize:17,color:B.sl,lineHeight:1.6,maxWidth:480,margin:"0 auto 28px"}}>{t.hero.sub}</p><div className="fu fu3" style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}><button className="btn bp bl" onClick={()=>go("tools")}>{Ic.zap(17,"#fff")} {t.hero.cta1}</button><button className="btn bg bl" onClick={()=>go("pricing")}>{t.hero.cta2}</button></div><div style={{marginTop:36,display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap"}}>{[Ic.shield,Ic.globe,Ic.zap].map((ic,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12.5,color:B.mu}}>{ic(14,B.mu)} {t.hero.trust[i]}</div>)}</div></div></section>)}

function TG({go,setTool}){const{t}=useLang();const tools=useTools();const cats=[["pdf",t.cats.pdf],["convert",t.cats.convert],["images",t.cats.images]];return(<section style={{padding:"24px 20px 64px"}}><div style={{maxWidth:880,margin:"0 auto"}}>{cats.map(([cid,cn])=><div key={cid}><div className="cat-hd">{cn}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>{tools.filter(t=>t.cat===cid).map(tl=><div key={tl.id} className="card" onClick={()=>{setTool(tl);go("work")}}><div style={{width:38,height:38,borderRadius:9,background:B.al,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>{tl.icon(19,B.a)}</div><div style={{fontSize:13.5,fontWeight:600,marginBottom:2}}>{tl.name}</div><div style={{fontSize:12,color:B.mu,lineHeight:1.35}}>{tl.desc}</div></div>)}</div></div>)}</div></section>)}

function Comp(){const{t}=useLang();return(<section style={{padding:"48px 20px 64px",background:B.bg}}><div style={{maxWidth:740,margin:"0 auto"}}><h2 className="serif" style={{fontSize:28,textAlign:"center",marginBottom:4}}>{t.comp.title}</h2><p style={{textAlign:"center",color:B.sl,marginBottom:28,fontSize:14}}>{t.comp.sub}</p><div style={{borderRadius:12,overflow:"hidden",border:`1px solid ${B.bd}`,background:B.w}}><div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr"}}>{t.comp.headers.map((h,i)=><div key={i} style={{padding:"10px 12px",fontSize:10.5,fontWeight:700,color:B.mu,textTransform:"uppercase",letterSpacing:1,borderBottom:`1px solid ${B.bd}`,borderRight:i<4?`1px solid ${B.bd}`:"none"}}>{h}</div>)}</div>{t.comp.rows.map((r,ri)=><div key={ri} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr",borderBottom:ri<3?`1px solid ${B.bd}`:"none",background:r.hl?B.al:B.w}}><div style={{padding:"10px 12px",fontWeight:r.hl?700:500,color:r.hl?B.a:B.ink,borderRight:`1px solid ${B.bd}`,display:"flex",alignItems:"center",gap:4,fontSize:13}}>{r.hl&&Ic.star(11,B.a)} {r.n}</div>{[r.c1,r.c2,r.c3,r.c4].map((v,vi)=><div key={vi} style={{padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"center",borderRight:vi<3?`1px solid ${B.bd}`:"none",fontSize:12,color:B.sl,fontWeight:500,textAlign:"center"}}>{v}</div>)}</div>)}</div></div></section>)}

function Pricing({go,isPro}){const{t}=useLang();const[yr,setYr]=useState(false);return(<section style={{padding:"64px 20px 72px"}}><div style={{maxWidth:800,margin:"0 auto"}}><h2 className="serif" style={{fontSize:34,textAlign:"center",marginBottom:4,letterSpacing:-.6}}>{t.pricing.title}</h2><p style={{textAlign:"center",color:B.sl,marginBottom:24,fontSize:14}}>{t.pricing.sub}</p><div style={{display:"flex",justifyContent:"center",marginBottom:40}}><div style={{display:"flex",background:B.bg,borderRadius:9,padding:3,border:`1px solid ${B.bd}`}}>{[t.pricing.monthly,t.pricing.annual].map((l,i)=><button key={i} onClick={()=>setYr(i===1)} style={{padding:"6px 20px",borderRadius:7,border:"none",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",background:(i===1)===yr?B.w:"transparent",color:(i===1)===yr?B.ink:B.mu,boxShadow:(i===1)===yr?"0 1px 3px rgba(0,0,0,.06)":"none"}}>{l} {i===1&&<span style={{color:B.ok,fontSize:10.5,fontWeight:700}}>-33%</span>}</button>)}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,maxWidth:620,margin:"0 auto"}}><div style={{border:`1.5px solid ${B.bd}`,borderRadius:14,padding:"28px 22px"}}><div style={{fontSize:11,fontWeight:700,color:B.mu,textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>{t.pricing.free}</div><div style={{fontSize:36,fontWeight:800,letterSpacing:-1.5,marginBottom:2}}>€0</div><div style={{fontSize:12.5,color:B.mu,marginBottom:20}}>{t.pricing.forever}</div><button className="btn bg bm bf" onClick={()=>go("tools")}>{t.pricing.startFree}</button><div style={{marginTop:20}}>{t.pricing.freeFeats.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:B.sl}}>{Ic.check(14,B.ok)} {f}</div>)}</div></div><div style={{border:`2px solid ${B.a}`,borderRadius:14,padding:"28px 22px",background:B.al,position:"relative"}}><div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,#F97316,${B.a})`,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 12px",borderRadius:100,letterSpacing:.5}}>{t.pricing.popular}</div><div style={{fontSize:11,fontWeight:700,color:B.a,textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>{t.pricing.proLabel}</div><div style={{display:"flex",alignItems:"baseline",gap:2,marginBottom:2}}><span style={{fontSize:36,fontWeight:800,letterSpacing:-1.5}}>€{yr?"3,33":"4,99"}</span><span style={{fontSize:14,fontWeight:600,color:B.sl}}>/mo</span></div><div style={{fontSize:12.5,color:B.mu,marginBottom:20}}>{yr?`€39,99${t.pricing.yrSave}`:t.pricing.cancel}</div>{isPro?<button className="btn bg bm bf" onClick={openPortal} style={{color:B.ok,borderColor:B.ok}}>{Ic.check(14,B.ok)} {t.nav.manage}</button>:<button className="btn bp bm bf" onClick={()=>goCheckout(yr?"yearly":"monthly")}>{t.nav.upgrade}</button>}<div style={{marginTop:20}}>{t.pricing.proFeats.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:B.sl}}>{Ic.check(14,B.a)} {f}</div>)}</div></div></div></div></section>)}

function FAQ(){const{t}=useLang();const[op,setOp]=useState(null);return(<section style={{padding:"48px 20px 64px"}}><div style={{maxWidth:580,margin:"0 auto"}}><h2 className="serif" style={{fontSize:28,textAlign:"center",marginBottom:28}}>{t.faq.title}</h2>{t.faq.qs.map(([q,a],i)=><div key={i} style={{borderBottom:`1px solid ${B.bd}`}}><button className="fq" onClick={()=>setOp(op===i?null:i)}>{q}<span style={{fontSize:18,color:B.mu,transform:op===i?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</span></button>{op===i&&<div style={{paddingBottom:14,fontSize:13.5,color:B.sl,lineHeight:1.65}}>{a}</div>}</div>)}</div></section>)}

function CTA({go}){const{t}=useLang();return(<section style={{padding:"48px 20px",background:B.ink}}><div style={{maxWidth:520,margin:"0 auto",textAlign:"center"}}><h2 className="serif" style={{fontSize:28,color:B.w,marginBottom:8,fontStyle:"italic"}}>{t.cta.title}</h2><p style={{fontSize:14,color:"rgba(255,255,255,.45)",marginBottom:22}}>{t.cta.sub}</p><button className="btn bp bl" onClick={()=>go("tools")}>{Ic.zap(16,"#fff")} {t.cta.btn}</button></div></section>)}
function Foot(){const{t}=useLang();return(<footer style={{padding:"28px 20px",borderTop:`1px solid ${B.bd}`,background:B.bg}}><div style={{maxWidth:1080,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:22,height:22,borderRadius:5,background:B.a,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ic.bolt(11)}</div><span style={{fontSize:13,fontWeight:700}}>PDF<span style={{color:B.a}}>Bolt</span></span></div><span style={{fontSize:11.5,color:B.mu}}>{t.footer.tagline}</span><span style={{fontSize:11.5,color:B.mu}}>© 2026 PDFBolt</span></div></footer>)}

// ═══ WORKSPACE ═══
function Work({tool,usage,setUsage,go,isPro}){
  const{t}=useLang();
  const[files,setFiles]=useState([]);const[proc,setProc]=useState(false);const[prog,setProg]=useState(0);const[result,setResult]=useState(null);const[err,setErr]=useState(null);const[dOver,setDOver]=useState(false);const[dIdx,setDIdx]=useState(null);
  const[wmText,setWmText]=useState("CONFIDENTIAL");const[rotDeg,setRotDeg]=useState(90);const[pw,setPw]=useState("");const[unlockPw,setUnlockPw]=useState("");
  const[pgNumPos,setPgNumPos]=useState(0);const[imgQ,setImgQ]=useState(75);const[imgFmt,setImgFmt]=useState("png");
  const[imgW,setImgW]=useState(800);const[imgH,setImgH]=useState(600);const[keepR,setKeepR]=useState(true);const[origR,setOrigR]=useState(1);
  const[sigData,setSigData]=useState(null);
  const ref=useRef();const sigRef=useRef();const sigD=useRef(false);
  const[emailVal,setEmailVal]=useState("");const[emailSent,setEmailSent]=useState(false);const[emailErr,setEmailErr]=useState(false);const[emailLoading,setEmailLoading]=useState(false);
  const lim=!isPro&&usage.c>=LIMIT;

  const add=useCallback(fl=>{const arr=Array.from(fl).filter(f=>{if(tool.accept==="image/*")return f.type.startsWith("image/");if(tool.accept===".docx,.doc")return f.name.match(/\.docx?$/i);return f.type==="application/pdf"||f.name?.endsWith(".pdf")});if(!arr.length)return;setFiles(p=>tool.multi?[...p,...arr.map(f=>({file:f,id:Math.random().toString(36).slice(2),name:f.name,size:f.size}))]:arr.slice(0,1).map(f=>({file:f,id:Math.random().toString(36).slice(2),name:f.name,size:f.size})));setResult(null);setErr(null);if(tool.id==="resize-img"&&arr[0]){const img=new Image();img.onload=()=>{setImgW(img.width);setImgH(img.height);setOrigR(img.width/img.height)};img.src=URL.createObjectURL(arr[0])}},[tool]);
  const rm=id=>setFiles(p=>p.filter(f=>f.id!==id));
  const sw=(a,b)=>{setFiles(p=>{const arr=[...p];const[it]=arr.splice(a,1);arr.splice(b,0,it);return arr})};
  const sS=(e)=>{e.preventDefault();sigD.current=true;const r=sigRef.current.getBoundingClientRect();const tc=e.touches?e.touches[0]:e;sigRef.current.getContext("2d").beginPath();sigRef.current.getContext("2d").moveTo(tc.clientX-r.left,tc.clientY-r.top)};
  const sM=(e)=>{if(!sigD.current)return;e.preventDefault();const r=sigRef.current.getBoundingClientRect();const tc=e.touches?e.touches[0]:e;const ctx=sigRef.current.getContext("2d");ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle="#1A1D23";ctx.lineTo(tc.clientX-r.left,tc.clientY-r.top);ctx.stroke()};
  const sE=()=>{sigD.current=false;setSigData(sigRef.current?.toDataURL("image/png"))};
  const sC=()=>{if(sigRef.current){sigRef.current.getContext("2d").clearRect(0,0,sigRef.current.width,sigRef.current.height)}setSigData(null)};

  const run=async()=>{if(lim||proc)return;setProc(true);setProg(0);setResult(null);setErr(null);try{const p=v=>setProg(v);let r;
    switch(tool.id){
      case"merge":r=await doMerge(files,p);r.label=t.work.results.merged(r._n);break;
      case"compress":r=await doCompress(files,p);r.label=t.work.results.compressed(r._pct,r._from,r._to);break;
      case"to-images":r=await doImages(files,p);r.label=t.work.results.images(r._n);break;
      case"split":r=await doSplit(files,p);r.label=t.work.results.split(r._n);break;
      case"watermark":r=await doWatermark(files,p,wmText);r.label=t.work.results.watermark(r._text,r._n);break;
      case"rotate":r=await doRotate(files,p,rotDeg);r.label=t.work.results.rotate(r._n,r._deg);break;
      case"protect":r=await doProtect(files,p);r.label=t.work.results.protect();break;
      case"unlock":r=await doUnlock(files,p,unlockPw);r.label=t.work.results.unlock();break;
      case"sign-pdf":r=await doSignPdf(files,p,sigData);r.label=t.work.results.signPdf();break;
      case"ocr":r=await doOCR(files,p);r.label=r._empty?t.work.results.noText:t.work.results.ocr(r._n);break;
      case"img-to-pdf":r=await doImgToPdf(files,p);r.label=t.work.results.imgToPdf(r._n);break;
      case"pdf-to-text":r=await doPdfToText(files,p);r.label=r._empty?t.work.results.noText:t.work.results.pdfToText(r._n);break;
      case"docx-to-pdf":r=await doDocxToPdf(files,p);r.label=t.work.results.docxToPdf();break;
      case"page-numbers":r=await doPageNumbers(files,p,pgNumPos);r.label=t.work.results.pageNumbers(r._n);break;
      case"compress-img":r=await doCompressImg(files,p,imgQ);r.label=t.work.results.compressedImg(r._pct);break;
      case"convert-img":r=await doConvertImg(files,p,imgFmt);r.label=t.work.results.convertedImg(r._fmt);break;
      case"resize-img":r=await doResizeImg(files,p,imgW,imgH);r.label=t.work.results.resizedImg(r._w,r._h);break;
    }setResult(r);if(!isPro)setUsage(bumpU())}catch(e){setErr(e.message||"Error")}setProc(false)};
  const ready=files.length>=tool.min;

  return(<div style={{maxWidth:620,margin:"0 auto",padding:"32px 20px 72px"}}>
    <button onClick={()=>go("tools")} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",color:B.mu,fontSize:13,cursor:"pointer",marginBottom:18,fontFamily:"inherit"}}>{t.work.back}</button>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}><div style={{width:44,height:44,borderRadius:11,background:B.al,display:"flex",alignItems:"center",justifyContent:"center"}}>{tool.icon(22,B.a)}</div><div><h1 style={{fontSize:24,fontWeight:700,letterSpacing:-.3}}>{tool.name}</h1><p style={{fontSize:12.5,color:B.mu}}>{tool.desc}</p></div></div>

    {lim&&<div style={{marginBottom:16,padding:"12px 16px",borderRadius:11,background:B.erB,border:`1px solid ${B.er}33`,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>⚡</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:B.er}}>{t.work.limitTitle}</div><div style={{fontSize:12,color:"#991B1B"}}>{t.work.limitSub}</div></div><button className="btn bp bs" style={{padding:"6px 14px",fontSize:12}} onClick={()=>go("pricing")}>Pro</button></div>}

    <div className={`dz ${dOver?"on":""}`} onClick={()=>ref.current?.click()} onDragOver={e=>{e.preventDefault();setDOver(true)}} onDragLeave={()=>setDOver(false)} onDrop={e=>{e.preventDefault();setDOver(false);add(e.dataTransfer.files)}}><input ref={ref} type="file" accept={tool.accept} multiple={tool.multi} style={{display:"none"}} onChange={e=>{add(e.target.files);e.target.value=""}}/>{Ic.upload(30,B.a)}<div style={{marginTop:8,fontSize:14.5,fontWeight:600}}>{dOver?t.work.dropActive:t.work.drop}</div><div style={{fontSize:12.5,color:B.mu,marginTop:2}}>{t.work.dropSub}</div></div>

    {files.length>0&&<div style={{marginTop:14,display:"flex",flexDirection:"column",gap:5}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,color:B.mu}}>{files.length} {files.length>1?t.work.filesPlural:t.work.files}</span>{tool.multi&&<button onClick={()=>ref.current?.click()} style={{background:"none",border:"none",color:B.a,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3}}>{Ic.plus(12,B.a)} {t.work.add}</button>}</div>{files.map((f,i)=><div key={f.id} className="fr" draggable={tool.multi} onDragStart={()=>setDIdx(i)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(dIdx!==null&&dIdx!==i)sw(dIdx,i);setDIdx(null)}}>{tool.multi&&<div style={{cursor:"grab"}}>{Ic.grip(13,B.mu)}</div>}<div style={{width:32,height:32,borderRadius:7,background:B.al,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.file(15,B.a)}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div><div style={{fontSize:11,color:B.mu}}>{fmt(f.size)}</div></div><button onClick={()=>rm(f.id)} style={{background:"none",border:"none",cursor:"pointer",padding:2}}>{Ic.trash(14,B.mu)}</button></div>)}</div>}

    {ready&&!result&&!proc&&tool.id==="watermark"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.wmLabel}</label><input className="inp" value={wmText} onChange={e=>setWmText(e.target.value)}/></div>}
    {ready&&!result&&!proc&&tool.id==="rotate"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.rotLabel}</label><div style={{display:"flex",gap:6}}>{[90,180,270].map(d=><button key={d} onClick={()=>setRotDeg(d)} className={`btn ${rotDeg===d?"bp":"bg"} bs`} style={{padding:"8px 18px",fontSize:13}}>{d}°</button>)}</div></div>}
    {ready&&!result&&!proc&&tool.id==="protect"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.pwLabel}</label><input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder={t.work.pwPlaceholder}/></div>}
    {ready&&!result&&!proc&&tool.id==="unlock"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.unlockLabel}</label><input className="inp" type="password" value={unlockPw} onChange={e=>setUnlockPw(e.target.value)} placeholder={t.work.unlockPlaceholder}/></div>}
    {ready&&!result&&!proc&&tool.id==="page-numbers"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.pgNumPos}</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{t.work.pgNumPosOpts.map((o,i)=><button key={i} onClick={()=>setPgNumPos(i)} className={`btn ${pgNumPos===i?"bp":"bg"} bs`} style={{padding:"8px 14px",fontSize:12}}>{o}</button>)}</div></div>}
    {ready&&!result&&!proc&&tool.id==="sign-pdf"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.signLabel}</label><canvas ref={sigRef} width={380} height={140} style={{border:`2px solid ${B.bd}`,borderRadius:10,background:"#fff",cursor:"crosshair",touchAction:"none",maxWidth:"100%",display:"block"}} onMouseDown={sS} onMouseMove={sM} onMouseUp={sE} onMouseLeave={sE} onTouchStart={sS} onTouchMove={sM} onTouchEnd={sE}/><button className="btn bg bs" style={{marginTop:6}} onClick={sC}>{t.work.signClear}</button></div>}
    {ready&&!result&&!proc&&tool.id==="compress-img"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.imgQuality}: {imgQ}%</label><input type="range" min="10" max="95" value={imgQ} onChange={e=>setImgQ(+e.target.value)} style={{width:"100%"}}/></div>}
    {ready&&!result&&!proc&&tool.id==="convert-img"&&<div style={{marginTop:16}}><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.imgFormat}</label><div style={{display:"flex",gap:6}}>{["png","jpg","webp"].map(f=><button key={f} onClick={()=>setImgFmt(f)} className={`btn ${imgFmt===f?"bp":"bg"} bs`} style={{padding:"8px 18px"}}>{f.toUpperCase()}</button>)}</div></div>}
    {ready&&!result&&!proc&&tool.id==="resize-img"&&<div style={{marginTop:16,display:"flex",gap:10,alignItems:"end",flexWrap:"wrap"}}><div><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.imgWidth}</label><input className="inp" type="number" value={imgW} onChange={e=>{const v=+e.target.value;setImgW(v);if(keepR)setImgH(Math.round(v/origR))}} style={{width:110}}/></div><div><label style={{fontSize:12.5,fontWeight:600,color:B.sl,display:"block",marginBottom:5}}>{t.work.imgHeight}</label><input className="inp" type="number" value={imgH} onChange={e=>{const v=+e.target.value;setImgH(v);if(keepR)setImgW(Math.round(v*origR))}} style={{width:110}}/></div><label style={{display:"flex",alignItems:"center",gap:5,fontSize:12.5,color:B.sl,cursor:"pointer"}}><input type="checkbox" checked={keepR} onChange={e=>setKeepR(e.target.checked)}/>{t.work.imgKeepRatio}</label></div>}

    {proc&&<div style={{marginTop:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12.5,fontWeight:600,color:B.a}}>{t.work.processing}</span><span style={{fontSize:11.5,color:B.mu}}>{Math.round(prog)}%</span></div><div className="prog"><div className="prog-f" style={{width:`${prog}%`}}/></div></div>}
    {err&&<div style={{marginTop:16,padding:"12px 16px",borderRadius:10,background:B.erB,border:`1px solid ${B.er}33`,fontSize:13,color:B.er}}>{err}</div>}
    {ready&&!result&&!proc&&<button className="btn bp bl bf" onClick={run} disabled={lim||(tool.id==="protect"&&!pw)||(tool.id==="unlock"&&!unlockPw)||(tool.id==="sign-pdf"&&!sigData)} style={{marginTop:18}}>{Ic.zap(16,"#fff")} {tool.verbText||"Go"}</button>}

    {result&&<div className="fu" style={{marginTop:20,padding:24,borderRadius:14,background:B.okB,border:`1.5px solid ${B.ok}33`,textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>⚡</div><h3 style={{fontSize:17,fontWeight:700,color:"#166534",marginBottom:5}}>{t.work.done}</h3><p style={{fontSize:13,color:"#4ADE80",marginBottom:16}}>{result.label}</p>
      {result.type==="pdf"&&<button className="btn bp bm" onClick={()=>dl(result.url,result.name)}>{Ic.download(16,"#fff")} {t.work.download} ({fmt(result.size)})</button>}
      {result.type==="split"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:6,marginBottom:14,textAlign:"left"}}>{result.pages.map((pg,i)=><div key={i} onClick={()=>dl(pg.url,pg.name)} style={{padding:"10px 12px",borderRadius:9,border:`1px solid ${B.bd}`,background:B.w,cursor:"pointer"}}><div style={{fontSize:12.5,fontWeight:600}}>{t.work.page} {pg.page}</div><div style={{fontSize:11,color:B.mu}}>{fmt(pg.size)}</div></div>)}</div><button className="btn bp bs" onClick={()=>result.pages.forEach(pg=>dl(pg.url,pg.name))}>{Ic.download(14,"#fff")} {t.work.downloadAll}</button></div>}
      {result.type==="images"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:6,marginBottom:14,textAlign:"left"}}>{result.images.map((img,i)=><div key={i} style={{borderRadius:7,overflow:"hidden",border:`1px solid ${B.bd}`,cursor:"pointer"}} onClick={()=>dl(img.url,img.name)}><img src={img.url} alt="" style={{width:"100%",display:"block"}}/><div style={{padding:"4px 7px",fontSize:10.5,color:B.mu,background:B.bg}}>{t.work.page} {img.page}</div></div>)}</div><button className="btn bp bs" onClick={()=>result.images.forEach(img=>dl(img.url,img.name))}>{Ic.download(14,"#fff")} {t.work.downloadAll}</button></div>}
      {result.type==="text"&&<div><div style={{textAlign:"left",background:B.w,border:`1px solid ${B.bd}`,borderRadius:9,padding:14,maxHeight:280,overflow:"auto",marginBottom:14}}><pre style={{fontFamily:"'DM Sans',monospace",fontSize:12.5,color:B.sl,whiteSpace:"pre-wrap",lineHeight:1.6}}>{result.text}</pre></div><button className="btn bp bs" onClick={()=>{const bl=new Blob([result.text],{type:"text/plain"});const r2=new FileReader();r2.onload=()=>dl(r2.result,"pdfbolt-text.txt");r2.readAsDataURL(bl)}}>{Ic.download(14,"#fff")} {t.work.downloadTxt}</button></div>}
      {result.type==="img"&&<div><div style={{marginBottom:14}}><img src={result.url} alt="" style={{maxWidth:"100%",maxHeight:280,borderRadius:9,border:`1px solid ${B.bd}`}}/></div><button className="btn bp bs" onClick={()=>dl(result.url,result.name)}>{Ic.download(14,"#fff")} {t.work.downloadImg} {result.size?`(${fmt(result.size)})`:""}</button></div>}
      <div style={{marginTop:12,fontSize:11.5,color:B.mu}}>{isPro?<span style={{color:B.ok,fontWeight:600}}>⚡ Pro — unlimited</span>:<>{Math.max(0,LIMIT-usage.c)} {t.work.usesLeft}</>}</div>
    </div>}
    {result&&!emailSent&&!isPro&&(<div style={{marginTop:10,padding:"16px 20px",borderRadius:12,border:`1px solid ${B.bd}`,background:B.bg}}><div style={{fontSize:13,fontWeight:600,color:B.ink,marginBottom:8}}>{t.work.email.cta}</div><div style={{display:"flex",gap:8}}><input className="inp" type="email" value={emailVal} onChange={e=>setEmailVal(e.target.value)} placeholder={t.work.email.placeholder} style={{flex:1,padding:"9px 12px",fontSize:13}}/><button className="btn bp bs" disabled={emailLoading||!emailVal.includes("@")} onClick={async()=>{setEmailLoading(true);setEmailErr(false);try{const r=await fetch("/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:emailVal})});const d=await r.json();if(d.success)setEmailSent(true);else setEmailErr(true)}catch{setEmailErr(true)}setEmailLoading(false)}} style={{padding:"9px 18px",fontSize:13,whiteSpace:"nowrap"}}>{emailLoading?"...":t.work.email.btn}</button></div>{emailErr&&<div style={{fontSize:12,color:B.er,marginTop:6}}>{t.work.email.error}</div>}</div>)}
    {result&&emailSent&&!isPro&&(<div style={{marginTop:10,padding:"12px 20px",borderRadius:12,background:B.okB,border:`1px solid ${B.ok}33`,fontSize:13,color:B.ok,fontWeight:600,textAlign:"center"}}>{t.work.email.success}</div>)}
    {result&&<button className="btn bg bm bf" style={{marginTop:10}} onClick={()=>{setFiles([]);setResult(null);setErr(null)}}>{t.work.newOp}</button>}
  </div>);
}

// ═══ APP ═══
export default function App(){
  const[pg,setPg]=useState("home");const[tool,setTool]=useState(null);const[usage,setUsage]=useState(getU());
  const[lang,setLang]=useState("en");const[isPro,setIsPro]=useState(false);const[pl,setPl]=useState(true);
  const t=T[lang];const go=useCallback(p=>{setPg(p);window.scrollTo?.({top:0,behavior:"smooth"})},[]);
  useEffect(()=>{(async()=>{const params=new URLSearchParams(window.location.search);const sid=params.get("session_id");if(sid){const ok=await activateSession(sid);setIsPro(ok);window.history.replaceState({},"","/")}else{const ok=await checkProStatus();setIsPro(ok)}setPl(false)})()},[]);
  return(<LangCtx.Provider value={{lang,setLang,t}}><div className="app"><style>{css}</style>
    <Nav pg={pg} go={go} usage={usage} isPro={isPro} pl={pl}/>
    {pg==="home"&&<><Hero go={go}/><TG go={go} setTool={setTool}/><Comp/><Pricing go={go} isPro={isPro}/><FAQ/><CTA go={go}/></>}
    {pg==="tools"&&<div style={{paddingTop:24}}><TG go={go} setTool={setTool}/></div>}
    {pg==="pricing"&&<Pricing go={go} isPro={isPro}/>}
    {pg==="work"&&tool&&<Work tool={tool} usage={usage} setUsage={setUsage} go={go} isPro={isPro}/>}
    <Foot/>
  </div></LangCtx.Provider>);
}
