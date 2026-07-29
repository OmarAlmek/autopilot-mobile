export interface LessonSection {
  heading: string;
  body: string;
}

export interface LessonReflectionPrompt {
  id: string;
  label: string;
}

export type LessonContentSource =
  | { kind: 'html'; html: string; baseUrl: string }
  | { kind: 'uri'; uri: string };

export interface LessonContentProps {
  title: string;
  summary: string;
  durationMinutes: number;
  outcome: string;
  sections: readonly LessonSection[];
  example: string;
  exercise: {
    heading: string;
    instruction: string;
  };
  reflectionPrompt: LessonReflectionPrompt;
  source: LessonContentSource;
  allowedOrigins: readonly string[];
  initialReflectionResponse?: string;
  isOffline?: boolean;
  onSaveReflection: (promptId: string, response: string) => void | Promise<void>;
  onAppendToPlaybook: (artifactId: string, content: string) => void | Promise<void>;
}