export type Lang = 'es' | 'it' | 'en' | 'pt'
export const LANGS: Record<Lang, string> = { es: 'Español', it: 'Italiano', en: 'Inglés', pt: 'Portugués (Portugal)' }
export interface EmailEx { id: string; title: string; scenario: string; checklist: string[]; phrases: Record<Lang, string[]>; model: Record<Lang, string> }

export const EMAILS: EmailEx[] = [
  {
    id: 'info', title: 'Solicitud de información',
    scenario: 'Un proveedor te ha enviado una oferta incompleta de **café verde arábica**: da un precio, pero no indica Incoterm, peso del saco, mes de embarque ni condiciones de pago. Pedile lo que falta. _(Situación simulada.)_',
    checklist: ['Agradece la oferta y la identifica (producto, fecha).', 'Enumera con claridad cada dato que falta.', 'Pide la validez de la oferta.', 'Indica para cuándo necesitás la respuesta.', 'Tono cordial y directo; sin comprometerte a comprar.'],
    phrases: {
      es: ['Para poder valorar su oferta, necesitaríamos que nos confirmase…', '¿Podría indicarnos…?', 'Quedamos a la espera de su respuesta.'],
      it: ['Per poter valutare la Vostra offerta, avremmo bisogno di sapere…', 'Potreste cortesemente indicarci…?', 'Restiamo in attesa di un Vostro gentile riscontro.'],
      en: ['In order to assess your offer, could you please confirm…', 'Could you also let us know…?', 'We look forward to hearing from you.'],
      pt: ['Para podermos avaliar a vossa proposta, agradecíamos que nos confirmassem…', 'Poderiam indicar-nos…?', 'Ficamos a aguardar a vossa resposta.'],
    },
    model: {
      es: `Asunto: Oferta de arábica Brasil del 12 de marzo – datos pendientes

Estimado Sr. Lima:

Gracias por su oferta. Para poder valorarla, necesitaríamos que nos confirmase:

1. Incoterm y puerto.
2. Peso del saco y número de sacos por contenedor.
3. Mes de embarque.
4. Condiciones de pago.
5. Si el precio es fijo o sobre diferencial, y validez de la oferta.

Agradeceríamos su respuesta antes del jueves.

Un cordial saludo,`,
      it: `Oggetto: Offerta arabica Brasile del 12 marzo – informazioni mancanti

Gentile Sig. Lima,

La ringraziamo per l'offerta. Per poterla valutare, avremmo bisogno delle seguenti informazioni:

1. Incoterm e porto.
2. Peso del sacco e numero di sacchi per container.
3. Mese di imbarco.
4. Condizioni di pagamento.
5. Se il prezzo è fisso o su differenziale, e validità dell'offerta.

Le saremmo grati di un riscontro entro giovedì.

Cordiali saluti,`,
      en: `Subject: Brazil arabica offer of 12 March – missing details

Dear Mr Lima,

Thank you for your offer. In order to assess it, could you please confirm:

1. Incoterm and port.
2. Bag weight and number of bags per container.
3. Shipment month.
4. Payment terms.
5. Whether the price is outright or on a differential basis, and the validity of the offer.

We would appreciate your reply by Thursday.

Kind regards,`,
      pt: `Assunto: Proposta de arábica Brasil de 12 de março – informação em falta

Exmo. Sr. Lima,

Agradecemos a vossa proposta. Para a podermos avaliar, agradecíamos que nos confirmassem:

1. Incoterm e porto.
2. Peso do saco e número de sacos por contentor.
3. Mês de embarque.
4. Condições de pagamento.
5. Se o preço é fixo ou sobre diferencial, e a validade da proposta.

Ficaríamos gratos por uma resposta até quinta-feira.

Com os melhores cumprimentos,`,
    },
  },
  {
    id: 'oferta', title: 'Oferta y contraoferta',
    scenario: 'Un distribuidor pide **2.000 kg de café tostado en grano al mes** y propone 10,80 €/kg con pago a 90 días. Tu precio objetivo es 11,30 €/kg a 60 días. Respondé con una contraoferta: podés ceder algo de precio a cambio de un compromiso anual. _(Cifras simuladas.)_',
    checklist: ['Agradece y reformula la petición.', 'Presenta la contraoferta con precio, unidad y lugar de entrega.', 'Vincula la concesión a una contrapartida (volumen, duración).', 'Indica condiciones de pago y validez.', 'Propone un siguiente paso.'],
    phrases: {
      es: ['Hemos estudiado su propuesta con atención.', 'Podemos ofrecerle… siempre que…', 'Esta oferta es válida hasta el…'],
      it: ['Abbiamo esaminato con attenzione la Vostra proposta.', 'Possiamo offrirVi… a condizione che…', 'La presente offerta è valida fino al…'],
      en: ['We have carefully reviewed your proposal.', 'We can offer… provided that…', 'This offer is valid until…'],
      pt: ['Analisámos com atenção a vossa proposta.', 'Podemos oferecer… desde que…', 'Esta proposta é válida até…'],
    },
    model: {
      es: `Estimada Sra. Ferrer:

Gracias por su interés. Hemos estudiado su propuesta de 2.000 kg mensuales.

Podemos ofrecerle un precio de 11,10 €/kg, entregado en su almacén, siempre que el acuerdo cubra 12 meses con ese volumen mensual. El pago sería a 60 días fecha factura.

El precio se revisaría trimestralmente según la evolución de la materia prima. Esta oferta es válida hasta el día 30.

¿Le parece que lo comentemos por teléfono el martes?

Un cordial saludo,`,
      it: `Gentile Sig.ra Ferrer,

La ringraziamo per l'interesse. Abbiamo esaminato la Sua proposta per 2.000 kg mensili.

Possiamo offrirLe un prezzo di 11,10 €/kg, reso presso il Suo magazzino, a condizione che l'accordo copra 12 mesi con tale volume mensile. Il pagamento sarebbe a 60 giorni data fattura.

Il prezzo verrebbe rivisto trimestralmente in base all'andamento della materia prima. La presente offerta è valida fino al giorno 30.

Possiamo sentirci telefonicamente martedì?

Cordiali saluti,`,
      en: `Dear Ms Ferrer,

Thank you for your interest. We have reviewed your proposal for 2,000 kg per month.

We can offer a price of €11.10/kg, delivered to your warehouse, provided that the agreement covers 12 months at that monthly volume. Payment would be 60 days from invoice date.

The price would be reviewed quarterly in line with raw material costs. This offer is valid until the 30th.

Would you be available for a call on Tuesday?

Kind regards,`,
      pt: `Exma. Sra. Ferrer,

Agradecemos o seu interesse. Analisámos a sua proposta de 2.000 kg mensais.

Podemos oferecer um preço de 11,10 €/kg, entregue no vosso armazém, desde que o acordo abranja 12 meses com esse volume mensal. O pagamento seria a 60 dias da data da fatura.

O preço seria revisto trimestralmente de acordo com a evolução da matéria-prima. Esta proposta é válida até ao dia 30.

Podemos falar por telefone na terça-feira?

Com os melhores cumprimentos,`,
    },
  },
  {
    id: 'seguimiento', title: 'Seguimiento de una entrega',
    scenario: 'El transitario informó hace una semana de que tu contenedor de **arroz** llegaría el día 14. Hoy es 12 y no tenés confirmación ni los documentos. Escribile para pedir estado actualizado. _(Situación simulada.)_',
    checklist: ['Identifica el embarque (referencia, contenedor o B/L).', 'Pide la fecha estimada actualizada.', 'Pregunta por el estado de los documentos.', 'Explica por qué es urgente (sin dramatizar).', 'Pide respuesta en un plazo concreto.'],
    phrases: {
      es: ['¿Podría confirmarnos la fecha de llegada actualizada?', 'Aún no hemos recibido…', 'Necesitamos esta información para planificar…'],
      it: ['Potrebbe confermarci la data di arrivo aggiornata?', 'Non abbiamo ancora ricevuto…', 'Abbiamo bisogno di questa informazione per pianificare…'],
      en: ['Could you please confirm the updated ETA?', 'We have not yet received…', 'We need this information to plan…'],
      pt: ['Poderia confirmar-nos a data de chegada atualizada?', 'Ainda não recebemos…', 'Precisamos desta informação para planear…'],
    },
    model: {
      es: `Asunto: Contenedor ABCD 123456-7 – estado y documentos

Buenos días, Marta:

¿Podrías confirmarnos la fecha de llegada actualizada del contenedor de referencia? La última previsión era el día 14.

Aún no hemos recibido los documentos originales. ¿Sabés cuándo estarán disponibles?

Necesitamos esta información hoy para organizar la descarga y avisar a producción.

Gracias de antemano,`,
      it: `Oggetto: Container ABCD 123456-7 – stato e documenti

Buongiorno Marta,

potresti confermarci la data di arrivo aggiornata del container in oggetto? L'ultima previsione era il giorno 14.

Non abbiamo ancora ricevuto i documenti originali. Sai quando saranno disponibili?

Abbiamo bisogno di questa informazione entro oggi per organizzare lo scarico e avvisare la produzione.

Grazie in anticipo,`,
      en: `Subject: Container ABCD 123456-7 – status and documents

Good morning Marta,

Could you please confirm the updated ETA for the above container? The latest estimate was the 14th.

We have not yet received the original documents. Do you know when they will be available?

We need this information today in order to arrange unloading and inform production.

Thank you in advance,`,
      pt: `Assunto: Contentor ABCD 123456-7 – ponto de situação e documentos

Bom dia, Marta,

Poderia confirmar-nos a data de chegada atualizada do contentor em referência? A última previsão era o dia 14.

Ainda não recebemos os documentos originais. Sabe quando estarão disponíveis?

Precisamos desta informação hoje para organizar a descarga e avisar a produção.

Desde já obrigado,`,
    },
  },
  {
    id: 'aumento', title: 'Comunicación de un aumento',
    scenario: 'El coste de tu **pasta de marca propia** ha subido un 6 % por el encarecimiento de la sémola y la energía. Tenés que comunicar a una cadena una subida del 6 % a partir del día 1 del mes siguiente. _(Cifras simuladas.)_',
    checklist: ['Va al grano: qué sube, cuánto y desde cuándo.', 'Explica la causa de forma breve y verificable.', 'Muestra que se ha absorbido o contenido lo posible.', 'Ofrece hablarlo y aporta la nueva tarifa.', 'Tono firme y respetuoso, sin disculpas excesivas.'],
    phrases: {
      es: ['Nos vemos obligados a actualizar nuestros precios…', 'a partir del 1 de…', 'Quedamos a su disposición para comentarlo.'],
      it: ['Ci vediamo costretti ad aggiornare i nostri prezzi…', 'a decorrere dal 1°…', 'Restiamo a disposizione per ogni chiarimento.'],
      en: ['We find ourselves obliged to adjust our prices…', 'effective from 1…', 'We remain at your disposal to discuss this.'],
      pt: ['Vemo-nos obrigados a atualizar os nossos preços…', 'a partir de 1 de…', 'Ficamos ao dispor para qualquer esclarecimento.'],
    },
    model: {
      es: `Estimado Sr. Ortega:

Le escribo para informarle de una actualización de precios de la gama de pasta: **+6 % a partir del 1 de mayo**.

En los últimos meses la sémola de trigo duro y la energía se han encarecido de forma sostenida. Hemos absorbido parte de ese incremento con mejoras internas, pero no podemos compensarlo por completo.

Adjunto la nueva tarifa. Los pedidos confirmados antes del 1 de mayo se servirán al precio actual.

Quedo a su disposición para comentarlo cuando le venga bien.

Un cordial saludo,`,
      it: `Gentile Sig. Ortega,

Le scrivo per informarLa di un aggiornamento dei prezzi della gamma pasta: **+6 % a decorrere dal 1° maggio**.

Negli ultimi mesi la semola di grano duro e l'energia hanno registrato aumenti costanti. Abbiamo assorbito parte di tale incremento con miglioramenti interni, ma non siamo in grado di compensarlo interamente.

In allegato il nuovo listino. Gli ordini confermati prima del 1° maggio saranno evasi al prezzo attuale.

Resto a disposizione per parlarne quando Le sarà più comodo.

Cordiali saluti,`,
      en: `Dear Mr Ortega,

I am writing to inform you of a price adjustment on our pasta range: **+6% effective from 1 May**.

Over recent months, durum wheat semolina and energy costs have risen steadily. We have absorbed part of this increase through internal efficiencies, but we are unable to offset it entirely.

Please find the new price list attached. Orders confirmed before 1 May will be supplied at current prices.

I remain at your disposal to discuss this at your convenience.

Kind regards,`,
      pt: `Exmo. Sr. Ortega,

Venho informá-lo de uma atualização de preços da gama de massas: **+6 % a partir de 1 de maio**.

Nos últimos meses, a sêmola de trigo duro e a energia registaram aumentos contínuos. Absorvemos parte desse acréscimo com melhorias internas, mas não nos é possível compensá-lo na totalidade.

Em anexo segue a nova tabela de preços. As encomendas confirmadas antes de 1 de maio serão fornecidas ao preço atual.

Fico ao dispor para falarmos quando lhe for conveniente.

Com os melhores cumprimentos,`,
    },
  },
  {
    id: 'reclamacion', title: 'Reclamación',
    scenario: 'Has recibido un envío de **salmón fresco** con 24 horas de retraso y el registro muestra que la temperatura superó el límite pactado durante varias horas. Calidad ha retenido el producto. Escribí la reclamación al proveedor. _(Situación simulada.)_',
    checklist: ['Identifica el envío: albarán, fecha, lote, cantidad.', 'Describe los hechos con datos (horas, temperaturas), sin adjetivos.', 'Adjunta o menciona las evidencias.', 'Dice qué se ha hecho con el producto.', 'Pide una acción concreta y un plazo.'],
    phrases: {
      es: ['Lamentamos comunicarle que…', 'Adjuntamos el registro de temperatura y fotografías.', 'Solicitamos…', 'Quedamos a la espera de sus instrucciones.'],
      it: ['Siamo spiacenti di comunicarVi che…', 'Alleghiamo il tracciato della temperatura e le fotografie.', 'Chiediamo pertanto…', 'Restiamo in attesa di Vostre istruzioni.'],
      en: ['We regret to inform you that…', 'Please find attached the temperature log and photographs.', 'We therefore request…', 'We await your instructions.'],
      pt: ['Lamentamos informar que…', 'Juntamos o registo de temperatura e fotografias.', 'Solicitamos, por isso…', 'Ficamos a aguardar as vossas instruções.'],
    },
    model: {
      es: `Asunto: Reclamación – albarán 4521, salmón fresco, lote L-0312

Estimados señores:

Lamentamos comunicarles una incidencia con el envío de referencia (600 kg), recibido el 8 de marzo, 24 horas después de la fecha acordada.

El registro de temperatura del vehículo muestra valores superiores al límite pactado durante unas seis horas. Adjuntamos el registro, fotografías y el parte de recepción firmado con reservas.

El producto ha quedado retenido por nuestro departamento de calidad y no se ha comercializado.

Solicitamos sus instrucciones sobre la mercancía y el abono correspondiente. Agradeceríamos una respuesta en 24 horas, dada la naturaleza del producto.

Atentamente,`,
      it: `Oggetto: Reclamo – DDT 4521, salmone fresco, lotto L-0312

Spettabile Ditta,

siamo spiacenti di segnalarVi un'anomalia relativa alla spedizione in oggetto (600 kg), ricevuta l'8 marzo, 24 ore dopo la data concordata.

Il tracciato della temperatura del mezzo evidenzia valori superiori al limite concordato per circa sei ore. Alleghiamo il tracciato, le fotografie e il verbale di ricevimento firmato con riserva.

Il prodotto è stato bloccato dal nostro reparto qualità e non è stato commercializzato.

Chiediamo Vostre istruzioni in merito alla merce e la relativa nota di credito. Vista la natura del prodotto, Vi saremmo grati di un riscontro entro 24 ore.

Distinti saluti,`,
      en: `Subject: Claim – delivery note 4521, fresh salmon, lot L-0312

Dear Sirs,

We regret to inform you of an issue with the above shipment (600 kg), received on 8 March, 24 hours after the agreed date.

The vehicle's temperature log shows readings above the agreed limit for approximately six hours. Please find attached the log, photographs and the delivery receipt signed with reservations.

The product has been placed on hold by our quality department and has not been sold.

We request your instructions regarding the goods and the corresponding credit note. Given the nature of the product, we would appreciate a reply within 24 hours.

Yours faithfully,`,
      pt: `Assunto: Reclamação – guia 4521, salmão fresco, lote L-0312

Exmos. Senhores,

Lamentamos informar de uma ocorrência com o envio em referência (600 kg), recebido a 8 de março, 24 horas após a data acordada.

O registo de temperatura do veículo apresenta valores acima do limite acordado durante cerca de seis horas. Juntamos o registo, fotografias e a guia de receção assinada com reservas.

O produto ficou retido pelo nosso departamento de qualidade e não foi comercializado.

Solicitamos as vossas instruções quanto à mercadoria e a respetiva nota de crédito. Dada a natureza do produto, agradecíamos uma resposta no prazo de 24 horas.

Com os melhores cumprimentos,`,
    },
  },
  {
    id: 'direccion', title: 'Resumen para dirección',
    scenario: 'Has comparado dos ofertas de **conservas de atún**. La A cuesta 12,68 €/kg escurrido (atún claro en aceite de oliva); la B, 11,92 €/kg escurrido (listado en girasol). El cliente aún no ha confirmado qué especie quiere. Resumilo para el CEO en pocas líneas. _(Cifras simuladas.)_',
    checklist: ['La recomendación o el siguiente paso va en la primera línea.', 'Compara en la misma base (€/kg escurrido).', 'Señala que no son el mismo producto.', 'Dice qué información falta y quién debe darla.', 'Cabe en una pantalla de móvil.'],
    phrases: {
      es: ['Recomiendo…', 'En base equivalente…', 'Queda pendiente confirmar…'],
      it: ['Consiglio di…', 'A parità di condizioni…', 'Resta da confermare…'],
      en: ['I recommend…', 'On a like-for-like basis…', 'Still to be confirmed:…'],
      pt: ['Recomendo…', 'Em base equivalente…', 'Fica por confirmar…'],
    },
    model: {
      es: `**Recomiendo no ofertar todavía:** falta que el cliente confirme especie y tipo de aceite.

En base equivalente (€/kg escurrido): A 12,68 · B 11,92. B es un 6 % más barata, no el 13 % que aparenta por lata.

No son el mismo producto: A es atún claro en oliva; B, listado en girasol.

Pendiente: especificación del cliente (la pido hoy). Con ella solicito a ambos proveedores oferta sobre el mismo producto y te paso la comparación el jueves.`,
      it: `**Consiglio di non presentare ancora l'offerta:** manca la conferma del cliente su specie e tipo di olio.

A parità di condizioni (€/kg sgocciolato): A 12,68 · B 11,92. B costa il 6 % in meno, non il 13 % che appare per scatoletta.

Non sono lo stesso prodotto: A è tonno pinna gialla in olio d'oliva; B è tonnetto striato in olio di girasole.

Da confermare: specifica del cliente (la chiedo oggi). Poi richiedo a entrambi i fornitori un'offerta sullo stesso prodotto e Le invio il confronto giovedì.`,
      en: `**I recommend we do not quote yet:** the customer still needs to confirm species and oil type.

On a like-for-like basis (€/kg drained weight): A 12.68 · B 11.92. B is 6% cheaper, not the 13% suggested by the per-can price.

They are not the same product: A is yellowfin in olive oil; B is skipjack in sunflower oil.

Still to be confirmed: customer specification (I will request it today). I will then ask both suppliers to quote on the same product and send you the comparison on Thursday.`,
      pt: `**Recomendo não apresentar ainda a proposta:** falta o cliente confirmar a espécie e o tipo de óleo.

Em base equivalente (€/kg de peso escorrido): A 12,68 · B 11,92. B é 6 % mais barata, e não os 13 % que aparenta por lata.

Não são o mesmo produto: A é atum-albacora em azeite; B é gaiado em óleo de girassol.

Fica por confirmar: especificação do cliente (peço-a hoje). Depois solicito a ambos os fornecedores proposta para o mesmo produto e envio-lhe a comparação na quinta-feira.`,
    },
  },
]
