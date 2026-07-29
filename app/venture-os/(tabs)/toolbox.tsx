import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../../src/components/common/Button';
import { IconButton } from '../../../src/components/common/IconButton';
import { Screen } from '../../../src/components/common/Screen';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../src/context/VentureOSContext';
import { colors, radii, spacing, typography } from '../../../src/theme/tokens';
import type { VentureTool, VentureToolCategory } from '../../../src/types/ventureOS';

type ToolFilter = 'all' | 'saved' | VentureToolCategory;

const filters: Array<{ id: ToolFilter; label: string }> = [
  { id: 'all', label: 'All' }, { id: 'saved', label: 'Saved' },
  { id: 'coding', label: 'Coding' }, { id: 'agents', label: 'Agents' },
  { id: 'rag', label: 'RAG' }, { id: 'voice', label: 'Voice' },
  { id: 'media', label: 'Media' }, { id: 'compliance', label: 'Compliance' },
  { id: 'research', label: 'Research' },
];

const categoryLabels: Record<VentureToolCategory, string> = {
  coding: 'Coding', agents: 'Agents', rag: 'RAG', voice: 'Voice',
  media: 'Media', compliance: 'Compliance', research: 'Research',
};

export default function ToolboxScreen() {
  const { reloadTools, setToolSaved, tools } = useVentureOS();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [filter, setFilter] = useState<ToolFilter>('all');
  const [selectedTool, setSelectedTool] = useState<VentureTool | null>(null);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (tools.status === 'loading') return <RouteState title="Loading toolbox" message="Preparing the curated tool directory." />;
  if (tools.status === 'error') return <RouteState title="Toolbox unavailable" message={tools.error.message} actionLabel="Try again" onAction={reloadTools} />;

  const savedCount = tools.data.filter((tool) => tool.isSaved).length;
  const filteredTools = tools.data.filter((tool) => {
    const matchesFilter = filter === 'all' || (filter === 'saved' ? tool.isSaved : tool.category === filter);
    const matchesQuery = !deferredQuery || `${tool.name} ${tool.description} ${categoryLabels[tool.category]}`.toLowerCase().includes(deferredQuery);
    return matchesFilter && matchesQuery;
  });

  const toggleSaved = async (tool: VentureTool) => {
    setPendingToolId(tool.id);
    setError(null);
    try {
      await setToolSaved(tool.id, !tool.isSaved);
      setSelectedTool((current) => current?.id === tool.id ? { ...current, isSaved: !tool.isSaved } : current);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Saved tools could not be updated. Try again.');
    } finally {
      setPendingToolId(null);
    }
  };

  const openWebsite = async (tool: VentureTool) => {
    setError(null);
    try {
      if (!await Linking.canOpenURL(tool.url)) throw new Error('This website cannot be opened on this device.');
      await Linking.openURL(tool.url);
    } catch (linkError) {
      setError(linkError instanceof Error ? linkError.message : 'This website could not be opened.');
    }
  };

  return (
    <Screen>
      <ScreenHeader bordered eyebrow="Curated directory" subtitle={`${tools.data.length} practical tools across ${Object.keys(categoryLabels).length} workflow categories.`} title="AI startup toolbox" trailing={<IconButton accessibilityLabel="Return to AutoPilot" icon="arrow-left" onPress={() => router.replace('/(tabs)/dashboard')} />} />
      <FlatList
        ListEmptyComponent={<EmptyState onClear={() => { setQuery(''); setFilter('all'); }} />}
        ListHeaderComponent={(
          <View>
            <View style={styles.summaryRow}>
              <Summary label="Tools" value={String(tools.data.length)} />
              <Summary label="Categories" value={String(Object.keys(categoryLabels).length)} />
              <Summary label="Saved" value={String(savedCount)} />
            </View>
            <View style={styles.searchWrap}>
              <MaterialCommunityIcons color={colors.textTertiary} name="magnify" size={20} />
              <TextInput accessibilityLabel="Search toolbox" autoCapitalize="none" onChangeText={setQuery} placeholder="Search tools and workflows" placeholderTextColor={colors.textTertiary} returnKeyType="search" style={styles.searchInput} value={query} />
              {query ? <IconButton accessibilityLabel="Clear search" icon="close" onPress={() => setQuery('')} size={18} style={styles.clearSearch} /> : null}
            </View>
            <ScrollView accessibilityRole="tablist" contentContainerStyle={styles.filters} horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((option) => {
                const selected = option.id === filter;
                return (
                  <Pressable accessibilityRole="tab" accessibilityState={{ selected }} key={option.id} onPress={() => setFilter(option.id)} style={[styles.filter, selected && styles.filterSelected]}>
                    <Text style={[styles.filterLabel, selected && styles.filterLabelSelected]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={styles.resultsLabel}>{filteredTools.length} {filteredTools.length === 1 ? 'RESULT' : 'RESULTS'}</Text>
            {error ? <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text> : null}
          </View>
        )}
        contentContainerStyle={styles.content}
        data={filteredTools}
        keyExtractor={(tool) => tool.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <ToolRow isPending={pendingToolId === item.id} onOpen={() => setSelectedTool(item)} onToggleSaved={() => toggleSaved(item)} tool={item} />}
      />
      <ToolDetails error={error} isPending={selectedTool ? pendingToolId === selectedTool.id : false} onClose={() => { setSelectedTool(null); setError(null); }} onOpenWebsite={openWebsite} onToggleSaved={toggleSaved} tool={selectedTool} />
    </Screen>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return <View style={styles.summaryItem}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons color={colors.textTertiary} name="magnify-close" size={28} />
      <Text accessibilityLiveRegion="polite" style={styles.emptyTitle}>No matching tools</Text>
      <Text style={styles.emptyMessage}>Try a different search or category.</Text>
      <Button label="Clear filters" onPress={onClear} style={styles.clearButton} />
    </View>
  );
}

function ToolRow({ tool, isPending, onOpen, onToggleSaved }: { tool: VentureTool; isPending: boolean; onOpen: () => void; onToggleSaved: () => void }) {
  return (
    <View style={styles.toolRow}>
      <Pressable accessibilityLabel={`${tool.name}, ${categoryLabels[tool.category]}`} accessibilityRole="button" onPress={onOpen} style={({ pressed }) => [styles.toolDetailsTarget, pressed && styles.pressed]}>
        <View style={styles.toolIcon}><Text style={styles.toolInitial}>{tool.name.charAt(0)}</Text></View>
        <View style={styles.toolCopy}>
          <Text style={styles.category}>{categoryLabels[tool.category].toUpperCase()}</Text>
          <Text style={styles.toolName}>{tool.name}</Text>
          <Text numberOfLines={2} style={styles.toolDescription}>{tool.description}</Text>
        </View>
      </Pressable>
      <IconButton accessibilityLabel={tool.isSaved ? `Remove ${tool.name} from saved tools` : `Save ${tool.name}`} backgroundColor={tool.isSaved ? colors.accentSoft : colors.surfaceSubtle} color={tool.isSaved ? colors.accent : colors.textSecondary} disabled={isPending} icon={tool.isSaved ? 'bookmark' : 'bookmark-outline'} onPress={onToggleSaved} />
    </View>
  );
}

function ToolDetails({ tool, error, isPending, onClose, onOpenWebsite, onToggleSaved }: { tool: VentureTool | null; error: string | null; isPending: boolean; onClose: () => void; onOpenWebsite: (tool: VentureTool) => void; onToggleSaved: (tool: VentureTool) => void }) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={Boolean(tool)}>
      <View style={styles.modalBackdrop}>
        {tool ? (
          <View accessibilityViewIsModal style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}><View style={styles.detailIcon}><Text style={styles.detailInitial}>{tool.name.charAt(0)}</Text></View><IconButton accessibilityLabel="Close tool details" icon="close" onPress={onClose} /></View>
            <Text style={styles.detailCategory}>{categoryLabels[tool.category].toUpperCase()}</Text>
            <Text style={styles.detailTitle}>{tool.name}</Text>
            <Text style={styles.detailDescription}>{tool.description}</Text>
            {error ? <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text> : null}
            <View style={styles.detailActions}>
              <Button icon="open-in-new" label="Open website" onPress={() => onOpenWebsite(tool)} style={styles.detailAction} />
              <Button icon={tool.isSaved ? 'bookmark-remove-outline' : 'bookmark-plus-outline'} label={tool.isSaved ? 'Remove saved' : 'Save tool'} loading={isPending} onPress={() => onToggleSaved(tool)} style={styles.detailAction} variant="accent" />
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

function RouteState({ title, message, actionLabel, onAction }: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  return <Screen style={styles.state}><Text accessibilityLiveRegion="polite" style={styles.stateTitle}>{title}</Text><Text style={styles.stateMessage}>{message}</Text>{actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}</Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  summaryRow: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, flexDirection: 'row', marginBottom: spacing[4], padding: spacing[4] },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: { ...typography.sectionTitle, color: colors.textPrimary },
  summaryLabel: { ...typography.micro, color: colors.textSecondary, marginTop: spacing[1] },
  searchWrap: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', minHeight: 50, paddingLeft: spacing[4], paddingRight: spacing[1] },
  searchInput: { color: colors.textPrimary, flex: 1, fontSize: 16, minWidth: 0, paddingHorizontal: spacing[3], paddingVertical: spacing[3] },
  clearSearch: { height: 40, width: 40 },
  filters: { gap: spacing[2], paddingVertical: spacing[4] },
  filter: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing[4] },
  filterSelected: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  filterLabel: { ...typography.label, color: colors.textSecondary },
  filterLabelSelected: { color: colors.inverse },
  resultsLabel: { ...typography.micro, color: colors.textTertiary, fontWeight: '800', marginBottom: spacing[2] },
  error: { ...typography.supporting, backgroundColor: colors.dangerSoft, borderRadius: radii.control, color: colors.danger, marginBottom: spacing[3], padding: spacing[3] },
  toolRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', minHeight: 120, paddingVertical: spacing[4] },
  toolDetailsTarget: { alignItems: 'center', flex: 1, flexDirection: 'row', minWidth: 0 },
  toolIcon: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: radii.control, height: 44, justifyContent: 'center', marginRight: spacing[3], width: 44 },
  toolInitial: { ...typography.sectionTitle, color: colors.accent },
  toolCopy: { flex: 1, minWidth: 0, paddingRight: spacing[2] },
  category: { ...typography.micro, color: colors.accent, fontWeight: '800' },
  toolName: { ...typography.itemTitle, color: colors.textPrimary, marginTop: spacing[1] },
  toolDescription: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  pressed: { opacity: 0.7 },
  emptyState: { alignItems: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[10] },
  emptyTitle: { ...typography.sectionTitle, color: colors.textPrimary, marginTop: spacing[3] },
  emptyMessage: { ...typography.body, color: colors.textSecondary, marginTop: spacing[1], textAlign: 'center' },
  clearButton: { marginTop: spacing[4] },
  modalBackdrop: { backgroundColor: 'rgba(15, 23, 42, 0.42)', flex: 1, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radii.feature, borderTopRightRadius: radii.feature, paddingBottom: spacing[8], paddingHorizontal: spacing[5], paddingTop: spacing[3] },
  sheetHandle: { alignSelf: 'center', backgroundColor: colors.border, borderRadius: radii.pill, height: 4, marginBottom: spacing[5], width: 44 },
  sheetHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  detailIcon: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: radii.control, height: 52, justifyContent: 'center', width: 52 },
  detailInitial: { ...typography.profileTitle, color: colors.accent },
  detailCategory: { ...typography.micro, color: colors.accent, fontWeight: '800', marginTop: spacing[5] },
  detailTitle: { ...typography.screenTitle, color: colors.textPrimary, marginTop: spacing[1] },
  detailDescription: { ...typography.body, color: colors.textSecondary, lineHeight: 23, marginBottom: spacing[5], marginTop: spacing[2] },
  detailActions: { flexDirection: 'row', gap: spacing[3] },
  detailAction: { flex: 1 },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  stateTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});