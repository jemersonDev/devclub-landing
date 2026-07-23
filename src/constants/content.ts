export interface ValuePillar {
  id: string;
  index: string;
  title: string;
  description: string;
  /** lucide-react icon name for the About section cards */
  icon: "Code2" | "Users" | "Target" | "LifeBuoy";
}

export const ABOUT_PILLARS: ValuePillar[] = [
  {
    id: "pratica",
    index: "01",
    title: "Aprender fazendo",
    icon: "Code2",
    description:
      "Você não assiste alguém programar. Você escreve o código, quebra, conserta e entende o porquê — desde a primeira aula.",
  },
  {
    id: "comunidade",
    index: "02",
    title: "Nunca sozinho",
    icon: "Users",
    description:
      "Uma comunidade ativa de milhares de devs trocando dúvidas, código e oportunidades todos os dias, 24 horas por dia.",
  },
  {
    id: "mercado",
    index: "03",
    title: "Foco no emprego",
    icon: "Target",
    description:
      "Cada módulo existe porque alguma empresa contrata por causa dele. Sem enrolação, sem conteúdo que não vira vaga.",
  },
  {
    id: "suporte",
    index: "04",
    title: "Suporte de verdade",
    icon: "LifeBuoy",
    description:
      "Mentoria com quem já foi júnior, já apanhou de bug em produção e sabe exatamente onde você vai travar.",
  },
];

export type CourseLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface CourseModule {
  id: string;
  title: string;
  category: string;
  description: string;
  level: CourseLevel;
  hours: number;
  modules: number;
  students: number;
  rating: number;
  cover: [string, string];
  image: string;
  /** what the track covers — shown in the detail modal */
  highlights: string[];
  icon:
    | "Layers"
    | "Rocket"
    | "Server"
    | "Palette"
    | "Zap"
    | "BrainCircuit"
    | "Cloud"
    | "Boxes";
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "full-stack-pro",
    title: "Full Stack PRO",
    category: "Formação completa",
    description:
      "Domine front-end e back-end e entregue produtos completos, do protótipo ao deploy.",
    level: "Avançado",
    hours: 92,
    modules: 14,
    students: 15240,
    rating: 5.0,
    cover: ["#38BDF8", "#8B5CF6"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=900&auto=format&fit=crop",
    icon: "Layers",
    highlights: [
      "Fundamentos sólidos de HTML, CSS e JavaScript moderno",
      "React, Next.js e construção de interfaces reais",
      "APIs REST, autenticação e banco de dados",
      "Deploy, CI/CD e boas práticas de produção",
    ],
  },
  {
    id: "projeto-dev",
    title: "Projeto Dev",
    category: "Prática guiada",
    description:
      "Aprenda construindo projetos reais que viram portfólio e experiência de verdade.",
    level: "Intermediário",
    hours: 48,
    modules: 9,
    students: 9870,
    rating: 4.8,
    cover: ["#06B6D4", "#38BDF8"],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=900&auto=format&fit=crop",
    icon: "Rocket",
    highlights: [
      "Projetos guiados do zero ao deploy",
      "Versionamento com Git e trabalho em equipe",
      "Clones de apps reais para o portfólio",
      "Code review e refatoração na prática",
    ],
  },
  {
    id: "backend-expert",
    title: "Backend Expert",
    category: "Servidores e APIs",
    description:
      "Projete APIs escaláveis, bancos de dados e arquiteturas que aguentam produção.",
    level: "Avançado",
    hours: 64,
    modules: 11,
    students: 7430,
    rating: 4.9,
    cover: ["#8B5CF6", "#06B6D4"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop",
    icon: "Server",
    highlights: [
      "Arquitetura de APIs escaláveis",
      "Bancos relacionais e não-relacionais",
      "Cache, filas e mensageria",
      "Testes automatizados e observabilidade",
    ],
  },
  {
    id: "frontend-elite",
    title: "Front-end Elite",
    category: "Interfaces modernas",
    description:
      "Interfaces rápidas, acessíveis e animadas com o padrão que o mercado exige hoje.",
    level: "Intermediário",
    hours: 52,
    modules: 10,
    students: 11260,
    rating: 4.9,
    cover: ["#38BDF8", "#06B6D4"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop",
    icon: "Palette",
    highlights: [
      "Componentização e design systems",
      "Performance e Core Web Vitals",
      "Acessibilidade e semântica",
      "Animações e microinterações fluidas",
    ],
  },
  {
    id: "react-performance",
    title: "React Performance",
    category: "Otimização",
    description:
      "Renderize menos, entregue mais: profiling, memoização e Core Web Vitals na prática.",
    level: "Avançado",
    hours: 36,
    modules: 7,
    students: 6480,
    rating: 4.9,
    cover: ["#06B6D4", "#8B5CF6"],
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=900&auto=format&fit=crop",
    icon: "Zap",
    highlights: [
      "Profiling e detecção de gargalos",
      "Memoização e renderização eficiente",
      "Code splitting e lazy loading",
      "Otimização de Core Web Vitals",
    ],
  },
  {
    id: "ia-para-devs",
    title: "IA para Desenvolvedores",
    category: "Inteligência artificial",
    description:
      "Integre modelos de IA nos seus apps e construa produtos inteligentes de verdade.",
    level: "Intermediário",
    hours: 40,
    modules: 7,
    students: 6120,
    rating: 4.8,
    cover: ["#8B5CF6", "#38BDF8"],
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=900&auto=format&fit=crop",
    icon: "BrainCircuit",
    highlights: [
      "Integração de LLMs em aplicações",
      "Embeddings e busca semântica",
      "Prompt engineering aplicado",
      "Construção de produtos com IA",
    ],
  },
  {
    id: "devops-pro",
    title: "DevOps PRO",
    category: "Infraestrutura",
    description:
      "Automatize deploys, monitore sistemas e domine a infraestrutura na nuvem.",
    level: "Avançado",
    hours: 44,
    modules: 8,
    students: 5380,
    rating: 4.9,
    cover: ["#38BDF8", "#8B5CF6"],
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=900&auto=format&fit=crop",
    icon: "Cloud",
    highlights: [
      "Containers com Docker",
      "Pipelines de CI/CD",
      "Infraestrutura na nuvem",
      "Monitoramento e logs",
    ],
  },
  {
    id: "arquitetura-software",
    title: "Arquitetura de Software",
    category: "Engenharia sênior",
    description:
      "Padrões, trade-offs e decisões técnicas que separam o júnior do engenheiro sênior.",
    level: "Avançado",
    hours: 58,
    modules: 10,
    students: 4920,
    rating: 5.0,
    cover: ["#06B6D4", "#38BDF8"],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop",
    icon: "Boxes",
    highlights: [
      "Padrões de projeto e SOLID",
      "Trade-offs de arquitetura",
      "Escalabilidade e resiliência",
      "Decisões técnicas de nível sênior",
    ],
  },
];

export interface HiringCompany {
  id: string;
  name: string;
  sector: string;
}

export const HIRING_COMPANIES: HiringCompany[] = [
  { id: "nubank", name: "Nubank", sector: "Fintech" },
  { id: "ifood", name: "iFood", sector: "Foodtech" },
  { id: "stone", name: "Stone", sector: "Pagamentos" },
  { id: "totvs", name: "TOTVS", sector: "Software" },
  { id: "magalu", name: "Magalu", sector: "Varejo" },
  { id: "vtex", name: "VTEX", sector: "E-commerce" },
  { id: "ci&t", name: "CI&T", sector: "Consultoria" },
  { id: "creditas", name: "Creditas", sector: "Fintech" },
  { id: "quintoandar", name: "QuintoAndar", sector: "Proptech" },
];

export interface ResultStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const RESULT_STATS: ResultStat[] = [
  { id: "alunos", value: 48000, suffix: "+", label: "alunos formados" },
  { id: "empregabilidade", value: 87, suffix: "%", label: "empregabilidade em 12 meses" },
  { id: "salario", value: 3200, suffix: "", label: "salário médio inicial (R$)" },
  { id: "avaliacao", value: 4.9, suffix: "/5", label: "avaliação média dos alunos" },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  /** YouTube video id for the embedded player */
  youtubeId: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "video-1",
    name: "Rodolfo Mori",
    role: "Fundador do DevClub",
    company: "DevClub",
    quote:
      "Da manutenção elétrica a desenvolvedor sênior — a mesma jornada que o DevClub ajuda milhares de alunos a percorrer.",
    youtubeId: "ogp2xwonO6M",
  },
  {
    id: "video-2",
    name: "DevClub no YouTube",
    role: "Conteúdo de programação",
    company: "DevClub",
    quote:
      "Aulas, lives e bastidores de quem já colocou mais de 25 mil alunos no mercado de tecnologia.",
    youtubeId: "hHcaVgoLLQM",
  },
  {
    id: "video-3",
    name: "DevClub no YouTube",
    role: "Carreira em tecnologia",
    company: "DevClub",
    quote:
      "O passo a passo real de quem transforma iniciantes em desenvolvedores que o mercado disputa.",
    youtubeId: "gc7y-wXJvkU",
  },
];

export interface Mentor {
  id: string;
  name: string;
  role: string;
  focus: string;
  /** two-color gradient for the poster-style card */
  cover: [string, string];
  /** portrait photo (falls back to initials if it fails to load) */
  photo: string;
  /** access-until date shown on hover (DevClub-style) */
  accessUntil: string;
}

export const MENTORS: Mentor[] = [
  {
    id: "bruno",
    name: "Bruno Ferreira",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    role: "Head de Front-end",
    accessUntil: "04/08/26",
    focus: "React & Performance Web",
    cover: ["#38BDF8", "#8B5CF6"],
  },
  {
    id: "amanda",
    name: "Amanda Ribeiro",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    role: "Engenheira de Software Sênior",
    accessUntil: "12/09/26",
    focus: "Arquitetura Backend",
    cover: ["#06B6D4", "#38BDF8"],
  },
  {
    id: "diego",
    name: "Diego Martins",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    role: "Tech Lead",
    accessUntil: "28/08/26",
    focus: "Carreira & Entrevistas Técnicas",
    cover: ["#8B5CF6", "#06B6D4"],
  },
  {
    id: "larissa",
    name: "Larissa Souza",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
    role: "Product Engineer",
    accessUntil: "15/10/26",
    focus: "Full Stack & Produto",
    cover: ["#38BDF8", "#06B6D4"],
  },
];
