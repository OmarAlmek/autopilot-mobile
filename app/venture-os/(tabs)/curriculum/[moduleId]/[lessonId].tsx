import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../../src/components/common/Button';
import { IconButton } from '../../../../../src/components/common/IconButton';
import { Screen } from '../../../../../src/components/common/Screen';
import { ScreenHeader } from '../../../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../../../src/context/VentureOSContext';
import LessonContent from '../../../../../src/features/ventureOS/lesson/LessonContent';
import {
  buildLessonHtml,
  getLessonBaseUrl,
  lessonAllowedOrigins,
} from '../../../../../src/features/ventureOS/lesson/lessonHtml';
import { colors, spacing, typography } from '../../../../../src/theme/tokens';

export default function LessonDetailScreen() {
  const { moduleId, lessonId } = useLocalSearchParams<{ moduleId: string; lessonId: string }>();
  const {
    completedLessons,
    curriculum,
    reflections,
    reloadCurriculum,
    saveReflection,
    selectedTrack,
    toggleLessonComplete,
  } = useVentureOS();
  const [completionError, setCompletionError] = useState('');
  const [reflectionError, setReflectionError] = useState('');
  const module = curriculum.status === 'ready'
    ? curriculum.data.find((candidate) => candidate.id === moduleId)
    : undefined;
  const lesson = module?.lessons.find((candidate) => candidate.id === lessonId);

  if (curriculum.status === 'loading') {
    return <LessonState title="Loading lesson" message="Preparing your lesson content." />;
  }

  if (curriculum.status === 'error') {
    return (
      <LessonState
        title="Lesson unavailable"
        message={curriculum.error.message}
        actionLabel="Try again"
        onAction={reloadCurriculum}
      />
    );
  }

  if (!module || !lesson) {
    return (
      <LessonState
        title="Lesson not found"
        message="This lesson may have moved or is not part of your curriculum."
        actionLabel="Back to curriculum"
        onAction={() => router.replace('/venture-os/curriculum')}
      />
    );
  }

  if (
    lesson.status !== 'published'
    || !lesson.durationMinutes
    || !lesson.outcome
    || !lesson.sections
    || !lesson.exercise
    || !lesson.reflectionPrompt
  ) {
    return (
      <LessonState
        title="Lesson in development"
        message="This lesson is on the curriculum roadmap, but its teaching content is not ready yet."
        actionLabel="Back to module"
        onAction={() => router.back()}
      />
    );
  }

  const isComplete = completedLessons.includes(lesson.id);
  const promptId = lesson.reflectionPrompt.id;
  const reflectionId = `${lesson.id}:${promptId}`;
  const savedReflection = reflections.find((reflection) => reflection.id === reflectionId);
  const trackExample = lesson.trackExamples?.[selectedTrack]
    ?? 'Choose one repeated workflow in your industry and identify where faster context handling could improve the customer outcome.';

  const updateCompletion = async () => {
    setCompletionError('');
    try {
      await toggleLessonComplete(lesson.id);
    } catch {
      setCompletionError('Your lesson progress could not be saved. Try again.');
    }
  };

  const persistReflection = async (savedPromptId: string, response: string) => {
    setReflectionError('');
    try {
      await saveReflection({
        id: reflectionId,
        lessonId: lesson.id,
        promptId: savedPromptId,
        response,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setReflectionError('Your reflection could not be saved. It remains on this screen so you can try again.');
      throw new Error('Reflection persistence failed');
    }
  };

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <ScreenHeader
        bordered
        eyebrow={`Module ${module.order} · Lesson ${lesson.order}`}
        title={lesson.title}
        trailing={<IconButton accessibilityLabel="Back to module" icon="arrow-left" onPress={() => router.back()} />}
      />
      {savedReflection ? (
        <View accessibilityLiveRegion="polite" style={styles.savedBanner}>
          <Text style={styles.savedText}>Reflection saved for this lesson</Text>
        </View>
      ) : null}
      <View style={styles.content}>
        <LessonContent
          allowedOrigins={lessonAllowedOrigins}
          durationMinutes={lesson.durationMinutes}
          example={trackExample}
          exercise={lesson.exercise}
          initialReflectionResponse={savedReflection?.response}
          onAppendToPlaybook={() => undefined}
          onSaveReflection={persistReflection}
          outcome={lesson.outcome}
          reflectionPrompt={lesson.reflectionPrompt}
          sections={lesson.sections}
          source={{ kind: 'html', html: buildLessonHtml(lesson, trackExample, savedReflection?.response), baseUrl: getLessonBaseUrl(lesson.id) }}
          summary={lesson.summary}
          title={lesson.title}
        />
      </View>
      <View style={styles.footer}>
        {reflectionError ? <Text accessibilityLiveRegion="assertive" style={styles.errorText}>{reflectionError}</Text> : null}
        {completionError ? <Text accessibilityLiveRegion="assertive" style={styles.errorText}>{completionError}</Text> : null}
        <Button
          icon={isComplete ? 'check-circle' : 'check'}
          label={isComplete ? 'Mark as incomplete' : 'Complete lesson'}
          onPress={() => void updateCompletion()}
          variant={isComplete ? 'success' : 'neutral'}
        />
      </View>
    </Screen>
  );
}

interface LessonStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function LessonState({ title, message, actionLabel, onAction }: LessonStateProps) {
  return (
    <Screen style={styles.state}>
      <Text accessibilityLiveRegion="polite" style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  footer: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, gap: spacing[2], padding: spacing[4] },
  savedBanner: { backgroundColor: colors.successSoft, paddingHorizontal: spacing[5], paddingVertical: spacing[2] },
  savedText: { ...typography.supporting, color: colors.textPrimary, fontWeight: '600' },
  errorText: { ...typography.supporting, color: colors.danger },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  stateTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});