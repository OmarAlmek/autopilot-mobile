export const LESSON_BRIDGE_VERSION = 1 as const;
export const LESSON_BRIDGE_MAX_PAYLOAD_BYTES = 16_384;

interface BridgeEnvelope {
  version: typeof LESSON_BRIDGE_VERSION;
  eventId: string;
}

export type LessonBridgeMessage =
  | (BridgeEnvelope & { type: 'READY' })
  | (BridgeEnvelope & { type: 'CONTENT_HEIGHT'; payload: { height: number } })
  | (BridgeEnvelope & {
      type: 'SAVE_REFLECTION';
      payload: { promptId: string; response: string };
    })
  | (BridgeEnvelope & {
      type: 'APPEND_TO_PLAYBOOK';
      payload: { artifactId: string; content: string };
    })
  | (BridgeEnvelope & { type: 'OPEN_EXTERNAL_LINK'; payload: { url: string } });

export type LessonBridgeRejection =
  | 'duplicate-event'
  | 'invalid-message'
  | 'payload-too-large'
  | 'untrusted-origin'
  | 'unsupported-version';

export type LessonBridgeParseResult =
  | { accepted: true; message: LessonBridgeMessage }
  | { accepted: false; reason: LessonBridgeRejection };

interface ParseLessonBridgeMessageOptions {
  data: string;
  sourceUrl: string;
  allowedOrigins: readonly string[];
  processedEventIds: Set<string>;
}

function utf8ByteLength(value: string) {
  let bytes = 0;

  for (let index = 0; index < value.length; index += 1) {
    const codePoint = value.codePointAt(index);

    if (codePoint === undefined) {
      continue;
    }

    if (codePoint <= 0x7f) {
      bytes += 1;
    } else if (codePoint <= 0x7ff) {
      bytes += 2;
    } else if (codePoint <= 0xffff) {
      bytes += 3;
    } else {
      bytes += 4;
      index += 1;
    }
  }

  return bytes;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actualKeys = Object.keys(value);
  return actualKeys.length === keys.length && actualKeys.every((key) => keys.includes(key));
}

function hasValidEnvelope(value: Record<string, unknown>) {
  return (
    value.version === LESSON_BRIDGE_VERSION &&
    isNonEmptyString(value.eventId) &&
    value.eventId.length <= 128 &&
    isNonEmptyString(value.type)
  );
}

function isValidPayload(
  value: Record<string, unknown>,
  keys: readonly string[],
  validators: Record<string, (field: unknown) => boolean>,
) {
  if (!hasOnlyKeys(value, keys)) {
    return false;
  }

  return keys.every((key) => validators[key]?.(value[key]) === true);
}

function isAllowedExternalUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isLessonBridgeMessage(value: unknown): value is LessonBridgeMessage {
  if (!isRecord(value) || !hasValidEnvelope(value)) {
    return false;
  }

  if (value.type === 'READY') {
    return hasOnlyKeys(value, ['version', 'eventId', 'type']);
  }

  if (!isRecord(value.payload) || !hasOnlyKeys(value, ['version', 'eventId', 'type', 'payload'])) {
    return false;
  }

  switch (value.type) {
    case 'CONTENT_HEIGHT':
      return isValidPayload(value.payload, ['height'], {
        height: (height) => typeof height === 'number' && Number.isFinite(height) && height > 0 && height <= 20_000,
      });
    case 'SAVE_REFLECTION':
      return isValidPayload(value.payload, ['promptId', 'response'], {
        promptId: (promptId) => isNonEmptyString(promptId) && promptId.length <= 128,
        response: (response) => isNonEmptyString(response) && response.length <= 8_000,
      });
    case 'APPEND_TO_PLAYBOOK':
      return isValidPayload(value.payload, ['artifactId', 'content'], {
        artifactId: (artifactId) => isNonEmptyString(artifactId) && artifactId.length <= 128,
        content: (content) => isNonEmptyString(content) && content.length <= 8_000,
      });
    case 'OPEN_EXTERNAL_LINK':
      return isValidPayload(value.payload, ['url'], {
        url: (url) => isNonEmptyString(url) && url.length <= 2_048 && isAllowedExternalUrl(url),
      });
    default:
      return false;
  }
}

export function isAllowedLessonOrigin(sourceUrl: string, allowedOrigins: readonly string[]) {
  try {
    return allowedOrigins.includes(new URL(sourceUrl).origin);
  } catch {
    return false;
  }
}

export function parseLessonBridgeMessage({
  data,
  sourceUrl,
  allowedOrigins,
  processedEventIds,
}: ParseLessonBridgeMessageOptions): LessonBridgeParseResult {
  if (!isAllowedLessonOrigin(sourceUrl, allowedOrigins)) {
    return { accepted: false, reason: 'untrusted-origin' };
  }

  if (utf8ByteLength(data) > LESSON_BRIDGE_MAX_PAYLOAD_BYTES) {
    return { accepted: false, reason: 'payload-too-large' };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(data);
  } catch {
    return { accepted: false, reason: 'invalid-message' };
  }

  if (isRecord(parsed) && parsed.version !== LESSON_BRIDGE_VERSION) {
    return { accepted: false, reason: 'unsupported-version' };
  }

  if (!isLessonBridgeMessage(parsed)) {
    return { accepted: false, reason: 'invalid-message' };
  }

  if (processedEventIds.has(parsed.eventId)) {
    return { accepted: false, reason: 'duplicate-event' };
  }

  processedEventIds.add(parsed.eventId);
  return { accepted: true, message: parsed };
}