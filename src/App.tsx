import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { CSSProperties } from "react";
import { Briefcase, Cpu, TrendingUp, type LucideProps } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";

type ProgramId = "management" | "finance" | "ai";
type TraitId =
  | "builder"
  | "analytical"
  | "leader"
  | "creative"
  | "technical"
  | "finance"
  | "people"
  | "impact";

type ProgramScores = Record<ProgramId, number>;
type TraitScores = Partial<Record<TraitId, number>>;

type AnswerOption = {
  label: string;
  detail: string;
  scores: ProgramScores;
  traits: TraitScores;
};

type Question = {
  category: string;
  prompt: string;
  context: string;
  options: AnswerOption[];
};

type Course = {
  code: string;
  title: string;
  note: string;
  traits: TraitId[];
};

type Program = {
  id: ProgramId;
  number: string;
  title: string;
  shortTitle: string;
  archetype: string;
  summary: string;
  lens: string;
  accent: string;
  subjects: string;
  courses: Course[];
};

const score = (management: number, finance: number, ai: number): ProgramScores => ({
  management,
  finance,
  ai,
});

const questions: Question[] = [
  {
    category: "Free time",
    prompt: "A free Saturday opens up. What would you actually enjoy doing?",
    context: "Pick the option you would choose without trying to make it sound impressive.",
    options: [
      {
        label: "Build a scrappy side project",
        detail: "Turn a rough idea into something people can try.",
        scores: score(5, 2, 4),
        traits: { builder: 3, creative: 1 },
      },
      {
        label: "Follow a market rabbit hole",
        detail: "Compare companies, trends, and where money might move next.",
        scores: score(2, 6, 3),
        traits: { finance: 3, analytical: 2 },
      },
      {
        label: "Automate something annoying",
        detail: "Write or learn enough code to make a repetitive task disappear.",
        scores: score(2, 2, 6),
        traits: { technical: 3, builder: 2 },
      },
      {
        label: "Bring people together",
        detail: "Organize a meetup, trip, event, or shared plan.",
        scores: score(6, 2, 2),
        traits: { people: 3, leader: 2 },
      },
    ],
  },
  {
    category: "Problem instinct",
    prompt: "Which kind of problem pulls you in first?",
    context: "Think about what makes you curious rather than what you already know.",
    options: [
      {
        label: "A promising idea with no clear market",
        detail: "I want to find the customer, position it, and plan the launch.",
        scores: score(5, 2, 3),
        traits: { builder: 2, creative: 2, leader: 1 },
      },
      {
        label: "A high-stakes choice with incomplete numbers",
        detail: "I want to model the tradeoffs and understand the downside.",
        scores: score(3, 6, 3),
        traits: { analytical: 3, finance: 2 },
      },
      {
        label: "A system that should be smarter",
        detail: "I want to find the pattern and design a better algorithm.",
        scores: score(2, 3, 6),
        traits: { technical: 3, analytical: 2 },
      },
      {
        label: "A team that is capable but stuck",
        detail: "I want to clarify the goal and help people move together.",
        scores: score(6, 2, 2),
        traits: { leader: 3, people: 2 },
      },
    ],
  },
  {
    category: "Numbers",
    prompt: "What is your honest relationship with mathematics?",
    context: "This is about your preferred use of math, not your latest grade.",
    options: [
      {
        label: "I like math when it drives a decision",
        detail: "Margins, forecasts, valuation, and risk make numbers feel useful.",
        scores: score(3, 5, 3),
        traits: { finance: 3, analytical: 2 },
      },
      {
        label: "I enjoy abstract models and logic",
        detail: "The deeper mechanics are satisfying, especially when code is involved.",
        scores: score(2, 4, 5),
        traits: { technical: 3, analytical: 2 },
      },
      {
        label: "I use numbers, but they are one input",
        detail: "Customers, context, and judgment should matter just as much.",
        scores: score(5, 3, 3),
        traits: { people: 2, creative: 2, analytical: 1 },
      },
      {
        label: "I prefer the story behind the numbers",
        detail: "Communicating the meaning is more energizing than calculating it.",
        scores: score(5, 2, 2),
        traits: { creative: 3, people: 2 },
      },
    ],
  },
  {
    category: "Team role",
    prompt: "In a group project, where do you naturally end up?",
    context: "Choose what people already tend to rely on you for.",
    options: [
      {
        label: "Setting direction and keeping momentum",
        detail: "I connect the dots, divide the work, and move the team forward.",
        scores: score(6, 2, 2),
        traits: { leader: 3, people: 2 },
      },
      {
        label: "Stress-testing the assumptions",
        detail: "I check whether the evidence and economics really hold up.",
        scores: score(3, 5, 3),
        traits: { analytical: 3, finance: 2 },
      },
      {
        label: "Building the first working version",
        detail: "I would rather make and test than discuss for too long.",
        scores: score(4, 2, 5),
        traits: { builder: 3, technical: 2 },
      },
      {
        label: "Shaping the story and presentation",
        detail: "I make the idea clear, persuasive, and memorable.",
        scores: score(5, 2, 2),
        traits: { creative: 3, people: 2 },
      },
    ],
  },
  {
    category: "Proud work",
    prompt: "Which outcome would make you most proud at the end of a semester?",
    context: "Imagine each one is equally difficult and equally respected.",
    options: [
      {
        label: "A product with its first real customers",
        detail: "We found a need, built the offer, and got people to care.",
        scores: score(5, 2, 3),
        traits: { builder: 3, leader: 1, creative: 1 },
      },
      {
        label: "An investment thesis that proved right",
        detail: "The research was rigorous and the risk was understood.",
        scores: score(2, 6, 3),
        traits: { finance: 3, analytical: 2 },
      },
      {
        label: "An intelligent tool that really works",
        detail: "The model turns messy data into a useful result.",
        scores: score(2, 2, 6),
        traits: { technical: 3, builder: 2 },
      },
      {
        label: "A solution that improves a community",
        detail: "The project creates practical and measurable social value.",
        scores: score(5, 3, 4),
        traits: { impact: 3, people: 2 },
      },
    ],
  },
  {
    category: "Learning style",
    prompt: "How do you learn something difficult most effectively?",
    context: "Pick the method you would still use when nobody is checking.",
    options: [
      {
        label: "Put it into a live project",
        detail: "A deadline and a real user make the lesson stick.",
        scores: score(5, 2, 4),
        traits: { builder: 3, leader: 1 },
      },
      {
        label: "Work through models and cases",
        detail: "I like structured frameworks and comparing possible outcomes.",
        scores: score(4, 5, 3),
        traits: { analytical: 3, finance: 1 },
      },
      {
        label: "Tinker until I understand the system",
        detail: "I learn by changing inputs, breaking things, and debugging.",
        scores: score(2, 3, 6),
        traits: { technical: 3, builder: 2 },
      },
      {
        label: "Discuss it and teach it back",
        detail: "Conversation helps me find the idea beneath the jargon.",
        scores: score(5, 3, 2),
        traits: { people: 3, creative: 1 },
      },
    ],
  },
  {
    category: "Technology",
    prompt: "How much coding belongs in your ideal degree?",
    context: "There is no virtuous answer. Think about the week-to-week work you want.",
    options: [
      {
        label: "A lot. I want to become deeply technical",
        detail: "Algorithms, software, data, and AI should be central.",
        scores: score(2, 2, 6),
        traits: { technical: 3, analytical: 2 },
      },
      {
        label: "Enough to build and lead tech products",
        detail: "I want fluency and prototypes without coding all day.",
        scores: score(5, 2, 4),
        traits: { builder: 2, technical: 1, leader: 2 },
      },
      {
        label: "Mostly data tools, models, and dashboards",
        detail: "I care more about decisions than software engineering.",
        scores: score(3, 5, 4),
        traits: { finance: 2, analytical: 3 },
      },
      {
        label: "Keep it practical and fairly light",
        detail: "Technology should support strategy, sales, and people work.",
        scores: score(5, 3, 2),
        traits: { people: 2, leader: 2, creative: 1 },
      },
    ],
  },
  {
    category: "Uncertainty",
    prompt: "A decision has to be made with imperfect information. You first...",
    context: "Choose your instinct before the polished answer kicks in.",
    options: [
      {
        label: "Run a small test in the real world",
        detail: "Fast evidence from users beats a perfect plan.",
        scores: score(5, 2, 3),
        traits: { builder: 3, creative: 1 },
      },
      {
        label: "Quantify scenarios and downside",
        detail: "I want a range of outcomes and a clear risk limit.",
        scores: score(3, 5, 3),
        traits: { analytical: 3, finance: 2 },
      },
      {
        label: "Model the system and simulate it",
        detail: "I want to understand the variables and hidden patterns.",
        scores: score(2, 4, 5),
        traits: { technical: 2, analytical: 3 },
      },
      {
        label: "Talk to the people closest to it",
        detail: "The right conversations usually expose what the data misses.",
        scores: score(5, 2, 2),
        traits: { people: 3, leader: 1 },
      },
    ],
  },
  {
    category: "Career room",
    prompt: "Which room would you be most excited to walk into?",
    context: "Picture the conversations, pace, and people around the table.",
    options: [
      {
        label: "Founders planning a new market launch",
        detail: "Product, brand, customers, team, and growth are all in play.",
        scores: score(5, 2, 3),
        traits: { leader: 2, builder: 2, creative: 1 },
      },
      {
        label: "Investors debating a major allocation",
        detail: "Conviction has to meet evidence, valuation, and risk.",
        scores: score(2, 6, 2),
        traits: { finance: 3, analytical: 2 },
      },
      {
        label: "Engineers training a new AI model",
        detail: "The team is pushing what a machine can learn and do.",
        scores: score(2, 2, 6),
        traits: { technical: 3, analytical: 2 },
      },
      {
        label: "Product leaders translating tech into value",
        detail: "I want to bridge technical possibility and human need.",
        scores: score(5, 2, 4),
        traits: { builder: 2, people: 2, technical: 1 },
      },
    ],
  },
  {
    category: "Future",
    prompt: "Ten years from now, which sentence sounds most like you?",
    context: "Choose the direction, not a fixed job title.",
    options: [
      {
        label: "I build ventures and lead change",
        detail: "I turn opportunities into products, teams, and sustainable growth.",
        scores: score(6, 2, 3),
        traits: { leader: 3, builder: 2 },
      },
      {
        label: "I make high-quality capital decisions",
        detail: "I help businesses or people price risk and use money intelligently.",
        scores: score(2, 6, 3),
        traits: { finance: 3, analytical: 2 },
      },
      {
        label: "I create systems that expand what is possible",
        detail: "I build with AI, software, and mathematics at a deep level.",
        scores: score(2, 2, 6),
        traits: { technical: 3, builder: 2 },
      },
      {
        label: "I solve complex problems with broad impact",
        detail: "I combine disciplines to improve how people live and work.",
        scores: score(5, 3, 5),
        traits: { impact: 3, creative: 1, analytical: 1 },
      },
    ],
  },
];

const programs: Record<ProgramId, Program> = {
  management: {
    id: "management",
    number: "01",
    title: "Bachelor's Program in Management & Technology",
    shortTitle: "Management & Technology",
    archetype: "The Venture Architect",
    summary:
      "You are energized by turning possibility into momentum. This program fits people who want enough fluency in product, finance, marketing, and technology to build ventures and lead across functions.",
    lens: "Build the business around the technology.",
    accent: "#f0c300",
    subjects: "Strategy / Product / Growth / Leadership",
    courses: [
      { code: "MAST 101", title: "Work effectively in teams", note: "Build collaboration and accountability in group settings.", traits: ["people", "leader"] },
      { code: "MAST 201", title: "Build a global supply chain", note: "Understand how operations scale across markets.", traits: ["analytical", "builder"] },
      { code: "MAST 301", title: "Write a comprehensive business plan", note: "Shape an idea into a structured venture roadmap.", traits: ["builder", "leader"] },
      { code: "MAST 401", title: "Create a winning fundraising deck", note: "Pitch a business with clarity and conviction.", traits: ["creative", "finance"] },
      { code: "MAST 501", title: "Network effortlessly", note: "Build relationships that unlock opportunities.", traits: ["people", "leader"] },
      { code: "SAMA 101", title: "Advertise without spending money", note: "Find creative ways to generate attention cheaply.", traits: ["creative", "builder"] },
      { code: "SAMA 201", title: "Run digital ads on TikTok, Meta, and Google", note: "Use paid channels to drive measurable growth.", traits: ["creative", "analytical"] },
      { code: "SAMA 301", title: "Leverage marketplaces like Amazon to sell your products", note: "Use platform distribution to reach demand faster.", traits: ["builder", "creative"] },
      { code: "SAMA 401", title: "Execute CRO and increase AOV", note: "Improve conversion and customer value using evidence.", traits: ["analytical", "builder"] },
      { code: "FIFI 101", title: "Understand basic financial terminology", note: "Learn the language that underpins business decisions.", traits: ["finance", "analytical"] },
      { code: "FIFI 102", title: "Read and analyse financial statements", note: "Use company accounts to understand performance.", traits: ["finance", "analytical"] },
      { code: "PRTC 101", title: "Use stats to build a better business", note: "Let evidence shape better business choices.", traits: ["analytical", "builder"] },
      { code: "PRTC 201", title: "Get comfortable with Excel", note: "Build confidence in a core business tool.", traits: ["analytical", "technical"] },
      { code: "PRTC 301", title: "Smartly leverage tech to grow your business", note: "Apply digital tools where they create leverage.", traits: ["technical", "builder"] },
      { code: "PRTC 401", title: "Set up an e-commerce website", note: "Launch a digital storefront from scratch.", traits: ["technical", "builder"] },
      { code: "AIML 101", title: "Master prompt engineering to leverage generative AI", note: "Use modern AI tools with precision and intent.", traits: ["technical", "builder"] },
      { code: "COMM 101", title: "Give an inspiring speech", note: "Speak in ways that move people to action.", traits: ["people", "creative"] },
      { code: "COMM 201", title: "Write persuasively", note: "Use words to influence decisions and outcomes.", traits: ["creative", "people"] },
      { code: "FIFI 201", title: "Read and analyse financial statements", note: "Interpret balance sheets and cash flows with confidence.", traits: ["finance", "analytical"] },
      { code: "MAST 102", title: "Analyse markets and identify new business opportunities", note: "Spot where demand and opportunity are forming.", traits: ["analytical", "builder"] },
      { code: "MAST 202", title: "Identify and track key business metrics", note: "Focus on the numbers that actually matter.", traits: ["analytical", "builder"] },
      { code: "MAST 302", title: "Manage and optimise inventory", note: "Balance supply, timing, and working capital.", traits: ["analytical", "builder"] },
      { code: "MAST 402", title: "Motivate your teams and give feedback", note: "Help people improve while keeping momentum high.", traits: ["people", "leader"] },
      { code: "SAMA 102", title: "Position your brand using consumer psychology and behavior", note: "Use human insight to sharpen brand relevance.", traits: ["creative", "people"] },
      { code: "SAMA 202", title: "Build a brand story", note: "Craft a voice, tone, and identity that people remember.", traits: ["creative", "people"] },
      { code: "SAMA 302", title: "Develop a GTM strategy", note: "Plan how a product enters and wins in a market.", traits: ["builder", "creative"] },
      { code: "SAMA 402", title: "Price your products strategically", note: "Use pricing as a lever for growth and margin.", traits: ["finance", "analytical"] },
      { code: "FIFI 201", title: "Allocate budgets and control costs", note: "Manage spending with discipline and visibility.", traits: ["finance", "analytical"] },
      { code: "FIFI 202", title: "Understand taxes and compliances", note: "Operate within the rules that shape business finance.", traits: ["finance", "analytical"] },
      { code: "PRTC 102", title: "Read and write code", note: "Learn the logic behind digital products.", traits: ["technical", "builder"] },
      { code: "PRTC 202", title: "Build dashboards and use advanced Excel", note: "Turn raw data into useful operating visibility.", traits: ["analytical", "technical"] },
      { code: "PRTC 302", title: "Develop a product mindset", note: "Think from user needs to product decisions.", traits: ["builder", "people"] },
      { code: "AIML 102", title: "Leverage AI to automate content creation", note: "Scale content systems using automation tools.", traits: ["technical", "creative"] },
      { code: "COMM 102", title: "Use mental models to solve problems", note: "Apply structured thinking to messy situations.", traits: ["analytical", "leader"] },
      { code: "COMM 202", title: "Manage personal finances", note: "Build financial discipline in everyday life.", traits: ["finance", "analytical"] },
      { code: "PRTC 203", title: "Use design thinking to build effective products and solutions", note: "Prototype around real human needs.", traits: ["builder", "people"] },
      { code: "AIML 103", title: "How LLMs and AI actually work", note: "Understand the mechanics behind generative systems.", traits: ["technical", "analytical"] },
      { code: "FIFI 203", title: "Innovate on monetisation techniques", note: "Design better ways for a business to earn.", traits: ["finance", "builder"] },
      { code: "SAMA 303", title: "Build a personal brand", note: "Shape how others perceive your value and voice.", traits: ["creative", "people"] },
      { code: "COMM 103", title: "Find your voice", note: "Develop a style that feels clear and authentic.", traits: ["creative", "people"] },
      { code: "FIFI 303", title: "Leverage DeFi and crypto in business", note: "Explore decentralized finance in commercial contexts.", traits: ["finance", "technical"] },
      { code: "SAMA 103", title: "Nail content marketing to grow your business", note: "Use content to build attention and trust.", traits: ["creative", "builder"] },
      { code: "PRTC 103", title: "Read and write code (Part 2)", note: "Go deeper into practical software fluency.", traits: ["technical", "builder"] },
      { code: "SAMA 203", title: "Script, record, and release content for YouTube and Instagram", note: "Produce media that informs and converts.", traits: ["creative", "builder"] },
      { code: "SAMA 403", title: "Decode social media algorithms", note: "Understand the systems that shape distribution.", traits: ["analytical", "creative"] },
      { code: "MAST 103", title: "How the microeconomy works", note: "See how incentives and markets shape choices.", traits: ["finance", "analytical"] },
      { code: "COMM 203", title: "Be productive and get things done", note: "Build habits for consistent execution.", traits: ["builder", "leader"] },
      { code: "FIFI 103", title: "Navigate corporate finance", note: "Understand capital decisions inside firms.", traits: ["finance", "analytical"] },
      { code: "MAST 303", title: "Think strategically about your business", note: "Zoom out and make smarter competitive choices.", traits: ["leader", "analytical"] },
      { code: "MAST 203", title: "Identify and forecast macro trends", note: "Track the wider forces shaping future markets.", traits: ["analytical", "finance"] },
      { code: "MAST 104", title: "How a country's economy works", note: "Connect policy, markets, and national growth.", traits: ["finance", "analytical"] },
      { code: "MAST 204", title: "Bring innovation to public policies", note: "Apply fresh thinking to public systems and governance.", traits: ["impact", "analytical"] },
      { code: "MAST 304", title: "Manage social ventures", note: "Lead organizations built around social value.", traits: ["impact", "leader"] },
      { code: "MAST 404", title: "Build solutions for global problems", note: "Use systems thinking on high-impact challenges.", traits: ["impact", "analytical"] },
      { code: "SAMA 104", title: "Fundraise capital for social projects", note: "Secure resources for mission-driven work.", traits: ["impact", "finance"] },
      { code: "SAMA 204", title: "Position and market your non-profit brand", note: "Communicate purpose in ways that mobilize support.", traits: ["impact", "creative"] },
      { code: "SAMA 304", title: "Market and sell to the bottom of the pyramid", note: "Design access-oriented go-to-market strategies.", traits: ["impact", "people"] },
      { code: "SAMA 404", title: "Follow up and close deals", note: "Turn conversations into signed outcomes.", traits: ["people", "builder"] },
      { code: "FIFI 104", title: "Invest in capital markets and build a portfolio", note: "Learn how to allocate money across assets.", traits: ["finance", "analytical"] },
      { code: "FIFI 204", title: "Build financial models", note: "Model business scenarios and decision paths.", traits: ["finance", "analytical"] },
      { code: "PRTC 104", title: "Design surveys to conduct primary research", note: "Capture better evidence from real people.", traits: ["analytical", "people"] },
      { code: "PRTC 304", title: "Leverage machine learning to build business solutions", note: "Apply data-driven models to practical problems.", traits: ["technical", "builder"] },
      { code: "PRTC 304", title: "Leverage gamification and behavioural design to build successful products", note: "Use behavior design to improve engagement.", traits: ["creative", "people"] },
      { code: "AIML 104", title: "Build AI powered products", note: "Translate AI capability into useful products.", traits: ["technical", "builder"] },
      { code: "COMM 104", title: "Craft a compelling personal portfolio", note: "Present your strengths with clarity and intent.", traits: ["creative", "people"] },
      { code: "COMM 204", title: "Master power writing and deep reading", note: "Sharpen complex thinking through language.", traits: ["creative", "analytical"] },
      { code: "MAST 105", title: "Never lose a customer", note: "Build loyalty by understanding retention deeply.", traits: ["people", "builder"] },
      { code: "MAST 205", title: "Use game theory for business and life", note: "Think through strategic interaction with rigor.", traits: ["analytical", "leader"] },
      { code: "MAST 305", title: "Use KPIs and KRAs to improve org alignment", note: "Align teams around measurable performance.", traits: ["analytical", "leader"] },
      { code: "SAMA 105", title: "Use marketing analytics to optimise conversion", note: "Use measurement to improve growth efficiency.", traits: ["analytical", "creative"] },
      { code: "SAMA 205", title: "Leverage design to inspire trust", note: "Use design choices to influence confidence.", traits: ["creative", "people"] },
      { code: "SAMA 305", title: "Craft a winning sales pitch", note: "Tell the story that gets a yes.", traits: ["people", "creative"] },
      { code: "SAMA 405", title: "Use and manage CRM tools", note: "Track relationships and follow-up at scale.", traits: ["technical", "people"] },
      { code: "FIFI 105", title: "How M&A works", note: "Understand acquisitions, integration, and value creation.", traits: ["finance", "analytical"] },
      { code: "FIFI 205", title: "Value business", note: "Estimate what a company is truly worth.", traits: ["finance", "analytical"] },
      { code: "FIFI 305", title: "Raise debt and equity capital", note: "Fund growth using the right capital stack.", traits: ["finance", "leader"] },
      { code: "PRTC 105", title: "Build an app using no-code", note: "Launch software ideas without full engineering overhead.", traits: ["technical", "builder"] },
      { code: "PRTC 205", title: "Manage developers effectively", note: "Lead technical teams without losing product focus.", traits: ["technical", "leader"] },
      { code: "PRTC 305", title: "Design UI/UX using Figma", note: "Visualize product flows and user experience clearly.", traits: ["creative", "builder"] },
      { code: "PRTC 405", title: "Build habit-forming products", note: "Design products people return to repeatedly.", traits: ["builder", "people"] },
      { code: "AIML 105", title: "Use big data to drive decision making", note: "Turn large-scale data into practical direction.", traits: ["technical", "analytical"] },
      { code: "COMM 105", title: "Master the craft of storytelling", note: "Make complex ideas memorable and persuasive.", traits: ["creative", "people"] },
      { code: "COMM 205", title: "Run effective meetings and motivate teams", note: "Lead conversations that create progress.", traits: ["people", "leader"] },
      { code: "MAST 405", title: "Understand current trends in retail market", note: "Track where consumer commerce is heading next.", traits: ["analytical", "builder"] },
      { code: "MAST 106", title: "How the carbon credits economy works", note: "Understand a fast-evolving sustainability market.", traits: ["impact", "finance"] },
      { code: "MAST 206", title: "Conduct environmental impact assessments", note: "Evaluate how projects affect ecosystems and communities.", traits: ["impact", "analytical"] },
      { code: "MAST 306", title: "Build a sustainability first culture in your company", note: "Embed long-term responsibility into operations.", traits: ["impact", "leader"] },
      { code: "MAST 406", title: "How the renewable energy market works", note: "Learn the forces shaping energy transition economics.", traits: ["impact", "analytical"] },
      { code: "SAMA 106", title: "Measure brand asset value", note: "Quantify the strength of brand equity.", traits: ["creative", "analytical"] },
      { code: "SAMA 206", title: "Negotiate deals that create a win-win", note: "Reach outcomes that work for all sides.", traits: ["people", "leader"] },
      { code: "SAMA 306", title: "Do community-driven marketing", note: "Grow through participation, trust, and belonging.", traits: ["people", "creative"] },
      { code: "SAMA 406", title: "Do B2B marketing", note: "Market effectively in longer and more complex sales cycles.", traits: ["builder", "people"] },
      { code: "FIFI 106", title: "How PE and VC firms work", note: "Understand how investors evaluate and fund growth.", traits: ["finance", "analytical"] },
      { code: "FIFI 206", title: "How IPOs work", note: "Study what it takes to go public.", traits: ["finance", "analytical"] },
      { code: "FIFI 306", title: "Understand the Triple Bottom Line", note: "Measure success beyond profit alone.", traits: ["impact", "finance"] },
      { code: "PRTC 106", title: "Use Power BI to visualize data", note: "Build decision-ready data views and reports.", traits: ["technical", "analytical"] },
      { code: "AIML 106", title: "Deploy AI in agritech", note: "Apply AI to real-world agricultural systems.", traits: ["technical", "impact"] },
      { code: "COMM 106", title: "Write emails that get responses", note: "Communicate clearly in low-attention channels.", traits: ["people", "creative"] },
      { code: "COMM 206", title: "Hack your hormones", note: "Understand personal performance through biology and habits.", traits: ["analytical", "builder"] },
      { code: "MAST 107", title: "Protect your ideas using intellectual property law", note: "Learn how innovation can be defended strategically.", traits: ["builder", "analytical"] },
      { code: "MAST 207", title: "Use mathematical models for business optimisation", note: "Improve business systems with quantitative logic.", traits: ["analytical", "technical"] },
      { code: "MAST 307", title: "Build a business in manufacturing", note: "Understand how products are made and scaled physically.", traits: ["builder", "analytical"] },
      { code: "MAST 407", title: "Manage a crisis", note: "Lead under pressure when uncertainty is high.", traits: ["leader", "people"] },
      { code: "SAMA 107", title: "Craft compelling copy to maximise sales", note: "Write messaging that persuades and converts.", traits: ["creative", "people"] },
      { code: "SAMA 207", title: "Spark product-led growth using Nudge theory", note: "Use behavior design to drive self-serve growth.", traits: ["builder", "people"] },
      { code: "SAMA 307", title: "Motivate and incentivize sales teams", note: "Use systems and psychology to improve team performance.", traits: ["leader", "people"] },
      { code: "FIFI 107", title: "Manage risk and optimise returns", note: "Balance upside with disciplined downside thinking.", traits: ["finance", "analytical"] },
      { code: "FIFI 207", title: "How the global banking system works", note: "See how modern financial plumbing actually operates.", traits: ["finance", "analytical"] },
      { code: "FIFI 307", title: "Leverage DeFi and crypto in business", note: "Use decentralized financial systems in commercial settings.", traits: ["finance", "technical"] },
      { code: "PRTC 107", title: "Build hardware prototypes", note: "Translate product ideas into physical experiments.", traits: ["technical", "builder"] },
      { code: "PRTC 207", title: "Leverage neuroscience in business", note: "Use brain and behavior insights to shape decisions.", traits: ["people", "analytical"] },
      { code: "AIML 107", title: "How LLMs and AI actually work", note: "Study the mechanisms behind modern AI systems.", traits: ["technical", "analytical"] },
      { code: "COMM 107", title: "Influence people without authority", note: "Move others through trust, framing, and credibility.", traits: ["people", "leader"] },
      { code: "COMM 207", title: "Be productive and get things done", note: "Improve personal execution and follow-through.", traits: ["builder", "leader"] },
      { code: "PRTC 307", title: "Use product analytics for deeper insights", note: "Read behavior data to guide product decisions.", traits: ["analytical", "technical"] },
    ],
  },
  finance: {
    id: "finance",
    number: "02",
    title: "Bachelor's in Finance & AI",
    shortTitle: "Finance & AI",
    archetype: "The Quant Strategist",
    summary:
      "You like decisions that can stand up to scrutiny. This program fits people who are curious about markets, capital, and risk, and want to use data and AI to make sharper financial judgments.",
    lens: "Make the capital decision behind the future.",
    accent: "#009c50",
    subjects: "Markets / Risk / Modeling / Fintech",
    courses: [
      { code: "FCV 101", title: "Read money in a business", note: "Interpret how money flows through an operating company.", traits: ["finance", "analytical"] },
      { code: "ECF 101", title: "Price products for profit", note: "Connect pricing choices to margin and unit economics.", traits: ["finance", "analytical"] },
      { code: "STAI 101", title: "Use math for financial decisions", note: "Apply quantitative reasoning to money choices.", traits: ["analytical", "finance"] },
      { code: "PCF 101", title: "Write investor-grade financial briefs", note: "Present financial thinking in a credible format.", traits: ["finance", "creative"] },
      { code: "ECF 102", title: "How money moves in the economy", note: "Understand the wider system behind financial activity.", traits: ["finance", "analytical"] },
      { code: "STAI 102", title: "Analyse uncertainty", note: "Think clearly when outcomes are probabilistic.", traits: ["analytical", "finance"] },
      { code: "STAI 301", title: "Build financial models (spreadsheets + AI)", note: "Combine financial logic with modern modeling tools.", traits: ["finance", "technical"] },
      { code: "STAI 201", title: "Collect financial and market data", note: "Build strong inputs for analysis and forecasting.", traits: ["analytical", "technical"] },
      { code: "ECF 103", title: "How costs, margins, and leverage actually behave", note: "Understand the mechanics behind profitability.", traits: ["finance", "analytical"] },
      { code: "FCV 102", title: "Value a business", note: "Estimate what an enterprise is worth and why.", traits: ["finance", "analytical"] },
      { code: "STAI 103", title: "Measure financial impact", note: "Translate activity into meaningful financial outcomes.", traits: ["finance", "analytical"] },
      { code: "ECF 201", title: "How incentives break financial plans", note: "See how human behavior distorts formal assumptions.", traits: ["analytical", "people"] },
      { code: "FCV 103", title: "How capital allocation decisions are made", note: "Understand where money goes and why.", traits: ["finance", "analytical"] },
      { code: "STAI 104", title: "How financial models actually work", note: "Go deeper into structure, assumptions, and sensitivity.", traits: ["finance", "analytical"] },
      { code: "ECF 202", title: "Run financial experiments", note: "Test hypotheses instead of relying on static theory.", traits: ["analytical", "builder"] },
      { code: "ECF 104", title: "Build finance ops and controls", note: "Create the systems that keep finance reliable.", traits: ["finance", "builder"] },
      { code: "ECF 105", title: "How assets are priced", note: "Understand what markets reward and penalize.", traits: ["finance", "analytical"] },
      { code: "ECF 203", title: "Manage portfolios", note: "Balance returns, diversification, and risk.", traits: ["finance", "analytical"] },
      { code: "STAI 105", title: "Forecast financial outcomes", note: "Project what may happen using quantitative methods.", traits: ["finance", "analytical"] },
      { code: "FCV 104", title: "How financial systems fail", note: "Study fragility, contagion, and systemic breakdown.", traits: ["finance", "analytical"] },
      { code: "ECF 106", title: "Manage downside", note: "Protect against loss without ignoring opportunity.", traits: ["finance", "analytical"] },
      { code: "STAI 202", title: "Use AI in finance responsibly", note: "Apply automation with judgment and safeguards.", traits: ["technical", "impact"] },
      { code: "ECF 204", title: "How institutions and regulation affect finance", note: "See how rules and structures shape financial behavior.", traits: ["finance", "impact"] },
      { code: "STAI 106", title: "Build decision-grade dashboards and pipelines", note: "Turn financial data into reliable decision systems.", traits: ["technical", "analytical"] },
      { code: "ECF 107", title: "Manage wealth across life stages", note: "Connect long-term finance to human goals and timing.", traits: ["finance", "people"] },
      { code: "ECF 205", title: "Design client portfolios and IPS", note: "Translate client needs into disciplined allocation plans.", traits: ["finance", "people"] },
      { code: "STAI 107", title: "Use AI for portfolio monitoring and research", note: "Apply machine intelligence to financial tracking.", traits: ["technical", "finance"] },
      { code: "PCF 102", title: "Communicate financial decisions to clients", note: "Explain complex tradeoffs in understandable language.", traits: ["people", "finance"] },
      { code: "ECF 109", title: "Build fintech unit economics", note: "Check whether a financial product can scale sustainably.", traits: ["builder", "finance"] },
      { code: "STAI 108", title: "Price risk using data and AI", note: "Use models to quantify uncertainty intelligently.", traits: ["technical", "finance"] },
      { code: "ECF 207", title: "How blockchain systems work financially", note: "Study the monetary logic of decentralized systems.", traits: ["finance", "technical"] },
      { code: "PCF 104", title: "How fintech regulation shapes product design", note: "Build financial products with compliance in mind.", traits: ["finance", "builder"] },
    ],
  },
  ai: {
    id: "ai",
    number: "03",
    title: "Bachelor of Science in Artificial Intelligence",
    shortTitle: "Artificial Intelligence",
    archetype: "The Intelligent Systems Builder",
    summary:
      "You want to understand the machinery, not just use the interface. This program fits people drawn to code, mathematics, data, and the challenge of building intelligent systems from first principles.",
    lens: "Build the technology shaping the future.",
    accent: "#090909",
    subjects: "Computer Science / Math / Data / AI",
    courses: [
      { code: "CS 101", title: "Design intelligent systems for everyday life", note: "Create AI systems grounded in practical human use.", traits: ["technical", "builder"] },
      { code: "CS 201", title: "Automate business workflows with OOP", note: "Use programming to remove friction from operations.", traits: ["technical", "builder"] },
      { code: "MAT 101", title: "Optimize delivery routes with calculus", note: "Use mathematics to improve real logistics systems.", traits: ["analytical", "technical"] },
      { code: "MAT 201", title: "Model population growth with integration techniques", note: "Apply mathematics to environmental system behavior.", traits: ["analytical", "impact"] },
      { code: "PHY 101", title: "Improve GPS accuracy", note: "Use physics to make navigation systems more precise.", traits: ["technical", "analytical"] },
      { code: "MAST 101", title: "Design scalable cloud solutions", note: "Build infrastructure that supports modern software systems.", traits: ["technical", "builder"] },
      { code: "MAST 201", title: "Conduct user research", note: "Study users before building technical solutions.", traits: ["people", "analytical"] },
      { code: "SAMA 101", title: "Launch products with GTM strategies", note: "Translate technology into adoption and market traction.", traits: ["builder", "creative"] },
      { code: "SAMA 201", title: "Increase engagement", note: "Improve user response through messaging and iteration.", traits: ["creative", "analytical"] },
      { code: "FIFI 101", title: "Create and manage budgets", note: "Use financial discipline to support technical work.", traits: ["finance", "analytical"] },
      { code: "FIFI 201", title: "Build financial models for decisions", note: "Model infrastructure and investment choices clearly.", traits: ["finance", "analytical"] },
      { code: "COMM 101", title: "Give inspiring speeches", note: "Communicate ideas with conviction and energy.", traits: ["people", "creative"] },
      { code: "COMM 201", title: "Write persuasively to influence decisions", note: "Use written communication to move ideas forward.", traits: ["creative", "people"] },
      { code: "COMM 301", title: "Boost productivity with better strategies", note: "Improve how work gets organized and executed.", traits: ["builder", "leader"] },
      { code: "CS 102", title: "Build scalable software", note: "Create systems that perform under real demand.", traits: ["technical", "builder"] },
      { code: "CS 202", title: "Solve network optimization problems", note: "Apply algorithms to constrained system performance.", traits: ["analytical", "technical"] },
      { code: "MAT 102", title: "Model weather systems using multivariate calculus", note: "Represent complex natural systems with math.", traits: ["analytical", "technical"] },
      { code: "PHY 201", title: "Predict demand and reduce wastage", note: "Use modeling to improve efficiency in physical systems.", traits: ["analytical", "impact"] },
      { code: "MAST 201", title: "Visualize data to inform decisions", note: "Make technical insight visible and actionable.", traits: ["analytical", "technical"] },
      { code: "MAST 202", title: "Assess emerging technologies", note: "Judge which innovations matter and why.", traits: ["analytical", "technical"] },
      { code: "SAMA 102", title: "Craft value propositions to stand out in e-commerce", note: "Explain why a product matters to the user.", traits: ["creative", "people"] },
      { code: "SAMA 202", title: "Optimize campaigns with A/B testing", note: "Use experimentation to improve messaging performance.", traits: ["analytical", "creative"] },
      { code: "FIFI 102", title: "Value companies and assess investments", note: "Understand business quality through financial analysis.", traits: ["finance", "analytical"] },
      { code: "FIFI 202", title: "Secure financing for startups", note: "Understand how ventures obtain growth capital.", traits: ["finance", "builder"] },
      { code: "COMM 102", title: "Solve problems with mental models", note: "Use conceptual frameworks to reason clearly.", traits: ["analytical", "leader"] },
      { code: "COMM 202", title: "Manage personal finances for long-term wealth", note: "Apply disciplined financial thinking personally.", traits: ["finance", "analytical"] },
      { code: "COMM 302", title: "Communicate with confidence", note: "Express ideas clearly in high-stakes situations.", traits: ["people", "creative"] },
      { code: "CS 103", title: "Optimize logistics operations", note: "Use computation to improve flow and coordination.", traits: ["analytical", "technical"] },
      { code: "CS 203", title: "Optimize hardware performance in embedded systems", note: "Improve how constrained systems behave at the edge.", traits: ["technical", "analytical"] },
      { code: "MAT 103", title: "Improve movie recommendations", note: "Use mathematical models to personalize discovery.", traits: ["technical", "analytical"] },
      { code: "PHY 103", title: "Develop next-generation AI microchips", note: "Build the physical substrate for smarter computing.", traits: ["technical", "builder"] },
      { code: "MAST 103", title: "Protect software innovations", note: "Understand how technical ideas are legally defended.", traits: ["analytical", "builder"] },
      { code: "MAST 203", title: "Build AI ecosystems for ethical and green computing", note: "Design AI systems with societal responsibility.", traits: ["impact", "technical"] },
      { code: "SAMA 103", title: "Build social media strategies", note: "Use digital channels intentionally to drive attention.", traits: ["creative", "analytical"] },
      { code: "SAMA 203", title: "Optimize SEO", note: "Improve discoverability through structured search strategy.", traits: ["analytical", "creative"] },
      { code: "SAMA 303", title: "Use behavior analytics", note: "Study users through data, not just intuition.", traits: ["analytical", "people"] },
      { code: "FIFI 103", title: "How blockchain transforms payments and decentralized applications", note: "Connect technical architecture to financial systems.", traits: ["finance", "technical"] },
      { code: "FIFI 203", title: "How loyalty programs transform retention", note: "Use incentives to deepen customer attachment.", traits: ["people", "analytical"] },
      { code: "COMM 103", title: "Become a leader by cultivating empathy and decision-making", note: "Lead with stronger judgment and emotional awareness.", traits: ["leader", "people"] },
      { code: "COMM 203", title: "Influence without authority", note: "Move work forward through trust and persuasion.", traits: ["leader", "people"] },
      { code: "COMM 303", title: "Lead teams with emotional intelligence", note: "Support performance through better human understanding.", traits: ["leader", "people"] },
      { code: "CS 104", title: "Improve process management in operating systems", note: "Understand how systems schedule and coordinate work.", traits: ["technical", "analytical"] },
      { code: "CS 204", title: "Manage customer data", note: "Build reliable systems around sensitive information.", traits: ["technical", "analytical"] },
      { code: "MAT 104", title: "Detect fraud", note: "Use quantitative methods to catch suspicious patterns.", traits: ["analytical", "finance"] },
      { code: "PHY 104", title: "Design safer and more efficient aircraft", note: "Model complex engineering tradeoffs under constraints.", traits: ["technical", "analytical"] },
      { code: "MAST 104", title: "Manage AI projects", note: "Coordinate technical work with clear delivery goals.", traits: ["leader", "technical"] },
      { code: "MAST 204", title: "Develop tech strategies for startups", note: "Choose the right technical path for growth.", traits: ["leader", "builder"] },
      { code: "MAST 304", title: "Foster innovation in tech teams", note: "Create the conditions for better product thinking.", traits: ["leader", "people"] },
      { code: "SAMA 104", title: "Build sales pipelines", note: "Design repeatable systems that create revenue opportunities.", traits: ["builder", "people"] },
      { code: "SAMA 204", title: "Negotiate sales contracts", note: "Use commercial judgment in people-intensive deals.", traits: ["people", "finance"] },
      { code: "SAMA 304", title: "Create marketing campaigns", note: "Design campaigns that persuade and perform.", traits: ["creative", "builder"] },
      { code: "FIFI 104", title: "Navigate banking systems", note: "Understand the institutions behind money movement.", traits: ["finance", "analytical"] },
      { code: "FIFI 204", title: "Manage taxes and compliance", note: "Operate responsibly within financial rules.", traits: ["finance", "analytical"] },
      { code: "COMM 104", title: "Craft a personal portfolio", note: "Present technical and personal strengths effectively.", traits: ["creative", "people"] },
      { code: "COMM 204", title: "Master power writing and deep reading", note: "Use language to think more sharply and communicate better.", traits: ["creative", "analytical"] },
      { code: "COMM 304", title: "Create digital stories", note: "Tell stronger stories across modern media channels.", traits: ["creative", "people"] },
      { code: "CS 106", title: "Optimize software performance in high-performance computing", note: "Push software systems closer to their limits.", traits: ["technical", "analytical"] },
      { code: "CS 206", title: "Design algorithms", note: "Build the logic that powers scalable computation.", traits: ["technical", "analytical"] },
      { code: "MAT 106", title: "Solve engineering simulations in aerospace applications", note: "Use mathematical models for difficult real-world systems.", traits: ["analytical", "technical"] },
      { code: "MAT 206", title: "Enhance image compression", note: "Improve data efficiency through mathematical design.", traits: ["technical", "analytical"] },
      { code: "PHY 106", title: "Optimize mechanical systems", note: "Use physical modeling to improve industrial performance.", traits: ["analytical", "technical"] },
      { code: "MAST 106", title: "Conduct environmental impact assessments", note: "Measure technical decisions against environmental outcomes.", traits: ["impact", "analytical"] },
      { code: "MAST 206", title: "Leverage big data", note: "Use large-scale information to guide strategic choices.", traits: ["technical", "analytical"] },
      { code: "SAMA 106", title: "Use PPC advertising", note: "Acquire users through measurable paid channels.", traits: ["creative", "analytical"] },
      { code: "SAMA 206", title: "Optimize marketing budgets and ROI", note: "Allocate resources with performance discipline.", traits: ["finance", "analytical"] },
      { code: "SAMA 306", title: "Use data analytics in subscription services", note: "Improve recurring businesses through behavioral metrics.", traits: ["analytical", "technical"] },
      { code: "FIFI 106", title: "Optimize capital structure in corporate finance", note: "Balance debt, equity, and cost of capital.", traits: ["finance", "analytical"] },
      { code: "FIFI 206", title: "Use financial ratios in decision-making", note: "Read performance through financial signals.", traits: ["finance", "analytical"] },
      { code: "COMM 106", title: "Write emails in client communication", note: "Communicate clearly in professional contexts.", traits: ["people", "creative"] },
      { code: "COMM 206", title: "Hack your hormones to optimize performance and well-being", note: "Connect biology, routines, and sustained performance.", traits: ["analytical", "builder"] },
      { code: "MAT 107", title: "Use mathematics to predict complex real-world systems", note: "Model difficult systems using quantitative reasoning.", traits: ["analytical", "technical"] },
      { code: "CS 107", title: "Discover hidden patterns inside massive amounts of data", note: "Find structure where others only see volume.", traits: ["analytical", "technical"] },
      { code: "CS 207", title: "How humans and AI actually learn", note: "Study the mechanics of learning across minds and machines.", traits: ["technical", "analytical"] },
      { code: "CS 307", title: "Model strategic decision-making between competing players", note: "Use formal reasoning for strategic interaction.", traits: ["analytical", "leader"] },
      { code: "CS 108", title: "Think, work, and live in a world reshaped by technology", note: "Understand the broader human implications of technological change.", traits: ["impact", "technical"] },
      { code: "MAT 108", title: "Turn raw data into accurate predictions using mathematics", note: "Transform messy information into predictive insight.", traits: ["analytical", "technical"] },
      { code: "MAT 208", title: "Use mathematics to predict markets, traffic, and human systems", note: "Apply mathematical reasoning across complex adaptive systems.", traits: ["analytical", "impact"] },
    ],
  },
};

const traitLabels: Record<TraitId, string> = {
  builder: "Hands-on builder",
  analytical: "Analytical thinker",
  leader: "Natural catalyst",
  creative: "Creative communicator",
  technical: "Technical explorer",
  finance: "Capital minded",
  people: "People centered",
  impact: "Impact driven",
};

const traitDescriptions: Record<TraitId, string> = {
  builder: "You prefer making, testing, and improving over staying in theory.",
  analytical: "You look for evidence, structure, and the logic beneath a decision.",
  leader: "You naturally create direction and help a group move together.",
  creative: "You notice the story, framing, and human meaning inside an idea.",
  technical: "You are curious about how systems work beneath the interface.",
  finance: "You pay attention to value, tradeoffs, risk, and how money moves.",
  people: "You treat human behavior and communication as essential inputs.",
  impact: "You want your work to improve outcomes beyond the bottom line.",
};

const programOrder: ProgramId[] = ["management", "finance", "ai"];

type ProgramIcon = ComponentType<LucideProps>;

const programIcons: Record<ProgramId, ProgramIcon> = {
  management: Briefcase,
  finance: TrendingUp,
  ai: Cpu,
};

function ArrowIcon({ direction = "right" }: { direction?: "right" | "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${direction === "left" ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function TetrBrand({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`tetr-wordmark ${light ? "text-white" : "text-[var(--tetr-black)]"}`}
      aria-label="TETR Program Finder"
    >
      <span className="tetr-mark">◆</span>
      <span className="tetr-label">TETR Program Finder</span>
    </span>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  const scrollToPrograms = () => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main style={{ background: "var(--tetr-white)", color: "var(--tetr-black)" }}>
      <section className="hero-grain relative isolate flex min-h-[100svh] flex-col overflow-hidden" style={{ background: "var(--tetr-primary)" }}>
        <img
          src="/images/pathfinder-hero.jpg"
          alt="A student exploring business strategy, finance, and artificial intelligence at a studio desk"
          className="hero-image absolute inset-0 -z-20 h-full w-full object-cover object-[66%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,72,34,.94)_0%,rgba(0,72,34,.78)_38%,rgba(0,72,34,.22)_72%,rgba(0,72,34,.42)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,72,34,.82)_0%,transparent_45%,rgba(0,72,34,.3)_100%)]" />

        <header className="hero-enter mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-6 sm:px-9 lg:px-12">
          <TetrBrand light />
          <button
            onClick={scrollToPrograms}
            className="group hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 transition-colors hover:text-[var(--tetr-accent)] md:inline-flex"
          >
            The three programs
            <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
          </button>
        </header>

        <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-end px-5 pb-8 text-white sm:px-9 sm:pb-12 lg:px-12 lg:pb-14">
          <div className="max-w-5xl">
            <p className="hero-kicker mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tetr-accent)]">
              <span className="h-px w-10 bg-[var(--tetr-accent)]" />
              Cohort class finder · TETR College of Business
            </p>
            <h1 className="hero-title font-display text-[clamp(4.4rem,16vw,15rem)] leading-[0.76] tracking-[-0.085em] text-white">
              TETR
            </h1>
            <p className="hero-subtitle mt-2 font-display text-[clamp(1.4rem,3.6vw,3rem)] leading-[0.95] tracking-[-0.04em] text-white/85 italic">
              Program Finder
            </p>
            <div className="hero-copy mt-10 grid items-end gap-8 border-t border-white/25 pt-6 md:grid-cols-[1fr_auto] md:gap-12">
              <div>
                <h2 className="max-w-2xl text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl">
                  Choose the cohort class that fits how you think.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                  Ten honest questions. One personalized comparison across Management & Technology, Finance & AI, and Artificial Intelligence. A helpful, student-led, open-source reflection tool designed for the TETR community.
                </p>
              </div>
              <button onClick={onStart} className="primary-cta group shrink-0">
                Start the quiz
                <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="px-5 py-24 text-[var(--tetr-black)] sm:px-9 sm:py-32 lg:px-12" style={{ background: "var(--tetr-white)" }}>
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
            <p className="section-label">The three programs</p>
            <div>
              <h2 className="max-w-4xl font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                Three paths. One community.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-600">
                This isn't a test of what you are already good at. It looks at the work you enjoy, the decisions you gravitate toward, and the future you want to build. Use it to focus your research before you choose your cohort class.
              </p>
            </div>
          </div>

          <div className="mt-20 border-t" style={{ borderColor: "var(--tetr-border-strong)" }}>
            {programOrder.map((id) => {
              const program = programs[id];
              const Icon = programIcons[id];
              return (
                <div key={id} className="program-row grid gap-5 border-b py-8 md:grid-cols-[80px_44px_1.1fr_.8fr] md:items-center" style={{ borderColor: "var(--tetr-border)" }}>
                  <span className="font-mono text-xs text-neutral-500">/{program.number}</span>
                  <span
                    className="hidden items-center justify-center md:flex"
                    style={{ color: "var(--tetr-secondary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{program.shortTitle}</h3>
                  <p className="text-sm text-neutral-500 md:text-right">{program.subjects}</p>
                </div>
              );
            })}
          </div>
          <button onClick={onStart} className="primary-cta mt-12">
            Find my cohort fit <ArrowIcon />
          </button>
        </div>
      </section>
    </main>
  );
}

function Quiz({
  answers,
  current,
  onAnswer,
  onBack,
  onNext,
  onExit,
}: {
  answers: Array<number | undefined>;
  current: number;
  onAnswer: (option: number) => void;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const selected = answers[current];
  const question = questions[current];
  const progress = ((current + (selected !== undefined ? 1 : 0)) / questions.length) * 100;

  return (
    <main className="quiz-shell min-h-[100svh] text-[var(--tetr-black)]" style={{ background: "var(--tetr-white)" }}>
      <header className="flex h-20 items-center justify-between border-b px-5 sm:px-9 lg:px-12" style={{ borderColor: "var(--tetr-border-strong)" }}>
        <button onClick={onExit} aria-label="Return to the start page"><TetrBrand /></button>
        <div className="flex items-center gap-5">
          <span className="hidden text-xs text-neutral-500 sm:inline">Private by design. Nothing is saved.</span>
          <span className="font-mono text-xs font-semibold" style={{ color: "var(--tetr-primary)" }}>
            {String(current + 1).padStart(2, "0")} / {questions.length}
          </span>
        </div>
      </header>
      <div className="h-[3px]" style={{ background: "var(--tetr-surface)" }}>
        <div className="progress-line h-full" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto grid min-h-[calc(100svh-83px)] max-w-[1500px] lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r px-10 py-14 lg:flex lg:flex-col lg:justify-between" style={{ borderColor: "var(--tetr-border)" }}>
          <div>
            <p className="section-label">Current lens</p>
            <p className="mt-4 text-lg font-semibold tracking-[-0.03em]">{question.category}</p>
          </div>
          <p className="vertical-note font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--tetr-secondary)" }}>
            Answer from instinct
          </p>
        </aside>

        <section className="flex flex-col px-5 py-9 sm:px-9 sm:py-12 lg:px-16 xl:px-24">
          <div key={current} className="question-enter mx-auto flex w-full max-w-5xl flex-1 flex-col">
            <div className="mb-9 lg:mb-12">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] lg:hidden" style={{ color: "var(--tetr-secondary)" }}>{question.category}</p>
              <h1 className="max-w-4xl font-display text-[clamp(2.25rem,5vw,4.8rem)] leading-[0.98] tracking-[-0.055em]">
                {question.prompt}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">{question.context}</p>
            </div>

            <div className="grid md:grid-cols-2" style={{ borderTop: "1px solid var(--tetr-border-strong)" }}>
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                return (
                  <button
                    key={option.label}
                    onClick={() => onAnswer(index)}
                    className={`answer-option group relative min-h-[135px] border-b p-5 text-left transition-colors sm:p-6 md:min-h-[155px] ${
                      index % 2 === 0 ? "md:border-r" : ""
                    } ${isSelected ? "selected text-white" : "hover:bg-[#f5f5f5]"}`}
                    style={{ borderColor: "var(--tetr-border)" }}
                    aria-pressed={isSelected}
                  >
                    <span className={`option-letter ${isSelected ? "text-[var(--tetr-accent)]" : ""}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="mt-5 block pr-8 text-base font-semibold tracking-[-0.02em] sm:text-lg">{option.label}</span>
                    <span className={`mt-2 block max-w-sm text-xs leading-5 sm:text-sm ${isSelected ? "text-white/60" : "option-detail"}`}>
                      {option.detail}
                    </span>
                    <span className={`absolute right-5 top-5 transition-all ${isSelected ? "text-[var(--tetr-accent)] translate-x-0 opacity-100" : "translate-x-0 text-neutral-400 opacity-0 group-hover:opacity-100"}`}>
                      <ArrowIcon />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto flex items-center justify-between pt-8">
              <button
                onClick={onBack}
                disabled={current === 0}
                className="flex items-center gap-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ArrowIcon direction="left" /> Back
              </button>
              <button onClick={onNext} disabled={selected === undefined} className="primary-cta disabled:cursor-not-allowed disabled:opacity-30">
                {current === questions.length - 1 ? "See my result" : "Continue"}
                <ArrowIcon />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Results({ answers, onRetake, onHome }: { answers: number[]; onRetake: () => void; onHome: () => void }) {
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totals: ProgramScores = score(0, 0, 0);
    const traitTotals: Record<TraitId, number> = {
      builder: 0,
      analytical: 0,
      leader: 0,
      creative: 0,
      technical: 0,
      finance: 0,
      people: 0,
      impact: 0,
    };

    answers.forEach((answer, questionIndex) => {
      const option = questions[questionIndex]?.options[answer];
      if (!option) return;
      programOrder.forEach((id) => { totals[id] += option.scores[id]; });
      Object.entries(option.traits).forEach(([trait, value]) => {
        traitTotals[trait as TraitId] += value ?? 0;
      });
    });

    const ranked = [...programOrder].sort((a, b) => totals[b] - totals[a]);

    // Contrast-stretch compatibility scores so the winner clearly separates from runners-up.
    const rawScores = programOrder.map((id) => totals[id]);
    const rawMax = Math.max(...rawScores);
    const rawMin = Math.min(...rawScores);
    const rawSpread = rawMax - rawMin || 1;

    // Normalize every score to [0, 1] based on the session's min and max.
    const normalized: ProgramScores = Object.fromEntries(
      programOrder.map((id) => [id, (totals[id] - rawMin) / rawSpread])
    ) as ProgramScores;

    // Winner lands in 85–96% depending on absolute raw performance.
    // Runners-up are compressed toward 35–70% proportional to their gap behind the winner.
    const topScore = totals[ranked[0]];
    const absoluteCeiling = questions.length * 6; // new per-question ceiling after rebalancing
    const topStrength = Math.min(1, topScore / absoluteCeiling);
    const winnerFloor = 85;
    const winnerCeiling = 96;
    const winnerMin = Math.round(winnerFloor + (winnerCeiling - winnerFloor) * topStrength);

    const runnerMax = 70;
    const runnerMin = 35;

    const compatibility = Object.fromEntries(
      programOrder.map((id) => {
        const isWinner = id === ranked[0];
        const value = isWinner
          ? Math.round(winnerMin + (winnerCeiling - winnerMin) * normalized[id])
          : Math.round(runnerMin + (runnerMax - runnerMin) * normalized[id]);
        return [id, value];
      })
    ) as Record<ProgramId, number>;

    // Ensure ties are handled gracefully: if the top two raw scores are equal,
    // both receive the same rounded winner-tier value.
    if (totals[ranked[0]] === totals[ranked[1]]) {
      compatibility[ranked[1]] = compatibility[ranked[0]];
    }

    const topTraits = (Object.entries(traitTotals) as [TraitId, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
    const recommendation = programs[ranked[0]];
    const courses = [...recommendation.courses]
      .map((course, index) => ({
        ...course,
        relevance: course.traits.reduce((sum, trait) => sum + traitTotals[trait], 0),
        index,
      }))
      .sort((a, b) => b.relevance - a.relevance || a.index - b.index)
      .slice(0, 4);

    return { ranked, compatibility, topTraits, recommendation, courses };
  }, [answers]);

  const shareResult = async () => {
    const text = `My coursefit result is ${result.recommendation.title} (${result.compatibility[result.recommendation.id]}% match).`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My coursefit result", text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // A cancelled share action needs no follow-up.
    }
  };

  const top = result.recommendation;

  // Track conversion: fires once when the results screen mounts.
  useEffect(() => {
    track("quiz_completed", {
      recommended_program: top.shortTitle,
      match_percentage: result.compatibility[top.id],
    });
    // Intentionally fire only on mount; eslint-disable ensures a single conversion event per result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="results-enter text-[var(--tetr-black)]" style={{ background: "var(--tetr-white)" }}>
      <section className="result-hero relative overflow-hidden px-5 pb-16 pt-6 text-white sm:px-9 sm:pb-24 lg:px-12" style={{ background: "var(--tetr-primary)" }}>
        <div className="result-orb" />
        <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between">
          <button onClick={onHome} aria-label="Return to start"><TetrBrand light /></button>
          <button onClick={shareResult} className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75 transition-colors hover:text-[var(--tetr-accent)]">
            {copied ? "Copied" : "Share result"}
          </button>
        </header>

        <div className="relative z-10 mx-auto mt-20 max-w-[1400px] sm:mt-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-6 flex items-center gap-4" aria-hidden="true">
                {(() => {
                  const TopIcon = programIcons[top.id];
                  return (
                    <span
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11"
                      style={{ color: "var(--tetr-accent)", background: "rgba(255, 255, 255, 0.09)" }}
                    >
                      <TopIcon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.7} />
                    </span>
                  );
                })()}
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                  Program 0{programOrder.indexOf(top.id) + 1}
                </span>
              </div>
              <p className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.23em] text-[var(--tetr-accent)]">
                <span className="h-px w-8 bg-[var(--tetr-accent)]" />
                Your closest cohort fit
              </p>
              <p className="mb-5 font-mono text-xs text-white/45">PROFILE / {top.archetype.toUpperCase()}</p>
              <h1 className="max-w-5xl font-display text-[clamp(3.4rem,8.5vw,8.7rem)] leading-[0.82] tracking-[-0.075em] text-white">
                {top.shortTitle}
              </h1>
            </div>
            <div className="score-ring" style={{ "--score": result.compatibility[top.id] } as CSSProperties}>
              <div>
                <span className="block text-4xl font-semibold tracking-[-0.06em] text-[var(--tetr-accent)]">{result.compatibility[top.id]}%</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.19em] text-white/55">cohort match</span>
              </div>
            </div>
          </div>
          <div className="mt-14 grid gap-6 border-t border-white/20 pt-6 md:grid-cols-[1fr_1fr] md:gap-14">
            <p className="text-xl font-medium tracking-[-0.03em] sm:text-2xl text-white">{top.lens}</p>
            <p className="max-w-2xl text-sm leading-6 text-white/70 sm:text-base">{top.summary}</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-9 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="section-label">Your study signature</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Why it fits.
              </h2>
            </div>
            <div style={{ borderTop: "1px solid var(--tetr-border-strong)" }}>
              {result.topTraits.map((trait, index) => (
                <div key={trait} className="grid grid-cols-[42px_1fr] gap-4 border-b py-7 sm:grid-cols-[62px_1fr]" style={{ borderColor: "var(--tetr-border)" }}>
                  <span className="font-mono text-xs text-neutral-400">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{traitLabels[trait]}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">{traitDescriptions[trait]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-9 sm:py-28 lg:px-12" style={{ background: "var(--tetr-surface)" }}>
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-7 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="section-label">Curriculum preview</p>
              <h2 className="mt-5 max-w-sm font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Courses picked for you.
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-6 text-neutral-600">
                Selected from the TETR curriculum using the interests that came through most strongly in your answers.
              </p>
            </div>
            <div style={{ borderTop: "1px solid var(--tetr-border-strong)" }}>
              {result.courses.map((course, index) => (
                <div key={course.code + course.title} className="course-row grid gap-3 border-b py-7 sm:grid-cols-[105px_1fr] sm:gap-6" style={{ borderColor: "var(--tetr-border)" }}>
                  <span className="font-mono text-xs font-semibold" style={{ color: "var(--tetr-primary)" }}>{course.code}</span>
                  <div className="grid gap-2 md:grid-cols-[1fr_.7fr] md:gap-8">
                    <h3 className="text-lg font-semibold tracking-[-0.025em]">{course.title}</h3>
                    <p className="text-sm leading-5 text-neutral-600">{course.note}</p>
                  </div>
                  <span className="sr-only">Recommendation {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-9 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="section-label">Full comparison</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">Your match, in context.</h2>
            </div>
            <div className="space-y-9">
              {result.ranked.map((id, index) => {
                const program = programs[id];
                const match = result.compatibility[id];
                const Icon = programIcons[id];
                return (
                  <div key={id}>
                    <div className="mb-3 flex items-end justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <span
                          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center sm:h-11 sm:w-11"
                          style={{
                            color: "var(--tetr-primary)",
                            background: "var(--tetr-surface)",
                          }}
                          aria-hidden="true"
                        >
                          <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.7} />
                        </span>
                        <div>
                          <span className="font-mono text-[10px] text-neutral-400">0{index + 1} / MATCH {match}%</span>
                          <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] sm:text-xl">{program.shortTitle}</h3>
                        </div>
                      </div>
                      <span className="text-2xl font-semibold tracking-[-0.05em]">{match}%</span>
                    </div>
                    <div className="h-2 overflow-hidden" style={{ background: "var(--tetr-surface)" }}>
                      <div className="match-bar h-full" style={{ width: `${match}%`, background: program.accent }} />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.13em] text-neutral-500">{program.subjects}</p>
                  </div>
                );
              })}
              <p className="border-t pt-6 text-xs leading-5 text-neutral-500" style={{ borderColor: "var(--tetr-border-strong)" }}>
                TETR Program Finder is an open-source reflection tool, not an admissions assessment. Use the result to focus your research, then compare faculty, workload, internships, and career outcomes before deciding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-white sm:px-9 lg:px-12" style={{ background: "var(--tetr-primary)" }}>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Built for TETR</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl">
              A student-led, open-source reflection tool for the TETR community.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
              Designed by a student, for students — to help the TETR community choose their cohort class. Use it freely, share it with classmates, and always pair it with your own research.
            </p>
          </div>
          <button onClick={onRetake} className="primary-cta">
            Retake the quiz <ArrowIcon />
          </button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"intro" | "quiz" | "results">("intro");
  const [answers, setAnswers] = useState<Array<number | undefined>>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const startQuiz = () => {
    track("quiz_started");
    setAnswers([]);
    setCurrent(0);
    setScreen("quiz");
  };

  const retakeQuiz = () => {
    track("quiz_retake");
    setAnswers([]);
    setCurrent(0);
    setScreen("quiz");
  };

  const answerQuestion = (option: number) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[current] = option;
      return next;
    });
  };

  const nextQuestion = () => {
    if (answers[current] === undefined) return;

    // Track progress/drop-off: which question was just answered.
    track("question_answered", {
      question_index: current + 1,
      category: questions[current].category,
    });

    if (current === questions.length - 1) {
      setScreen("results");
      return;
    }
    setCurrent((value) => value + 1);
  };

  const backQuestion = () => {
    setCurrent((value) => Math.max(0, value - 1));
  };

  if (screen === "quiz") {
    return (
      <>
        <Quiz
          answers={answers}
          current={current}
          onAnswer={answerQuestion}
          onBack={backQuestion}
          onNext={nextQuestion}
          onExit={() => setScreen("intro")}
        />
        <Analytics />
      </>
    );
  }

  if (screen === "results") {
    return (
      <>
        <Results answers={answers as number[]} onRetake={retakeQuiz} onHome={() => setScreen("intro")} />
        <Analytics />
      </>
    );
  }

  return (
    <>
      <Intro onStart={startQuiz} />
      <Analytics />
    </>
  );
}