import { useMemo, useState } from "react";
import { questions, getProfile } from "./questions";

type Step = "intro" | "quiz" | "email" | "result";

const WHATSAPP = "https://wa.link/8ptn4f";
const CALENDLY = "https://calendly.com/sanamenteconsulta/15min";

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sending, setSending] = useState(false);

  const score = useMemo(() => answers.reduce((a, b) => a + b, 0), [answers]);
  const profile = useMemo(() => getProfile(score), [score]);
  const progress = (current / questions.length) * 100;

  function selectAnswer(value: number) {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        setStep("email");
      }
    }, 220);
  }

  function restart() {
    setStep("intro");
    setCurrent(0);
    setAnswers([]);
    setName("");
    setEmail("");
  }

  // ✅ FUNCIÓN CORREGIDA E INTEGRADA CON RESEND Y MAILERLITE
  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setSending(true);

    try {
      // 1. Guardamos en MailerLite de fondo
      fetch('/api/mailerlite-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(),
          name: name.trim()
        })
      }).catch(err => console.log("Error silencioso Mailerlite:", err));

      // 2. Enviamos el correo de Resend inmediatamente
      const resendResponse = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          score: score,
          profileTitle: profile.title,
          profileDescription: profile.description,
          profileInvitation: profile.invitation
        })
      });

      if (!resendResponse.ok) {
        throw new Error("No se pudo enviar el correo de resultados");
      }

      setStep("result");

    } catch (error) {
      console.log("Error general:", error);
      setEmailError("Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3ece1]">
      <BackgroundDecor />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        <Header />
        <main className="flex flex-1 items-center justify-center py-6">
          {step === "intro" && <Intro onStart={() => setStep("quiz")} />}
          {step === "quiz" && (
            <Quiz
              index={current}
              total={questions.length}
              progress={progress}
              question={questions[current]}
              selected={answers[current]}
              onSelect={selectAnswer}
              onBack={() => current > 0 && setCurrent(current - 1)}
            />
          )}
          {step === "email" && (
            <EmailGate
              name={name}
              email={email}
              error={emailError}
              sending={sending}
              setName={setName}
              setEmail={setEmail}
              onSubmit={submitEmail}
            />
          )}
          {step === "result" && (
            <Result
              name={name}
              score={score}
              profile={profile}
              onRestart={restart}
            />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function BrainLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 170 C90 160, 80 150, 75 135 C60 100, 55 80, 60 60 C65 40, 80 25, 100 25 C120 25, 135 40, 140 60 C145 80, 140 100, 125 135 C120 150, 110 160, 100 170Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 130 C90 115, 95 100, 100 85 C105 70, 100 55, 95 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M115 130 C110 115, 105 100, 100 85 C95 70, 100 55, 105 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M70 80 C80 75, 85 65, 85 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M130 80 C120 75, 115 65, 115 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 110 C85 105, 90 95, 92 85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M122 110 C115 105, 110 95, 108 85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="75" cy="55" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="90" cy="38" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="110" cy="38" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="125" cy="55" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="65" cy="72" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="135" cy="72" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="72" cy="95" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="128" cy="95" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="80" cy="120" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#e7d3c2] opacity-50 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#d9b9a4] opacity-30 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#ede0cf] opacity-60 blur-3xl" />
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-[#3a2f28]">
          <BrainLogo className="h-8 w-8" />
        </div>
        <div>
          <span className="block text-sm font-medium tracking-wide text-[#3a2f28]">
            Sana<span className="font-semibold">Mente</span> Consulta
          </span>
          <span className="block text-[10px] tracking-wider text-[#8a7868]">@asesoramientopsi</span>
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <span className="block text-[11px] uppercase tracking-[0.25em] text-[#8a7868]">Lic. Psi. Camila Pizzani</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-8 text-center">
      <div className="mb-2 flex items-center justify-center gap-2 text-[#8a7868]">
        <BrainLogo className="h-5 w-5" />
      </div>
      <p className="text-[11px] tracking-wider text-[#9b8b7c]">Lic. Psi. Camila Pizzani · @asesoramientopsi</p>
      <p className="mt-1 text-[10px] italic text-[#b8a896]">"Descubrí cuánto te querés de verdad"</p>
    </footer>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full">
      <div className="rounded-[28px] border border-[#e6d6c3] bg-white/70 p-8 shadow-[0_30px_80px_-30px_rgba(120,80,50,0.25)] backdrop-blur-sm sm:p-14">
        <div className="mb-8 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3a2f28] text-[#e6d6c3]">
            <BrainLogo className="h-7 w-7" />
          </span>
          <div>
            <span className="block text-sm font-medium text-[#3a2f28]">Sana<span className="font-semibold">Mente</span> Consulta</span>
            <span className="block text-[10px] uppercase tracking-[0.35em] text-[#b07560]">Test gratuito · Resultado instantáneo</span>
          </div>
        </div>
        <h1 className="font-serif text-4xl leading-[1.05] text-[#3a2f28] sm:text-6xl">
          ¿Cómo está tu<br /><span className="italic text-[#b07560]">autoestima</span> hoy?
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#6b5d52] sm:text-lg">
          Un test diagnóstico corto que te entrega tu <span className="font-medium text-[#3a2f28]">perfil de autoestima</span> con un resultado personalizado y una invitación para tu próximo paso de bienestar emocional.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {["10 preguntas validadas clínicamente", "3 perfiles de resultado personalizados", "Resultado con ejercicios prácticos", "Invitación a tu próximo paso"].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#5a4d43]">
              <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#c98e7a]" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button onClick={onStart} className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#3a2f28] px-8 py-4 text-sm font-medium tracking-wide text-[#f9f4ec] transition hover:bg-[#b07560]">
            Empezar el test<span className="transition group-hover:translate-x-1">→</span>
          </button>
          <p className="text-xs text-[#8a7868]">Tarda menos de 3 minutos · 100% gratuito</p>
        </div>
        <div className="mt-8 flex items-center gap-3 border-t border-[#e6d6c3] pt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e2cf] text-xs text-[#b07560]">🎁</div>
          <p className="text-xs leading-relaxed text-[#8a7868]">
            <span className="font-medium text-[#6b5d52]">Regalo de bienvenida</span> — Al finalizar recibís tu perfil detallado con ejercicios para empezar hoy mismo.
          </p>
        </div>
      </div>
    </div>
  );
}

function Quiz({ index, total, progress, question, selected, onSelect, onBack }: { index: number; total: number; progress: number; question: (typeof questions)[number]; selected: number | undefined; onSelect: (v: number) => void; onBack: () => void; }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-[#8a7868]">
          <span>Pregunta {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <span>{Math.round(progress + 100 / total)}%</span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#e6d6c3]">
          <div className="h-full bg-gradient-to-r from-[#c98e7a] to-[#b07560] transition-all duration-500" style={{ width: `${progress + 100 / total}%` }} />
        </div>
      </div>
      <div key={question.id} className="rounded-[28px] border border-[#e6d6c3] bg-white/75 p-8 shadow-[0_30px_80px_-30px_rgba(120,80,50,0.25)] backdrop-blur-sm sm:p-12">
        <h2 className="font-serif text-2xl leading-snug text-[#3a2f28] sm:text-4xl">{question.text}</h2>
        <div className="mt-8 space-y-3">
          {question.options.map((opt, i) => {
            const isSelected = selected === opt.value;
            return (
              <button key={i} onClick={() => onSelect(opt.value)} className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${isSelected ? "border-[#b07560] bg-[#f1e2cf] shadow-sm" : "border-[#e6d6c3] bg-white/60 hover:border-[#c98e7a] hover:bg-[#faf2e6]"}`}>
                <div className="flex items-center gap-4">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium tracking-wider transition ${isSelected ? "border-[#b07560] bg-[#b07560] text-white" : "border-[#c9b9a8] text-[#8a7868] group-hover:border-[#b07560] group-hover:text-[#b07560]"}`}>{String.fromCharCode(65 + i)}</span>
                  <span className="text-[15px] text-[#3a2f28] sm:text-base">{opt.label}</span>
                </div>
                <span className={`text-[#b07560] transition ${isSelected ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>→</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <button onClick={onBack} disabled={index === 0} className="text-xs uppercase tracking-[0.25em] text-[#8a7868] transition hover:text-[#3a2f28] disabled:cursor-not-allowed disabled:opacity-30">← Anterior</button>
          <span className="text-xs italic text-[#9b8b7c]">Elegí la opción que más resuene hoy</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-[#b8a896]">
        <BrainLogo className="h-3.5 w-3.5" />
        <span className="text-[10px] tracking-wider">SanaMente Consulta</span>
      </div>
    </div>
  );
}

function EmailGate({ name, email, error, sending, setName, setEmail, onSubmit }: { name: string; email: string; error: string; sending: boolean; setName: (s: string) => void; setEmail: (s: string) => void; onSubmit: (e: React.FormEvent) => void; }) {
  return (
    <div className="w-full">
      <div className="rounded-[28px] border border-[#e6d6c3] bg-white/75 p-8 shadow-[0_30px_80px_-30px_rgba(120,80,50,0.25)] backdrop-blur-sm sm:p-14">
        <div className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#b07560]">Último paso · Casi ahí</div>
        <h2 className="font-serif text-3xl leading-[1.1] text-[#3a2f28] sm:text-5xl">Tu resultado está<br /><span className="italic text-[#b07560]">listo para vos</span></h2>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#6b5d52]">Dejame tu nombre y tu mejor email. Te muestro tu perfil ahora mismo y te envío el PDF completo con ejercicios para llevarte.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[#8a7868]">Tu nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como te gusta que te llamen" className="w-full rounded-2xl border border-[#e6d6c3] bg-white/80 px-5 py-4 text-[15px] text-[#3a2f28] placeholder-[#b8a896] outline-none transition focus:border-[#b07560] focus:bg-white" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[#8a7868]">Tu email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" className="w-full rounded-2xl border border-[#e6d6c3] bg-white/80 px-5 py-4 text-[15px] text-[#3a2f28] placeholder-[#b8a896] outline-none transition focus:border-[#b07560] focus:bg-white" />
          </div>
          {error && <p className="text-sm text-[#b04a3a]">{error}</p>}
          <button type="submit" disabled={sending} className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#3a2f28] px-8 py-4 text-sm font-medium tracking-wide text-[#f9f4ec] transition hover:bg-[#b07560] disabled:opacity-70 sm:w-auto">
            {sending ? "Guardando..." : "Ver mi resultado"}
            {!sending && <span className="transition group-hover:translate-x-1">→</span>}
          </button>
          <p className="pt-2 text-[11px] text-[#9b8b7c]">🔒 Cuido tu información como cuido a mis pacientes. Cero spam.</p>
        </form>
        <div className="mt-6 flex items-center gap-3 border-t border-[#e6d6c3] pt-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3a2f28] text-[#e6d6c3]"><BrainLogo className="h-4 w-4" /></div>
          <div>
            <p className="text-xs font-medium text-[#3a2f28]">Lic. Psi. Camila Pizzani</p>
            <p className="text-[10px] text-[#8a7868]">@asesoramientopsi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Result({ name, score, profile, onRestart }: { name: string; score: number; profile: ReturnType<typeof getProfile>; onRestart: () => void; }) {
  const max = 40;
  const percent = Math.round((score / max) * 100);
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[28px] border border-[#e6d6c3] bg-white/80 shadow-[0_30px_80px_-30px_rgba(120,80,50,0.3)] backdrop-blur-sm">
        <div className="border-b border-[#ecdcc8] bg-gradient-to-br from-[#f7ead9] to-[#efddc6] p-8 sm:p-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#b07560]">{profile.subtitle}</div>
            <div className="flex items-center gap-2 text-[#8a7868]"><BrainLogo className="h-4 w-4" /><span className="text-[10px] tracking-wider">SanaMente</span></div>
          </div>
          <h2 className="font-serif text-3xl leading-[1.1] text-[#3a2f28] sm:text-5xl">{name ? `${name}, ` : ""}<span className="italic">{profile.title.toLowerCase()}</span></h2>
          <div className="mt-8 max-w-md">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a7868]">Tu puntaje</span>
              <span className="font-serif text-2xl text-[#b07560]">{score}<span className="text-base text-[#9b8b7c]">/{max}</span></span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
              <div className="h-full bg-gradient-to-r from-[#c98e7a] to-[#b07560] transition-all duration-1000" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
        <div className="p-8 sm:p-12">
          <p className="text-[15px] leading-relaxed text-[#5a4d43] sm:text-base">{profile.description}</p>
          <div className="mt-8">
            <h3 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#8a7868]">Lo que tu test refleja</h3>
            <ul className="space-y-3">
              {profile.insights.map((i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl bg-[#f9f1e4] px-5 py-3 text-sm text-[#3a2f28]">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#b07560]" />{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 rounded-2xl border border-dashed border-[#d9c2a8] bg-[#fbf5ec] p-6">
            <div className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#b07560]">Tu siguiente paso</div>
            <p className="font-serif text-xl italic text-[#3a2f28] sm:text-2xl">{profile.invitation}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-medium tracking-wide text-white transition hover:bg-[#1ebc57]">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Escribime por WhatsApp
            </a>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border-2 border-[#006BFF] bg-transparent px-6 py-4 text-sm font-medium tracking-wide text-[#006BFF] transition hover:bg-[#006BFF] hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Agendar Cita
            </a>
          </div>
          <div className="mt-8 rounded-2xl border border-[#e6d6c3] bg-[#f9f4ec] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a2f28] text-[#e6d6c3]"><BrainLogo className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-medium text-[#3a2f28]">Lic. Psi. Camila Pizzani</p>
                <p className="text-[11px] text-[#8a7868]">@asesoramientopsi · SanaMente Consulta</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#6b5d52]">Este test es una herramienta orientativa y no reemplaza una evaluación profesional. Si sentís que necesitás acompañamiento, escribime por WhatsApp o agendá una cita conmigo.</p>
          </div>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-[#ecdcc8] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs italic text-[#9b8b7c]">📩 Revisá tu email, te envié una copia de tu resultado.</p>
            <button onClick={onRestart} className="text-xs uppercase tracking-[0.25em] text-[#8a7868] transition hover:text-[#b07560]">↺ Hacer el test de nuevo</button>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-[#e6d6c3] bg-white/60 p-5 text-center backdrop-blur-sm">
        <p className="text-xs tracking-wider text-[#6b5d52]">¿Conocés a alguien que necesite escuchar esto hoy? <a href="https://www.instagram.com/asesoramientopsi/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#b07560] underline-offset-4 hover:underline">Compartir el test →</a></p>
      </div>
    </div>
  );
}
