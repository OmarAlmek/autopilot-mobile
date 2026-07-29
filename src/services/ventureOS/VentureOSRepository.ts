import type {
  VentureArtifact,
  VentureCohortPost,
  VentureCompanyContext,
  VentureEntitlement,
  VentureModule,
  VentureProgress,
  VentureReflection,
  VentureTool,
} from '../../types/ventureOS';

export type VentureRepositoryErrorCode = 'not-found' | 'unavailable' | 'validation';

export class VentureRepositoryError extends Error {
  constructor(
    public readonly code: VentureRepositoryErrorCode,
    message: string,
    public readonly canRetry: boolean,
  ) {
    super(message);
    this.name = 'VentureRepositoryError';
  }
}

export interface VentureOSRepository {
  getCurriculum(): Promise<VentureModule[]>;
  getCompanyContext(): Promise<VentureCompanyContext>;
  saveCompanyContext(value: VentureCompanyContext): Promise<VentureCompanyContext>;
  getProgress(): Promise<VentureProgress>;
  saveProgress(value: VentureProgress): Promise<VentureProgress>;
  listReflections(): Promise<VentureReflection[]>;
  saveReflection(value: VentureReflection): Promise<VentureReflection>;
  listArtifacts(): Promise<VentureArtifact[]>;
  saveArtifact(artifactId: string, content: string, status: VentureArtifact['status']): Promise<VentureArtifact>;
  appendArtifactGuidance(artifactId: string, guidance: string): Promise<VentureArtifact>;
  listTools(): Promise<VentureTool[]>;
  setToolSaved(toolId: string, isSaved: boolean): Promise<VentureTool>;
  listCohortPosts(): Promise<VentureCohortPost[]>;
  getEntitlement(): Promise<VentureEntitlement>;
}

export function toVentureRepositoryError(error: unknown): VentureRepositoryError {
  if (error instanceof VentureRepositoryError) return error;
  return new VentureRepositoryError(
    'unavailable',
    'Venture OS could not load right now. Check your connection and try again.',
    true,
  );
}