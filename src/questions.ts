export type Question = {
  id: number;
  text: string;
  options: { label: string; value: number }[];
};

// Test inspirado en escalas validadas (Rosenberg + autocompasión)
// Puntuación: 0 = bajo, 4 = alto. Total max: 40
export const questions: Question[] = [
  {
    id: 1,
    text: "Cuando me miro al espejo por la mañana, lo primero que siento es…",
    options: [
      { label: "Aceptación tranquila, me reconozco", value: 4 },
      { label: "Neutralidad, no le doy importancia", value: 3 },
      { label: "Crítica leve por algún detalle", value: 1 },
      { label: "Rechazo o incomodidad", value: 0 },
    ],
  },
  {
    id: 2,
    text: "Cuando cometo un error, mi diálogo interno suele ser…",
    options: [
      { label: "Comprensivo, como le hablaría a una amiga", value: 4 },
      { label: "Racional, intento aprender de eso", value: 3 },
      { label: "Algo duro, me cuesta soltarlo", value: 1 },
      { label: "Muy crítico, me castigo durante días", value: 0 },
    ],
  },
  {
    id: 3,
    text: "Cuando alguien me hace un cumplido sincero…",
    options: [
      { label: "Lo recibo con gratitud y lo creo", value: 4 },
      { label: "Lo agradezco aunque me cueste creerlo", value: 2 },
      { label: "Lo minimizo o lo desvío", value: 1 },
      { label: "Pienso que no lo merezco", value: 0 },
    ],
  },
  {
    id: 4,
    text: "Frente a una oportunidad nueva (trabajo, vínculo, proyecto)…",
    options: [
      { label: "Me animo aunque tenga miedo", value: 4 },
      { label: "Lo pienso mucho pero suelo intentarlo", value: 3 },
      { label: "Dudo y muchas veces me echo atrás", value: 1 },
      { label: "Suelo creer que no estoy a la altura", value: 0 },
    ],
  },
  {
    id: 5,
    text: "En mis vínculos cercanos, suelo…",
    options: [
      { label: "Poner límites con claridad y sin culpa", value: 4 },
      { label: "Poner límites, aunque después dudo", value: 2 },
      { label: "Costarme decir que no", value: 1 },
      { label: "Priorizar al otro casi siempre", value: 0 },
    ],
  },
  {
    id: 6,
    text: "Cuando estoy a solas conmigo misma…",
    options: [
      { label: "Disfruto mi compañía", value: 4 },
      { label: "Estoy bien, aunque a veces me aburro", value: 3 },
      { label: "Necesito distraerme rápido", value: 1 },
      { label: "Me invade ansiedad o tristeza", value: 0 },
    ],
  },
  {
    id: 7,
    text: "Mi cuerpo, hoy, lo siento…",
    options: [
      { label: "Como un hogar al que cuido", value: 4 },
      { label: "Con altibajos, pero con respeto", value: 3 },
      { label: "Como algo a corregir o mejorar", value: 1 },
      { label: "Como un enemigo o una carga", value: 0 },
    ],
  },
  {
    id: 8,
    text: "Cuando me comparo con otras personas en redes…",
    options: [
      { label: "Casi no me afecta, sigo en lo mío", value: 4 },
      { label: "A veces me inspira, a veces me incomoda", value: 2 },
      { label: "Me siento atrasada o insuficiente", value: 1 },
      { label: "Me genera angustia y autocrítica", value: 0 },
    ],
  },
  {
    id: 9,
    text: "Si pienso en pedir ayuda (terapia, médico, alguien cercano)…",
    options: [
      { label: "Lo hago sin culpa, es cuidarme", value: 4 },
      { label: "Lo hago, aunque me cueste un poco", value: 3 },
      { label: "Lo postergo o lo evito", value: 1 },
      { label: "Siento que debería poder sola", value: 0 },
    ],
  },
  {
    id: 10,
    text: "En una frase: hoy siento que…",
    options: [
      { label: "Soy suficiente tal como soy", value: 4 },
      { label: "Estoy en camino, me animo", value: 3 },
      { label: "Me falta mucho todavía", value: 1 },
      { label: "No sé bien quién soy", value: 0 },
    ],
  },
];

export type ProfileKey = "florecer" | "construir" | "reencontrar";

export type Profile = {
  key: ProfileKey;
  range: [number, number];
  title: string;
  subtitle: string;
  description: string;
  insights: string[];
  invitation: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export const profiles: Profile[] = [
  {
    key: "reencontrar",
    range: [0, 15],
    title: "Tu autoestima está pidiendo ser escuchada",
    subtitle: "Perfil: Reencontrarte",
    description:
      "Hoy tu voz interior está siendo más dura de lo que merecés. No es debilidad: es una señal clara de que algo dentro tuyo necesita atención, ternura y un acompañamiento real. Lo bueno: este es exactamente el lugar desde donde empiezan los cambios más profundos.",
    insights: [
      "Tendés a postergarte y a poner al otro primero.",
      "Tu diálogo interno suele ser crítico y exigente.",
      "Te cuesta recibir, pedir ayuda o poner límites.",
    ],
    invitation:
      "Te invito a empezar por algo simple: un espacio de consulta donde podamos mirar juntas qué heridas están sosteniendo esa voz crítica.",
    ctaPrimary: "Quiero agendar una primera consulta",
    ctaSecondary: "Descargar la guía gratuita",
  },
  {
    key: "construir",
    range: [16, 29],
    title: "Estás en plena construcción",
    subtitle: "Perfil: Construirte",
    description:
      "Tenés conciencia, herramientas y voluntad. A veces te animás, a veces te frenás. Estás en ese momento hermoso (e incómodo) donde sabés lo que querés, pero todavía hay partes tuyas que dudan. Es el momento perfecto para pasar de la teoría a la práctica.",
    insights: [
      "Sabés lo que necesitás, pero te cuesta sostenerlo.",
      "Tu autoestima sube y baja según el contexto.",
      "Tenés la base, te falta la práctica diaria.",
    ],
    invitation:
      "Tu próximo paso ideal es la guía 'Querete de verdad': 30 días de ejercicios para volver tu autoestima un hábito, no una excepción.",
    ctaPrimary: "Quiero la guía de 30 días",
    ctaSecondary: "Agendar consulta personalizada",
  },
  {
    key: "florecer",
    range: [30, 40],
    title: "Estás floreciendo",
    subtitle: "Perfil: Florecer",
    description:
      "Tu autoestima hoy tiene raíces firmes. No significa que no tengas días grises (todas los tenemos), pero significa que volvés a vos con más facilidad. Desde acá, lo que sigue no es 'arreglar' nada: es profundizar, expandir y sostener lo que ya construiste.",
    insights: [
      "Tenés un diálogo interno mayoritariamente amable.",
      "Sabés poner límites y recibir cuidado.",
      "Tu identidad no depende de la mirada del otro.",
    ],
    invitation:
      "Para vos, el espacio ideal es el programa premium: un acompañamiento profundo para sostener este lugar y expandirlo a vínculos, trabajo y proyectos.",
    ctaPrimary: "Conocer el programa premium",
    ctaSecondary: "Descargar la guía gratuita",
  },
];

export function getProfile(score: number): Profile {
  return (
    profiles.find((p) => score >= p.range[0] && score <= p.range[1]) ??
    profiles[1]
  );
}
