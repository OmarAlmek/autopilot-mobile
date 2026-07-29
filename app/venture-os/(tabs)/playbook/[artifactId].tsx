import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../../../src/components/common/Button';
import { Card } from '../../../../src/components/common/Card';
import { IconButton } from '../../../../src/components/common/IconButton';
import { Screen } from '../../../../src/components/common/Screen';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../../src/context/VentureOSContext';
import { colors, radii, spacing, typography } from '../../../../src/theme/tokens';
import type { VentureArtifactStatus } from '../../../../src/types/ventureOS';

const guidanceByArtifact: Record<string, string> = {
  'ai-economics-map': 'Make the unit of work measurable. Name its current cycle time, human approval point, failure cost, and the customer outcome that should improve.',
};

export default function ArtifactDetailScreen() {
  const { artifactId } = useLocalSearchParams<{ artifactId: string }>();
  const { appendArtifactGuidance, artifacts, reloadArtifacts, saveArtifact } = useVentureOS();
  const artifact = artifacts.status === 'ready' ? artifacts.data.find((candidate) => candidate.id === artifactId) : undefined;
  const [draft, setDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingGuidance, setIsAddingGuidance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (artifact) setDraft(artifact.content);
  }, [artifact]);

  if (artifacts.status === 'loading') return <RouteState title="Loading artifact" message="Preparing your working draft." />;
  if (artifacts.status === 'error') return <RouteState title="Artifact unavailable" message={artifacts.error.message} actionLabel="Try again" onAction={reloadArtifacts} />;
  if (!artifact) return <RouteState title="Artifact not found" message="This playbook artifact may have moved." actionLabel="Back to playbook" onAction={() => router.replace('/venture-os/playbook')} />;

  const isDirty = draft !== artifact.content;
  const confirmBack = () => {
    if (!isDirty) return router.back();
    Alert.alert('Discard unsaved changes?', 'Your playbook draft has not been saved.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const persist = async (status: VentureArtifactStatus) => {
    setIsSaving(true);
    setError(null);
    try {
      await saveArtifact(artifact.id, draft, status);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Your artifact could not be saved. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addGuidance = async () => {
    setIsAddingGuidance(true);
    setError(null);
    try {
      await appendArtifactGuidance(artifact.id, guidanceByArtifact[artifact.id] ?? 'Review this artifact against current customer evidence, explicit human approval points, and the next decision it must support.');
    } catch (guidanceError) {
      setError(guidanceError instanceof Error ? guidanceError.message : 'Guidance could not be added. Try again.');
    } finally {
      setIsAddingGuidance(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScreenHeader
          bordered
          eyebrow={artifact.status.replace('-', ' ').toUpperCase()}
          subtitle={artifact.description}
          title={artifact.title}
          trailing={<IconButton accessibilityLabel="Back to playbook" icon="arrow-left" onPress={confirmBack} />}
        />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>YOUR WORKING DRAFT</Text>
          <TextInput
            accessibilityLabel={`${artifact.title} working draft`}
            multiline
            onChangeText={(value) => { setDraft(value); setError(null); }}
            placeholder="Write the decision, evidence, owners, and next action this artifact should preserve."
            placeholderTextColor={colors.textTertiary}
            style={styles.editor}
            textAlignVertical="top"
            value={draft}
          />
          <View style={styles.actions}>
            <Button
              disabled={!draft.trim()}
              label={artifact.status === 'not-started' ? 'Save draft' : 'Save changes'}
              loading={isSaving}
              onPress={() => persist(artifact.status === 'complete' ? 'complete' : 'draft')}
              style={styles.action}
            />
            <Button
              disabled={!draft.trim() || artifact.status === 'complete' || isSaving}
              label={artifact.status === 'complete' ? 'Completed' : 'Mark complete'}
              onPress={() => persist('complete')}
              style={styles.action}
              variant="success"
            />
          </View>

          {error ? <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text> : null}

          <View style={styles.guidanceHeader}>
            <View style={styles.guidanceTitleRow}>
              <MaterialCommunityIcons color={colors.accent} name="creation-outline" size={20} />
              <Text style={styles.guidanceTitle}>AI guidance</Text>
            </View>
            <Text style={styles.guidanceNote}>Suggestions stay separate from your draft until you choose what to use.</Text>
          </View>

          {artifact.guidance.map((guidance) => (
            <Card key={guidance.id} elevated={false} style={styles.guidanceCard}>
              <Text style={styles.aiLabel}>AI SUGGESTION</Text>
              <Text style={styles.guidanceBody}>{guidance.content}</Text>
            </Card>
          ))}

          <Button label={artifact.guidance.length ? 'Add another suggestion' : 'Add AI suggestion'} loading={isAddingGuidance} onPress={addGuidance} variant="accent" />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function RouteState({ title, message, actionLabel, onAction }: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <Screen style={styles.state}>
      <Text accessibilityLiveRegion="polite" style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  sectionLabel: { ...typography.micro, color: colors.textSecondary, fontWeight: '800', marginBottom: spacing[2] },
  editor: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, color: colors.textPrimary, fontSize: 16, lineHeight: 24, minHeight: 220, padding: spacing[4] },
  actions: { flexDirection: 'row', gap: spacing[3], marginTop: spacing[3] },
  action: { flex: 1 },
  error: { ...typography.supporting, backgroundColor: colors.dangerSoft, borderRadius: radii.control, color: colors.danger, marginTop: spacing[4], padding: spacing[3] },
  guidanceHeader: { marginBottom: spacing[3], marginTop: spacing[8] },
  guidanceTitleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  guidanceTitle: { ...typography.sectionTitle, color: colors.textPrimary },
  guidanceNote: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  guidanceCard: { borderRadius: radii.control, marginBottom: spacing[3] },
  aiLabel: { ...typography.micro, color: colors.accent, fontWeight: '800' },
  guidanceBody: { ...typography.body, color: colors.textPrimary, lineHeight: 23, marginTop: spacing[2] },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  stateTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});