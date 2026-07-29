import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { colors, spacing, typography } from '../../../theme/tokens';
import type { LessonContentProps } from './LessonContent.types';

export default function LessonContent({
  title,
  summary,
  durationMinutes,
  outcome,
  sections,
  example,
  exercise,
  reflectionPrompt,
  initialReflectionResponse = '',
  onSaveReflection,
}: LessonContentProps) {
  const [response, setResponse] = useState(initialReflectionResponse);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveReflection = async () => {
    if (!response.trim()) return;
    setIsSaving(true);
    setSaved(false);

    try {
      await onSaveReflection(reflectionPrompt.id, response.trim());
      setSaved(true);
    } catch {
      setSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>

      <View style={styles.orientation}>
        <Text style={styles.duration}>{durationMinutes} MIN</Text>
        <View style={styles.orientationCopy}>
          <Text style={styles.orientationLabel}>After this lesson</Text>
          <Text style={styles.outcome}>{outcome}</Text>
        </View>
      </View>

      {sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}

      <Card elevated={false} style={styles.example}>
        <Text style={styles.eyebrow}>YOUR INDUSTRY</Text>
        <Text style={styles.heading}>See the pattern</Text>
        <Text style={styles.body}>{example}</Text>
      </Card>

      <View style={styles.section}>
        <Text style={styles.heading}>{exercise.heading}</Text>
        <Text style={styles.body}>{exercise.instruction}</Text>
      </View>

      <Card elevated={false} style={styles.reflection}>
        <Text style={styles.heading}>Reflection</Text>
        <Text style={styles.prompt}>{reflectionPrompt.label}</Text>
        <TextInput
          accessibilityLabel="Reflection response"
          multiline
          onChangeText={(value) => {
            setResponse(value);
            setSaved(false);
          }}
          placeholder="Write your response"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          value={response}
        />
        {saved ? <Text accessibilityLiveRegion="polite" style={styles.saved}>Reflection saved</Text> : null}
        <Button
          disabled={!response.trim()}
          label="Save reflection"
          loading={isSaving}
          onPress={saveReflection}
          variant="accent"
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[5],
    padding: spacing[5],
    paddingBottom: spacing[10],
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  summary: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  orientation: {
    alignItems: 'flex-start',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing[4],
    paddingVertical: spacing[4],
  },
  duration: {
    ...typography.micro,
    color: colors.accent,
    fontWeight: '800',
    paddingTop: spacing[1],
  },
  orientationCopy: { flex: 1, gap: spacing[1] },
  orientationLabel: { ...typography.label, color: colors.textPrimary },
  outcome: { ...typography.supporting, color: colors.textMuted, lineHeight: 21 },
  section: {
    gap: spacing[2],
  },
  heading: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 24,
  },
  example: { backgroundColor: colors.infoSoft, gap: spacing[2] },
  eyebrow: { ...typography.micro, color: colors.info, fontWeight: '800' },
  reflection: {
    gap: spacing[3],
  },
  prompt: {
    ...typography.supporting,
    color: colors.textMuted,
    lineHeight: 21,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    minHeight: 120,
    padding: spacing[3],
    textAlignVertical: 'top',
  },
  saved: {
    ...typography.supporting,
    color: colors.success,
    fontWeight: '600',
  },
});