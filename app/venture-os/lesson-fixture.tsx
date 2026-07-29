import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { IconButton } from '../../src/components/common/IconButton';
import { Screen } from '../../src/components/common/Screen';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import LessonContent from '../../src/features/ventureOS/lesson/LessonContent';
import { colors, spacing, typography } from '../../src/theme/tokens';

const LESSON_ORIGIN = 'https://lessons.autopilot.local';
const READY_MESSAGE = JSON.stringify({ version: 1, eventId: 'fixture-ready', type: 'READY' });

const fixtureHtml = `<!doctype html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1" />
<style>body{font-family:system-ui;margin:0;padding:24px;color:#0f172a}h1{font-size:28px}p{font-size:16px;line-height:1.6}.callout{padding:16px;background:#f1f5f9;border-left:4px solid #8b5cf6}</style></head>
<body><h1>Map the painful workflow</h1><p>Start with the work as it happens today, including handoffs, delays, and repeated decisions.</p><div class="callout">Look for a narrow workflow where speed and consistency matter more than novelty.</div>
<script>window.ReactNativeWebView.postMessage(${JSON.stringify(READY_MESSAGE)});</script></body></html>`;

export default function LessonFixtureScreen() {
  const [savedReflection, setSavedReflection] = useState('');

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <ScreenHeader
        bordered
        eyebrow="Lesson fixture"
        title="Workflow discovery"
        trailing={<IconButton accessibilityLabel="Close lesson" icon="close" onPress={() => router.back()} />}
      />
      {savedReflection ? (
        <View accessibilityLiveRegion="polite" style={styles.savedBanner}>
          <Text style={styles.savedText}>Reflection callback received</Text>
        </View>
      ) : null}
      <LessonContent
        allowedOrigins={[LESSON_ORIGIN]}
        durationMinutes={6}
        example="A field-service team maps the delay between a customer request, triage, and dispatch before choosing where AI should assist."
        exercise={{
          heading: 'Trace one request',
          instruction: 'Follow one recent customer request from arrival to resolution and record every wait, handoff, and repeated decision.',
        }}
        onAppendToPlaybook={() => undefined}
        onSaveReflection={(_promptId, response) => setSavedReflection(response)}
        reflectionPrompt={{
          id: 'painful-workflow',
          label: 'Which step in your customer workflow creates the most delay or rework?',
        }}
        sections={[
          {
            heading: 'Observe before automating',
            body: 'Document the current sequence, the people involved, and where information changes hands.',
          },
          {
            heading: 'Choose a narrow wedge',
            body: 'Prioritize one repeated decision or handoff whose outcome can be measured within weeks.',
          },
        ]}
        outcome="Identify one measurable workflow bottleneck that is narrow enough to test."
        source={{ kind: 'html', html: fixtureHtml, baseUrl: `${LESSON_ORIGIN}/fixture` }}
        summary="Find a specific operational bottleneck that is painful enough to earn adoption."
        title="Map the painful workflow"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  savedBanner: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
  },
  savedText: {
    ...typography.supporting,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});