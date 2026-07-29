import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../../src/components/common/Button';
import { IconButton } from '../../../../../src/components/common/IconButton';
import { Screen } from '../../../../../src/components/common/Screen';
import { ScreenHeader } from '../../../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../../../src/context/VentureOSContext';
import { colors, radii, spacing, typography } from '../../../../../src/theme/tokens';
import type { VentureLesson } from '../../../../../src/types/ventureOS';

export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { completedLessons, curriculum, reloadCurriculum } = useVentureOS();
  const module = curriculum.status === 'ready'
    ? curriculum.data.find((candidate) => candidate.id === moduleId)
    : undefined;

  if (curriculum.status === 'loading') {
    return <RouteState title="Loading module" message="Preparing the module lessons." />;
  }

  if (curriculum.status === 'error') {
    return (
      <RouteState
        title="Module unavailable"
        message={curriculum.error.message}
        actionLabel="Try again"
        onAction={reloadCurriculum}
      />
    );
  }

  if (!module) {
    return (
      <RouteState
        title="Module not found"
        message="This module may have moved or is not part of your curriculum."
        actionLabel="Back to curriculum"
        onAction={() => router.replace('/venture-os/curriculum')}
      />
    );
  }

  const publishedLessons = module.lessons.filter((lesson) => lesson.status === 'published');
  const completedCount = publishedLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;

  return (
    <Screen>
      <ScreenHeader
        bordered
        eyebrow={`Module ${module.order} of 10`}
        subtitle={publishedLessons.length > 0
          ? `${completedCount} of ${publishedLessons.length} available lessons complete`
          : 'Lessons in development'}
        title={module.title}
        trailing={<IconButton accessibilityLabel="Back to curriculum" icon="arrow-left" onPress={() => router.back()} />}
      />
      <FlatList
        ListHeaderComponent={<Text style={styles.summary}>{module.summary}</Text>}
        contentContainerStyle={styles.content}
        data={module.lessons}
        keyExtractor={(lesson) => lesson.id}
        renderItem={({ item }) => (
          <LessonRow
            completed={completedLessons.includes(item.id)}
            lesson={item}
            moduleId={module.id}
          />
        )}
      />
    </Screen>
  );
}

function LessonRow({ lesson, moduleId, completed }: { lesson: VentureLesson; moduleId: string; completed: boolean }) {
  const isPublished = lesson.status === 'published';
  return (
    <Pressable
      accessibilityLabel={`Lesson ${lesson.order}: ${lesson.title}${isPublished ? '' : ', in development'}${completed ? ', complete' : ''}`}
      accessibilityRole="button"
      onPress={() => router.push(`/venture-os/curriculum/${moduleId}/${lesson.id}`)}
      style={({ pressed }) => [styles.lessonRow, pressed && styles.pressed]}
    >
      <View style={[styles.lessonStatus, completed && styles.lessonStatusComplete]}>
        <MaterialCommunityIcons
          color={completed ? colors.inverse : colors.textSecondary}
          name={completed ? 'check' : isPublished ? 'play' : 'clock-outline'}
          size={18}
        />
      </View>
      <View style={styles.lessonCopy}>
        <Text style={styles.lessonMeta}>LESSON {lesson.order} · {isPublished ? `${lesson.durationMinutes} MIN` : 'IN DEVELOPMENT'}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSummary}>{lesson.summary}</Text>
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
  summary: { ...typography.body, color: colors.textSecondary, lineHeight: 23, marginBottom: spacing[5] },
  lessonRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', minHeight: 124, paddingVertical: spacing[4] },
  lessonStatus: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, height: 40, justifyContent: 'center', marginRight: spacing[3], width: 40 },
  lessonStatusComplete: { backgroundColor: colors.success },
  lessonCopy: { flex: 1, minWidth: 0, paddingRight: spacing[2] },
  lessonMeta: { ...typography.micro, color: colors.textTertiary, fontWeight: '700' },
  lessonTitle: { ...typography.itemTitle, color: colors.textPrimary, marginTop: spacing[1] },
  lessonSummary: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  pressed: { opacity: 0.7 },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  stateTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});