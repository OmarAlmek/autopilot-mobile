import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../src/components/common/Button';
import { IconButton } from '../../../../src/components/common/IconButton';
import { Screen } from '../../../../src/components/common/Screen';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../../src/context/VentureOSContext';
import { colors, radii, spacing, typography } from '../../../../src/theme/tokens';
import type { VentureArtifact } from '../../../../src/types/ventureOS';

export default function PlaybookScreen() {
  const { artifacts, reloadArtifacts } = useVentureOS();

  if (artifacts.status === 'loading') {
    return <RouteState title="Loading playbook" message="Preparing your company artifacts." />;
  }

  if (artifacts.status === 'error') {
    return <RouteState title="Playbook unavailable" message={artifacts.error.message} actionLabel="Try again" onAction={reloadArtifacts} />;
  }

  const draftCount = artifacts.data.filter((artifact) => artifact.status === 'draft').length;
  const completeCount = artifacts.data.filter((artifact) => artifact.status === 'complete').length;

  return (
    <Screen>
      <ScreenHeader
        bordered
        eyebrow="Execution system"
        subtitle="Turn lessons into company decisions you can review and operate."
        title="Your company playbook"
        trailing={<IconButton accessibilityLabel="Return to AutoPilot" icon="arrow-left" onPress={() => router.replace('/(tabs)/dashboard')} />}
      />
      <FlatList
        ListEmptyComponent={<RouteState title="No artifacts yet" message="Your playbook artifacts will appear here when they are available." />}
        ListHeaderComponent={(
          <View style={styles.summaryRow}>
            <Summary value={String(artifacts.data.length)} label="Artifacts" />
            <Summary value={String(draftCount)} label="Drafts" />
            <Summary value={String(completeCount)} label="Complete" />
          </View>
        )}
        contentContainerStyle={styles.content}
        data={artifacts.data}
        keyExtractor={(artifact) => artifact.id}
        renderItem={({ item }) => <ArtifactRow artifact={item} />}
      />
    </Screen>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function ArtifactRow({ artifact }: { artifact: VentureArtifact }) {
  const icon = artifact.status === 'complete' ? 'check-circle' : artifact.status === 'draft' ? 'pencil-outline' : 'file-outline';
  return (
    <Pressable
      accessibilityLabel={`${artifact.title}, ${artifact.status.replace('-', ' ')}`}
      accessibilityRole="button"
      onPress={() => router.push(`/venture-os/playbook/${artifact.id}`)}
      style={({ pressed }) => [styles.artifactRow, pressed && styles.pressed]}
    >
      <View style={[styles.icon, artifact.status === 'complete' && styles.iconComplete]}>
        <MaterialCommunityIcons color={artifact.status === 'complete' ? colors.inverse : colors.textSecondary} name={icon} size={20} />
      </View>
      <View style={styles.artifactCopy}>
        <Text style={styles.status}>{artifact.status.replace('-', ' ').toUpperCase()}</Text>
        <Text style={styles.artifactTitle}>{artifact.title}</Text>
        <Text style={styles.description}>{artifact.description}</Text>
      </View>
      <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={24} />
    </Pressable>
  );
}

interface RouteStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function RouteState({ title, message, actionLabel, onAction }: RouteStateProps) {
  return (
    <Screen style={styles.state}>
      <Text accessibilityLiveRegion="polite" style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  summaryRow: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, flexDirection: 'row', marginBottom: spacing[5], padding: spacing[4] },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: { ...typography.sectionTitle, color: colors.textPrimary },
  summaryLabel: { ...typography.micro, color: colors.textSecondary, marginTop: spacing[1] },
  artifactRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', minHeight: 132, paddingVertical: spacing[4] },
  icon: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, height: 42, justifyContent: 'center', marginRight: spacing[3], width: 42 },
  iconComplete: { backgroundColor: colors.success },
  artifactCopy: { flex: 1, minWidth: 0, paddingRight: spacing[2] },
  status: { ...typography.micro, color: colors.textTertiary, fontWeight: '800' },
  artifactTitle: { ...typography.itemTitle, color: colors.textPrimary, marginTop: spacing[1] },
  description: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  pressed: { opacity: 0.7 },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  stateTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});