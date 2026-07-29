import { VentureModuleScreen } from '../../../src/components/ventureOS/VentureModuleScreen';

export default function CommunityScreen() {
  return <VentureModuleScreen eyebrow="Founder network" title="Build alongside the community" description="Share progress, compare decisions, and learn with founders moving through the same twelve-week program." icon="account-group-outline" stats={[{ value: '12', label: 'Weekly cohorts' }, { value: '0', label: 'Discussions' }, { value: '0', label: 'Connections' }]} nextTitle="Introduce your venture" nextDescription="Share what you are building with the cohort" />;
}