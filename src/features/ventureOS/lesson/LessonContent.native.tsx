import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from 'react-native-webview';

import { Button } from '../../../components/common/Button';
import { colors, spacing, typography } from '../../../theme/tokens';
import type { LessonContentProps } from './LessonContent.types';
import { isAllowedLessonOrigin, parseLessonBridgeMessage } from './lessonBridge';

const LOAD_TIMEOUT_MS = 15_000;

type ContentState = 'loading' | 'ready' | 'timeout' | 'error';

export default function LessonContent({
  source,
  allowedOrigins,
  isOffline = false,
  onSaveReflection,
  onAppendToPlaybook,
}: LessonContentProps) {
  const [contentState, setContentState] = useState<ContentState>('loading');
  const [reloadKey, setReloadKey] = useState(0);
  const processedEventIds = useRef(new Set<string>());
  const webView = useRef<WebView>(null);
  const canGoBack = useRef(false);
  const sourceUrl = source.kind === 'uri' ? source.uri : source.baseUrl;

  useEffect(() => {
    if (isOffline || contentState !== 'loading') return;

    const timeout = setTimeout(() => setContentState('timeout'), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [contentState, isOffline, reloadKey]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack.current) return false;

      webView.current?.goBack();
      return true;
    });

    return () => subscription.remove();
  }, []);

  const retry = () => {
    processedEventIds.current.clear();
    setContentState('loading');
    setReloadKey((current) => current + 1);
  };

  const openInBrowser = () => {
    if (source.kind === 'uri') void Linking.openURL(source.uri);
  };

  const openExternalLink = (url: string) => {
    void Linking.openURL(url);
  };

  const handleMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    const result = parseLessonBridgeMessage({
      data: nativeEvent.data,
      sourceUrl: nativeEvent.url || sourceUrl,
      allowedOrigins,
      processedEventIds: processedEventIds.current,
    });

    if (!result.accepted) {
      console.warn('[Venture OS lesson bridge] Message rejected:', result.reason);
      return;
    }

    switch (result.message.type) {
      case 'READY':
        setContentState('ready');
        break;
      case 'SAVE_REFLECTION':
        void onSaveReflection(result.message.payload.promptId, result.message.payload.response);
        break;
      case 'APPEND_TO_PLAYBOOK':
        void onAppendToPlaybook(result.message.payload.artifactId, result.message.payload.content);
        break;
      case 'OPEN_EXTERNAL_LINK':
        openExternalLink(result.message.payload.url);
        break;
      case 'CONTENT_HEIGHT':
        break;
    }
  };

  const allowNavigation = (request: WebViewNavigation) => {
    if (request.url === 'about:blank' || isAllowedLessonOrigin(request.url, allowedOrigins)) {
      return true;
    }

    if (request.url.startsWith('https://')) openExternalLink(request.url);
    return false;
  };

  if (isOffline) {
    return (
      <ContentUnavailable
        canOpenInBrowser={source.kind === 'uri'}
        message="Connect to the internet to load this lesson."
        onOpenInBrowser={openInBrowser}
        onRetry={retry}
        title="Lesson unavailable offline"
      />
    );
  }

  if (contentState === 'timeout' || contentState === 'error') {
    return (
      <ContentUnavailable
        canOpenInBrowser={source.kind === 'uri'}
        message={contentState === 'timeout'
          ? 'The lesson took too long to respond.'
          : 'The lesson could not be loaded. Check your connection and try again.'}
        onOpenInBrowser={openInBrowser}
        onRetry={retry}
        title={contentState === 'timeout' ? 'Loading timed out' : 'Unable to load lesson'}
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        allowFileAccess={false}
        allowFileAccessFromFileURLs={false}
        allowUniversalAccessFromFileURLs={false}
        cacheEnabled
        incognito
        javaScriptCanOpenWindowsAutomatically={false}
        key={reloadKey}
        mixedContentMode="never"
        onError={() => setContentState('error')}
        onHttpError={() => setContentState('error')}
        onLoad={() => setContentState('ready')}
        onMessage={handleMessage}
        onNavigationStateChange={(navigation) => {
          canGoBack.current = navigation.canGoBack;
        }}
        onOpenWindow={({ nativeEvent }) => {
          if (nativeEvent.targetUrl.startsWith('https://')) openExternalLink(nativeEvent.targetUrl);
        }}
        onShouldStartLoadWithRequest={allowNavigation}
        originWhitelist={source.kind === 'html' ? ['*'] : allowedOrigins.map((origin) => `${origin}/*`)}
        ref={webView}
        setSupportMultipleWindows
        sharedCookiesEnabled={false}
        source={source.kind === 'uri' ? { uri: source.uri } : { html: source.html, baseUrl: source.baseUrl }}
        thirdPartyCookiesEnabled={false}
        webviewDebuggingEnabled={false}
      />
      {contentState === 'loading' ? (
        <View accessibilityLabel="Loading lesson" accessibilityRole="progressbar" style={styles.loading}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.loadingText}>Loading lesson</Text>
        </View>
      ) : null}
    </View>
  );
}

interface ContentUnavailableProps {
  title: string;
  message: string;
  canOpenInBrowser: boolean;
  onRetry: () => void;
  onOpenInBrowser: () => void;
}

function ContentUnavailable({
  title,
  message,
  canOpenInBrowser,
  onRetry,
  onOpenInBrowser,
}: ContentUnavailableProps) {
  return (
    <View style={styles.unavailable}>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      <Button icon="reload" label="Retry" onPress={onRetry} />
      {canOpenInBrowser ? (
        <Button icon="open-in-new" label="Open in browser" onPress={onOpenInBrowser} variant="accent" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.canvas,
    gap: spacing[3],
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unavailable: {
    alignItems: 'stretch',
    flex: 1,
    gap: spacing[3],
    justifyContent: 'center',
    padding: spacing[6],
  },
  errorTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  errorMessage: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
});