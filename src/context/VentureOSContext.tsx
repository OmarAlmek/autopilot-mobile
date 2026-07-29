import React, { createContext, useContext, useEffect, useState } from 'react';

import { localVentureOSRepository } from '../services/ventureOS/LocalVentureOSRepository';
import {
  toVentureRepositoryError,
  type VentureOSRepository,
  type VentureRepositoryError,
} from '../services/ventureOS/VentureOSRepository';
import type { VentureArtifact, VentureCompanyContext, VentureModule, VentureReflection, VentureTool, VentureTrack } from '../types/ventureOS';

export type VentureResource<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: VentureRepositoryError };

interface VentureOSContextValue {
  companyContext: VentureCompanyContext;
  companyContextResource: VentureResource<VentureCompanyContext>;
  curriculum: VentureResource<VentureModule[]>;
  artifacts: VentureResource<VentureArtifact[]>;
  tools: VentureResource<VentureTool[]>;
  completedLessons: string[];
  reflections: VentureReflection[];
  selectedTrack: VentureTrack;
  reloadCurriculum: () => void;
  reloadCompanyContext: () => void;
  reloadArtifacts: () => void;
  reloadTools: () => void;
  setCompanyContext: (value: VentureCompanyContext) => Promise<void>;
  saveArtifact: (artifactId: string, content: string, status: VentureArtifact['status']) => Promise<void>;
  appendArtifactGuidance: (artifactId: string, guidance: string) => Promise<void>;
  setToolSaved: (toolId: string, isSaved: boolean) => Promise<void>;
  saveReflection: (value: VentureReflection) => Promise<void>;
  setSelectedTrack: (track: VentureTrack) => Promise<void>;
  toggleLessonComplete: (lessonId: string) => Promise<void>;
}

const initialCompanyContext: VentureCompanyContext = {
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

const VentureOSContext = createContext<VentureOSContextValue | null>(null);

interface VentureOSProviderProps extends React.PropsWithChildren {
  repository?: VentureOSRepository;
}

export function VentureOSProvider({ children, repository = localVentureOSRepository }: VentureOSProviderProps) {
  const [companyContext, setCompanyContextState] = useState(initialCompanyContext);
  const [companyContextResource, setCompanyContextResource] = useState<VentureResource<VentureCompanyContext>>({ status: 'loading' });
  const [curriculum, setCurriculum] = useState<VentureResource<VentureModule[]>>({ status: 'loading' });
  const [artifacts, setArtifacts] = useState<VentureResource<VentureArtifact[]>>({ status: 'loading' });
  const [tools, setTools] = useState<VentureResource<VentureTool[]>>({ status: 'loading' });
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [reflections, setReflections] = useState<VentureReflection[]>([]);
  const [selectedTrack, setSelectedTrackState] = useState<VentureTrack>('tradeflow');

  const reloadCurriculum = () => {
    setCurriculum({ status: 'loading' });
    repository.getCurriculum()
      .then((data) => setCurriculum({ status: 'ready', data }))
      .catch((error: unknown) => setCurriculum({ status: 'error', error: toVentureRepositoryError(error) }));
  };

  const reloadCompanyContext = () => {
    setCompanyContextResource({ status: 'loading' });
    repository.getCompanyContext()
      .then((data) => {
        setCompanyContextState(data);
        setCompanyContextResource({ status: 'ready', data });
      })
      .catch((error: unknown) => setCompanyContextResource({ status: 'error', error: toVentureRepositoryError(error) }));
  };

  const reloadArtifacts = () => {
    setArtifacts({ status: 'loading' });
    repository.listArtifacts()
      .then((data) => setArtifacts({ status: 'ready', data }))
      .catch((error: unknown) => setArtifacts({ status: 'error', error: toVentureRepositoryError(error) }));
  };

  const reloadTools = () => {
    setTools({ status: 'loading' });
    repository.listTools()
      .then((data) => setTools({ status: 'ready', data }))
      .catch((error: unknown) => setTools({ status: 'error', error: toVentureRepositoryError(error) }));
  };

  useEffect(() => {
    reloadCurriculum();
    reloadCompanyContext();
    reloadArtifacts();
    reloadTools();
    repository.getProgress().then((progress) => {
      setCompletedLessons(progress.completedLessonIds);
      setSelectedTrackState(progress.selectedTrack);
    }).catch(() => undefined);
    repository.listReflections().then(setReflections).catch(() => undefined);
  }, [repository]);

  const setCompanyContext = async (value: VentureCompanyContext) => {
    const saved = await repository.saveCompanyContext(value);
    setCompanyContextState(saved);
    setCompanyContextResource({ status: 'ready', data: saved });
  };

  const setSelectedTrack = async (track: VentureTrack) => {
    const saved = await repository.saveProgress({ completedLessonIds: completedLessons, selectedTrack: track });
    setSelectedTrackState(saved.selectedTrack);
  };

  const saveReflection = async (value: VentureReflection) => {
    const saved = await repository.saveReflection(value);
    setReflections((current) => [
      ...current.filter((reflection) => reflection.id !== saved.id),
      saved,
    ]);
  };

  const updateArtifactResource = (saved: VentureArtifact) => {
    setArtifacts((current) => current.status === 'ready'
      ? { status: 'ready', data: current.data.map((artifact) => artifact.id === saved.id ? saved : artifact) }
      : current);
  };

  const saveArtifact = async (artifactId: string, content: string, status: VentureArtifact['status']) => {
    const saved = await repository.saveArtifact(artifactId, content, status);
    updateArtifactResource(saved);
  };

  const appendArtifactGuidance = async (artifactId: string, guidance: string) => {
    const saved = await repository.appendArtifactGuidance(artifactId, guidance);
    updateArtifactResource(saved);
  };

  const setToolSaved = async (toolId: string, isSaved: boolean) => {
    const saved = await repository.setToolSaved(toolId, isSaved);
    setTools((current) => current.status === 'ready'
      ? { status: 'ready', data: current.data.map((tool) => tool.id === saved.id ? saved : tool) }
      : current);
  };

  const toggleLessonComplete = async (lessonId: string) => {
    const nextCompletedLessons = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    const saved = await repository.saveProgress({
      completedLessonIds: nextCompletedLessons,
      selectedTrack,
    });
    setCompletedLessons(saved.completedLessonIds);
  };

  return (
    <VentureOSContext.Provider value={{
      companyContext,
      companyContextResource,
      curriculum,
      artifacts,
      tools,
      completedLessons,
      reflections,
      selectedTrack,
      reloadCurriculum,
      reloadCompanyContext,
      reloadArtifacts,
      reloadTools,
      setCompanyContext,
      saveArtifact,
      appendArtifactGuidance,
      setToolSaved,
      saveReflection,
      setSelectedTrack,
      toggleLessonComplete,
    }}>
      {children}
    </VentureOSContext.Provider>
  );
}

export function useVentureOS() {
  const context = useContext(VentureOSContext);
  if (!context) throw new Error('useVentureOS must be used within VentureOSProvider');
  return context;
}