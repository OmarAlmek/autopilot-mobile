import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Screen } from '../../../components/common/Screen';
import { colors, radii, spacing, typography } from '../../../theme/tokens';
import type { VentureCompanyContext } from '../../../types/ventureOS';

type CompanyContextField = keyof VentureCompanyContext;

interface FieldDefinition {
  key: CompanyContextField;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const steps: Array<{ title: string; description: string; fields: FieldDefinition[] }> = [
  {
    title: 'Company fundamentals',
    description: 'Start with who you are and where the company is today.',
    fields: [
      { key: 'name', label: 'Your name', placeholder: 'Eden Mea' },
      { key: 'company', label: 'Company name', placeholder: 'Acme Labs' },
      { key: 'industry', label: 'Industry', placeholder: 'Healthcare operations' },
      { key: 'stage', label: 'Company stage', placeholder: 'Pre-seed, seed, growth...' },
    ],
  },
  {
    title: 'Customer and workflow',
    description: 'Describe the work and people your company is built around.',
    fields: [
      { key: 'customer', label: 'Target customer', placeholder: 'Independent clinic operators', multiline: true },
      { key: 'painfulWorkflow', label: 'Most painful workflow', placeholder: 'Describe the repeated work that creates the most friction', multiline: true },
      { key: 'tools', label: 'Current tools', placeholder: 'Spreadsheets, CRM, inbox, internal software...', multiline: true },
    ],
  },
  {
    title: 'AI readiness and goals',
    description: 'Set the boundaries Venture OS should respect when giving guidance.',
    fields: [
      { key: 'aiMaturity', label: 'AI maturity', placeholder: 'Exploring, prototyping, or in production' },
      { key: 'constraints', label: 'Important constraints', placeholder: 'Budget, data, regulation, hiring, timeline...', multiline: true },
      { key: 'goals', label: 'Goals for the program', placeholder: 'What should be true after twelve weeks?', multiline: true },
    ],
  },
];

interface CompanyContextWorkflowProps {
  initialValue: VentureCompanyContext;
  onSave: (value: VentureCompanyContext) => Promise<void>;
  onCancel: () => void;
}

export function CompanyContextWorkflow({ initialValue, onSave, onCancel }: CompanyContextWorkflowProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialValue);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<CompanyContextField, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const step = steps[stepIndex];
  const isDirty = JSON.stringify(draft) !== JSON.stringify(initialValue);

  const confirmDiscard = (action: () => void) => {
    if (!isDirty) {
      action();
      return;
    }
    Alert.alert(
      'Discard unsaved changes?',
      'Your company context changes have not been saved.',
      [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: action },
      ],
    );
  };

  const updateField = (key: CompanyContextField, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaveError(null);
  };

  const validateStep = () => {
    const nextErrors: Partial<Record<CompanyContextField, string>> = {};
    step.fields.forEach((field) => {
      if (!draft[field.key].trim()) nextErrors[field.key] = `${field.label} is required.`;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const continueOrSave = async () => {
    if (!validateStep()) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(draft);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Your company context could not be saved. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <TouchableOpacity
              accessibilityLabel="Return to AutoPilot"
              accessibilityRole="button"
              onPress={() => confirmDiscard(() => router.replace('/(tabs)/dashboard'))}
              style={styles.backButton}
            >
              <MaterialCommunityIcons color={colors.textPrimary} name="arrow-left" size={20} />
              <Text style={styles.backButtonText}>AutoPilot</Text>
            </TouchableOpacity>
            <Text style={styles.stepCount}>Step {stepIndex + 1} of {steps.length}</Text>
          </View>

          <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: stepIndex + 1 }} style={styles.progressTrack}>
            <View style={[styles.progressValue, { width: `${((stepIndex + 1) / steps.length) * 100}%` }]} />
          </View>

          <Text style={styles.eyebrow}>COMPANY CONTEXT</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>

          <Card style={styles.formCard}>
            {step.fields.map((field) => (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  accessibilityLabel={field.label}
                  accessibilityHint={errors[field.key]}
                  multiline={field.multiline}
                  onChangeText={(value) => updateField(field.key, value)}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.input, field.multiline && styles.multilineInput, errors[field.key] && styles.inputError]}
                  textAlignVertical={field.multiline ? 'top' : 'center'}
                  value={draft[field.key]}
                />
                {errors[field.key] ? <Text accessibilityLiveRegion="assertive" style={styles.errorText}>{errors[field.key]}</Text> : null}
              </View>
            ))}
          </Card>

          {saveError ? (
            <View accessibilityLiveRegion="assertive" style={styles.saveError}>
              <MaterialCommunityIcons color={colors.danger} name="alert-circle-outline" size={20} />
              <Text style={styles.saveErrorText}>{saveError}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Button
              label={stepIndex === 0 ? 'Cancel' : 'Back'}
              onPress={() => stepIndex === 0
                ? confirmDiscard(onCancel)
                : setStepIndex((current) => current - 1)}
              style={styles.action}
              variant="dangerSecondary"
            />
            <Button
              label={stepIndex === steps.length - 1 ? 'Save context' : 'Continue'}
              loading={isSaving}
              onPress={continueOrSave}
              style={styles.action}
              variant="accent"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[4] },
  backButton: { alignItems: 'center', flexDirection: 'row', gap: spacing[1], minHeight: 44, paddingRight: spacing[3] },
  backButtonText: { ...typography.label, color: colors.textPrimary },
  stepCount: { ...typography.label, color: colors.textSecondary },
  progressTrack: { backgroundColor: colors.border, borderRadius: radii.small, height: 6, marginBottom: spacing[8], overflow: 'hidden' },
  progressValue: { backgroundColor: colors.accent, borderRadius: radii.small, height: 6 },
  eyebrow: { ...typography.micro, color: colors.accent, fontWeight: '800', marginBottom: spacing[2] },
  title: { ...typography.screenTitle, color: colors.textPrimary },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 23, marginTop: spacing[2], marginBottom: spacing[6] },
  formCard: { borderRadius: radii.brand, gap: spacing[5] },
  fieldGroup: { gap: spacing[2] },
  label: { ...typography.label, color: colors.textPrimary },
  input: { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, color: colors.textPrimary, fontSize: 16, minHeight: 48, paddingHorizontal: spacing[4], paddingVertical: spacing[3] },
  multilineInput: { minHeight: 104 },
  inputError: { borderColor: colors.danger },
  errorText: { ...typography.micro, color: colors.danger },
  saveError: { alignItems: 'flex-start', backgroundColor: colors.dangerSoft, borderRadius: radii.control, flexDirection: 'row', gap: spacing[2], marginTop: spacing[4], padding: spacing[4] },
  saveErrorText: { ...typography.supporting, color: colors.danger, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing[3], marginTop: spacing[6] },
  action: { flex: 1 },
});