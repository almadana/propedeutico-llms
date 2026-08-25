"use client";

import { useEffect, useMemo, useState } from "react";
import { decode, encode } from "gpt-tokenizer/model/gpt-4o";

type Module = { id: string; day: string; week: string; time: string; title: string; summary: string };

const modules: Module[] = [
  { id: "m1", day: "Día 1", week: "Semana 1", time: "35 min", title: "¿Qué hace un LLM?", summary: "Predicción, probabilidades y generación." },
  { id: "m2", day: "Día 3", week: "Semana 1", time: "55 min", title: "Del texto a los vectores", summary: "Tokens, embeddings y posición." },
  { id: "m3", day: "Día 5", week: "Semana 1", time: "55 min", title: "El recorrido por un transformer", summary: "De la entrada a la próxima predicción." },
  { id: "m4", day: "Día 8", week: "Semana 2", time: "65 min", title: "¿Qué significa prestar atención?", summary: "Cómo los tokens recuperan contexto." },
  { id: "m5", day: "Día 10", week: "Semana 2", time: "50 min", title: "¿Dónde está el conocimiento?", summary: "Capas MLP y representaciones distribuidas." },
  { id: "m6", day: "Día 12", week: "Semana 2", time: "55 min", title: "Integración", summary: "Unir las piezas y llegar a la Escuela." },
];

const nextTokens = [
  { word: "lenguaje", p: .42 }, { word: "texto", p: .26 }, { word: "mundo", p: .17 },
  { word: "cerebro", p: .10 }, { word: "resto", p: .05 },
];

const pipelineStages = [
  { label: "Texto / contexto", input: "El prompt y todo lo generado hasta ahora", output: "Una secuencia de caracteres" },
  { label: "Tokens", input: "La secuencia de caracteres", output: "Una secuencia de identificadores discretos" },
  { label: "Embeddings + posición", input: "Identificadores de tokens y su orden", output: "Un vector inicial para cada token" },
  { label: "Atención + MLP", input: "Vectores de todos los tokens del contexto", output: "Representaciones contextualizadas" },
  { label: "Logits", input: "La representación contextual final", output: "Un puntaje para cada token del vocabulario" },
  { label: "Softmax + temperatura", input: "Los logits y la temperatura elegida", output: "Una distribución de probabilidades" },
  { label: "Muestreo y repetición", input: "La distribución de probabilidades", output: "Un nuevo token, que se agrega al contexto" },
];

const shuffledPipeline = ["Atención + MLP", "Muestreo y repetición", "Texto / contexto", "Logits", "Tokens", "Softmax + temperatura", "Embeddings + posición"];

const attentionWords = ["El", "banco", "cerró", "porque", "era", "feriado"];
const attentionWeights: Record<string, number[]> = {
  El: [1, .35, .08, .04, .03, .02], banco: [.12, 1, .32, .08, .1, .05],
  cerró: [.04, .46, 1, .22, .12, .18], porque: [.03, .09, .31, 1, .2, .34],
  era: [.04, .19, .23, .18, 1, .55], feriado: [.02, .12, .21, .18, .63, 1],
};

export default function Home() {
  const [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [temperature, setTemperature] = useState(0.8);
  const [tokenText, setTokenText] = useState("Los modelos de lenguaje aprenden regularidades.");
  const [focusWord, setFocusWord] = useState("banco");
  const [pipeline, setPipeline] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Record<string, string>>({});

  useEffect(() => {
    try { const saved = localStorage.getItem("cicada-propedeutico-progress"); if (saved) setDone(JSON.parse(saved)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem("cicada-propedeutico-progress", JSON.stringify(done)); }, [done, loaded]);

  const progress = Math.round((done.length / modules.length) * 100);
  const tokens = useMemo(() => {
    if (!tokenText) return [];
    return encode(tokenText).map((id) => ({ id, text: decode([id]).replaceAll(" ", "·").replaceAll("\n", "↵") }));
  }, [tokenText]);
  const temperatureDistribution = useMemo(() => {
    const scaled = nextTokens.map((token) => Math.exp(Math.log(token.p) / temperature));
    const total = scaled.reduce((sum, value) => sum + value, 0);
    return nextTokens.map((token, index) => ({ ...token, adjusted: scaled[index] / total }));
  }, [temperature]);
  const attentionDistribution = useMemo(() => {
    const weights = attentionWeights[focusWord];
    const total = weights.reduce((sum, value) => sum + value, 0);
    return weights.map((value) => value / total);
  }, [focusWord]);
  const toggleDone = (id: string) => setDone((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  const addPipeline = (item: string) => { if (!pipeline.includes(item)) setPipeline([...pipeline, item]); };
  const pipelineCorrect = pipeline.join("|") === pipelineStages.map((stage) => stage.label).join("|");

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Volver al inicio"><span className="brand-mark">C</span><span><strong>Escuela CICADA</strong><small>Propedéutico LLM</small></span></a>
        <nav aria-label="Navegación principal"><a href="#recorrido">Recorrido</a><a href="#glosario">Glosario</a><span className="progress-pill">{progress}% completo</span></nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Dos semanas · menos de cinco horas</p>
          <h1>Una llegada suave al mundo de los <em>LLMs</em></h1>
          <p className="lead">Este recorrido te dará un mapa básico para aprovechar mejor la Escuela. No necesitás programar ni dominar la matemática: alcanza con curiosidad y unos pocos ratos durante las dos semanas previas.</p>
          <div className="hero-actions"><a className="button primary" href="#m1">Comenzar el recorrido <span>↓</span></a><a className="button quiet" href="#recorrido">Ver cronograma</a></div>
          <p className="save-note">Tu avance se guarda automáticamente en este dispositivo.</p>
        </div>
        <div className="hero-map" aria-label="Mapa conceptual del curso"><div className="orbit orbit-one"><span>tokens</span></div><div className="orbit orbit-two"><span>atención</span></div><div className="orbit orbit-three"><span>vectores</span></div><div className="core">texto<small>→</small>texto</div></div>
      </section>

      <section className="common-ground">
        <p className="eyebrow">La meta</p><h2>No buscamos que implementes un transformer.</h2>
        <p>Al llegar a la Escuela, queremos que puedas seguir una conversación donde aparezcan palabras como <mark>token</mark>, <mark>embedding</mark>, <mark>atención</mark>, <mark>pretraining</mark> o <mark>alucinación</mark>, y que tengas una intuición razonable de cómo se conectan.</p>
      </section>

      <section className="schedule" id="recorrido">
        <div className="section-heading"><div><p className="eyebrow">Tu recorrido</p><h2>Seis momentos, a tu ritmo</h2></div><div className="progress-block"><div><span>Avance</span><strong>{done.length}/{modules.length}</strong></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div></div>
        <div className="schedule-grid">{modules.map((m, i) => <a className={`schedule-card ${done.includes(m.id) ? "is-done" : ""}`} href={`#${m.id}`} key={m.id}><span className="schedule-number">0{i + 1}</span><div><small>{m.week} · {m.day}</small><h3>{m.title}</h3><p>{m.summary}</p></div><span className="schedule-time">{m.time}</span></a>)}</div>
      </section>

      <ModuleShell module={modules[0]} done={done.includes("m1")} onDone={() => toggleDone("m1")}>
        <Prompt>Antes de mirar</Prompt><h3>Terminá mentalmente esta oración:</h3><blockquote>“Un modelo de lenguaje intenta predecir…”</blockquote>
        <Video id="LPZh9BOjkQs" title="Large Language Models explained briefly" />
        <Prompt>Probalo</Prompt>
        <div className="lab two-col"><div><h3>Una distribución, no una respuesta única</h3><p>Imaginá que el texto termina en: <strong>“El estudio analiza cómo funciona el…”</strong></p><label className="slider-label">Temperatura <strong>{temperature.toFixed(1)}</strong></label><input type="range" min="0.1" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} /><div className="temperature-scale"><span>más determinista</span><span>más diversa</span></div><p className="hint">Aplicamos la temperatura a los mismos puntajes y volvemos a normalizar con softmax. Las probabilidades siempre suman 100%.</p></div><div className="bars" aria-label="Probabilidades simuladas para el próximo token">{temperatureDistribution.map((t, i) => <div className="bar-row" key={t.word}><span>{t.word}</span><div><i style={{ width: `${t.adjusted * 100}%`, opacity: 1 - i * .1 }} /><strong>{(t.adjusted * 100).toFixed(t.adjusted < .005 ? 2 : 1)}%</strong></div></div>)}</div></div>
        <Takeaway>Un LLM asigna probabilidades a posibles continuaciones y genera texto repitiendo esa predicción token a token.</Takeaway>
      </ModuleShell>

      <ModuleShell module={modules[1]} done={done.includes("m2")} onDone={() => toggleDone("m2")}>
        <Prompt>Explorá</Prompt><div className="lab"><div className="lab-title-row"><div><h3>Antes de entrar al transformer, el texto se parte</h3><p>Este sí es un tokenizador BPE real: usa la codificación <strong>o200k_base de GPT-4o</strong>. Probá palabras frecuentes, largas, inventadas, con tildes o en otros idiomas.</p></div><span className="real-badge">Tokenización real</span></div><input className="text-input" value={tokenText} onChange={(e) => setTokenText(e.target.value)} aria-label="Texto para separar en tokens" /><div className="token-summary"><strong>{tokens.length}</strong> tokens <span>· representa un espacio inicial</span></div><div className="tokens" aria-live="polite">{tokens.map((token, i) => <span key={`${token.id}-${i}`} title={`ID ${token.id}`}><b>{token.text || "∅"}</b><small>#{token.id}</small></span>)}</div><p className="hint">La partición depende del vocabulario de cada modelo: otros LLMs pueden tokenizar el mismo texto de otra manera.</p></div>
        <Video id="wjZofJX0v4M" title="Transformers, the tech behind LLMs" />
        <div className="pause-card"><strong>Mientras mirás</strong><p>No intentes retener cada dimensión o número. Seguí tres transformaciones: texto → tokens; tokens → vectores; vectores → representaciones que cambian con el contexto.</p></div>
        <Takeaway>Los tokens se representan como vectores. Esas representaciones contienen relaciones aprendidas y se enriquecen con posición y contexto.</Takeaway>
      </ModuleShell>

      <ModuleShell module={modules[2]} done={done.includes("m3")} onDone={() => toggleDone("m3")}>
        <Prompt>Reconstruí el camino</Prompt><div className="lab"><h3>¿En qué orden viaja el texto?</h3><p>Seleccioná las siete etapas. Después podés abrir cada una para ver exactamente qué entra y qué sale.</p><div className="pipeline-options">{shuffledPipeline.map((x) => <button key={x} disabled={pipeline.includes(x)} onClick={() => addPipeline(x)}>{x}</button>)}</div><div className="pipeline-result">{pipeline.length ? pipeline.map((x, i) => <button className={activeStage === x ? "active" : ""} onClick={() => setActiveStage(x)} key={x}>{x}{i < pipeline.length - 1 && <b>→</b>}</button>) : <em>Tu secuencia aparecerá aquí</em>}</div>{pipeline.length === pipelineStages.length && <p className={pipelineCorrect ? "feedback good" : "feedback bad"}>{pipelineCorrect ? "Exacto: ahora abrí cada etapa para seguir la transformación." : "Todavía no. La secuencia empieza en el texto/contexto y termina al muestrear un token, agregarlo y repetir."}</p>}{activeStage && (() => { const stage = pipelineStages.find((item) => item.label === activeStage)!; return <div className="stage-detail"><span>{stage.label}</span><div><small>RECIBE</small><p>{stage.input}</p></div><b>→</b><div><small>PRODUCE</small><p>{stage.output}</p></div></div>; })()}<button className="text-button" onClick={() => { setPipeline([]); setActiveStage(null); }}>Reiniciar</button></div>
        <div className="concept-grid"><div><span>01</span><h3>Entrada</h3><p>El prompt y el texto ya generado forman el contexto.</p></div><div><span>02</span><h3>Transformación</h3><p>Atención y MLP modifican las representaciones.</p></div><div><span>03</span><h3>Salida</h3><p>Los logits se convierten en probabilidades y se elige otro token.</p></div></div>
        <Takeaway>El transformer no produce una respuesta completa de una vez: transforma el contexto, predice un token y vuelve a empezar.</Takeaway>
      </ModuleShell>

      <ModuleShell module={modules[3]} done={done.includes("m4")} onDone={() => toggleDone("m4")}>
        <Video id="eMlx5fFNoYc" title="Attention in transformers, step-by-step" />
        <div className="level-note"><strong>Dos niveles de lectura</strong><p><b>Imprescindible:</b> cada token recupera información relevante de otros tokens. <b>Para profundizar:</b> observá cómo queries y keys determinan cuánto pesa cada relación, y cómo values transportan la información.</p></div>
        <Prompt>Una intuición visual</Prompt><div className="lab attention-lab"><h3>Elegí un token para ver cómo distribuye su atención</h3><div className="sentence">{attentionWords.map((word) => <button className={focusWord === word ? "active" : ""} key={word} onClick={() => setFocusWord(word)}>{word}</button>)}</div><div className="attention-view"><div className="attention-query"><small>TOKEN QUE CONSULTA</small><strong>{focusWord}</strong><span>query</span></div><div className="attention-links" aria-live="polite">{attentionWords.map((word, index) => <div className={word === focusWord ? "self" : ""} key={word}><span>{word}</span><div><i style={{ width: `${attentionDistribution[index] * 100}%` }} /></div><strong>{(attentionDistribution[index] * 100).toFixed(1)}%</strong></div>)}</div></div><p className="attention-reading">La representación de <strong>{focusWord}</strong> combina información de todos estos tokens, en proporciones diferentes.</p><p className="hint">Ejemplo conceptual de una sola cabeza: los pesos están normalizados y suman 100%. En un transformer real conviven muchas cabezas y capas con patrones distintos.</p></div>
        <Takeaway>La atención permite que la representación de cada token incorpore información de otros tokens relevantes para el contexto.</Takeaway>
      </ModuleShell>

      <ModuleShell module={modules[4]} done={done.includes("m5")} onDone={() => toggleDone("m5")} optional>
        <Video id="9-Jl0dxWQs8" title="How might LLMs store facts" />
        <Prompt>Desarmá dos intuiciones</Prompt><div className="myth-grid"><div><span>✕</span><h3>“Es una base de datos”</h3><p>El modelo no busca una ficha textual con cada hecho. El conocimiento modifica patrones de activación y pesos.</p></div><div><span>✕</span><h3>“Una neurona, un concepto”</h3><p>Las representaciones suelen estar distribuidas, aunque algunas unidades o direcciones puedan ser muy selectivas.</p></div></div>
        <Takeaway>Parte del conocimiento puede estar codificada en las capas MLP, pero de forma distribuida y dependiente del contexto.</Takeaway>
      </ModuleShell>

      <ModuleShell module={modules[5]} done={done.includes("m6")} onDone={() => toggleDone("m6")}>
        <Prompt>Uní las piezas</Prompt><div className="compare-grid"><div><small>Durante el entrenamiento</small><h3>Aprender los parámetros</h3><p>El modelo ve enormes cantidades de texto, predice, mide su error y ajusta sus pesos. Esto se repite muchas veces.</p></div><div><small>Durante la inferencia</small><h3>Usar los parámetros</h3><p>El modelo recibe tu prompt, calcula probabilidades y genera tokens. Normalmente no modifica sus pesos.</p></div></div>
        <div className="quiz"><h3>Chequeo final</h3><QuizQuestion id="q1" value={quiz.q1} setQuiz={setQuiz} question="¿Qué produce directamente un LLM en cada paso?" options={["Una oración completa", "Probabilidades para el próximo token", "Una búsqueda en internet"]} correct="Probabilidades para el próximo token" /><QuizQuestion id="q2" value={quiz.q2} setQuiz={setQuiz} question="¿Qué hace que la representación de ‘banco’ dependa de su contexto?" options={["La atención", "El tamaño de la pantalla", "La temperatura por sí sola"]} correct="La atención" /><QuizQuestion id="q3" value={quiz.q3} setQuiz={setQuiz} question="Si un modelo responde con seguridad algo falso…" options={["Su base de datos está vacía", "Es necesariamente un error de conexión", "Puede estar generando una continuación plausible pero incorrecta"]} correct="Puede estar generando una continuación plausible pero incorrecta" /></div>
        <Takeaway>Llegás con el mapa necesario. Durante la Escuela vamos a abrir cada una de estas cajas y conectarlas con preguntas, datos y aplicaciones reales.</Takeaway>
      </ModuleShell>

      <section className="glossary" id="glosario"><div className="section-heading"><div><p className="eyebrow">Para volver cuando quieras</p><h2>Glosario mínimo</h2></div></div><dl><div><dt>Token</dt><dd>Unidad de texto que el modelo procesa: puede ser una palabra, parte de una palabra o un signo.</dd></div><div><dt>Embedding</dt><dd>Vector numérico que representa un token u otra unidad en un espacio aprendido.</dd></div><div><dt>Atención</dt><dd>Mecanismo que combina información de distintos tokens según su relevancia contextual.</dd></div><div><dt>Parámetro</dt><dd>Valor numérico ajustado durante el entrenamiento que contribuye al comportamiento del modelo.</dd></div><div><dt>Pretraining</dt><dd>Entrenamiento inicial, generalmente mediante predicción sobre grandes colecciones de texto.</dd></div><div><dt>Inferencia</dt><dd>Uso del modelo ya entrenado para producir predicciones o generar una respuesta.</dd></div><div><dt>Temperatura</dt><dd>Control sobre cuán concentrado o diverso es el muestreo de la siguiente salida.</dd></div><div><dt>Alucinación</dt><dd>Generación de contenido plausible en su forma, pero incorrecto o no sustentado.</dd></div></dl></section>
      <footer><div><span className="brand-mark">C</span><p><strong>Escuela CICADA</strong><br />Propedéutico sobre modelos de lenguaje</p></div><a href="#inicio">Volver arriba ↑</a></footer>
    </main>
  );
}

function ModuleShell({ module, done, onDone, optional = false, children }: { module: Module; done: boolean; onDone: () => void; optional?: boolean; children: React.ReactNode }) {
  return <section className="module" id={module.id}><div className="module-header"><div><p className="eyebrow">{module.week} · {module.day} · {module.time}</p><h2>{module.title}</h2><p>{module.summary}</p></div>{optional && <span className="optional">Profundización</span>}</div><div className="module-body">{children}</div><button className={`complete-button ${done ? "checked" : ""}`} onClick={onDone}><span>{done ? "✓" : ""}</span>{done ? "Módulo completado" : "Marcar como completado"}</button></section>;
}

function Video({ id, title }: { id: string; title: string }) { return <div className="video-block"><div className="video-label"><span>▶</span><div><small>Video central</small><strong>{title}</strong></div></div><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">Abrir en YouTube ↗</a></div>; }
function Prompt({ children }: { children: React.ReactNode }) { return <p className="prompt">{children}</p>; }
function Takeaway({ children }: { children: React.ReactNode }) { return <div className="takeaway"><span>Idea para llevarte</span><p>{children}</p></div>; }
function QuizQuestion({ id, value, setQuiz, question, options, correct }: { id: string; value?: string; setQuiz: React.Dispatch<React.SetStateAction<Record<string, string>>>; question: string; options: string[]; correct: string }) { return <fieldset><legend>{question}</legend><div>{options.map((o) => <label key={o} className={value === o ? "selected" : ""}><input type="radio" name={id} value={o} checked={value === o} onChange={() => setQuiz((q) => ({ ...q, [id]: o }))} />{o}</label>)}</div>{value && <p className={`feedback ${value === correct ? "good" : "bad"}`}>{value === correct ? "Bien. Esa es la idea central." : "No exactamente. Volvé al mapa del módulo y probá otra vez."}</p>}</fieldset>; }
