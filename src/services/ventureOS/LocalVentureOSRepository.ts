import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  VentureArtifact,
  VentureCohortPost,
  VentureCommunityCommentInput,
  VentureCommunityPostInput,
  VentureCompanyContext,
  VentureEntitlement,
  VentureModule,
  VentureProgress,
  VentureReflection,
  VentureTool,
} from '../../types/ventureOS';
import { VentureRepositoryError, type VentureOSRepository } from './VentureOSRepository';

export type LocalRepositoryMode = 'ready' | 'empty' | 'error';

interface VentureStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

interface StoredVentureState {
  version: 1;
  companyContext: VentureCompanyContext;
  progress: VentureProgress;
  reflections?: VentureReflection[];
  artifacts?: VentureArtifact[];
  tools?: VentureTool[];
  cohortPosts?: VentureCohortPost[];
}

const STORAGE_KEY = '@autopilot/venture-os/v1';

const cohortPostSeeds: VentureCohortPost[] = [{
  id: 'welcome-to-the-cohort',
  authorName: 'Maya Chen',
  body: 'What is the one workflow you want to make meaningfully better during this program?',
  createdAt: '2026-07-21T09:00:00.000Z',
  comments: [{
    id: 'welcome-comment-1',
    postId: 'welcome-to-the-cohort',
    authorName: 'Jon Bell',
    body: 'Customer onboarding. We lose too much context between the sale and the first successful outcome.',
    createdAt: '2026-07-21T10:15:00.000Z',
    isReported: false,
  }],
  isReported: false,
}];

const artifactSeeds: VentureArtifact[] = [
  ['ai-economics-map', 'AI-Native Economics Map', 'Define the workflow unit, customer value, and economic change your company will prove.'],
  ['customer-reality-brief', 'Customer Reality Brief', 'Capture the painful work, current alternatives, and evidence from customer observation.'],
  ['opportunity-scorecard', 'Opportunity Scorecard', 'Compare use cases by pain, frequency, feasibility, trust, and durable advantage.'],
  ['system-blueprint', 'Human + AI System Blueprint', 'Assign human and agent roles, context boundaries, escalation rules, and accountable decisions.'],
  ['prototype-plan', 'Prototype Evidence Plan', 'Name the riskiest interaction, the prototype scope, and the evidence needed before building more.'],
  ['trust-evaluation-plan', 'Trust & Evaluation Plan', 'Define evaluation cases, quality thresholds, failure handling, and human approval controls.'],
  ['gtm-wedge', 'Go-to-Market Wedge', 'Specify the first buyer, urgent workflow, offer, channel, and learning loop.'],
  ['operating-system', 'Founder Operating System', 'Set the weekly decisions, metrics, reviews, and automations that keep execution accountable.'],
  ['risk-register', 'AI Risk Register', 'Track operational risks, permission bounds, owners, mitigations, and escalation paths.'],
  ['ninety-day-plan', '30/60/90-Day Plan', 'Sequence production readiness, launch evidence, and the next compounding capability.'],
].map(([id, title, description]) => ({
  id,
  title,
  description,
  content: '',
  guidance: [],
  status: 'not-started',
  updatedAt: null,
}));

const toolSeeds: VentureTool[] = [
  ['github-copilot', 'GitHub Copilot', 'AI pair programming across your editor and development workflow.', 'coding', 'https://github.com/features/copilot'],
  ['cursor', 'Cursor', 'AI-first code editor for navigating and changing large codebases.', 'coding', 'https://www.cursor.com'],
  ['replit', 'Replit', 'Build, run, and deploy software collaboratively from the browser.', 'coding', 'https://replit.com'],
  ['bolt', 'Bolt', 'Prompt-to-application development with an integrated browser runtime.', 'coding', 'https://bolt.new'],
  ['v0', 'v0', 'Generate and refine production-oriented web interfaces from prompts.', 'coding', 'https://v0.dev'],
  ['lovable', 'Lovable', 'Create full-stack product prototypes through conversational development.', 'coding', 'https://lovable.dev'],
  ['windsurf', 'Windsurf', 'Agentic development environment for multi-file implementation work.', 'coding', 'https://windsurf.com'],
  ['codesandbox', 'CodeSandbox', 'Cloud development environments for rapid web prototyping.', 'coding', 'https://codesandbox.io'],
  ['openai-agents', 'OpenAI Agents SDK', 'Build tool-using agent workflows with handoffs and traces.', 'agents', 'https://openai.github.io/openai-agents-python'],
  ['langgraph', 'LangGraph', 'Orchestrate stateful, controllable agent workflows as graphs.', 'agents', 'https://www.langchain.com/langgraph'],
  ['crewai', 'CrewAI', 'Coordinate role-based AI agents around shared tasks.', 'agents', 'https://www.crewai.com'],
  ['autogen', 'AutoGen', 'Framework for event-driven multi-agent applications.', 'agents', 'https://microsoft.github.io/autogen'],
  ['n8n', 'n8n', 'Automate tool and agent workflows with visual orchestration.', 'agents', 'https://n8n.io'],
  ['make', 'Make', 'Design visual automations across business applications.', 'agents', 'https://www.make.com'],
  ['zapier', 'Zapier', 'Connect application events to automated actions and AI steps.', 'agents', 'https://zapier.com'],
  ['pipedream', 'Pipedream', 'Build event-driven integrations with code and managed connectors.', 'agents', 'https://pipedream.com'],
  ['llamaindex', 'LlamaIndex', 'Connect private data to retrieval and agent applications.', 'rag', 'https://www.llamaindex.ai'],
  ['langchain', 'LangChain', 'Compose retrieval, model, and tool integrations.', 'rag', 'https://www.langchain.com'],
  ['pinecone', 'Pinecone', 'Managed vector database for production semantic retrieval.', 'rag', 'https://www.pinecone.io'],
  ['weaviate', 'Weaviate', 'Open-source vector database with hybrid search.', 'rag', 'https://weaviate.io'],
  ['qdrant', 'Qdrant', 'Vector search engine for filtered semantic retrieval.', 'rag', 'https://qdrant.tech'],
  ['chroma', 'Chroma', 'Open-source embedding database for local AI applications.', 'rag', 'https://www.trychroma.com'],
  ['unstructured', 'Unstructured', 'Prepare complex documents for retrieval pipelines.', 'rag', 'https://unstructured.io'],
  ['cohere-rerank', 'Cohere Rerank', 'Reorder retrieved documents by relevance to a query.', 'rag', 'https://cohere.com/rerank'],
  ['elevenlabs', 'ElevenLabs', 'Speech generation and conversational voice experiences.', 'voice', 'https://elevenlabs.io'],
  ['deepgram', 'Deepgram', 'Real-time speech recognition and voice agent infrastructure.', 'voice', 'https://deepgram.com'],
  ['cartesia', 'Cartesia', 'Low-latency speech generation for conversational products.', 'voice', 'https://cartesia.ai'],
  ['vapi', 'Vapi', 'Developer platform for deploying voice agents.', 'voice', 'https://vapi.ai'],
  ['retell', 'Retell AI', 'Build and monitor production phone agents.', 'voice', 'https://www.retellai.com'],
  ['livekit', 'LiveKit', 'Real-time media infrastructure for voice and video agents.', 'voice', 'https://livekit.io'],
  ['assemblyai', 'AssemblyAI', 'Speech-to-text models and audio intelligence APIs.', 'voice', 'https://www.assemblyai.com'],
  ['runway', 'Runway', 'Generate and edit video with AI production tools.', 'media', 'https://runwayml.com'],
  ['midjourney', 'Midjourney', 'Generate visual concepts and production imagery.', 'media', 'https://www.midjourney.com'],
  ['adobe-firefly', 'Adobe Firefly', 'Generate commercially oriented images and design assets.', 'media', 'https://www.adobe.com/products/firefly.html'],
  ['canva-magic-studio', 'Canva Magic Studio', 'Create branded visual assets with assisted design tools.', 'media', 'https://www.canva.com/magic-studio'],
  ['descript', 'Descript', 'Edit audio and video through transcript-based workflows.', 'media', 'https://www.descript.com'],
  ['synthesia', 'Synthesia', 'Create presenter-led videos from scripts.', 'media', 'https://www.synthesia.io'],
  ['ideogram', 'Ideogram', 'Generate images with strong text rendering and layout control.', 'media', 'https://ideogram.ai'],
  ['heygen', 'HeyGen', 'Create avatar video and localized media.', 'media', 'https://www.heygen.com'],
  ['lakera', 'Lakera Guard', 'Protect model applications against prompt attacks and unsafe inputs.', 'compliance', 'https://www.lakera.ai'],
  ['protect-ai', 'Protect AI', 'Secure machine-learning supply chains and model deployments.', 'compliance', 'https://protectai.com'],
  ['whylabs', 'WhyLabs', 'Monitor model quality, drift, and production behavior.', 'compliance', 'https://whylabs.ai'],
  ['patronus', 'Patronus AI', 'Evaluate and monitor model outputs for reliability.', 'compliance', 'https://www.patronus.ai'],
  ['arize', 'Arize AI', 'Observe, evaluate, and debug AI application behavior.', 'compliance', 'https://arize.com'],
  ['fiddler', 'Fiddler AI', 'Monitor and govern predictive and generative AI systems.', 'compliance', 'https://www.fiddler.ai'],
  ['credal', 'Credal', 'Apply data controls and policy enforcement to enterprise AI.', 'compliance', 'https://www.credal.ai'],
  ['garak', 'Garak', 'Open-source vulnerability scanner for language models.', 'compliance', 'https://github.com/NVIDIA/garak'],
  ['perplexity', 'Perplexity', 'Research topics through cited web answers and follow-up questions.', 'research', 'https://www.perplexity.ai'],
  ['elicit', 'Elicit', 'Find and synthesize evidence from academic research.', 'research', 'https://elicit.com'],
  ['consensus', 'Consensus', 'Search scientific literature and compare evidence-backed findings.', 'research', 'https://consensus.app'],
  ['notebooklm', 'NotebookLM', 'Analyze a bounded source collection with grounded responses.', 'research', 'https://notebooklm.google'],
  ['scite', 'scite', 'Inspect how research papers are cited and supported.', 'research', 'https://scite.ai'],
  ['exa', 'Exa', 'Search the web semantically for AI applications and research.', 'research', 'https://exa.ai'],
  ['tavily', 'Tavily', 'Web search API designed for agent research workflows.', 'research', 'https://tavily.com'],
  ['you-com', 'You.com', 'Research assistant with web search and source exploration.', 'research', 'https://you.com'],
].map(([id, name, description, category, url]) => ({
  id,
  name,
  description,
  category: category as VentureTool['category'],
  url,
  isSaved: false,
}));

const moduleSeeds = [
  ['ai-native-company', 'The AI-Native Company', 'Economics, leverage, and momentum', ['AI-native economics', 'The leverage gap', 'Your founder thesis']],
  ['customer-reality', 'Customer Reality', 'Find painful work worth changing', ['Pain before product', 'Workflow observation']],
  ['opportunity-map', 'Opportunity Map', 'Choose where AI creates durable value', ['Map the workflow', 'Score the opportunity']],
  ['system-design', 'System Design', 'Shape a dependable AI product', ['Human and agent roles', 'Data and context']],
  ['prototype', 'Prototype the Core', 'Test the riskiest interaction quickly', ['Prototype strategy', 'Evidence over demos']],
  ['evaluation', 'Evaluation and Trust', 'Measure quality before scaling', ['Build an evaluation set', 'Design trust controls']],
  ['go-to-market', 'AI-Native Go-to-Market', 'Reach buyers with a precise wedge', ['Choose the wedge', 'Design the learning loop']],
  ['operations', 'Operating System', 'Run the company with compounding context', ['Founder operating rhythm', 'Automate the routine']],
  ['risk', 'Risk and Governance', 'Make responsible operation concrete', ['Map operational risk', 'Set governance boundaries']],
  ['launch', 'Launch and Compound', 'Ship, learn, and build momentum', ['Production readiness', 'Launch with evidence', 'The next ninety days']],
] as const;

const aiNativeEconomicsLesson = {
  status: 'published',
  durationMinutes: 8,
  outcome: 'Identify one workflow where AI can improve customer value without adding equivalent operating cost.',
  sections: [
    {
      id: 'economics-shift',
      heading: 'The economics shift',
      body: 'Traditional software makes a fixed workflow easier to repeat. An AI-native company can interpret context, produce a first draft, and improve from feedback. The opportunity is not simply lower labor cost. It is delivering a useful outcome faster while serving work that was previously too expensive or inconsistent to handle.',
    },
    {
      id: 'cost-vs-value',
      heading: 'Separate cost from value',
      body: 'A strong AI workflow changes two curves: the cost of producing an outcome and the value customers receive from it. Automation that only moves work from an employee to a customer is not leverage. Look for faster decisions, fewer errors, better coverage, or a service that becomes practical for a smaller customer.',
    },
    {
      id: 'workflow-unit',
      heading: 'Choose a measurable unit',
      body: 'Work at the level of one repeated unit: one quote, lease review, patient intake, lesson plan, claim, contract, or candidate screen. Record the current time, handoffs, failure rate, and customer consequence. That baseline lets you test whether AI creates real leverage rather than an impressive demo.',
    },
  ],
  exercise: {
    heading: 'Map one unit of work',
    instruction: 'Choose one repeated customer workflow. Write its current time to complete, the people or tools involved, the cost of a mistake, and the improvement a customer would notice.',
  },
  reflectionPrompt: {
    id: 'ai-native-company-1-application',
    label: 'Which unit of work should become dramatically faster, cheaper, or more valuable, and what evidence would prove the change matters?',
  },
  trackExamples: {
    tradeflow: 'A distributor turns an emailed parts list into a checked quote in minutes, while a salesperson reviews substitutions and margin exceptions.',
    proptech: 'A property manager summarizes a lease application, flags missing evidence, and prepares a review packet before a human approval decision.',
    clinicflow: 'A clinic converts referral documents into a structured intake summary while clinical staff verify urgency and missing information.',
    edubridge: 'A teacher produces differentiated practice drafts from recent assessment evidence, then reviews them before assigning work.',
    agrimarket: 'A produce buyer combines quality notes, availability, and delivery constraints into a proposed order for human confirmation.',
    serviceops: 'A field-service company turns a customer description and equipment history into a scoped work-order draft before dispatch.',
    financedesk: 'A finance team reconciles supporting documents into an exception queue instead of manually checking every transaction.',
    legalops: 'A legal team extracts obligations and unusual clauses from a contract, leaving interpretation and negotiation to counsel.',
    retailpulse: 'A retailer converts demand, stock, and local events into replenishment recommendations that a planner can approve.',
    talentmatch: 'A recruiting team compares evidence from applications against role criteria and prepares a review brief without making the hiring decision.',
  },
} as const;

const leverageGapLesson = {
  status: 'published',
  durationMinutes: 9,
  outcome: 'Choose an AI role that expands what a small team can deliver while keeping accountable decisions with people.',
  sections: [
    {
      id: 'leverage-not-headcount',
      heading: 'Leverage is not headcount removal',
      body: 'The leverage gap is the distance between what your team can deliver today and what it could deliver when AI handles high-volume interpretation, drafting, and coordination. The goal is not to erase every human step. It is to reserve human attention for judgment, trust, and exceptions while software absorbs work that scales poorly.',
    },
    {
      id: 'three-roles',
      heading: 'Give AI a bounded role',
      body: 'Start with one of three roles: prepare, recommend, or execute. Preparation gathers context and creates a draft. Recommendation ranks options with evidence. Execution performs a reversible action inside clear limits. Moving directly to execution creates risk before you understand quality, exceptions, and customer expectations.',
    },
    {
      id: 'control-point',
      heading: 'Design the control point',
      body: 'Name who reviews the output, which evidence they see, and what makes the work stop for human attention. A useful control point is fast for routine cases and unmistakable for exceptions. If reviewers must redo the whole task, the workflow has moved work rather than created leverage.',
    },
  ],
  exercise: {
    heading: 'Assign roles across the workflow',
    instruction: 'Take the unit of work from lesson 1. Mark each step as human-owned, AI-prepared, AI-recommended, or AI-executed. Add one condition that must always escalate to a person.',
  },
  reflectionPrompt: {
    id: 'ai-native-company-2-application',
    label: 'Where is the largest leverage gap in this workflow, and which decision must remain visibly human-owned?',
  },
  trackExamples: {
    tradeflow: 'AI prepares a quote from a parts list and recommends substitutions; a salesperson owns margin exceptions and the final customer commitment.',
    proptech: 'AI prepares a lease-review packet and recommends missing checks; a property manager owns approval, rejection, and exception handling.',
    clinicflow: 'AI prepares an intake summary and recommends routing; clinical staff own urgency, diagnosis, and care decisions.',
    edubridge: 'AI prepares differentiated exercises and recommends groupings; the teacher owns learning goals, assignment, and intervention.',
    agrimarket: 'AI prepares an order plan and recommends alternatives; the buyer owns supplier commitments and quality exceptions.',
    serviceops: 'AI prepares a work order and recommends a technician; dispatch owns safety exceptions, scheduling conflicts, and final assignment.',
    financedesk: 'AI prepares reconciliation evidence and recommends exception categories; finance staff own adjustments and sign-off.',
    legalops: 'AI prepares a clause comparison and recommends review priorities; counsel owns interpretation, advice, and negotiation.',
    retailpulse: 'AI prepares replenishment quantities and recommends transfers; the planner owns promotions, unusual demand, and purchase approval.',
    talentmatch: 'AI prepares evidence summaries and recommends review order; recruiters own candidate evaluation, communication, and hiring decisions.',
  },
} as const;

const founderThesisLesson = {
  status: 'published',
  durationMinutes: 10,
  outcome: 'Write a falsifiable founder thesis connecting a painful workflow, an AI advantage, and evidence you can collect now.',
  sections: [
    {
      id: 'thesis-not-vision',
      heading: 'A thesis is a testable belief',
      body: 'A vision describes the future you want. A founder thesis states why a specific change should happen now and what must be true for your company to create it. It should be narrow enough to challenge with customer evidence, not broad enough to survive every outcome.',
    },
    {
      id: 'thesis-parts',
      heading: 'Connect four claims',
      body: 'A useful thesis names the customer, the painful unit of work, the new AI-enabled outcome, and the advantage your company can compound. The advantage may be proprietary workflow context, trusted distribution, evaluation data, or a learning loop. Access to a general model alone is not a durable advantage.',
    },
    {
      id: 'falsify-early',
      heading: 'Try to disprove it early',
      body: 'List the riskiest belief inside the thesis and seek evidence that could prove it wrong. Customers may not value the speed, the data may be unavailable, review may erase the savings, or the workflow may be too rare. A failed belief discovered this week is cheaper than a polished product built on it.',
    },
  ],
  exercise: {
    heading: 'Write the one-sentence thesis',
    instruction: 'Complete this structure: We believe [customer] will choose [new outcome] for [painful workflow] because AI now enables [specific advantage]. We will reconsider if [observable evidence] does not occur.',
  },
  reflectionPrompt: {
    id: 'ai-native-company-3-application',
    label: 'What is your current founder thesis, and which single observation would most seriously challenge it?',
  },
  trackExamples: {
    tradeflow: 'We believe regional distributors will adopt same-hour quote preparation because AI can interpret messy parts requests; we will reconsider if faster quotes do not improve conversion or response capacity.',
    proptech: 'We believe small property teams will pay for review-ready lease packets because AI can organize fragmented application evidence; we will reconsider if review time does not fall without increasing approval risk.',
    clinicflow: 'We believe specialty clinics will adopt structured referral intake because AI can organize unstandardized documents; we will reconsider if clinical review time or missing-information rates do not improve.',
    edubridge: 'We believe teachers will use evidence-based practice drafts because AI can adapt materials to recent assessment data; we will reconsider if preparation time falls but classroom usefulness does not improve.',
    agrimarket: 'We believe produce buyers will use constraint-aware order proposals because AI can combine availability, quality, and delivery context; we will reconsider if exception handling erases the planning gain.',
    serviceops: 'We believe field-service operators will adopt dispatch-ready work orders because AI can interpret customer language and equipment history; we will reconsider if first-visit resolution does not improve.',
    financedesk: 'We believe lean finance teams will adopt evidence-linked reconciliation queues because AI can prioritize true exceptions; we will reconsider if reviewers still inspect nearly every transaction.',
    legalops: 'We believe in-house legal teams will adopt evidence-linked clause review because AI can focus counsel on unusual obligations; we will reconsider if verification takes as long as the original review.',
    retailpulse: 'We believe multi-site retailers will adopt local replenishment recommendations because AI can combine demand signals and operational context; we will reconsider if stock availability improves without reducing waste.',
    talentmatch: 'We believe recruiting teams will adopt evidence-first candidate briefs because AI can organize applications against explicit criteria; we will reconsider if review consistency or time-to-shortlist does not improve.',
  },
} as const;

const authoredModuleOneLessons = [
  aiNativeEconomicsLesson,
  leverageGapLesson,
  founderThesisLesson,
] as const;

const curriculum: VentureModule[] = moduleSeeds.map(([id, title, summary, lessonTitles], moduleIndex) => ({
  id,
  title,
  summary,
  order: moduleIndex + 1,
  lessons: lessonTitles.map((lessonTitle, lessonIndex) => ({
    id: `${id}-${lessonIndex + 1}`,
    moduleId: id,
    title: lessonTitle,
    summary: id === 'ai-native-company'
      ? [
        'Learn where AI changes the cost and value of delivering one repeated customer outcome.',
        'Design a bounded role for AI that expands team capacity without hiding human accountability.',
        'Turn your opportunity into a founder thesis that evidence can prove wrong.',
      ][lessonIndex]
      : 'Lesson content is being prepared for the authored curriculum.',
    order: lessonIndex + 1,
    status: 'draft',
    ...(id === 'ai-native-company' ? authoredModuleOneLessons[lessonIndex] : {}),
  })),
}));

const emptyCompanyContext: VentureCompanyContext = {
  name: '',
  company: '',
  industry: '',
  stage: '',
  customer: '',
  painfulWorkflow: '',
  tools: '',
  aiMaturity: '',
  constraints: '',
  goals: '',
};

export class LocalVentureOSRepository implements VentureOSRepository {
  private companyContext = emptyCompanyContext;
  private progress: VentureProgress = { completedLessonIds: [], selectedTrack: 'tradeflow' };
  private readonly reflections = new Map<string, VentureReflection>();
  private readonly artifacts = new Map<string, VentureArtifact>(artifactSeeds.map((artifact) => [artifact.id, artifact]));
  private readonly tools = new Map<string, VentureTool>(toolSeeds.map((tool) => [tool.id, tool]));
  private readonly cohortPosts = new Map<string, VentureCohortPost>(cohortPostSeeds.map((post) => [post.id, post]));
  private hydration: Promise<void> | null = null;

  constructor(
    private readonly mode: LocalRepositoryMode = 'ready',
    private readonly storage: VentureStorage = AsyncStorage,
  ) {}

  private ensureAvailable() {
    if (this.mode === 'error') {
      throw new VentureRepositoryError(
        'unavailable',
        'Venture OS could not load right now. Check your connection and try again.',
        true,
      );
    }
  }

  private async hydrate() {
    this.ensureAvailable();
    if (!this.hydration) {
      this.hydration = this.storage.getItem(STORAGE_KEY).then((value) => {
        if (!value) return;
        const stored = JSON.parse(value) as Partial<StoredVentureState>;
        if (stored.version !== 1 || !stored.companyContext || !stored.progress) {
          throw new Error('Unsupported Venture OS state');
        }
        this.companyContext = stored.companyContext;
        this.progress = stored.progress;
        this.reflections.clear();
        stored.reflections?.forEach((reflection) => this.reflections.set(reflection.id, reflection));
        stored.artifacts?.forEach((artifact) => {
          if (this.artifacts.has(artifact.id)) this.artifacts.set(artifact.id, artifact);
        });
        stored.tools?.forEach((tool) => {
          if (this.tools.has(tool.id)) this.tools.set(tool.id, tool);
        });
        stored.cohortPosts?.forEach((post) => this.cohortPosts.set(post.id, post));
      }).catch(() => {
        this.hydration = null;
        throw new VentureRepositoryError(
          'unavailable',
          'Your company profile could not be loaded. Your saved data has not been changed.',
          true,
        );
      });
    }
    return this.hydration;
  }

  private async persist() {
    try {
      const value: StoredVentureState = {
        version: 1,
        companyContext: this.companyContext,
        progress: this.progress,
        reflections: [...this.reflections.values()],
        artifacts: [...this.artifacts.values()],
        tools: [...this.tools.values()],
        cohortPosts: [...this.cohortPosts.values()],
      };
      await this.storage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      throw new VentureRepositoryError(
        'unavailable',
        'Your changes could not be saved. They are still available on this screen so you can try again.',
        true,
      );
    }
  }

  async getCurriculum() {
    this.ensureAvailable();
    return this.mode === 'empty' ? [] : curriculum;
  }

  async getCompanyContext() {
    await this.hydrate();
    return this.companyContext;
  }

  async saveCompanyContext(value: VentureCompanyContext) {
    await this.hydrate();
    const previous = this.companyContext;
    this.companyContext = value;
    try {
      await this.persist();
    } catch (error) {
      this.companyContext = previous;
      throw error;
    }
    return value;
  }

  async getProgress() {
    await this.hydrate();
    return this.progress;
  }

  async saveProgress(value: VentureProgress) {
    await this.hydrate();
    const previous = this.progress;
    this.progress = value;
    try {
      await this.persist();
    } catch (error) {
      this.progress = previous;
      throw error;
    }
    return value;
  }

  async saveReflection(value: VentureReflection) {
    await this.hydrate();
    const previous = this.reflections.get(value.id);
    this.reflections.set(value.id, value);
    try {
      await this.persist();
    } catch (error) {
      if (previous) {
        this.reflections.set(value.id, previous);
      } else {
        this.reflections.delete(value.id);
      }
      throw error;
    }
    return value;
  }

  async listReflections() {
    await this.hydrate();
    return [...this.reflections.values()];
  }

  async listArtifacts() {
    await this.hydrate();
    return [...this.artifacts.values()];
  }

  async saveArtifact(artifactId: string, content: string, status: VentureArtifact['status']) {
    await this.hydrate();
    const artifact = this.artifacts.get(artifactId);
    if (!artifact) {
      throw new VentureRepositoryError('not-found', 'That playbook artifact was not found.', false);
    }
    if (!content.trim() && status !== 'not-started') {
      throw new VentureRepositoryError('validation', 'Add your working draft before changing its status.', false);
    }
    const updated: VentureArtifact = {
      ...artifact,
      content,
      status: content.trim() ? status : 'not-started',
      updatedAt: new Date().toISOString(),
    };
    this.artifacts.set(artifactId, updated);
    try {
      await this.persist();
    } catch (error) {
      this.artifacts.set(artifactId, artifact);
      throw error;
    }
    return updated;
  }

  async appendArtifactGuidance(artifactId: string, guidance: string) {
    await this.hydrate();
    const artifact = this.artifacts.get(artifactId);
    if (!artifact) {
      throw new VentureRepositoryError('not-found', 'That playbook artifact was not found.', false);
    }
    if (!guidance.trim()) {
      throw new VentureRepositoryError('validation', 'Guidance cannot be empty.', false);
    }
    const now = new Date().toISOString();
    const updated: VentureArtifact = {
      ...artifact,
      guidance: [...artifact.guidance, {
        id: `guidance-${now}-${artifact.guidance.length + 1}`,
        source: 'ai',
        content: guidance.trim(),
        createdAt: now,
      }],
      updatedAt: now,
    };
    this.artifacts.set(artifactId, updated);
    try {
      await this.persist();
    } catch (error) {
      this.artifacts.set(artifactId, artifact);
      throw error;
    }
    return updated;
  }

  async listTools(): Promise<VentureTool[]> {
    await this.hydrate();
    return this.mode === 'empty' ? [] : [...this.tools.values()];
  }

  async setToolSaved(toolId: string, isSaved: boolean): Promise<VentureTool> {
    await this.hydrate();
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new VentureRepositoryError('not-found', 'That toolbox item was not found.', false);
    }
    const updated = { ...tool, isSaved };
    this.tools.set(toolId, updated);
    try {
      await this.persist();
    } catch (error) {
      this.tools.set(toolId, tool);
      throw error;
    }
    return updated;
  }

  async listCohortPosts(): Promise<VentureCohortPost[]> {
    await this.hydrate();
    return this.mode === 'empty' ? [] : [...this.cohortPosts.values()]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async createCohortPost(value: VentureCommunityPostInput): Promise<VentureCohortPost> {
    await this.hydrate();
    const authorName = value.authorName.trim();
    const body = value.body.trim();
    if (!authorName || !body) {
      throw new VentureRepositoryError('validation', 'Add your name and an update before publishing.', false);
    }
    const createdAt = new Date().toISOString();
    const post: VentureCohortPost = {
      id: `post-${createdAt}-${this.cohortPosts.size + 1}`,
      authorName,
      body,
      createdAt,
      comments: [],
      isReported: false,
    };
    this.cohortPosts.set(post.id, post);
    try {
      await this.persist();
    } catch (error) {
      this.cohortPosts.delete(post.id);
      throw error;
    }
    return post;
  }

  async addCohortComment(postId: string, value: VentureCommunityCommentInput): Promise<VentureCohortPost> {
    await this.hydrate();
    const post = this.cohortPosts.get(postId);
    if (!post) throw new VentureRepositoryError('not-found', 'That discussion was not found.', false);
    const authorName = value.authorName.trim();
    const body = value.body.trim();
    if (!authorName || !body) {
      throw new VentureRepositoryError('validation', 'Add your name and a comment before publishing.', false);
    }
    const createdAt = new Date().toISOString();
    const updated: VentureCohortPost = {
      ...post,
      comments: [...post.comments, {
        id: `comment-${createdAt}-${post.comments.length + 1}`,
        postId,
        authorName,
        body,
        createdAt,
        isReported: false,
      }],
    };
    this.cohortPosts.set(postId, updated);
    try {
      await this.persist();
    } catch (error) {
      this.cohortPosts.set(postId, post);
      throw error;
    }
    return updated;
  }

  async reportCohortContent(contentId: string, contentType: 'post' | 'comment'): Promise<VentureCohortPost> {
    await this.hydrate();
    const post = contentType === 'post'
      ? this.cohortPosts.get(contentId)
      : [...this.cohortPosts.values()].find((item) => item.comments.some((comment) => comment.id === contentId));
    if (!post) throw new VentureRepositoryError('not-found', 'That community content was not found.', false);
    const updated: VentureCohortPost = contentType === 'post'
      ? { ...post, isReported: true }
      : { ...post, comments: post.comments.map((comment) => comment.id === contentId ? { ...comment, isReported: true } : comment) };
    this.cohortPosts.set(post.id, updated);
    try {
      await this.persist();
    } catch (error) {
      this.cohortPosts.set(post.id, post);
      throw error;
    }
    return updated;
  }

  async getEntitlement(): Promise<VentureEntitlement> {
    this.ensureAvailable();
    return { programId: 'venture-os', status: 'active', cohortId: null };
  }
}

export const localVentureOSRepository = new LocalVentureOSRepository();