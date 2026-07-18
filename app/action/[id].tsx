import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Screen } from '../../src/components/common/Screen';
import { useWorkspace, type ActionDecision } from '../../src/context/WorkspaceContext';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';

type PendingDecision = 'approve' | 'reject' | 'changes';

const reasons: Record<Exclude<PendingDecision, 'approve'>, string[]> = {
  reject: ['Duplicate request', 'Incorrect information', 'Policy violation', 'Missing documentation', 'Other'],
  changes: ['Add supporting documentation', 'Correct request details', 'Add a time limit', 'Clarify business reason', 'Other'],
};

export default function ActionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { actions, can, decideAction } = useWorkspace();
  const action = actions.find((item) => item.id === id);
  const canApprove = can('approveActions');
  const [pendingDecision, setPendingDecision] = useState<PendingDecision | null>(null);
  const [selectedReason, setSelectedReason] = useState('');

  const closeDecision = () => {
    setPendingDecision(null);
    setSelectedReason('');
  };

  const submitDecision = () => {
    if (!action || !pendingDecision) return;

    const decision: ActionDecision = pendingDecision === 'approve'
      ? 'approved'
      : pendingDecision === 'reject'
        ? 'rejected'
        : 'changes_requested';

    decideAction(action.id, decision, selectedReason || undefined);
    closeDecision();
    router.back();
  };

  if (!action) {
    return (
      <Screen style={styles.centered}>
        <MaterialCommunityIcons color={colors.textTertiary} name="clipboard-search-outline" size={48} />
        <Text style={styles.notFoundTitle}>Request not found</Text>
        <Text style={styles.notFoundText}>It may already have been reviewed.</Text>
        <Button label="Back to actions" onPress={() => router.back()} style={styles.notFoundButton} />
      </Screen>
    );
  }

  const riskColor = action.risk === 'high' ? colors.danger : action.risk === 'medium' ? colors.warning : colors.success;
  const riskBackground = action.risk === 'high' ? colors.dangerSoft : action.risk === 'medium' ? colors.warningSoft : colors.successSoft;
  const needsReason = pendingDecision === 'reject' || pendingDecision === 'changes';
  const modalTitle = pendingDecision === 'approve' ? `Approve ${action.title}?` : pendingDecision === 'reject' ? 'Why are you rejecting this request?' : 'What needs to change?';

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Back to actions" accessibilityRole="button" hitSlop={8} onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons color={colors.textPrimary} name="arrow-left" size={24} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{action.type === 'invoice' ? 'Financial request' : 'Access request'}</Text>
          <Text numberOfLines={2} style={styles.headerTitle}>{action.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryRow}>
          <View style={[styles.badge, { backgroundColor: riskBackground }]}>
            <MaterialCommunityIcons color={riskColor} name="shield-outline" size={15} />
            <Text style={[styles.badgeText, { color: riskColor }]}>{action.risk.charAt(0).toUpperCase() + action.risk.slice(1)} risk</Text>
          </View>
          <View style={styles.dueBadge}>
            <MaterialCommunityIcons color={colors.textSecondary} name="clock-outline" size={15} />
            <Text style={styles.dueText}>{action.dueLabel}</Text>
          </View>
        </View>

        <Card style={styles.requestCard}>
          <Text style={styles.vendor}>{action.subtitle}</Text>
          {action.amount ? <Text style={styles.amount}>{action.amount}</Text> : null}
          <Text style={styles.requester}>Requested by {action.requester} • {action.time}</Text>
          <View style={styles.detailList}>
            {action.details.map((detail) => (
              <View key={detail.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card elevated={false} style={styles.aiCard}>
          <View style={styles.aiHeading}>
            <View style={styles.aiIcon}>
              <MaterialCommunityIcons color={colors.accent} name="creation" size={18} />
            </View>
            <Text style={styles.aiTitle}>{action.recommendation === 'approve' ? 'AI recommends approval' : 'AI recommends review'}</Text>
          </View>
          <Text style={styles.aiReason}>{action.recommendationReason}</Text>
          <Text style={styles.aiNote}>AI guidance supports the review. An authorized person makes the final decision.</Text>
        </Card>

        {!canApprove ? (
          <View style={styles.readOnly}>
            <MaterialCommunityIcons color={colors.textSecondary} name="lock-outline" size={20} />
            <View style={styles.readOnlyCopy}>
              <Text style={styles.readOnlyTitle}>Admin review required</Text>
              <Text style={styles.readOnlyText}>You can view this request, but only a Workspace Admin can make a decision.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.actions}>
            <Button icon="check" label="Approve" onPress={() => setPendingDecision('approve')} variant="success" />
            <Button icon="pencil-outline" label="Request changes" onPress={() => setPendingDecision('changes')} variant="accent" />
            <Button icon="close" label="Reject" onPress={() => setPendingDecision('reject')} variant="dangerSecondary" />
          </View>
        )}
      </ScrollView>

      <Modal animationType="slide" onRequestClose={closeDecision} transparent visible={pendingDecision !== null}>
        <View style={styles.modalOverlay}>
          <Pressable accessibilityLabel="Close decision dialog" onPress={closeDecision} style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Pressable accessibilityLabel="Close" accessibilityRole="button" hitSlop={8} onPress={closeDecision}>
                <MaterialCommunityIcons color={colors.textSecondary} name="close" size={24} />
              </Pressable>
            </View>
            {pendingDecision === 'approve' ? (
              <Text style={styles.confirmText}>{action.amount ? `${action.amount} for ` : ''}{action.subtitle} will be approved and recorded in Activity.</Text>
            ) : null}
            {needsReason ? (
              <View style={styles.reasonList}>
                {reasons[pendingDecision].map((reason) => {
                  const selected = selectedReason === reason;
                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      key={reason}
                      onPress={() => setSelectedReason(reason)}
                      style={[styles.reasonOption, selected && styles.reasonSelected]}
                    >
                      <MaterialCommunityIcons color={selected ? colors.accent : colors.textTertiary} name={selected ? 'radiobox-marked' : 'radiobox-blank'} size={20} />
                      <Text style={[styles.reasonText, selected && styles.reasonTextSelected]}>{reason}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
            <View style={styles.modalActions}>
              <Button label="Cancel" onPress={closeDecision} style={styles.modalButton} />
              <Button
                disabled={needsReason && !selectedReason}
                label={pendingDecision === 'approve' ? 'Confirm approval' : pendingDecision === 'reject' ? 'Confirm rejection' : 'Send request'}
                onPress={submitDecision}
                style={styles.modalButton}
                variant={pendingDecision === 'reject' ? 'dangerSecondary' : pendingDecision === 'approve' ? 'success' : 'accent'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', paddingHorizontal: spacing[5], paddingVertical: spacing[4] },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', marginRight: spacing[3], width: 44 },
  headerCopy: { flex: 1, minWidth: 0 },
  eyebrow: { ...typography.micro, color: colors.textSecondary, marginBottom: 2 },
  headerTitle: { ...typography.sectionTitle, color: colors.textPrimary },
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[4] },
  badge: { alignItems: 'center', borderRadius: radii.pill, flexDirection: 'row', gap: spacing[1], paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
  badgeText: { ...typography.micro, fontWeight: '700' },
  dueBadge: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, flexDirection: 'row', gap: spacing[1], paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
  dueText: { ...typography.micro, color: colors.textSecondary },
  requestCard: { marginBottom: spacing[4] },
  vendor: { ...typography.itemTitle, color: colors.textPrimary },
  amount: { color: colors.textPrimary, fontSize: 32, fontWeight: '800', marginTop: spacing[2] },
  requester: { ...typography.supporting, color: colors.textSecondary, marginTop: spacing[2] },
  detailList: { borderTopColor: colors.divider, borderTopWidth: 1, marginTop: spacing[5], paddingTop: spacing[2] },
  detailRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing[3] },
  detailLabel: { ...typography.supporting, color: colors.textSecondary, flex: 1 },
  detailValue: { ...typography.supporting, color: colors.textPrimary, flex: 1.3, fontWeight: '600', textAlign: 'right' },
  aiCard: { backgroundColor: colors.accentSoft, borderColor: colors.accentTextSoft, marginBottom: spacing[5] },
  aiHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  aiIcon: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.small, height: 32, justifyContent: 'center', width: 32 },
  aiTitle: { ...typography.itemTitle, color: colors.textPrimary, flex: 1 },
  aiReason: { ...typography.body, color: colors.textMuted, lineHeight: 22, marginTop: spacing[3] },
  aiNote: { ...typography.micro, color: colors.textSecondary, lineHeight: 17, marginTop: spacing[3] },
  actions: { gap: spacing[3] },
  readOnly: { alignItems: 'flex-start', backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, flexDirection: 'row', gap: spacing[3], padding: spacing[4] },
  readOnlyCopy: { flex: 1 },
  readOnlyTitle: { ...typography.label, color: colors.textPrimary },
  readOnlyText: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  modalOverlay: { backgroundColor: 'rgba(15, 23, 42, 0.45)', flex: 1, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: radii.feature, borderTopRightRadius: radii.feature, maxHeight: '85%', padding: spacing[5], paddingBottom: spacing[8] },
  modalHandle: { alignSelf: 'center', backgroundColor: colors.border, borderRadius: radii.pill, height: 4, marginBottom: spacing[5], width: 40 },
  modalHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing[4], justifyContent: 'space-between' },
  modalTitle: { ...typography.sectionTitle, color: colors.textPrimary, flex: 1 },
  confirmText: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginTop: spacing[4] },
  reasonList: { gap: spacing[2], marginTop: spacing[4] },
  reasonOption: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', gap: spacing[3], minHeight: 48, paddingHorizontal: spacing[4] },
  reasonSelected: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  reasonText: { ...typography.supporting, color: colors.textMuted, flex: 1 },
  reasonTextSelected: { color: colors.textPrimary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: spacing[3], marginTop: spacing[5] },
  modalButton: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: spacing[5] },
  notFoundTitle: { ...typography.sectionTitle, color: colors.textPrimary, marginTop: spacing[4] },
  notFoundText: { ...typography.body, color: colors.textSecondary, marginTop: spacing[2] },
  notFoundButton: { marginTop: spacing[5], minWidth: 180 },
});
