export type VentureTrack =
  | 'tradeflow'
  | 'proptech'
  | 'clinicflow'
  | 'edubridge'
  | 'agrimarket'
  | 'serviceops'
  | 'financedesk'
  | 'legalops'
  | 'retailpulse'
  | 'talentmatch';

export interface VentureCompanyContext {
  name: string;
  company: string;
  industry: string;
  stage: string;
  customer: string;
  painfulWorkflow: string;
  tools: string;
  aiMaturity: string;
  constraints: string;
  goals: string;
}

export interface VentureLesson {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  order: number;
  status: 'draft' | 'published';
  durationMinutes?: number;
  outcome?: string;
  sections?: readonly VentureLessonSection[];
  exercise?: VentureLessonExercise;
  reflectionPrompt?: VentureLessonReflectionPrompt;
  trackExamples?: Partial<Record<VentureTrack, string>>;
}

export interface VentureLessonSection {
  id: string;
  heading: string;
  body: string;
}

export interface VentureLessonExercise {
  heading: string;
  instruction: string;
}

export interface VentureLessonReflectionPrompt {
  id: string;
  label: string;
}

export interface VentureModule {
  id: string;
  title: string;
  summary: string;
  order: number;
  lessons: VentureLesson[];
}

export interface VentureReflection {
  id: string;
  lessonId: string;
  promptId: string;
  response: string;
  updatedAt: string;
}

export type VentureArtifactStatus = 'not-started' | 'draft' | 'complete';

export interface VentureArtifactGuidance {
  id: string;
  source: 'ai';
  content: string;
  createdAt: string;
}

export interface VentureArtifact {
  id: string;
  title: string;
  description: string;
  content: string;
  guidance: VentureArtifactGuidance[];
  status: VentureArtifactStatus;
  updatedAt: string | null;
}

export type VentureToolCategory =
  | 'coding'
  | 'agents'
  | 'rag'
  | 'voice'
  | 'media'
  | 'compliance'
  | 'research';

export interface VentureTool {
  id: string;
  name: string;
  description: string;
  category: VentureToolCategory;
  url: string;
  isSaved: boolean;
}

export interface VentureCohortPost {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  commentCount: number;
}

export interface VentureEntitlement {
  programId: 'venture-os';
  status: 'active' | 'expired' | 'unavailable';
  cohortId: string | null;
}

export interface VentureProgress {
  completedLessonIds: string[];
  selectedTrack: VentureTrack;
}