import{t as e}from"./jsx-runtime-CX4v7VKw.js";import{R as t,l as n}from"./documentBranding-nc5SQqBa.js";import{S as r,_ as i,b as a,d as o,g as s,h as c,u as l,v as u,y as ee}from"./index-CdSAMjhG.js";import{S as d,o as f,s as p}from"./store-C07YZeu7.js";import{c as m,f as h,s as g}from"./krankenkasse-C04pC0k5.js";var _=t(`library`,[[`path`,{d:`m16 6 4 14`,key:`ji33uf`}],[`path`,{d:`M12 6v14`,key:`1n7gus`}],[`path`,{d:`M8 8v12`,key:`1gg7y9`}],[`path`,{d:`M4 4v16`,key:`6qkkli`}]]),v=t(`pen-line`,[[`path`,{d:`M13 21h8`,key:`1jsn5i`}],[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}]]),y=t(`pencil`,[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]]),b=`scanlogic_legal_pages`,x={firstName:``,lastName:``,businessName:``,legalStructure:`einzelunternehmer`,street:``,houseNumber:``,plz:``,city:``,country:`Deutschland`,email:``,phone:``,website:``,steuernummer:``,ustIdNr:``,handelsregister:``,activityDescription:``},te={websiteUrl:``,hasContactForm:!1,hasNewsletter:!1,hasAnalytics:!1,analyticsProvider:``,hasCookies:!1,cookieTypes:[],hostingProvider:``,emailProvider:``,usesAiApi:!1,aiApiProvider:``,usesPaymentProcessor:!1,paymentProvider:``,isWebAgency:!1,clientCompanyName:``,clientContactName:``,clientEmail:``,clientAddress:``,processingPurpose:`Website hosting and maintenance`,subProcessors:[]},ne={impressum:``,datenschutz:``,avv:``,impressumConfirmed:!1,datenschutzConfirmed:!1,avvConfirmed:!1,lastGeneratedAt:null};function re(){try{let e=localStorage.getItem(b);return e?JSON.parse(e):null}catch{return null}}function ie(e){localStorage.setItem(b,JSON.stringify(e))}function S(){let e=re();return{profile:{...x,...e?.profile},questionnaire:{...te,...e?.questionnaire},drafts:{...ne,...e?.drafts},lastUpdatedAt:e?.lastUpdatedAt||null}}function C(e){let t=S(),n={...t,...e,profile:{...t.profile,...e.profile},questionnaire:{...t.questionnaire,...e.questionnaire},drafts:{...t.drafts,...e.drafts},lastUpdatedAt:new Date().toISOString()};return ie(n),n}function ae(e){return C({profile:e})}function w(e){return C({questionnaire:e})}function oe(e){return C({drafts:e})}function T(e,t={},n){ae(e),w({websiteUrl:e.website||``});let r=ge(e);n?.(r),f();let i=p();return i&&d({...i,businessName:e.businessName||i.businessName,legalStructure:e.legalStructure||i.legalStructure,street:e.street,houseNumber:e.houseNumber,plz:e.plz,city:e.city,country:e.country,email:e.email,phone:e.phone,website:e.website,steuernummer:e.steuernummer,ustIdNr:e.ustIdNr}),V(e,S().questionnaire)}function se(e={},t=null){let n=S();return T(t||n.profile,e)}var E=`scanlogic_bizstart_form`,D=`scanlogic_bizstart_steps`,O=`scanlogic_german_vat_settings`,k=`scanlogic_registration_docs`;function A(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function j(e,t){localStorage.setItem(e,JSON.stringify(t))}function M(){return A(E,{})}function ce(e){let t={...M(),...e,lastUpdatedAt:new Date().toISOString()};return j(E,t),t}function N(){return A(D,{})}function le(e,t,n={}){let r=N();return r[e]={status:t,updatedAt:new Date().toISOString(),...n},j(D,r),r}function P(){return A(O,{vatScheme:`kleinunternehmer`,vatFilingFrequency:`quarterly`,currentYearRevenue:0,skrVersion:`SKR03`})}function ue(e){let t={...P(),...e};return j(O,t),t}function de(){return A(k,[])}function fe(e){let t=de();return t.push({id:`rd-${Date.now()}`,permanent:!0,...e,uploadedAt:new Date().toISOString()}),j(k,t),t}async function pe(){return(await n.entities.BusinessRegistration.list())[0]||null}async function me(e,t){let r=e.businessStructure||`einzelunternehmer`,i=await pe(),a={business_structure:r,registration_status:t.complete?.status===`confirmed`?`completed`:`in_progress`,gewerbe_status:t.gewerbe?.status||i?.gewerbe_status||`not_started`,finanzamt_status:t.finanzamt?.status||i?.finanzamt_status||`not_started`,handelsregister_status:t.handelsregister?.status||`not_applicable`,ihk_status:t.ihk?.status||`not_started`,vat_status:e.vatScheme===`kleinunternehmer`?`kleinunternehmer`:`standard`,steuernummer:e.steuernummer||i?.steuernummer||``,ust_id_nr:e.ustIdNr||i?.ust_id_nr||``,gewerbeschein_url:t.gewerbe?.gewerbescheinUrl||``},o;o=i?.id?await n.entities.BusinessRegistration.update(i.id,a):await n.entities.BusinessRegistration.create(a),f();let s=p();return s&&d({...s,businessName:e.businessName||e.intendedBusinessName||s.businessName,legalStructure:r,street:e.street,houseNumber:e.houseNumber,plz:e.plz,city:e.city,steuernummer:e.steuernummer||s.steuernummer,ustIdNr:e.ustIdNr||s.ustIdNr,iban:e.iban||s.iban,bic:e.bic||s.bic,isKleinunternehmer:e.vatScheme===`kleinunternehmer`,email:e.email||s.email,phone:e.phone||s.phone}),ue({vatScheme:e.vatScheme||`kleinunternehmer`,vatFilingFrequency:e.vatFilingFrequency||`quarterly`,ustIdNr:e.ustIdNr,currentYearRevenue:e.currentYearRevenue||0}),h({businessName:e.businessName||e.intendedBusinessName||``,ownerName:[e.firstName,e.lastName].filter(Boolean).join(` `),taxId:e.steuernummer||e.taxId||``,vatNumber:e.ustIdNr||``,address:[e.street,e.houseNumber,e.plz,e.city].filter(Boolean).join(`, `),businessStructure:r,vatScheme:e.vatScheme||`kleinunternehmer`,vatFilingFrequency:e.vatFilingFrequency||`quarterly`,expectedProfitYear1:Number(e.expectedProfitYear1)||0,healthInsuranceType:e.healthInsuranceType||`pending`,healthInsurerName:e.healthInsurerName||``,healthInsuranceMemberId:e.healthInsuranceMemberId||``,healthInsuranceStatus:e.healthInsuranceStatus||`not_started`,healthInsuranceZusatzbeitrag:e.healthInsuranceZusatzbeitrag??1.7,healthInsuranceAge:e.healthInsuranceAge??35}),se(e),o}async function F(e){let t=new Date().getFullYear(),r=await n.entities.TaxDeadline.list();if(r.length>5)return r;let i=e.vatFilingFrequency||`quarterly`,a=[{deadline_name:`Einkommensteuererklärung`,due_date:`${t+1}-07-31`,is_filed:!1,category:`ESt`},{deadline_name:`Gewerbesteuererklärung`,due_date:`${t+1}-05-31`,is_filed:!1,category:`Gewerbe`}];e.vatScheme!==`kleinunternehmer`&&(a.push({deadline_name:`Umsatzsteuervoranmeldung Q1`,due_date:`${t}-04-10`,is_filed:!1,category:`USt`}),i===`monthly`&&a.push({deadline_name:`USt-Voranmeldung (monatlich)`,due_date:`${t}-${String(new Date().getMonth()+2).padStart(2,`0`)}-10`,is_filed:!1,category:`USt`})),m(e)&&a.push({deadline_name:`Krankenkasse — Anmeldung Selbstständigkeit`,due_date:g(e),is_filed:!1,category:`KV`});for(let e of a)await n.entities.TaxDeadline.create(e);return n.entities.TaxDeadline.list()}var I={freiberufler:`Freiberufler`,einzelunternehmer:`Einzelunternehmer`,kleinunternehmer:`Kleinunternehmer (§19 UStG)`,gbr:`GbR`,ug:`UG (haftungsbeschränkt)`,gmbh:`GmbH`},L=[{id:`freiberufler`,labelDe:`Freiberufler`,labelEn:`Freiberufler`},{id:`einzelunternehmer`,labelDe:`Einzelunternehmer`,labelEn:`Sole trader`},{id:`kleinunternehmer`,labelDe:`Kleinunternehmer (§19 UStG)`,labelEn:`Kleinunternehmer (§19)`},{id:`gbr`,labelDe:`GbR`,labelEn:`GbR`},{id:`ug`,labelDe:`UG (haftungsbeschränkt)`,labelEn:`UG`},{id:`gmbh`,labelDe:`GmbH`,labelEn:`GmbH`}],R=[`firstName`,`lastName`,`street`,`plz`,`city`,`email`,`phone`];function he(e={}){let t={...M(),...e},n=p()||{},r=S().profile,i=r.website||S().questionnaire?.websiteUrl||t.website||n.website||``;return{...x,firstName:r.firstName||t.firstName||``,lastName:r.lastName||t.lastName||``,businessName:r.businessName||t.intendedBusinessName||t.businessName||n.businessName||``,legalStructure:r.legalStructure||t.businessStructure||n.legalStructure||`einzelunternehmer`,street:r.street||t.street||n.street||``,houseNumber:r.houseNumber||t.houseNumber||n.houseNumber||``,plz:r.plz||t.plz||n.plz||``,city:r.city||t.city||n.city||``,country:r.country||n.country||`Deutschland`,email:r.email||t.email||n.email||``,phone:r.phone||t.phone||n.phone||``,website:i,steuernummer:r.steuernummer||t.steuernummer||n.steuernummer||``,ustIdNr:r.ustIdNr||t.ustIdNr||n.ustIdNr||``,handelsregister:r.handelsregister||t.handelsregister||``,activityDescription:r.activityDescription||t.businessActivityDescription||``}}function ge(e){return{firstName:e.firstName,lastName:e.lastName,intendedBusinessName:e.businessName,businessName:e.businessName,businessStructure:e.legalStructure,street:e.street,houseNumber:e.houseNumber,plz:e.plz,city:e.city,email:e.email,phone:e.phone,website:e.website,steuernummer:e.steuernummer,ustIdNr:e.ustIdNr,handelsregister:e.handelsregister,businessActivityDescription:e.activityDescription}}function _e(e,t=R){return t.filter(t=>!String(e[t]||``).trim())}function z(e={}){let t=S().profile,n=M(),r=p()||{},i={...S().questionnaire,...e.questionnaire},a=e.firstName??t.firstName??n.firstName??``,o=e.lastName??t.lastName??n.lastName??``,s=e.ownerName??([a,o].filter(Boolean).join(` `)||r.ownerName||``),c=e.businessName??t.businessName??n.intendedBusinessName??n.businessName??r.businessName??s,l=e.legalStructure??t.legalStructure??n.businessStructure??r.legalStructure??`einzelunternehmer`,u=e.website??t.website??i.websiteUrl??n.website??r.website??``;return{ownerName:s,firstName:a,lastName:o,businessName:c,legalStructure:l,legalStructureLabel:I[l]||l,street:e.street??t.street??n.street??r.street??``,houseNumber:e.houseNumber??t.houseNumber??n.houseNumber??r.houseNumber??``,plz:e.plz??t.plz??n.plz??r.plz??``,city:e.city??t.city??n.city??r.city??``,country:e.country??t.country??r.country??`Deutschland`,email:e.email??t.email??n.email??r.email??``,phone:e.phone??t.phone??n.phone??r.phone??``,website:u,steuernummer:e.steuernummer??t.steuernummer??n.steuernummer??r.steuernummer??``,ustIdNr:e.ustIdNr??t.ustIdNr??n.ustIdNr??r.ustIdNr??``,taxId:e.taxId??n.taxId??``,handelsregister:e.handelsregister??t.handelsregister??n.handelsregister??``,activityDescription:e.activityDescription??t.activityDescription??n.businessActivityDescription??``,questionnaire:i}}function B(e){return[[e.street,e.houseNumber].filter(Boolean).join(` `),[e.plz,e.city].filter(Boolean).join(` `),e.country].filter(Boolean).join(`, `)}function V(e,t={}){return z({...e,questionnaire:{...t,websiteUrl:e.website||t.websiteUrl}})}var H=`⚠️ Entwurf zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung von einem Rechtsanwalt prüfen lassen.`,U=`⚠️ Draft for preparation only — not legal advice. Have a licensed lawyer review before publishing.`;function W(e,t,n=`[BITTE ERGÄNZEN]`){let r=e[t];return r&&String(r).trim()?String(r).trim():n}function G(e,t,n=`[BITTE ERGÄNZEN]`){let r=e[t];return r&&String(r).trim()?String(r).trim():n}function K(e,t=`de`){let n=B(e),r=[`gmbh`,`ug`,`gbr`].includes(e.legalStructure)?`${W(e,`businessName`)} — vertreten durch ${W(e,`ownerName`)}`:W(e,`ownerName`);return t===`en`?`${U}

# Imprint (Impressum)

**Information pursuant to § 5 DDG (Digitale-Dienste-Gesetz)**

**Service provider / responsible person:**
${r}

**Address:**
${n}
(No P.O. box — physical address required)

**Contact:**
Phone: ${W(e,`phone`)}
E-mail: ${W(e,`email`)}
${e.website?`Website: ${e.website}`:``}

**Legal form:** ${e.legalStructureLabel}

${e.steuernummer?`**Tax number (Steuernummer):** ${e.steuernummer}`:`**Tax number:** [to be added after Finanzamt registration]`}
${e.ustIdNr?`**VAT ID (USt-IdNr.):** ${e.ustIdNr}`:``}
${e.handelsregister?`**Commercial register:** ${e.handelsregister}`:``}

${e.activityDescription?`**Activity:** ${e.activityDescription}`:``}

**Dispute resolution:** We are not obliged or willing to participate in dispute resolution proceedings before a consumer arbitration board.

---
_Place this page in your website footer as "Impressum"._`:`${H}

# Impressum

**Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)**

**Diensteanbieter / Verantwortlich:**
${r}

**Anschrift:**
${n}
(Kein Postfach — ladungsfähige Anschrift erforderlich)

**Kontakt:**
Telefon: ${W(e,`phone`)}
E-Mail: ${W(e,`email`)}
${e.website?`Website: ${e.website}`:``}

**Rechtsform:** ${e.legalStructureLabel}

${e.steuernummer?`**Steuernummer:** ${e.steuernummer}`:`**Steuernummer:** [nach Finanzamt-Anmeldung ergänzen]`}
${e.ustIdNr?`**USt-IdNr.:** ${e.ustIdNr}`:``}
${e.handelsregister?`**Handelsregister:** ${e.handelsregister}`:``}

${e.activityDescription?`**Tätigkeit:** ${e.activityDescription}`:``}

**Streitschlichtung:** Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

---
_Diese Seite im Website-Footer als „Impressum" verlinken._`}function q(e,t=`de`){let n=e.questionnaire||{},r=B(e),i=[];n.hostingProvider&&i.push({name:n.hostingProvider,purpose:`Hosting`}),n.emailProvider&&i.push({name:n.emailProvider,purpose:`E-Mail`}),n.hasAnalytics&&n.analyticsProvider&&i.push({name:n.analyticsProvider,purpose:`Webanalyse`}),n.usesAiApi&&n.aiApiProvider&&i.push({name:n.aiApiProvider,purpose:`KI-Verarbeitung`}),n.usesPaymentProcessor&&n.paymentProvider&&i.push({name:n.paymentProvider,purpose:`Zahlungsabwicklung`});let a=i.length>0?i.map(e=>`- **${e.name}** — ${e.purpose}`).join(`
`):t===`en`?`- [List all hosting, email, analytics, and other processors]`:`- [Alle Hosting-, E-Mail-, Analyse- und sonstigen Auftragsverarbeiter auflisten]`,o=[];return t===`en`?o.push(`${U}

# Privacy Policy (Datenschutzerklärung)

**Controller pursuant to Art. 4(7) GDPR:**
${W(e,`businessName`)}
${r}
E-mail: ${W(e,`email`)}

## 1. Overview
This privacy policy explains how we process personal data on ${W(e,`website`,`our website`)} in accordance with the GDPR (DSGVO).

## 2. Data we collect
- **Server log files:** IP address, browser type, date/time, pages viewed (legitimate interest / Art. 6(1)(f) GDPR)
${n.hasContactForm?`- **Contact form:** name, e-mail, message content (Art. 6(1)(b) GDPR — pre-contractual measures)`:``}
${n.hasNewsletter?`- **Newsletter:** e-mail address (Art. 6(1)(a) GDPR — consent)`:``}

## 3. Cookies & tracking
${n.hasCookies||n.hasAnalytics?`We use cookies/tracking tools. **Consent is required** for non-essential cookies (TTDSG §25).\n${n.analyticsProvider?`Analytics: ${n.analyticsProvider}`:``}\nConfigure a cookie consent banner before going live.`:`We only use technically necessary cookies. No marketing or analytics cookies without prior consent.`}

## 4. Processors (Art. 28 GDPR)
${a}

## 5. Retention
Data is deleted when the purpose no longer applies or statutory retention periods expire.

## 6. Your rights
You have the right to access, rectification, erasure, restriction, portability, and objection (Art. 15–21 GDPR). Contact: ${W(e,`email`)}. You may lodge a complaint with your supervisory authority.

## 7. Changes
We may update this policy. The current version is always published on our website.

---
_Link as "Datenschutz" in your website footer. Set up cookie consent if using analytics or marketing cookies._`):o.push(`${H}

# Datenschutzerklärung

**Verantwortlicher gemäß Art. 4 Nr. 7 DSGVO:**
${W(e,`businessName`)}
${r}
E-Mail: ${W(e,`email`)}

## 1. Überblick
Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten auf ${W(e,`website`,`unserer Website`)} gemäß DSGVO.

## 2. Erhobene Daten
- **Server-Logdateien:** IP-Adresse, Browsertyp, Datum/Uhrzeit, aufgerufene Seiten (berechtigtes Interesse / Art. 6 Abs. 1 lit. f DSGVO)
${n.hasContactForm?`- **Kontaktformular:** Name, E-Mail, Nachricht (Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen)`:``}
${n.hasNewsletter?`- **Newsletter:** E-Mail-Adresse (Art. 6 Abs. 1 lit. a DSGVO — Einwilligung)`:``}

## 3. Cookies & Tracking
${n.hasCookies||n.hasAnalytics?`Wir setzen Cookies/Tracking-Tools ein. Für nicht notwendige Cookies ist **Einwilligung erforderlich** (TTDSG §25).\n${n.analyticsProvider?`Analyse: ${n.analyticsProvider}`:``}\nVor Live-Schaltung Cookie-Banner konfigurieren.`:`Wir verwenden nur technisch notwendige Cookies. Keine Marketing- oder Analyse-Cookies ohne vorherige Einwilligung.`}

## 4. Auftragsverarbeiter (Art. 28 DSGVO)
${a}

## 5. Speicherdauer
Daten werden gelöscht, sobald der Zweck entfällt oder gesetzliche Aufbewahrungsfristen ablaufen.

## 6. Ihre Rechte
Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Kontakt: ${W(e,`email`)}. Beschwerderecht bei der zuständigen Aufsichtsbehörde.

## 7. Änderungen
Wir können diese Erklärung anpassen. Die aktuelle Fassung ist stets auf der Website veröffentlicht.

---
_Im Website-Footer als „Datenschutz" verlinken. Bei Analyse-/Marketing-Cookies Cookie-Einwilligung einrichten._`),o.join(`
`)}function J(e,t=`de`){let n=e.questionnaire||{},r=B(e),i=n.isWebAgency,a=i?G(n,`clientCompanyName`,`[Auftraggeber / Kunde]`):W(e,`businessName`),o=i?`${G(n,`clientContactName`)} — ${G(n,`clientEmail`)}`:`${W(e,`ownerName`)} — ${W(e,`email`)}`,s=i?G(n,`clientAddress`,r):r,c=i?W(e,`businessName`):`[Hosting-/IT-Dienstleister]`,l=i?`${W(e,`ownerName`)} — ${W(e,`email`)}`:`[Name, E-Mail des Auftragsverarbeiters]`;return t===`en`?`${U}

# Data Processing Agreement (AVV / DPA)
## Pursuant to Art. 28 GDPR

**Between:**

**Controller (Auftraggeber):**
${a}
${s}
Contact: ${o}

**and**

**Processor (Auftragsverarbeiter):**
${c}
${i?r:`[Processor address]`}
Contact: ${l}

## 1. Subject and duration
The processor processes personal data on behalf of the controller for: **${n.processingPurpose||`Website hosting, maintenance, and form data storage`}**.

Duration: for the term of the main service agreement.

## 2. Nature and purpose of processing
- Hosting website content and databases
${n.hasContactForm?`- Storing and forwarding contact form submissions`:``}
- Technical support and backups

## 3. Categories of data subjects & data
- Website visitors (IP, browser data, form entries)
${n.hasNewsletter?`- Newsletter subscribers (e-mail)`:``}

## 4. Obligations of the processor
- Process data only on documented instructions (Art. 28(3)(a) GDPR)
- Ensure confidentiality of personnel
- Implement appropriate technical and organisational measures (TOMs)
- Assist with data subject requests
- Delete or return data after contract end
- Notify controller of data breaches without undue delay

## 5. Sub-processors
${n.hostingProvider?`Approved sub-processor: ${n.hostingProvider}`:`[List sub-processors — requires prior written consent]`}

## 6. Audits
The controller may audit compliance with reasonable notice.

## 7. Signatures

Controller: _________________________ Date: _________

Processor: _________________________ Date: _________

---
_The AVV is a contract between controller and processor — not a public footer page. Have your lawyer finalize before signing._`:`${H}

# Auftragsverarbeitungsvertrag (AVV)
## gemäß Art. 28 DSGVO

**Zwischen:**

**Verantwortlicher (Auftraggeber):**
${a}
${s}
Kontakt: ${o}

**und**

**Auftragsverarbeiter:**
${c}
${i?r:`[Anschrift des Auftragsverarbeiters]`}
Kontakt: ${l}

## 1. Gegenstand und Dauer
Der Auftragsverarbeiter verarbeitet personenbezogene Daten im Auftrag des Verantwortlichen für: **${n.processingPurpose||`Website-Hosting, Wartung und Speicherung von Formulardaten`}**.

Dauer: Laufzeit des Hauptvertrags.

## 2. Art und Zweck der Verarbeitung
- Hosting von Website-Inhalten und Datenbanken
${n.hasContactForm?`- Speicherung und Weiterleitung von Kontaktformular-Eingaben`:``}
- Technischer Support und Backups

## 3. Kategorien betroffener Personen & Daten
- Website-Besucher (IP, Browserdaten, Formulareingaben)
${n.hasNewsletter?`- Newsletter-Abonnenten (E-Mail)`:``}

## 4. Pflichten des Auftragsverarbeiters
- Verarbeitung nur auf dokumentierte Weisung (Art. 28 Abs. 3 lit. a DSGVO)
- Vertraulichkeit des Personals sicherstellen
- Geeignete technische und organisatorische Maßnahmen (TOMs) umsetzen
- Unterstützung bei Betroffenenanfragen
- Löschung oder Rückgabe der Daten nach Vertragsende
- Meldung von Datenschutzverletzungen unverzüglich

## 5. Unterauftragsverarbeiter
${n.hostingProvider?`Genehmigter Unterauftragsverarbeiter: ${n.hostingProvider}`:`[Unterauftragsverarbeiter auflisten — vorherige schriftliche Zustimmung erforderlich]`}

## 6. Kontrollen
Der Verantwortliche kann die Einhaltung mit angemessener Vorankündigung prüfen.

## 7. Unterschriften

Verantwortlicher: _________________________ Datum: _________

Auftragsverarbeiter: _________________________ Datum: _________

---
_Der AVV ist ein Vertrag zwischen Verantwortlichem und Auftragsverarbeiter — keine öffentliche Footer-Seite. Vor Unterzeichnung vom Rechtsanwalt prüfen lassen._`}function ve(e,t=`de`){return{impressum:K(e,t),datenschutz:q(e,t),avv:J(e,t),lastGeneratedAt:new Date().toISOString()}}function Y(e){return String(e||``).replace(/\*\*(.+?)\*\*/g,`$1`).replace(/_(.+?)_/g,`$1`).trim()}function X(e){let t=e.trim();return t?t.startsWith(`#`)||t.startsWith(`**`)||t.startsWith(`---`)||t.startsWith(`- `)||t.startsWith(`* `)||/^⚠/.test(t)||/entwurf/i.test(t)&&/rechtsberatung|legal advice/i.test(t):!1}function Z(e){let t=e.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);if(t)return{label:t[1].replace(/:$/,``).trim(),value:t[2].trim()};let n=e.match(/^([^:]{2,40}):\s*(.+)$/);return n&&!n[1].includes(`http`)?{label:n[1].trim(),value:n[2].trim()}:null}function Q(e){if(!e)return[];let t=[],n=e.split(`
`),r=0;for(;r<n.length;){let e=n[r].trim();if(!e){r++;continue}if(e.startsWith(`# `)){t.push({type:`h1`,text:Y(e.slice(2))}),r++;continue}if(e.startsWith(`## `)){t.push({type:`h2`,text:Y(e.slice(3))}),r++;continue}let i=e.match(/^\*\*(.+?)\*\*$/);if(i){t.push({type:`h2`,text:Y(i[1])}),r++;continue}if(e.startsWith(`---`)){t.push({type:`hr`}),r++;continue}if(/^⚠/.test(e)||/entwurf|draft/i.test(e)&&/rechtsberatung|legal advice/i.test(e)){t.push({type:`disclaimer`,text:Y(e)}),r++;continue}let a=Z(e);if(a){if(!a.value&&r+1<n.length&&n[r+1].trim()&&!X(n[r+1])){let e=[];for(r++;r<n.length&&n[r].trim()&&!X(n[r]);)e.push(Y(n[r])),r++;a.value=e.join(`
`)}t.push({type:`field`,...a}),r++;continue}if(e.startsWith(`_`)&&e.endsWith(`_`)&&e.length>2){t.push({type:`note`,text:Y(e)}),r++;continue}if(e.startsWith(`(`)&&e.endsWith(`)`)){t.push({type:`note`,text:Y(e)}),r++;continue}if(e.startsWith(`- `)||e.startsWith(`* `)){let e=[];for(;r<n.length&&(n[r].trim().startsWith(`- `)||n[r].trim().startsWith(`* `));)e.push(Y(n[r].trim().replace(/^[-*]\s+/,``))),r++;t.push({type:`list`,items:e});continue}let o=[Y(e)];for(r++;r<n.length&&n[r].trim()&&!X(n[r])&&!Z(n[r].trim());)o.push(Y(n[r])),r++;t.push({type:`p`,text:o.join(` `)})}return t}var $=e();function ye({fields:e}){return e.length?(0,$.jsx)(`div`,{className:`my-2 grid gap-1.5`,children:e.map((e,t)=>(0,$.jsxs)(`div`,{className:`grid grid-cols-[7.5rem_1fr] gap-3 rounded-md px-3 py-2 text-sm sm:grid-cols-[9rem_1fr] ${t%2==0?`bg-slate-50`:`bg-indigo-50/80`}`,children:[(0,$.jsx)(`span`,{className:`text-[10px] font-bold uppercase tracking-wide text-slate-500`,children:e.label}),(0,$.jsx)(`span`,{className:`whitespace-pre-wrap font-medium leading-snug text-slate-800`,children:e.value||`—`})]},`${e.label}-${t}`))}):null}function be({content:e,className:t=``,module:n=`Website-Rechtliches`,showHeader:r=!0}){let i=Q(e),a=i.find(e=>e.type===`h1`),o=[],s=[],c=0,l=()=>{s.length&&(o.push((0,$.jsx)(ye,{fields:s},`f-${c++}`)),s=[])};i.forEach(e=>{switch(e.type){case`h1`:e.text!==a?.text&&(l(),o.push((0,$.jsx)(`h2`,{className:`mb-2 mt-4 border-b-2 border-indigo-500 pb-1 text-base font-bold text-indigo-900`,children:e.text},`h1-${c++}`)));break;case`disclaimer`:l(),o.push((0,$.jsx)(`div`,{className:`mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs leading-relaxed text-indigo-800`,children:e.text},`d-${c++}`));break;case`h2`:l(),o.push((0,$.jsx)(`h3`,{className:`mb-2 mt-5 inline-block min-w-[40%] border-b-2 border-indigo-400 pb-0.5 text-xs font-bold uppercase tracking-wide text-indigo-700`,children:e.text},`h2-${c++}`));break;case`field`:s.push(e);break;case`list`:l(),o.push((0,$.jsx)(`ul`,{className:`my-2 list-disc space-y-1 pl-5 text-sm text-slate-700`,children:e.items.map(e=>(0,$.jsx)(`li`,{children:e},e))},`ul-${c++}`));break;case`hr`:l(),o.push((0,$.jsx)(`hr`,{className:`my-4 border-indigo-200`},`hr-${c++}`));break;case`note`:l(),o.push((0,$.jsx)(`p`,{className:`mt-2 text-xs italic text-slate-500`,children:e.text},`n-${c++}`));break;default:l(),o.push((0,$.jsx)(`p`,{className:`my-1.5 text-sm leading-relaxed text-slate-700`,children:e.text},`p-${c++}`));break}}),l();let u=new Date().toLocaleDateString(`de-DE`);return(0,$.jsxs)(`div`,{className:`legal-doc-preview overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${t}`,children:[r&&(0,$.jsxs)(`div`,{className:`bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 px-4 py-3 text-white`,children:[(0,$.jsx)(`span`,{className:`float-right text-[11px] opacity-90`,children:u}),(0,$.jsx)(`p`,{className:`text-[10px] font-semibold uppercase tracking-wider opacity-90`,children:`ScanLogic Business Suite`}),(0,$.jsx)(`p`,{className:`text-xs opacity-85`,children:n})]}),(0,$.jsxs)(`div`,{className:`border-t-[3px] border-indigo-500 p-5`,children:[a&&(0,$.jsx)(`h1`,{className:`mb-3 text-lg font-bold tracking-tight text-indigo-950`,children:a.text}),o]})]})}function xe(e,t,n,{module:d,docTitle:f,forceTitle:p,fragment:m=!1,branding:h}={}){let g=Q(n),_=t,v=!1,y=t>0||m,b=g.find(e=>e.type===`h1`),x=p||f||b?.text||`Document`;y||=(_=s(e,{title:x,module:d||`Website-Rechtliches`,branding:h}),!0);for(let t of g)if(!(m&&(t.type===`disclaimer`||t.type===`h1`))&&!(t.type===`h1`&&t.text===x))switch(_=a(e,_,14,{title:x,module:d,branding:h}),t.type){case`disclaimer`:_=i(e,_,t.text),_+=4;break;case`h1`:case`h2`:_=ee(e,_,t.text);break;case`field`:_=u(e,_,t.label,t.value,{alt:v}),v=!v;break;case`list`:t.items.forEach(t=>{_=a(e,_,8,{module:d,title:x,branding:h}),e.setFont(l.family,`normal`),e.setFontSize(l.bodySize),e.setTextColor(...o.slate800);let n=e.splitTextToSize(`•  ${t}`,o.contentWidth-4);e.text(n,o.margin+2,_),_+=n.length*4.8+2});break;case`hr`:_+=3,e.setDrawColor(...o.brand200),e.setLineWidth(.3),e.line(o.margin,_,r(e)-o.margin,_),_+=6;break;case`note`:e.setFont(l.family,`italic`),e.setFontSize(l.labelSize),e.setTextColor(...o.slate500),_=c(e,_,t.text);break;default:_=c(e,_,t.text);break}return _}export{oe as C,_ as D,v as E,S,y as T,ce as _,J as a,me as b,L as c,_e as d,he as f,P as g,N as h,ve as i,z as l,M as m,be as n,q as o,fe as p,Q as r,K as s,xe as t,V as u,F as v,w,T as x,le as y};