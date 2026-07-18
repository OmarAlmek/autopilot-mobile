import React, { useDeferredValue, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/common/Button';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { useWorkspace, type DataSource, type WorkspaceDocument } from '../../src/context/WorkspaceContext';
import { colors, radii, shadows, spacing, typography } from '../../src/theme/tokens';

type DataView = 'sources' | 'documents';
type DataListItem = DataSource | WorkspaceDocument;

const views: { label: string; value: DataView }[] = [
  { label: 'Sources', value: 'sources' },
  { label: 'Documents', value: 'documents' },
];

export default function DataScreen() {
  const { availableDataSources, can, connectDataSource, dataSources, disconnectDataSource, documents, syncDataSource } = useWorkspace();
  const canManageData = can('manageData');
  const [activeView, setActiveView] = useState<DataView>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery.trim().toLowerCase());
  const [showConnectSheet, setShowConnectSheet] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const selectedSource = dataSources.find((source) => source.id === selectedSourceId) ?? null;
  const connectableSources = availableDataSources.filter((source) => !dataSources.some((connected) => connected.id === source.id));
  const visibleSources = dataSources.filter((source) => `${source.name} ${source.type} ${source.status}`.toLowerCase().includes(deferredQuery));
  const visibleDocuments = documents.filter((document) => `${document.name} ${document.type} ${document.source}`.toLowerCase().includes(deferredQuery));
  const visibleItems: DataListItem[] = activeView === 'sources' ? visibleSources : visibleDocuments;
  const syncingCount = dataSources.filter((source) => source.status === 'syncing').length;

  const openSource = (source: DataSource) => setSelectedSourceId(source.id);

  const handleConnect = (sourceId: string) => {
    if (!connectDataSource(sourceId)) return;
    setShowConnectSheet(false);
    setSelectedSourceId(sourceId);
  };

  const handleDisconnect = () => {
    if (!selectedSource || !disconnectDataSource(selectedSource.id)) return;
    setSelectedSourceId(null);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScreenHeader
        bordered
        title="Data & Context"
        subtitle={canManageData ? 'Control what your workspace agents can use' : 'See what your workspace agents can use'}
        trailing={canManageData ? (
          <Pressable accessibilityLabel="Connect data source" accessibilityRole="button" onPress={() => setShowConnectSheet(true)} style={styles.addButton}>
            <MaterialCommunityIcons color={colors.inverse} name="plus" size={22} />
          </Pressable>
        ) : undefined}
      />

      <FlatList<DataListItem>
        contentContainerStyle={styles.content}
        data={visibleItems}
        keyExtractor={(item) => item.id}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={(
          <>
            <View style={styles.healthPanel}>
              <View style={styles.healthTopRow}>
                <View>
                  <Text style={styles.healthLabel}>Workspace knowledge</Text>
                  <Text style={styles.healthValue}>12,402 indexed items</Text>
                </View>
                <View style={styles.healthIcon}>
                  <MaterialCommunityIcons color={colors.accent} name="database-check-outline" size={24} />
                </View>
              </View>
              <View style={styles.healthMetrics}>
                <View style={styles.healthMetric}>
                  <Text style={styles.metricValue}>{dataSources.length}</Text>
                  <Text style={styles.metricLabel}>Sources</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.healthMetric}>
                  <Text style={styles.metricValue}>{documents.length}</Text>
                  <Text style={styles.metricLabel}>Documents</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.healthMetric}>
                  <Text style={[styles.metricValue, syncingCount > 0 && styles.metricWarning]}>{syncingCount}</Text>
                  <Text style={styles.metricLabel}>Syncing</Text>
                </View>
              </View>
            </View>

            {!canManageData ? (
              <View style={styles.readOnlyNotice}>
                <MaterialCommunityIcons color={colors.textSecondary} name="eye-outline" size={18} />
                <Text style={styles.readOnlyText}>Read-only access. A workspace admin manages connections and syncs.</Text>
              </View>
            ) : null}

            <View style={styles.segmentedControl}>
              {views.map((view) => {
                const selected = activeView === view.value;
                const count = view.value === 'sources' ? dataSources.length : documents.length;
                return (
                  <Pressable key={view.value} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => setActiveView(view.value)} style={[styles.segment, selected && styles.segmentSelected]}>
                    <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>{view.label}</Text>
                    <Text style={[styles.segmentCount, selected && styles.segmentCountSelected]}>{count}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.searchField}>
              <MaterialCommunityIcons color={colors.textTertiary} name="magnify" size={20} />
              <TextInput
                accessibilityLabel={`Search ${activeView}`}
                onChangeText={setSearchQuery}
                placeholder={activeView === 'sources' ? 'Search sources' : 'Search documents'}
                placeholderTextColor={colors.textTertiary}
                style={styles.searchInput}
                value={searchQuery}
              />
              {searchQuery ? (
                <Pressable accessibilityLabel="Clear search" accessibilityRole="button" hitSlop={8} onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons color={colors.textSecondary} name="close-circle" size={20} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.listHeadingRow}>
              <Text style={styles.listHeading}>{activeView === 'sources' ? 'Connected Sources' : 'Agent Documents'}</Text>
              <Text style={styles.listCount}>{activeView === 'sources' ? visibleSources.length : visibleDocuments.length} shown</Text>
            </View>
          </>
        )}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <MaterialCommunityIcons color={colors.textTertiary} name="database-search-outline" size={32} />
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>Try another name, type, or source.</Text>
          </View>
        )}
        renderItem={({ item }) => 'records' in item ? (
          <Pressable accessibilityLabel={`Open ${item.name} source details`} accessibilityRole="button" onPress={() => openSource(item)} style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}>
            <View style={[styles.sourceIcon, { backgroundColor: item.background }]}>
              <MaterialCommunityIcons color={item.color} name={item.icon} size={23} />
            </View>
            <View style={styles.rowCopy}>
              <View style={styles.rowTitleLine}>
                <Text numberOfLines={1} style={styles.rowTitle}>{item.name}</Text>
                <View style={[item.status === 'syncing' ? styles.syncingDot : styles.connectedDot]} />
              </View>
              <Text style={styles.rowMeta}>{item.type} · {item.records}</Text>
              <Text style={item.status === 'syncing' ? styles.syncingText : styles.syncText}>{item.lastSync}</Text>
            </View>
            <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={22} />
          </Pressable>
        ) : (
          <View style={styles.listRow}>
            <View style={styles.documentIcon}>
              <MaterialCommunityIcons color={colors.textSecondary} name="file-document-outline" size={23} />
            </View>
            <View style={styles.rowCopy}>
              <View style={styles.rowTitleLine}>
                <Text numberOfLines={1} style={styles.rowTitle}>{item.name}</Text>
                {item.status === 'processing' ? <Text style={styles.processingBadge}>Processing</Text> : null}
              </View>
              <Text style={styles.rowMeta}>{item.type} · {item.size}</Text>
              <Text style={styles.syncText}>{item.source} · Added {item.uploadedAt}</Text>
            </View>
          </View>
        )}
      />

      <Modal animationType="slide" onRequestClose={() => setShowConnectSheet(false)} transparent visible={showConnectSheet}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <Pressable accessibilityLabel="Close source connection sheet" onPress={() => setShowConnectSheet(false)} style={styles.modalDismissArea} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Connect a source</Text>
                <Text style={styles.sheetSubtitle}>Choose data to add to this local workspace demo.</Text>
              </View>
              <Pressable accessibilityLabel="Close" accessibilityRole="button" onPress={() => setShowConnectSheet(false)} style={styles.closeButton}>
                <MaterialCommunityIcons color={colors.textPrimary} name="close" size={21} />
              </Pressable>
            </View>
            {connectableSources.length ? connectableSources.map((source) => (
              <Pressable key={source.id} accessibilityLabel={`Connect ${source.name}`} accessibilityRole="button" onPress={() => handleConnect(source.id)} style={({ pressed }) => [styles.connectRow, pressed && styles.pressed]}>
                <View style={[styles.sourceIcon, { backgroundColor: source.background }]}>
                  <MaterialCommunityIcons color={source.color} name={source.icon} size={23} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{source.name}</Text>
                  <Text style={styles.rowMeta}>{source.type}</Text>
                </View>
                <MaterialCommunityIcons color={colors.accent} name="plus-circle-outline" size={23} />
              </Pressable>
            )) : (
              <View style={styles.sheetEmpty}>
                <Text style={styles.emptyTitle}>All demo sources are connected</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setSelectedSourceId(null)} transparent visible={Boolean(selectedSource)}>
        <View style={styles.detailBackdrop}>
          <Pressable accessibilityLabel="Close source details" onPress={() => setSelectedSourceId(null)} style={StyleSheet.absoluteFill} />
          {selectedSource ? (
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={[styles.detailIcon, { backgroundColor: selectedSource.background }]}>
                  <MaterialCommunityIcons color={selectedSource.color} name={selectedSource.icon} size={28} />
                </View>
                <Pressable accessibilityLabel="Close" accessibilityRole="button" onPress={() => setSelectedSourceId(null)} style={styles.closeButton}>
                  <MaterialCommunityIcons color={colors.textPrimary} name="close" size={21} />
                </Pressable>
              </View>
              <Text style={styles.detailTitle}>{selectedSource.name}</Text>
              <Text style={styles.detailSubtitle}>{selectedSource.type}</Text>
              <View style={styles.detailFacts}>
                <View style={styles.factRow}><Text style={styles.factLabel}>Status</Text><Text style={selectedSource.status === 'syncing' ? styles.factWarning : styles.factValue}>{selectedSource.status === 'syncing' ? 'Syncing' : 'Connected'}</Text></View>
                <View style={styles.factRow}><Text style={styles.factLabel}>Last sync</Text><Text style={styles.factValue}>{selectedSource.lastSync}</Text></View>
                <View style={styles.factRow}><Text style={styles.factLabel}>Available data</Text><Text style={styles.factValue}>{selectedSource.records}</Text></View>
              </View>
              {canManageData ? (
                <View style={styles.detailActions}>
                  <Button icon="sync" label="Sync now" onPress={() => syncDataSource(selectedSource.id)} style={styles.actionButton} variant="accent" />
                  <Button label="Disconnect" onPress={handleDisconnect} style={styles.actionButton} variant="dangerSecondary" />
                </View>
              ) : (
                <View style={styles.detailReadOnly}><MaterialCommunityIcons color={colors.textSecondary} name="lock-outline" size={17} /><Text style={styles.readOnlyText}>Admin access is required to change this source.</Text></View>
              )}
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.canvas, flex: 1 },
  addButton: { alignItems: 'center', backgroundColor: colors.textPrimary, borderRadius: radii.control, height: 44, justifyContent: 'center', width: 44 },
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  healthPanel: { backgroundColor: colors.darkSurface, borderRadius: radii.card, marginBottom: spacing[4], padding: spacing[5] },
  healthTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[5] },
  healthLabel: { ...typography.label, color: colors.textTertiary, marginBottom: spacing[1] },
  healthValue: { ...typography.sectionTitle, color: colors.inverse },
  healthIcon: { alignItems: 'center', backgroundColor: '#312E49', borderRadius: radii.control, height: 44, justifyContent: 'center', width: 44 },
  healthMetrics: { flexDirection: 'row' },
  healthMetric: { alignItems: 'center', flex: 1 },
  metricValue: { ...typography.itemTitle, color: colors.inverse },
  metricWarning: { color: colors.warning },
  metricLabel: { ...typography.micro, color: colors.textTertiary, marginTop: 2 },
  metricDivider: { backgroundColor: '#334155', width: 1 },
  readOnlyNotice: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, flexDirection: 'row', gap: spacing[2], marginBottom: spacing[4], padding: spacing[3] },
  readOnlyText: { ...typography.label, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  segmentedControl: { backgroundColor: colors.border, borderRadius: radii.control, flexDirection: 'row', marginBottom: spacing[3], padding: spacing[1] },
  segment: { alignItems: 'center', borderRadius: radii.small, flex: 1, flexDirection: 'row', gap: spacing[2], justifyContent: 'center', minHeight: 42 },
  segmentSelected: { backgroundColor: colors.surface, ...shadows.subtle },
  segmentLabel: { ...typography.label, color: colors.textSecondary },
  segmentLabelSelected: { color: colors.textPrimary },
  segmentCount: { ...typography.micro, color: colors.textTertiary },
  segmentCountSelected: { color: colors.accent },
  searchField: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', gap: spacing[2], minHeight: 48, paddingHorizontal: spacing[3] },
  searchInput: { ...typography.supporting, color: colors.textPrimary, flex: 1, minWidth: 0, paddingVertical: spacing[3] },
  listHeadingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2], marginTop: spacing[6], paddingHorizontal: spacing[1] },
  listHeading: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase' },
  listCount: { ...typography.micro, color: colors.textTertiary },
  listRow: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.brand, borderWidth: 1, flexDirection: 'row', marginBottom: spacing[2], minHeight: 82, padding: spacing[3], ...shadows.subtle },
  pressed: { opacity: 0.65 },
  sourceIcon: { alignItems: 'center', borderRadius: radii.control, height: 46, justifyContent: 'center', marginRight: spacing[3], width: 46 },
  documentIcon: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, height: 46, justifyContent: 'center', marginRight: spacing[3], width: 46 },
  rowCopy: { flex: 1, minWidth: 0, paddingRight: spacing[2] },
  rowTitleLine: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  rowTitle: { ...typography.itemTitle, color: colors.textPrimary, flexShrink: 1 },
  rowMeta: { ...typography.micro, color: colors.textSecondary, marginTop: 2 },
  syncText: { ...typography.micro, color: colors.textTertiary, marginTop: spacing[1] },
  syncingText: { ...typography.micro, color: colors.warning, marginTop: spacing[1] },
  connectedDot: { backgroundColor: colors.success, borderRadius: radii.pill, height: 7, width: 7 },
  syncingDot: { backgroundColor: colors.warning, borderRadius: radii.pill, height: 7, width: 7 },
  processingBadge: { ...typography.micro, backgroundColor: colors.warningSoft, borderRadius: radii.pill, color: colors.warning, overflow: 'hidden', paddingHorizontal: spacing[2], paddingVertical: 3 },
  emptyState: { alignItems: 'center', paddingVertical: spacing[10] },
  emptyTitle: { ...typography.itemTitle, color: colors.textPrimary, marginTop: spacing[3] },
  emptyText: { ...typography.supporting, color: colors.textSecondary, marginTop: spacing[1] },
  modalBackdrop: { backgroundColor: 'rgba(15, 23, 42, 0.38)', flex: 1, justifyContent: 'flex-end' },
  modalDismissArea: { flex: 1 },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.feature, borderTopRightRadius: radii.feature, padding: spacing[5], paddingBottom: spacing[8] },
  sheetHandle: { alignSelf: 'center', backgroundColor: colors.border, borderRadius: radii.pill, height: 4, marginBottom: spacing[4], width: 40 },
  sheetHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[4] },
  sheetTitle: { ...typography.sectionTitle, color: colors.textPrimary },
  sheetSubtitle: { ...typography.supporting, color: colors.textSecondary, marginTop: spacing[1] },
  closeButton: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, height: 40, justifyContent: 'center', marginLeft: spacing[3], width: 40 },
  connectRow: { alignItems: 'center', borderTopColor: colors.divider, borderTopWidth: 1, flexDirection: 'row', minHeight: 70, paddingVertical: spacing[3] },
  sheetEmpty: { alignItems: 'center', paddingBottom: spacing[5] },
  detailBackdrop: { alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.38)', flex: 1, justifyContent: 'center', padding: spacing[5] },
  detailCard: { backgroundColor: colors.surface, borderRadius: radii.card, maxWidth: 460, padding: spacing[5], width: '100%', ...shadows.card },
  detailHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  detailIcon: { alignItems: 'center', borderRadius: radii.brand, height: 54, justifyContent: 'center', width: 54 },
  detailTitle: { ...typography.profileTitle, color: colors.textPrimary, marginTop: spacing[4] },
  detailSubtitle: { ...typography.supporting, color: colors.textSecondary, marginTop: 2 },
  detailFacts: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, marginVertical: spacing[5], paddingHorizontal: spacing[4] },
  factRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 46 },
  factLabel: { ...typography.label, color: colors.textSecondary },
  factValue: { ...typography.label, color: colors.textPrimary, maxWidth: '58%', textAlign: 'right' },
  factWarning: { ...typography.label, color: colors.warning },
  detailActions: { flexDirection: 'row', gap: spacing[2] },
  actionButton: { flex: 1 },
  detailReadOnly: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, flexDirection: 'row', gap: spacing[2], padding: spacing[3] },
});