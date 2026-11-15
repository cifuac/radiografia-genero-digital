/* Radiografía de un género digital — lógica del sitio */
(() => {
  'use strict';

  // Planilla de seguimiento: los avances se envían a un formulario de Google
  // vinculado a una hoja de cálculo. Cada clave indica en qué columna cae el dato.
  const CONFIG = {
    form: 'https://docs.google.com/forms/d/e/1FAIpQLSffuHH21yEW75zRLFOb2BUzImSoGhzuhPkFfLI5Ty70bDoUvA/formResponse',
    fields: {
      id: 'entry.954917097', curso: 'entry.1728499470', integrantes: 'entry.2130728715', genero: 'entry.1325586198',
      pasos: 'entry.455942961', pasosDetalle: 'entry.349220047', fichaPct: 'entry.1083551927', checklist: 'entry.1875904500',
      estado: 'entry.1955398821', fechaFicha: 'entry.204930077', fechaExpo: 'entry.1041380925', plataforma: 'entry.1012259937',
      auto: 'entry.1017019561', link: 'entry.202263602', ficha: 'entry.183009965'
    }
  };

  // Modo de prueba del profesor: ?prueba=1 usa datos aparte y no envía nada a la planilla.
  const TEST = new URLSearchParams(location.search).has('prueba');
  const KEY = TEST ? 'rgd:v1:prueba' : 'rgd:v1';
  const MERGED = 'Unido a otro celular del grupo';
  const THEME_KEY = 'rgd:theme';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ------------------------------------------------------------ datos */
  const PASOS = [
    [1, 'Elegir el género digital', 1], [2, 'Reunir ejemplos reales', 1], [3, 'Describir las propiedades del género', 1],
    [4, 'Investigar la plataforma donde más circula', 1], [5, 'Conectar el género con la plataforma', 1],
    [6, 'Armar el guion de la exposición', 2], [7, 'Diseñar el material de apoyo', 2], [8, 'Ensayar', 2],
    [9, 'Exponer y responder preguntas', 3]
  ];

  const GENEROS = [
    ['Meme', 'Imagen o video reconocible que se rellena con un texto nuevo y se remezcla.', 'Instagram, X, TikTok'],
    ['Storytime', 'Una persona cuenta a cámara una anécdota personal.', 'TikTok, YouTube'],
    ['Hilo', 'Serie de publicaciones encadenadas que desarrollan un tema.', 'X, Threads'],
    ['Video de reacción', 'Alguien se graba mientras ve y comenta otro contenido.', 'YouTube, TikTok'],
    ['Tutorial o «paso a paso»', 'Enseña a hacer algo en una secuencia de pasos.', 'YouTube, TikTok'],
    ['Reseña de usuario', 'Opinión breve, con nota o estrellas, sobre una película, libro, juego o local.', 'Letterboxd, Goodreads, Steam, Google Maps'],
    ['Carrusel informativo', 'Varias imágenes deslizables que explican un tema.', 'Instagram'],
    ['Unboxing o haul', 'Se abre o se muestra una compra frente a la cámara.', 'YouTube, TikTok'],
    ['Videoensayo', 'Video largo que analiza una obra o un fenómeno con una postura.', 'YouTube'],
    ['Fanfic', 'Relato escrito por fans con personajes de una obra conocida.', 'Wattpad, AO3'],
    ['Gameplay comentado o directo', 'Alguien juega y comenta, muchas veces con chat en vivo.', 'Twitch, YouTube, Kick'],
    ['Pregunta en foro', 'Una pregunta o caso que la comunidad responde y vota.', 'Reddit'],
    ['Vlog o «arréglate conmigo»', 'Registro de una rutina o de un día contado a cámara.', 'TikTok, Instagram, YouTube'],
    ['Edit o fancam', 'Montaje breve de imágenes de un artista o personaje con música.', 'TikTok, X'],
    ['Trend con audio', 'Muchas personas repiten la misma idea usando un mismo sonido.', 'TikTok, Instagram']
  ];

  const CHECKS = [
    'Podemos explicar por qué lo que elegimos es un género, y no una plataforma ni un tema.',
    'Tenemos entre 4 y 6 ejemplos reales y variados, cada uno con su procedencia.',
    'Cada propiedad está explicada con al menos un ejemplo (afirmar, mostrar, explicar).',
    'Describimos la plataforma con datos de fuentes confiables y contamos cómo supimos que el género circula más ahí.',
    'Tenemos al menos dos hipótesis del tipo «En [plataforma], el género [X] adopta la forma [Y] porque…».',
    'El material tiene poco texto, ejemplos grandes y señalizados, y las fuentes al final.',
    'Tapamos nombres de usuario y rostros de personas no públicas.',
    'Ensayamos con cronómetro: duramos entre 8 y 10 minutos y nadie lee.',
    'Cualquiera de nosotros puede responder preguntas sobre cualquier parte.'
  ];

  const NIVELES = ['Nivel 4 · Avanzado', 'Nivel 3 · Logrado', 'Nivel 2 · En desarrollo', 'Nivel 1 · Inicial'];
  const RUB = [
    ['Caracterización del género', 'grupal',
      'Explica con precisión las cinco propiedades (propósito, tema, estilo, composición y comunidad) y muestra cómo se relacionan entre sí; por ejemplo, cómo la composición sirve al propósito. Distingue lo que define al género de lo que solo aparece a veces.',
      'Explica correctamente las cinco propiedades del género, de modo que el curso puede reconocerlo y diferenciarlo de otros géneros.',
      'Explica correctamente solo parte de las propiedades. Las demás quedan nombradas sin explicación, son muy generales («es entretenido») o confunden el género con la plataforma o con el tema.',
      'Menciona rasgos sueltos o impresiones sin llegar a describir propiedades, o lo que presenta no corresponde a un género (es una plataforma o un tema).'],
    ['Ejemplos como evidencia', 'grupal',
      'Los ejemplos son reales, variados y bien escogidos; incluyen algún caso que pone a prueba las reglas del género. Cada propiedad se demuestra señalando en el ejemplo el detalle preciso que la muestra y explicando por qué.',
      'Los ejemplos son reales y pertinentes. La mayoría de las propiedades se apoya en un ejemplo y el grupo explica qué muestra cada uno.',
      'Los ejemplos son reales, pero funcionan sobre todo como ilustración: se muestran sin explicar qué demuestran, son muy parecidos entre sí o respaldan solo algunas propiedades.',
      'No presenta ejemplos reales del género, los ejemplos no corresponden al género expuesto o aparecen sin relación con lo que se explica.'],
    ['Plataforma y su relación con el género', 'grupal',
      'Describe las características relevantes de la plataforma y fundamenta por qué el género circula más ahí. Explica con claridad al menos dos formas en que la plataforma moldea al género y lo contrasta con lo que ocurriría en otra plataforma.',
      'Describe características relevantes de la plataforma (extensión, multimodalidad, interacción, permanencia o visibilidad) y explica al menos una forma concreta en que influyen en cómo es el género.',
      'Describe la plataforma de manera general o con datos poco relevantes para el género. La relación entre plataforma y género se afirma, pero no se explica.',
      'Solo nombra la plataforma, o entrega información sobre ella que no vincula con el género.'],
    ['Investigación y uso ético de la información', 'grupal',
      'Toda la información se puede rastrear: cada ejemplo indica plataforma, tipo de cuenta y fecha, y los datos sobre la plataforma provienen de fuentes confiables que el grupo cita y sabe justificar. Resguarda la identidad de las personas y distingue lo que comprobó de lo que supone.',
      'Los ejemplos indican su procedencia y los datos sobre la plataforma provienen de fuentes confiables, citadas en el material. Resguarda la identidad de las personas no públicas.',
      'Parte de los ejemplos o de los datos no indica procedencia, o se apoya en fuentes poco confiables o imprecisas («lo vi en internet»). El resguardo de identidades es parcial.',
      'No se puede saber de dónde provienen los ejemplos ni los datos, presenta como propio un trabajo ajeno o expone a personas sin ningún resguardo.'],
    ['Organización y material de apoyo', 'grupal',
      'La exposición avanza como una sola explicación: cada parte prepara la siguiente y la conclusión reúne lo expuesto, dentro del tiempo. El material hace visible el análisis (ejemplos legibles y señalizados, poco texto) y el grupo lo usa activamente para explicar.',
      'La exposición tiene apertura, desarrollo y cierre reconocibles y respeta el tiempo. El material es legible, muestra los ejemplos y apoya lo que se dice sin reemplazarlo.',
      'Las partes se reconocen, pero quedan sueltas entre sí, falta el cierre o el tiempo se desajusta y alguna parte queda sin tratar. El material tiene exceso de texto o ejemplos poco legibles, o se usa principalmente para leer.',
      'No se distingue un orden que permita seguir la explicación; o el material no se relaciona con lo expuesto, no se puede leer o no existe.'],
    ['Expresión oral y dominio del contenido', 'individual',
      'Explica su parte con sus propias palabras y sin leer, con volumen, ritmo y registro adecuados a una exposición formal. Usa los conceptos con precisión, se apoya en el material para mostrar lo que dice y responde preguntas relacionando distintas partes del trabajo.',
      'Explica su parte sin depender de la lectura y se le escucha y entiende con claridad. Mantiene un registro formal y se dirige al curso. Responde preguntas sobre su parte.',
      'Depende de la lectura de apuntes o diapositivas, o su volumen, ritmo o registro dificultan seguir algunos pasajes. Responde las preguntas de forma muy breve o imprecisa.',
      'Lee todo, o recita de memoria sin poder explicarlo con otras palabras, o no se le logra escuchar ni entender. No consigue responder preguntas sobre el trabajo.']
  ];

  // Campo: [clave, etiqueta, ejemplo (placeholder), tipo ('' | 'ta' | 'date' | 'sel'), obligatorio]
  const F = (k, l, ph = '', type = '', req = 1) => ({ k, l, ph, type, req });
  const PROPS = ['Propósito', 'Tema (de qué habla)', 'Estilo (cómo suena)', 'Composición (cómo se ordena)', 'Comunidad (¿comunidad discursiva o audiencia?)'];
  const PROPS_PH = [
    ['Ej.: Busca hacer reír por identificación y mostrar que se pertenece a un grupo.', 'Ej.: En E1 y E3 la gracia depende de reconocer una situación propia: por eso en los comentarios se repite «soy yo».'],
    ['Ej.: Situaciones cotidianas y compartidas; no cabe la explicación detallada de un tema.', 'Ej.: E1 y E2 hablan de dejar el estudio para el final…'],
    ['Ej.: Registro informal, frases cortísimas y fórmulas fijas como «yo cuando…».', 'Ej.: En E3 la frase «yo cuando dicen: saquen una hoja» usa la fórmula fija…'],
    ['Ej.: Plantilla conocida + texto breve que la rellena con algo nuevo.', 'Ej.: En E1, las etiquetas sobre cada personaje crean el chiste…'],
    ['Ej.: Quienes los crean, remezclan y comentan forman una comunidad discursiva; quienes solo miran son audiencia.', 'Ej.: Para entender E1 hay que conocer la plantilla y haber vivido la situación…']
  ];
  const CARS = ['Extensión', 'Multimodalidad', 'Interacción', 'Permanencia', 'Visibilidad'];
  const CARS_PH = [
    'Ej.: La imagen ocupa casi toda la pantalla y el texto queda debajo, en segundo plano.',
    'Ej.: Imágenes y videos; el sentido se reparte entre la imagen y el texto escrito sobre ella.',
    'Ej.: Dar me gusta, comentar, guardar, enviar por mensaje y compartir en historias.',
    'Ej.: Las publicaciones quedan en el perfil; las historias desaparecen a las 24 horas.',
    'Ej.: La plataforma recomienda lo que recibe más reacciones y más envíos.'
  ];
  const ESTADOS = ['Todavía no la entregamos', 'Entregada: esperando la revisión', 'Revisada: podemos pasar a la etapa 2', 'Revisada: debemos ajustar antes de continuar'];

  const FICHA = [
    { id: 'grupo', t: 'Nuestro grupo', fields: [
      F('curso', 'Curso', 'Ej.: 3° medio A'), F('int1', 'Integrante 1'), F('int2', 'Integrante 2'), F('int3', 'Integrante 3'), F('int4', 'Integrante 4 (si hay)', '', '', 0)] },
    { id: 'genero', t: '1. Nuestro género', hint: 'Corresponde al paso 1.', paso: 1, fields: [
      F('genero', 'Género elegido', 'Ej.: el meme de imagen con texto'),
      F('porque', '¿Por qué es un género y no una plataforma ni un tema?', 'Ej.: Cuando vemos una imagen conocida con una frase corta encima decimos «es un meme», aunque nunca hayamos visto esa publicación.', 'ta')] },
    { id: 'ejemplos', t: '2. Nuestros ejemplos (entre 4 y 6)', hint: 'Corresponde al paso 2. Los ejemplos 5 y 6 son opcionales.', paso: 2,
      groups: [1, 2, 3, 4, 5, 6].map(n => ({ t: 'Ejemplo E' + n, opt: n > 4, fields: [
        F(`e${n}_que`, 'Qué es (descripción breve)', n === 1 ? 'Ej.: Plantilla del «novio distraído»: él es «yo», la otra chica es «ver una serie» y la novia es «la prueba de mañana».' : '', 'ta', n <= 4),
        F(`e${n}_plat`, 'Plataforma y tipo de cuenta', n === 1 ? 'Ej.: Instagram, cuenta pública de memes estudiantiles' : '', '', n <= 4),
        F(`e${n}_fechas`, 'Fechas (publicación y captura)', n === 1 ? 'Ej.: Publicado en oct. 2026; capturado el 3 de nov.' : '', '', n <= 4),
        F(`e${n}_inter`, 'Interacción visible', n === 1 ? 'Ej.: 12 mil me gusta, 300 comentarios' : '', '', n <= 4),
        F(`e${n}_porque`, 'Por qué lo elegimos', n === 1 ? 'Ej.: Típico: plantilla famosa + situación escolar.' : '', 'ta', n <= 4),
        F(`e${n}_link`, 'Enlace (si es un video o una publicación pública)', 'https://…', '', 0)] })) },
    { id: 'propiedades', t: '3. Propiedades del género', hint: 'Corresponde al paso 3. Recuerden la cadena: afirmar, mostrar, explicar.', paso: 3,
      groups: PROPS.map((p, i) => ({ t: (i + 1) + '. ' + p, fields: [
        F(`p${i + 1}_af`, 'Lo que afirmamos', PROPS_PH[i][0], 'ta'),
        F(`p${i + 1}_ej`, 'Ejemplo donde se ve y por qué lo demuestra', PROPS_PH[i][1], 'ta')] })) },
    { id: 'plataforma', t: '4. La plataforma donde más circula', hint: 'Corresponde al paso 4.', paso: 4,
      fields: [F('plataforma', 'Plataforma', 'Ej.: Instagram'),
        F('comprob', '¿Cómo comprobamos que circula más ahí?', 'Ej.: Buscamos el género en tres plataformas y encontramos más ejemplos, y más recientes, en…', 'ta')],
      groups: CARS.map((c, i) => ({ t: c, fields: [
        F(`c${i + 1}_av`, 'Lo que averiguamos', CARS_PH[i], 'ta'),
        F(`c${i + 1}_fu`, 'Fuente', 'Ej.: Centro de ayuda de la plataforma')] })) },
    { id: 'conexion', t: '5. Conexión entre el género y la plataforma', hint: 'Corresponde al paso 5. Usen la estructura: En [plataforma], el género [X] adopta la forma [Y] porque…', paso: 5, fields: [
      F('hip1', 'Hipótesis 1', 'Ej.: En Instagram, el meme adopta la forma de una imagen con muy poco texto porque se avanza deslizando y cada publicación tiene apenas un par de segundos para llamar la atención.', 'ta'),
      F('hip2', 'Hipótesis 2', 'En [plataforma], el género [X] adopta la forma [Y] porque…', 'ta'),
      F('cambio', '¿Cómo cambiaría el género en otra plataforma?', 'Ej.: En TikTok, la misma idea deja de ser una imagen y se convierte en un video corto con un audio de moda.', 'ta')] },
    { id: 'fuentes', t: '6. Fuentes consultadas (al menos 2)', hint: 'De cada fuente anoten autor o institución, título, año y enlace.',
      groups: [1, 2, 3].map(n => ({ t: 'Fuente ' + n, opt: n > 2, fields: [
        F(`f${n}_aut`, 'Autor o institución', n === 1 ? 'Ej.: Instituto Reuters' : '', '', n <= 2),
        F(`f${n}_tit`, 'Título', n === 1 ? 'Ej.: Digital News Report' : '', '', n <= 2),
        F(`f${n}_anio`, 'Año', n === 1 ? 'Ej.: 2026' : '', '', n <= 2),
        F(`f${n}_link`, 'Enlace', 'https://…', '', n <= 2)] })) },
    { id: 'organizacion', t: '7. Organización del grupo y uso de inteligencia artificial', paso: 6, fields: [
      F('org', '¿Quién se hace cargo de cada momento de la exposición?', 'Ej.: Apertura: … · Propiedades: … · Plataforma: … · Conexión y conclusión: … · Fuentes y preguntas: …', 'ta'),
      F('ia', '¿Usamos inteligencia artificial? ¿Para qué?', 'Ej.: Sí, para que nos explicara qué significa «multimodalidad» y para revisar la ortografía. / No la usamos.', 'ta')] },
    { id: 'fechas', t: '8. Fechas y estado de la ficha', hint: 'Estas fechas las completa cada grupo, según lo acordado con el docente.', fields: [
      F('fficha', 'Fecha de entrega de la ficha de investigación', '', 'date'),
      F('fexpo', 'Fecha de nuestra exposición', '', 'date'),
      F('estado', 'Estado de la ficha', '', 'sel', 0)] }
  ];
  const allFields = sec => (sec.fields || []).concat(...(sec.groups || []).map(g => g.fields));
  const REQ = FICHA.flatMap(s => allFields(s)).filter(f => f.req).map(f => f.k);
  const ALLK = new Set(FICHA.flatMap(s => allFields(s)).map(f => f.k));

  /* ------------------------------------------------------------ estado */
  const blank = () => ({ v: 1, id: Math.random().toString(36).slice(2, 10), f: {}, pasos: {}, check: {}, rub: {}, m: {}, c: 0, tomb: [], t: 0, sent: 0 });
  function load() {
    try { const o = JSON.parse(localStorage.getItem(KEY)); if (o && o.v === 1) return Object.assign(blank(), o); } catch (e) { /* sin almacenamiento */ }
    return blank();
  }
  let S = load();
  let saveT;
  let canStore = true;
  const note = msg => { const n = document.getElementById('saveNote'); if (n) n.textContent = msg; };
  const flush = () => {
    clearTimeout(saveT);
    try { localStorage.setItem(KEY, JSON.stringify(S)); canStore = true; if (S.t) note('Guardado en este celular ✓'); }
    catch (e) { canStore = false; note('No se pudo guardar en este navegador'); const w = document.getElementById('noStore'); if (w) w.hidden = false; }
  };
  function save() { S.t = Date.now(); note('Guardando…'); clearTimeout(saveT); saveT = setTimeout(flush, 250); refresh(); }
  const now = () => Math.floor(Date.now() / 1000);
  const touch = key => { S.m[key] = now(); if (!S.c) S.c = now(); };
  const pad = n => String(n).padStart(2, '0');
  const when = ts => { const d = new Date(ts); return `${pad(d.getDate())}-${pad(d.getMonth() + 1)} a las ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

  const val = k => (S.f[k] || '').trim();
  const ints = () => ['int1', 'int2', 'int3', 'int4'].map(val).filter(Boolean).join(', ');
  const hasData = o => Object.keys(o.f).some(k => (o.f[k] || '').trim()) || Object.keys(o.pasos).some(k => o.pasos[k]);
  // Ejecuta una función leyendo otra ficha (p. ej. una compartida) sin tocar la de este celular.
  function withState(o, fn) { const keep = S; S = o; try { return fn(); } finally { S = keep; } }
  const nota = p => { const c = 14.4; const n = p < c ? 1 + 3 * (p / c) : 4 + 3 * ((p - c) / (24 - c)); return (n + 1e-9).toFixed(1).replace('.', ','); };
  const fecha = v => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ''); return m ? `${m[3]}-${m[2]}-${m[1]}` : ''; };

  function stats() {
    const pasos = PASOS.filter(p => S.pasos[p[0]]).map(p => p[0]);
    const filled = REQ.filter(k => val(k)).length;
    const checks = CHECKS.filter((_, i) => S.check[i + 1]).length;
    const rubN = RUB.filter((_, i) => S.rub[i + 1]).length;
    const rubPts = RUB.reduce((a, _, i) => a + (S.rub[i + 1] || 0), 0);
    return { pasos, filled, total: REQ.length, pct: Math.round(100 * filled / REQ.length), checks, rubN, rubPts };
  }

  /* ------------------------------------------------------------ render */
  function fieldHTML(f) {
    const lab = `<span>${esc(f.l)}${f.req ? ' <i class="req" aria-hidden="true">*</i>' : ''}</span>`;
    const ph = f.ph ? ` placeholder="${esc(f.ph)}"` : '';
    let ctl;
    if (f.type === 'ta') ctl = `<textarea data-k="${f.k}" rows="3"${ph}></textarea>`;
    else if (f.type === 'date') ctl = `<input type="date" data-k="${f.k}">`;
    else if (f.type === 'sel') ctl = `<select data-k="${f.k}">${ESTADOS.map((e, i) => `<option value="${i ? esc(e) : ''}">${esc(e)}</option>`).join('')}</select>`;
    else ctl = `<input type="text" data-k="${f.k}"${ph} autocomplete="off">`;
    return `<label class="fld">${lab}${ctl}</label>`;
  }
  function renderFicha() {
    $('#fichaForm').innerHTML = FICHA.map((s, i) => `
      <details class="fsec" id="ficha-${s.id}"${i === 0 ? ' open' : ''}>
        <summary><span>${esc(s.t)}</span><span class="cnt" data-cnt="${s.id}"></span></summary>
        <div class="fbody">
          ${s.hint ? `<p class="fhint">${esc(s.hint)}${s.paso ? ` <a href="#paso-${s.paso}">Ver el paso ${s.paso}</a>` : ''}</p>` : ''}
          ${(s.fields || []).map(fieldHTML).join('')}
          ${(s.groups || []).map((g, j) => `
            <details class="sub"${j === 0 ? ' open' : ''}>
              <summary><span>${esc(g.t)}${g.opt ? ' <span class="opt">(opcional)</span>' : ''}</span><span class="cnt" data-gcnt="${s.id}:${j}"></span></summary>
              <div>${g.fields.map(fieldHTML).join('')}</div>
            </details>`).join('')}
        </div>
      </details>`).join('');
    $$('[data-k]').forEach(el => { el.value = S.f[el.dataset.k] || ''; });
  }
  function renderStatic() {
    $('#genres').innerHTML = GENEROS.map(g => `<div class="genre" data-g="${esc(g[0])}"><b>${esc(g[0])}</b><p>${esc(g[1])}</p><small>Suele verse en: ${esc(g[2])}*</small><button class="btn" type="button" aria-pressed="false">Anotar</button></div>`).join('');
    $('#rubrica').innerHTML = RUB.map((r, i) => `
      <details class="crit" data-c="${i + 1}"${i === 0 ? ' open' : ''}>
        <summary><div><small>Criterio ${i + 1} · ${r[1]}</small><b>${esc(r[0])}</b></div><span class="chip" data-chip="${i + 1}">—</span></summary>
        <div class="levels">${[0, 1, 2, 3].map(j => `<button type="button" class="lvl${j === 1 ? ' exp' : ''}" data-c="${i + 1}" data-n="${4 - j}" aria-pressed="false"><b><span>${NIVELES[j]}${j === 1 ? ' · lo esperado' : ''}</span><span>${4 - j} ${j === 3 ? 'punto' : 'puntos'}</span></b><span>${esc(r[2 + j])}</span></button>`).join('')}</div>
      </details>`).join('');
    $('#conv').innerHTML = Array.from({ length: 25 }, (_, i) => 24 - i).map(p => `<div data-p="${p}" class="${p >= 15 ? 'pass' : ''}"><b>${p}</b>${nota(p)}</div>`).join('');
    $('#convEj').textContent = `Ejemplo: un grupo obtiene 16 puntos en los criterios 1 a 5. Una integrante obtiene 3 puntos en el criterio 6: su puntaje es 19 y su nota, ${nota(19)}. Otro integrante obtiene 2 puntos en el criterio 6: su puntaje es 18 y su nota, ${nota(18)}. Los puntajes con borde verde alcanzan la nota 4,0 o más.`;
    $('#stepList').innerHTML = PASOS.map(p => `<div class="step" data-step="${p[0]}"><button class="box" type="button" data-toggle="${p[0]}" aria-label="Marcar el paso ${p[0]}"></button><a href="#paso-${p[0]}">Paso ${p[0]}. ${esc(p[1])}<small>Etapa ${p[2]}</small></a></div>`).join('');
    $('#checkList').innerHTML = CHECKS.map((c, i) => `<button class="chk" type="button" data-check="${i + 1}" aria-pressed="false"><span class="box"></span><span>${esc(c)}</span></button>`).join('');
  }

  function refresh() {
    const st = stats();
    $('#topPill').textContent = `${st.pasos.length}/9`;
    $$('details.paso').forEach(d => {
      const n = +d.dataset.paso, on = !!S.pasos[n];
      d.classList.toggle('is-done', on);
      const b = $('[data-done]', d);
      if (b) { b.classList.toggle('on', on); b.textContent = on ? '✓ Paso listo · desmarcar' : 'Marcar paso como listo'; b.setAttribute('aria-pressed', on); }
    });
    [1, 2, 3].forEach(e => { const ps = PASOS.filter(p => p[2] === e); const el = $(`[data-bar="${e}"]`); if (el) el.style.width = (100 * ps.filter(p => S.pasos[p[0]]).length / ps.length) + '%'; });
    $$('[data-step]').forEach(el => { const on = !!S.pasos[+el.dataset.step]; el.classList.toggle('on', on); $('.box', el).setAttribute('aria-pressed', on); });
    $$('[data-check]').forEach(el => { const on = !!S.check[+el.dataset.check]; el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); $('.box', el).classList.toggle('on', on); });
    // ficha
    $('#fichaBar').style.width = st.pct + '%';
    $('#fichaTxt').textContent = `${st.pct} % · ${st.filled} de ${st.total}`;
    FICHA.forEach(s => {
      const cnt = (fs, el) => { const rq = fs.filter(f => f.req); if (!el) return; if (!rq.length) { el.hidden = true; return; } const n = rq.filter(f => val(f.k)).length; el.textContent = `${n}/${rq.length}`; el.classList.toggle('full', n === rq.length); };
      cnt(allFields(s), $(`[data-cnt="${s.id}"]`));
      (s.groups || []).forEach((g, j) => cnt(g.fields, $(`[data-gcnt="${s.id}:${j}"]`)));
    });
    const g = val('genero').toLowerCase();
    $$('.genre').forEach(el => { const on = !!g && el.dataset.g.toLowerCase() === g; el.classList.toggle('sel', on); const b = $('button', el); b.textContent = on ? '✓ Quitar' : 'Anotar'; b.setAttribute('aria-pressed', on); });
    $('#gsel').hidden = !g; $('#gselName').textContent = val('genero');
    // siguiente paso
    const nx = PASOS.find(p => !S.pasos[p[0]]), card = $('#nextCard');
    card.href = nx ? `#paso-${nx[0]}` : '#avance';
    card.innerHTML = nx
      ? `<small>${st.pasos.length ? 'Sigan aquí' : 'Empiecen aquí'} · Etapa ${nx[2]}</small><b>Paso ${nx[0]}. ${esc(nx[1])}</b><span>${st.pasos.length} de 9 pasos listos →</span>`
      : '<small>¡Los 9 pasos están listos!</small><b>Revisen la lista final y envíen su avance</b><span>Ir a Avance →</span>';
    // rúbrica
    $$('.lvl').forEach(b => { const on = S.rub[+b.dataset.c] === +b.dataset.n; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $$('[data-chip]').forEach(c => { const v = S.rub[+c.dataset.chip]; c.textContent = v ? `${v} pts` : '—'; c.classList.toggle('set', !!v); });
    const full = st.rubN === RUB.length;
    $('#scorePts').textContent = st.rubN ? `${st.rubPts} / ${full ? 24 : st.rubN * 4}` : '— / 24';
    $('#scoreNota').textContent = full ? nota(st.rubPts) : (st.rubN ? `faltan ${RUB.length - st.rubN}` : '—');
    $('#scoreBox').hidden = !st.rubN;
    $$('#conv div').forEach(d => d.classList.toggle('me', full && +d.dataset.p === st.rubPts));
    // avance
    $('#ringNum').textContent = st.pasos.length;
    $('#ringVal').style.strokeDashoffset = 314.16 * (1 - st.pasos.length / 9);
    $('#tFicha').textContent = st.pct + ' %';
    $('#tLista').textContent = `${st.checks}/9`;
    $('#tAuto').textContent = full ? `${st.rubPts}/24` : '—';
    const ints = ['int1', 'int2', 'int3', 'int4'].map(val).filter(Boolean);
    $('#grpLine').textContent = (val('curso') || ints.length || val('genero'))
      ? [val('curso'), ints.join(', '), val('genero') && 'Género: ' + val('genero')].filter(Boolean).join(' · ')
      : 'Completen los datos del grupo en la ficha para identificar su avance.';
    $('#lastSent').textContent = S.sent ? `Último envío al profesor: ${when(S.sent)}.` : 'Todavía no han enviado su avance desde este celular.';
  }

  /* ------------------------------------------------------------ interacción */
  let toastT, undoFn = null;
  function toast(msg, undo) {
    const t = $('#toast'); $('#toastMsg').textContent = msg; undoFn = undo || null; $('#toastAct').hidden = !undoFn;
    t.classList.toggle('has-act', !!undoFn); t.classList.add('show'); clearTimeout(toastT);
    toastT = setTimeout(() => { t.classList.remove('show'); undoFn = null; }, undoFn ? 8000 : 3200);
  }
  $('#toastAct').onclick = () => { const f = undoFn; undoFn = null; $('#toast').classList.remove('show'); if (f) f(); };
  function grow(el) { if (el.tagName === 'TEXTAREA' && el.offsetParent) { el.style.height = 'auto'; el.style.height = (el.scrollHeight + 2) + 'px'; } }
  let closeModal = null;
  function ask(title, text, okLabel, danger) {
    if (closeModal) closeModal(false);
    return new Promise(res => {
      const m = $('#modal'), prev = document.activeElement;
      $('#modalT').textContent = title; $('#modalP').textContent = text; $('#modalOk').textContent = okLabel; m.classList.toggle('is-danger', !!danger); m.hidden = false;
      const onKey = e => { if (e.key === 'Escape') done(false); };
      const done = v => { closeModal = null; m.hidden = true; $('#modalOk').onclick = $('#modalNo').onclick = m.onclick = null; document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); res(v); };
      $('#modalOk').onclick = () => done(true); $('#modalNo').onclick = () => done(false);
      m.onclick = e => { if (e.target === m) done(false); };
      document.addEventListener('keydown', onKey); closeModal = done;
      (danger ? $('#modalNo') : $('#modalOk')).focus();
    });
  }
  // Reemplaza todo lo guardado y permite volver atrás desde el aviso.
  function replaceAll(next, msg) {
    const backup = JSON.stringify(S);
    S = next; flush(); renderFicha(); refresh();
    toast(msg, () => { S = Object.assign(blank(), JSON.parse(backup)); flush(); renderFicha(); refresh(); toast('Listo: se recuperó lo que había antes.'); });
  }
  function setGenero(v) { S.f.genero = v; touch('f:genero'); const inp = $('[data-k="genero"]'); if (inp) inp.value = v; save(); }

  const onField = e => {
    const k = e.target.dataset && e.target.dataset.k; if (!k || S.f[k] === e.target.value) return;
    S.f[k] = e.target.value; touch('f:' + k); grow(e.target); save();
  };
  document.addEventListener('input', onField);
  document.addEventListener('change', onField);
  document.addEventListener('toggle', e => { if (e.target.open) $$('textarea', e.target).forEach(grow); }, true);

  document.addEventListener('click', async e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.done || t.dataset.toggle) {
      const n = +(t.dataset.done || t.dataset.toggle); S.pasos[n] = !S.pasos[n]; touch('p:' + n); save();
      if (S.pasos[n]) toast(`Paso ${n} listo. Van ${stats().pasos.length} de 9.`);
    } else if (t.dataset.check) {
      const n = +t.dataset.check; S.check[n] = !S.check[n]; touch('c:' + n); save();
    } else if (t.classList.contains('lvl')) {
      const c = +t.dataset.c, n = +t.dataset.n; if (S.rub[c] === n) delete S.rub[c]; else S.rub[c] = n; touch('r:' + c); save();
    } else if (t.closest('.genre') || t.id === 'gselClear') {
      const prev = S.f.genero || '', cur = val('genero');
      const g = t.id === 'gselClear' ? cur : t.closest('.genre').dataset.g;
      if (t.id === 'gselClear' || cur.toLowerCase() === g.toLowerCase()) {
        setGenero(''); toast(`Se quitó «${g}» de la ficha.`, () => setGenero(prev)); return;
      }
      const listed = GENEROS.some(x => x[0].toLowerCase() === cur.toLowerCase());
      if (cur && !listed && !(await ask('Cambiar el género', `En la ficha está escrito «${cur}». ¿Reemplazarlo por «${g}»?`, 'Reemplazar'))) return;
      setGenero(g);
      toast(cur ? `Cambiaron «${cur}» por «${g}».` : `«${g}» quedó anotado en la ficha.`, cur ? () => setGenero(prev) : null);
    }
  });

  $('#rubClear').onclick = () => { const prev = Object.assign({}, S.rub); const all = () => [1, 2, 3, 4, 5, 6].forEach(c => touch('r:' + c)); S.rub = {}; all(); save(); toast('Se borró la autoevaluación.', () => { S.rub = prev; all(); save(); }); };
  $('#resetBtn').onclick = async () => {
    if (!(await ask('Borrar todo', 'Se borrarán la ficha, los pasos marcados y la autoevaluación guardados en este celular.', 'Borrar todo', true))) return;
    replaceAll(blank(), 'Se borró lo guardado en este celular.');
  };

  /* tema claro / oscuro */
  function setTheme(t) { document.documentElement.dataset.theme = t; const m = $('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#ffffff' : '#0d2236'; }
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  $('#themeBtn').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(t); try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* sin almacenamiento */ } };

  /* ------------------------------------------------------------ compartir */
  const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64 = str => { const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/')); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return u8; };
  async function pipe(u8, Stream) { const s = new Blob([u8]).stream().pipeThrough(new Stream('deflate-raw')); return new Uint8Array(await new Response(s).arrayBuffer()); }
  async function pack(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if ('CompressionStream' in window) { try { return 'z' + b64(await pipe(bytes, CompressionStream)); } catch (e) { /* sin compresión */ } }
    return 'j' + b64(bytes);
  }
  async function unpack(str) {
    let bytes = unb64(str.slice(1));
    if (str[0] === 'z') bytes = await pipe(bytes, DecompressionStream);
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  function clean(o) {
    const n = blank(); if (!o || typeof o !== 'object') return null;
    if (typeof o.id === 'string') n.id = o.id.slice(0, 16).replace(/[^a-z0-9]/gi, '') || n.id;
    Object.entries(o.f || {}).forEach(([k, v]) => { if (ALLK.has(k) && typeof v === 'string') n.f[k] = v.slice(0, 4000); });
    for (let i = 1; i <= 9; i++) { if (o.pasos && o.pasos[i]) n.pasos[i] = true; if (o.check && o.check[i]) n.check[i] = true; }
    for (let i = 1; i <= 6; i++) { const v = o.rub && +o.rub[i]; if (v >= 1 && v <= 4) n.rub[i] = Math.round(v); }
    Object.entries(o.m || {}).forEach(([k, v]) => { if (/^(f:[a-z0-9_]+|[pcr]:\d)$/.test(k) && +v > 0) n.m[k] = Math.floor(+v); });
    n.c = +o.c > 0 ? Math.floor(+o.c) : 0;
    n.t = +o.t || 0; return n;
  }
  // Junta dos fichas casilla por casilla: en cada una queda lo último que se escribió.
  function merge(L, I) {
    const R = JSON.parse(JSON.stringify(L)); const info = { added: 0, changed: 0, kept: 0 };
    const ts = (o, k) => (o.m && o.m[k]) || 0;
    ALLK.forEach(k => {
      const lv = L.f[k] || '', iv = I.f[k] || ''; if (lv === iv) return;
      const lt = ts(L, 'f:' + k), it = ts(I, 'f:' + k);
      if (it > lt || (it === lt && !lv.trim() && iv.trim())) { R.f[k] = iv; if (lv.trim()) info.changed++; else info.added++; }
      else if (iv.trim()) info.kept++;
    });
    const flags = (name, pre, max) => { for (let n = 1; n <= max; n++) {
      const lt = ts(L, pre + n), it = ts(I, pre + n), lv = L[name][n], iv = I[name][n];
      if (it > lt || (it === lt && !lv && iv)) { if (iv) R[name][n] = iv; else delete R[name][n]; }
    } };
    flags('pasos', 'p:', 9); flags('check', 'c:', 9); flags('rub', 'r:', 6);
    Object.keys(I.m || {}).forEach(k => { if ((I.m[k] || 0) > (R.m[k] || 0)) R.m[k] = I.m[k]; });
    // Identidad del grupo: prevalece la del grupo más antiguo, para que todos queden en la misma fila de la planilla.
    const iWins = !hasData(L) || (I.c && (!L.c || I.c < L.c)) || (I.c === L.c && I.id < L.id);
    if (iWins && I.id !== L.id) { if (L.sent) R.tomb = (R.tomb || []).concat(L.id); R.id = I.id; R.c = I.c || L.c || now(); R.sent = 0; }
    R.t = Date.now(); return { state: R, info };
  }
  const baseURL = () => location.origin + location.pathname + (TEST ? '?prueba=1' : '');
  // kind 'g': enlace para el grupo (se junta con la ficha de quien lo abre). kind 'v': solo lectura, para el profesor.
  async function shareLink(kind = 'g') {
    const data = { id: S.id, c: S.c, f: {}, pasos: S.pasos, check: S.check, rub: S.rub, t: S.t };
    if (kind === 'g') { data.f = S.f; data.m = S.m; } else Object.keys(S.f).forEach(k => { if (val(k)) data.f[k] = S.f[k]; });
    return baseURL() + '#' + kind + '=' + await pack(data);
  }

  function resumen(st, link) {
    return [
      'Radiografía de un género digital · Avance del grupo',
      `Curso: ${val('curso') || '(sin anotar)'}`,
      `Integrantes: ${ints() || '(sin anotar)'}`,
      `Género: ${val('genero') || '(sin anotar)'}`,
      `Pasos listos: ${st.pasos.length} de 9${st.pasos.length ? ' (' + st.pasos.join(', ') + ')' : ''}`,
      `Ficha de investigación: ${st.pct} % (${st.filled} de ${st.total} campos)`,
      `Estado de la ficha: ${val('estado') || ESTADOS[0]}`,
      `Entrega de la ficha: ${fecha(val('fficha')) || '(sin fecha)'} · Exposición: ${fecha(val('fexpo')) || '(sin fecha)'}`,
      `Lista de comprobación: ${st.checks} de 9`,
      link ? `Ficha completa: ${link}` : ''
    ].filter(Boolean).join('\n');
  }
  function fichaTexto() {
    const out = ['FICHA DE INVESTIGACIÓN · Radiografía de un género digital', ''];
    FICHA.forEach(s => {
      out.push(s.t.toUpperCase());
      (s.fields || []).forEach(f => { const v = f.type === 'date' ? fecha(val(f.k)) : val(f.k); if (v || f.req) out.push(`${f.l}: ${v || '—'}`); });
      (s.groups || []).forEach(g => { const fs = g.fields.filter(f => val(f.k)); if (!fs.length && g.opt) return; out.push(`· ${g.t}`); g.fields.forEach(f => { if (val(f.k) || f.req) out.push(`   ${f.l}: ${val(f.k) || '—'}`); }); });
      out.push('');
    });
    return out.join('\n');
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (err) { /* sin portapapeles */ } ta.remove(); return ok;
    }
  }
  const status = (msg, ok) => { const s = $('#sendStatus'); s.textContent = msg; s.classList.toggle('ok', !!ok); };
  async function shareOrCopy(title, text, okMsg) {
    if (navigator.share) { try { await navigator.share({ title, text }); status(okMsg, true); return; } catch (e) { if (e && e.name === 'AbortError') { status('Envío cancelado.'); return; } } }
    status((await copy(text)) ? 'Copiado. Péguenlo en el mensaje para el profesor o para su grupo.' : 'No se pudo copiar automáticamente en este navegador.', true);
  }

  async function post(data) {
    const body = new URLSearchParams();
    Object.entries(CONFIG.fields).forEach(([k, entry]) => body.append(entry, String(data[k] == null ? '' : data[k])));
    await fetch(CONFIG.form, { method: 'POST', mode: 'no-cors', body });
  }
  // Si este celular cambió de identidad al unirse al grupo, avisa a la planilla para que no quede una fila duplicada.
  async function sendTombs() {
    if (TEST || !CONFIG.form || !S.tomb || !S.tomb.length || navigator.onLine === false) return;
    for (const id of S.tomb.slice()) {
      try { await post({ id, curso: val('curso'), integrantes: ints(), genero: val('genero'), estado: MERGED }); S.tomb = S.tomb.filter(x => x !== id); } catch (e) { break; }
    }
    flush();
  }

  $('#sendBtn').onclick = async () => {
    if (!val('curso') || !val('int1')) { toast('Antes de enviar, anoten el curso y los integrantes en la ficha.'); location.hash = '#ficha-grupo'; return; }
    const btn = $('#sendBtn'); if (btn.disabled) return;
    const st = stats();
    if (!(await ask('Enviar el avance', `Pasos listos: ${st.pasos.length} de 9\nFicha de investigación: ${st.pct} %\n\nEste envío reemplaza al anterior de su grupo en la planilla del profesor. Si alguien escribió en otro celular, junten primero las fichas.`, 'Enviar'))) return;
    btn.disabled = true; setTimeout(() => { btn.disabled = false; }, 5000);
    flush(); status('Enviando el avance…');
    const link = await shareLink('v');
    if (TEST) {
      status('Modo de prueba: este envío no llegó a la planilla.', true);
      showViewer(JSON.parse(JSON.stringify(S)), 'Así verá el profesor esta ficha'); return;
    }
    let sent = false;
    if (CONFIG.form && navigator.onLine !== false) {
      try {
        await sendTombs();
        await post({
          id: S.id, curso: val('curso'), integrantes: ints(), genero: val('genero'),
          pasos: st.pasos.length, pasosDetalle: st.pasos.join(', '), fichaPct: st.pct, checklist: st.checks, estado: val('estado') || ESTADOS[0],
          fechaFicha: fecha(val('fficha')), fechaExpo: fecha(val('fexpo')), plataforma: val('plataforma'), auto: st.rubN === RUB.length ? st.rubPts : '', link, ficha: fichaTexto().trim().replace(/\n+/g, ' // ')
        });
        sent = true;
      } catch (e) { /* sin conexión */ }
    }
    if (sent) {
      const h = new Date(); const hora = pad(h.getHours()) + ':' + pad(h.getMinutes());
      S.sent = h.getTime(); flush(); refresh();
      status(`Avance enviado al profesor a las ${hora}. ✓`, true); toast('Avance enviado al profesor.'); return;
    }
    status('No se pudo enviar (¿hay conexión?). Compartan este resumen con el profesor:');
    await shareOrCopy('Avance del grupo', resumen(st, link), 'Listo: elijan al profesor como destinatario en la aplicación que se abrió.');
  };
  $('#linkBtn').onclick = async () => { flush(); const link = await shareLink('g'); await shareOrCopy('Ficha del grupo', 'Ficha de nuestro grupo (Radiografía de un género digital). Ábrelo en tu celular para unirte al grupo o para juntar lo que escribiste:\n' + link, 'Enlace compartido con el grupo.'); };
  $('#textBtn').onclick = async () => { status((await copy(fichaTexto())) ? 'Ficha copiada como texto. Pueden pegarla en un documento o en un mensaje.' : 'No se pudo copiar automáticamente en este navegador.', true); };
  $('#pasteBtn').onclick = () => {
    const m = /#([gv])=([A-Za-z0-9_-]+)/.exec($('#pasteLink').value);
    if (!m) { toast('Ese texto no trae un enlace de ficha. Peguen el enlace completo.'); return; }
    $('#pasteLink').value = ''; openShared(m[1], m[2]);
  };

  /* ------------------------------------------------------------ fichas compartidas */
  const describe = o => withState(o, () => [val('curso'), ints(), val('genero') && 'Género: ' + val('genero')].filter(Boolean).join('\n') || 'Grupo sin datos anotados');
  function applyMerge(o, msg) {
    const { state, info } = merge(S, o);
    const n = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
    const parts = [info.added && n(info.added, 'casilla nueva', 'casillas nuevas'), info.changed && n(info.changed, 'actualizada', 'actualizadas'), info.kept && n(info.kept, 'de este celular se mantuvo por ser más reciente', 'de este celular se mantuvieron por ser más recientes')].filter(Boolean);
    replaceAll(state, msg || (parts.length ? `Fichas juntadas: ${parts.join(', ')}.` : 'Fichas juntadas: no había diferencias.'));
    sendTombs();
  }
  async function openShared(kind, data) {
    let o = null; try { o = clean(await unpack(data)); } catch (e) { /* enlace dañado */ }
    history.replaceState(null, '', baseURL() + '#avance');
    if (!o) { toast('El enlace de la ficha está incompleto o dañado.'); return; }
    if (kind === 'v') { showViewer(o, 'Ficha del grupo (solo lectura)'); return; }
    const who = describe(o) + (o.t ? `\nÚltimo cambio: ${when(o.t)}` : '');
    if (!hasData(S)) {
      if (await ask('Unirse al grupo', who + '\n\nEste celular quedará en ese grupo y recibirá su ficha. Lo que escriban aquí se podrá juntar después con lo de sus compañeros.', 'Unirme al grupo')) applyMerge(o, 'Listo: este celular ya es parte del grupo.');
      return;
    }
    if (await ask('Juntar fichas', who + '\n\nSe juntará con la ficha de este celular: en cada casilla queda lo último que se escribió. Si algo no queda bien, podrán deshacerlo.', 'Juntar')) applyMerge(o);
  }
  const vrow = (l, v) => `<div class="vrow"><small>${esc(l)}</small><p${v ? '' : ' class="empty"'}>${v ? esc(v) : 'Sin completar'}</p></div>`;
  function showViewer(o, title) {
    $('#viewerTitle').textContent = title;
    $('#viewerBody').innerHTML = withState(o, () => {
      const st = stats();
      const head = `<p class="vwho">${esc([val('curso'), ints()].filter(Boolean).join(' · ') || 'Grupo sin datos anotados')}</p>
        <div class="vstats"><div><small>Pasos listos</small><b>${st.pasos.length}/9</b></div><div><small>Ficha</small><b>${st.pct} %</b></div><div><small>Lista final</small><b>${st.checks}/9</b></div><div><small>Autoeval.</small><b>${st.rubN === RUB.length ? st.rubPts + '/24' : '—'}</b></div></div>
        <p class="small">${st.pasos.length ? 'Pasos marcados: ' + st.pasos.join(', ') + '.' : 'Aún no hay pasos marcados.'}${o.t ? ' Último cambio: ' + when(o.t) + '.' : ''}</p>`;
      return head + FICHA.map(s => `<section><h3>${esc(s.t)}</h3>${(s.fields || []).map(f => vrow(f.l, f.type === 'date' ? fecha(val(f.k)) : val(f.k))).join('')}${(s.groups || []).map(g => {
        if (g.opt && !g.fields.some(f => val(f.k))) return '';
        return `<h4>${esc(g.t)}</h4>` + g.fields.filter(f => val(f.k) || f.req).map(f => vrow(f.l, val(f.k))).join('');
      }).join('')}</section>`).join('');
    });
    $('#viewer').hidden = false; $('#viewer').scrollTop = 0; document.body.classList.add('noscroll');
  }
  const hideViewer = () => { $('#viewer').hidden = true; document.body.classList.remove('noscroll'); };
  $('#viewerClose').onclick = hideViewer;

  /* ------------------------------------------------------------ modo de prueba del profesor */
  function demoState() {
    const d = blank(); const E = (n, que, plat, fechas, inter, porque) => Object.assign(d.f, { [`e${n}_que`]: que, [`e${n}_plat`]: plat, [`e${n}_fechas`]: fechas, [`e${n}_inter`]: inter, [`e${n}_porque`]: porque });
    Object.assign(d.f, {
      curso: '3° medio A (prueba)', int1: 'Estudiante Uno', int2: 'Estudiante Dos', int3: 'Estudiante Tres',
      genero: 'el meme de imagen con texto',
      porque: 'Cuando vemos una imagen conocida con una frase corta encima decimos «es un meme», aunque nunca hayamos visto esa publicación. Entonces es un género, y no una plataforma ni un tema.',
      p1_af: 'Busca hacer reír por identificación y mostrar que se pertenece a un grupo.', p1_ej: 'En E1 y E3 la gracia depende de reconocer una situación propia: por eso en los comentarios se repite «soy yo».',
      p2_af: 'Trata situaciones cotidianas y compartidas (el colegio, la familia, dejar todo para el final) y hechos de actualidad.', p2_ej: 'E1 y E2 hablan de dejar el estudio para después; ninguno explica un tema en detalle.',
      p3_af: 'Registro informal, frases cortísimas y fórmulas fijas como «yo cuando…»; usa ironía y exageración.', p3_ej: 'En E3, «yo cuando dicen: saquen una hoja» usa la fórmula fija y exagera el susto con la foto del perro.',
      p4_af: 'Plantilla conocida + texto breve que la rellena con algo nuevo (remezcla).', p4_ej: 'En E1, las etiquetas sobre cada personaje crean el chiste. El texto remata, no explica.',
      p5_af: 'Quienes crean memes, los remezclan y comentan forman una comunidad discursiva; quienes solo miran son audiencia.', p5_ej: 'Para entender E1 hace falta el guiño interno: conocer la plantilla y haber vivido la situación.',
      plataforma: 'Instagram', comprob: 'Buscamos memes en tres plataformas y encontramos más, y más recientes, en Instagram.',
      c1_av: 'La imagen ocupa casi toda la pantalla y el texto que la acompaña queda debajo, en segundo plano.', c1_fu: 'Observación de nuestros ejemplos',
      c2_av: 'Imágenes y videos; el sentido se reparte entre la imagen y el texto escrito sobre ella.', c2_fu: 'Centro de ayuda de la plataforma',
      c3_av: 'Dar me gusta, comentar, guardar, enviar por mensaje y compartir en historias.', c3_fu: 'Centro de ayuda de la plataforma',
      c4_av: 'Las publicaciones quedan en el perfil; las historias desaparecen a las 24 horas.', c4_fu: 'Centro de ayuda de la plataforma',
      c5_av: 'La plataforma recomienda lo que recibe más reacciones y más envíos.', c5_fu: 'Informe de uso de redes (fuente 2)',
      hip1: 'En Instagram, el meme adopta la forma de una imagen con muy poco texto porque se avanza deslizando y cada publicación tiene apenas un par de segundos para llamar la atención.',
      hip2: 'En Instagram, el meme reutiliza plantillas y no lleva firma porque cualquiera puede guardar la imagen y volver a publicarla con otro texto.',
      cambio: 'En TikTok, la misma idea deja de ser una imagen y se convierte en un video corto con un audio de moda.',
      f1_aut: 'Plataforma estudiada (dato de ejemplo)', f1_tit: 'Centro de ayuda', f1_anio: '2026', f1_link: 'https://ejemplo.invalid/centro-de-ayuda',
      f2_aut: 'Informe de uso de redes (dato de ejemplo)', f2_tit: 'Informe anual', f2_anio: '2026', f2_link: 'https://ejemplo.invalid/informe',
      org: 'Apertura: Uno · Propiedades: Dos · Plataforma: Tres · Conexión y conclusión: Uno · Fuentes y preguntas: todos',
      ia: 'Sí, para que nos explicara qué significa «multimodalidad» y para revisar la ortografía.',
      fficha: '2026-11-20', fexpo: '2026-11-27', estado: ESTADOS[1]
    });
    E(1, 'Plantilla del «novio distraído»: él es «yo», la otra chica es «ver una serie» y la novia es «la prueba de mañana».', 'Instagram, cuenta pública de memes estudiantiles', 'Publicado en oct. 2026; capturado el 3 de nov.', '12 mil me gusta, 300 comentarios', 'Típico: plantilla famosa + situación escolar.');
    E(2, 'Plantilla de «Drake»: rechaza «empezar el trabajo con tiempo» y aprueba «hacerlo la noche anterior».', 'X, cuenta personal pública (nombre tapado)', 'Publicado en sept. 2026; capturado el 3 de nov.', '2 mil reposteos', 'La misma idea en otra plataforma: sirve para comparar.');
    E(3, 'Foto de un perro con cara de susto y el texto «yo cuando dicen: saquen una hoja».', 'Instagram, cuenta de humor chileno', 'Publicado en nov. 2026; capturado el 4 de nov.', '8 mil me gusta', 'No usa plantilla famosa, pero mantiene la estructura.');
    E(4, 'Una marca de comida rápida usa una plantilla de moda para promocionar una oferta.', 'Instagram, cuenta oficial de una marca', 'Publicado en oct. 2026; capturado el 4 de nov.', '900 me gusta', 'Caso «raro»: el propósito cambia (vender).');
    [1, 2, 3, 4, 5].forEach(n => { d.pasos[n] = true; }); [1, 2, 3].forEach(n => { d.check[n] = true; });
    const t = now(); Object.keys(d.f).forEach(k => { d.m['f:' + k] = t; }); d.c = t; d.t = Date.now();
    return d;
  }
  if (TEST) {
    $('#testBar').hidden = false; document.title = 'PRUEBA · ' + document.title;
    $('#demoBtn').onclick = () => replaceAll(demoState(), 'Se cargaron datos de ejemplo (el grupo modelo).');
  }

  /* ------------------------------------------------------------ navegación */
  const VIEWS = ['inicio', 'ruta', 'ficha', 'rubrica', 'avance'];
  function show(view) {
    $$('.view').forEach(v => { v.hidden = v.dataset.view !== view; });
    $$('.tabs a').forEach(a => { const on = a.dataset.tab === view; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (view === 'ficha') $$('#fichaForm textarea').forEach(grow);
  }
  function route() {
    if (closeModal) closeModal(false);
    const h = decodeURIComponent(location.hash.slice(1));
    hideViewer();
    const sh = /^([gv])=(.+)$/.exec(h);
    if (sh) { show('avance'); openShared(sh[1], sh[2]); return; }
    let view = 'inicio', target = null;
    if (VIEWS.includes(h)) view = h;
    else if (/^paso-\d$/.test(h) || /^etapa-\d$/.test(h)) { view = 'ruta'; target = document.getElementById(h); }
    else if (h.startsWith('ficha-')) { view = 'ficha'; target = document.getElementById(h); }
    else if (h.startsWith('avance-')) { view = 'avance'; target = document.getElementById(h); }
    show(view);
    if (target) {
      if (target.tagName === 'DETAILS') { target.open = true; $$('textarea', target).forEach(grow); }
      const go = () => scrollTo({ top: target.getBoundingClientRect().top + scrollY - 64, behavior: 'auto' });
      requestAnimationFrame(go); setTimeout(go, 250); setTimeout(go, 800);
    } else scrollTo(0, 0);
  }
  addEventListener('hashchange', route);

  try { localStorage.setItem('rgd:test', '1'); localStorage.removeItem('rgd:test'); } catch (e) { canStore = false; }
  renderStatic(); renderFicha(); refresh(); route();
  if (!canStore) $('#noStore').hidden = false;
  if (S.t) note('Guardado en este celular ✓');
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
