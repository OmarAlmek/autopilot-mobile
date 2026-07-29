import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../src/components/common/Button';
import { Screen } from '../../../../src/components/common/Screen';
import { useVentureOS } from '../../../../src/context/VentureOSContext';
import { colors, radii, spacing, typography } from '../../../../src/theme/tokens';
import type { VentureModule, VentureTrack } from '../../../../src/types/ventureOS';

const tracks: Array<{ id: VentureTrack; label: string }> = [
  { id: 'tradeflow', label: 'Trade' },
  { id: 'proptech', label: 'Property' },
  { id: 'clinicflow', label: 'Clinical' },
  { id: 'edubridge', label: 'Education' },
  { id: 'agrimarket', label: 'Agriculture' },
  { id: 'serviceops', label: 'Services' },
  { id: 'financedesk', label: 'Finance' },
  { id: 'legalops', label: 'Legal' },
  { id: 'retailpulse', label: 'Retail' },
  { id: 'talentmatch', label: 'Talent' },
];

export default function CurriculumScreen() {
  const {
    completedLessons,
    curriculum,
    reloadCurriculum,
    selectedTrack,
    setSelectedTrack,
  } = useVentureOS();
  const [trackError, setTrackError] = useState('');
  const modules = curriculum.status === 'ready' ? curriculum.data : [];
  const publishedLessons = modules.flatMap((module) => module.lessons.filter((lesson) => lesson.status === 'published'));
  const publishedLessonIds = new Set(publishedLessons.map((lesson) => lesson.id));
  const completedPublishedCount = completedLessons.filter((lessonId) => publishedLessonIds.has(lessonId)).length;
  const progress = publishedLessons.length === 0 ? 0 : Math.round((completedPublishedCount / publishedLessons.length) * 100);

  const selectTrack = async (track: VentureTrack) => {
    if (track === selectedTrack) return;
    setTrackError('');

    try {
      await setSelectedTrack(track);
    } catch {
      setTrackError('Your track could not be changed. Try again.');
    }
  };

  if (curriculum.status === 'loading') {
    return (
      <Screen style={styles.centered}>
        <Text accessibilityLiveRegion="polite" style={styles.stateTitle}>Loading curriculum</Text>
        <Text style={styles.stateBody}>Preparing your modules and progress.</Text>
      </Screen>
    );
  }

  if (curriculum.status === 'error') {
    return (
      <Screen style={styles.centered}>
        <Text accessibilityLiveRegion="assertive" style={styles.stateTitle}>Curriculum unavailable</Text>
        <Text style={styles.stateBody}>{curriculum.error.message}</Text>
        <Button icon="reload" label="Try again" onPress={reloadCurriculum} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        ListEmptyComponent={(
          <View style={styles.empty}>
            <MaterialCommunityIcons color={colors.textTertiary} name="book-open-blank-variant" size={32} />
            <Text style={styles.stateTitle}>No modules available</Text>
            <Text style={styles.stateBody}>Your curriculum has not been assigned yet.</Text>
            <Button icon="reload" label="Refresh" onPress={reloadCurriculum} />
          </View>
        )}
        ListHeaderComponent={(
          <View>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.eyebrow}>VENTURE OS</Text>
                <Text style={styles.title}>Curriculum</Text>
              </View>
              <Pressable
                accessibilityLabel="Return to AutoPilot"
                accessibilityRole="button"
                onPress={() => router.replace('/(tabs)/dashboard')}
                style={({ pressed }) => [styles.autopilotButton, pressed && styles.pressed]}
              >
                <MaterialCommunityIcons color={colors.textPrimary} name="arrow-left" size={18} />
                <Text style={styles.autopilotText}>AutoPilot</Text>
              </Pressable>
            </View>

            <View style={styles.progressRow}>
              <View>
                <Text style={styles.progressValue}>{progress}%</Text>
                <Text style={styles.progressLabel}>{completedPublishedCount} of {publishedLessons.length} available lessons</Text>
              </View>
              <View accessibilityLabel={`${progress}% complete`} accessibilityRole="progressbar" style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            <Text style={styles.sectionLabel}>INDUSTRY TRACK</Text>
            <ScrollView
              accessibilityLabel="Industry track"
              accessibilityRole="radiogroup"
              contentContainerStyle={styles.trackRow}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {tracks.map((track) => {
                const selected = track.id === selectedTrack;
                return (
                  <Pressable
                    aria-checked={selected}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={track.id}
                    onPress={() => void selectTrack(track.id)}
                    style={({ pressed }) => [
                      styles.trackButton,
                      selected && styles.trackButtonSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.trackText, selected && styles.trackTextSelected]}>{track.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {trackError ? <Text accessibilityLiveRegion="assertive" style={styles.errorText}>{trackError}</Text> : null}
            <Text style={[styles.sectionLabel, styles.modulesLabel]}>10 MODULES</Text>
          </View>
        )}
        contentContainerStyle={styles.content}
        data={modules}
        keyExtractor={(module) => module.id}
        renderItem={({ item }) => <ModuleRow completedLessons={completedLessons} module={item} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function ModuleRow({ module, completedLessons }: { module: VentureModule; completedLessons: string[] }) {
  const publishedLessons = module.lessons.filter((lesson) => lesson.status === 'published');
  const completedCount = publishedLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const isComplete = publishedLessons.length > 0 && completedCount === publishedLessons.length;
  const progressLabel = publishedLessons.length > 0
    ? `${completedCount} of ${publishedLessons.length} available lessons complete`
    : 'lessons in development';

  return (
    <Pressable
      accessibilityLabel={`Module ${module.order}: ${module.title}, ${progressLabel}`}
      accessibilityRole="button"
      onPress={() => router.push(`/venture-os/curriculum/${module.id}`)}
      style={({ pressed }) => [styles.moduleRow, pressed && styles.pressed]}
    >
      <View style={[styles.moduleNumber, isComplete && styles.moduleNumberComplete]}>
        {isComplete ? (
          <MaterialCommunityIcons color={colors.inverse} name="check" size={18} />
        ) : (
          <Text style={styles.moduleNumberText}>{String(module.order).padStart(2, '0')}</Text>
        )}
      </View>
      <View style={styles.moduleCopy}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text numberOfLines={2} style={styles.moduleSummary}>{module.summary}</Text>
        <Text style={styles.moduleMeta}>{publishedLessons.length > 0 ? `${completedCount}/${publishedLessons.length} available lessons` : 'Lessons in development'}</Text>
      </View>
      <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  centered: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[6] },
  eyebrow: { ...typography.micro, color: colors.accent, fontWeight: '800' },
  title: { ...typography.screenTitle, color: colors.textPrimary, marginTop: spacing[1] },
  autopilotButton: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', gap: spacing[1], minHeight: 44, paddingHorizontal: spacing[3] },
  autopilotText: { ...typography.label, color: colors.textPrimary },
  progressRow: { alignItems: 'center', backgroundColor: colors.textPrimary, borderRadius: radii.brand, flexDirection: 'row', gap: spacing[5], marginBottom: spacing[6], padding: spacing[5] },
  progressValue: { ...typography.profileTitle, color: colors.inverse },
  progressLabel: { ...typography.micro, color: colors.accentTextSoft, marginTop: spacing[1] },
  progressTrack: { backgroundColor: colors.textMuted, borderRadius: radii.pill, flex: 1, height: 8, overflow: 'hidden' },
  progressFill: { backgroundColor: colors.success, borderRadius: radii.pill, height: 8 },
  sectionLabel: { ...typography.micro, color: colors.textTertiary, fontWeight: '800' },
  trackRow: { gap: spacing[2], paddingVertical: spacing[3] },
  trackButton: { borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing[4] },
  trackButtonSelected: { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
  trackText: { ...typography.label, color: colors.textMuted },
  trackTextSelected: { color: colors.inverse },
  errorText: { ...typography.supporting, color: colors.danger, marginBottom: spacing[2] },
  modulesLabel: { marginBottom: spacing[3], marginTop: spacing[4] },
  moduleRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', minHeight: 112, paddingVertical: spacing[4] },
  moduleNumber: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, height: 44, justifyContent: 'center', marginRight: spacing[3], width: 44 },
  moduleNumberComplete: { backgroundColor: colors.success },
  moduleNumberText: { ...typography.label, color: colors.textPrimary, fontWeight: '800' },
  moduleCopy: { flex: 1, minWidth: 0, paddingRight: spacing[2] },
  moduleTitle: { ...typography.itemTitle, color: colors.textPrimary },
  moduleSummary: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  moduleMeta: { ...typography.micro, color: colors.textTertiary, marginTop: spacing[2] },
  empty: { alignItems: 'center', gap: spacing[3], paddingVertical: spacing[10] },
  stateTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  stateBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});