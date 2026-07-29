import type { VentureLesson } from '../../../types/ventureOS';

const LESSON_ORIGIN = 'https://lessons.autopilot.local';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function getLessonBaseUrl(lessonId: string) {
  return `${LESSON_ORIGIN}/${encodeURIComponent(lessonId)}`;
}

export const lessonAllowedOrigins = [LESSON_ORIGIN] as const;

export function buildLessonHtml(lesson: VentureLesson, example: string, initialResponse = '') {
  if (!lesson.durationMinutes || !lesson.outcome || !lesson.sections || !lesson.exercise || !lesson.reflectionPrompt) {
    throw new Error(`Lesson ${lesson.id} is missing published content`);
  }

  const readyMessage = JSON.stringify({ version: 1, eventId: `${lesson.id}-ready`, type: 'READY' });
  const safePromptId = JSON.stringify(lesson.reflectionPrompt.id);
  const sections = lesson.sections
    .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`)
    .join('');

  return `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { color: #0f172a; font-family: system-ui, sans-serif; margin: 0; padding: 24px; }
    h1 { font-size: 28px; line-height: 1.2; margin: 0 0 12px; }
    h2 { font-size: 19px; margin: 28px 0 10px; }
    p { color: #475569; font-size: 16px; line-height: 1.6; }
    .orientation { border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0; margin-top: 24px; padding: 16px 0; }
    .meta { color: #7c3aed; font-size: 12px; font-weight: 800; }
    .orientation strong { display: block; margin: 8px 0 4px; }
    .callout { background: #dbeafe; border-left: 4px solid #3b82f6; margin-top: 28px; padding: 16px; }
    .callout strong { display: block; margin-bottom: 8px; }
    label { display: block; font-size: 15px; font-weight: 700; margin-bottom: 10px; }
    textarea { border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; min-height: 132px; padding: 12px; resize: vertical; width: 100%; }
    button { background: #0f172a; border: 0; border-radius: 8px; color: white; font-size: 15px; font-weight: 700; margin-top: 12px; min-height: 48px; padding: 12px 18px; width: 100%; }
    #status { color: #047857; font-size: 14px; min-height: 22px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(lesson.title)}</h1>
  <p>${escapeHtml(lesson.summary)}</p>
  <div class="orientation"><span class="meta">${lesson.durationMinutes} MIN</span><strong>After this lesson</strong><p>${escapeHtml(lesson.outcome)}</p></div>
  ${sections}
  <div class="callout"><strong>Your industry</strong>${escapeHtml(example)}</div>
  <h2>${escapeHtml(lesson.exercise.heading)}</h2>
  <p>${escapeHtml(lesson.exercise.instruction)}</p>
  <h2>Reflection</h2>
  <label for="reflection">${escapeHtml(lesson.reflectionPrompt.label)}</label>
  <textarea id="reflection" placeholder="Write your response">${escapeHtml(initialResponse)}</textarea>
  <div id="status" role="status"></div>
  <button id="save" type="button">Save reflection</button>
  <script>
    const post = (message) => window.ReactNativeWebView.postMessage(JSON.stringify(message));
    post(${JSON.stringify(readyMessage)});
    document.getElementById('save').addEventListener('click', () => {
      const response = document.getElementById('reflection').value.trim();
      if (!response) return;
      post({
        version: 1,
        eventId: 'reflection-' + Date.now() + '-' + Math.random().toString(16).slice(2),
        type: 'SAVE_REFLECTION',
        payload: { promptId: ${safePromptId}, response }
      });
      document.getElementById('status').textContent = 'Reflection saved';
    });
  </script>
</body>
</html>`;
}