import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../../src/components/common/Button';
import { IconButton } from '../../../src/components/common/IconButton';
import { Screen } from '../../../src/components/common/Screen';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../src/context/VentureOSContext';
import { toVentureRepositoryError } from '../../../src/services/ventureOS/VentureOSRepository';
import { colors, radii, spacing, typography } from '../../../src/theme/tokens';
import type { VentureCohortPost } from '../../../src/types/ventureOS';

export default function CommunityScreen() {
  const { cohortPosts, createCohortPost, reloadCohortPosts, reportCohortContent } = useVentureOS();
  const [authorName, setAuthorName] = useState('Eden Mea');
  const [body, setBody] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const publish = async () => {
    if (!authorName.trim() || !body.trim() || isPublishing) return;
    setIsPublishing(true);
    setMutationError(null);
    try {
      await createCohortPost({ authorName, body });
      setBody('');
    } catch (error) {
      setMutationError(toVentureRepositoryError(error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  const reportPost = async (postId: string) => {
    setMutationError(null);
    try {
      await reportCohortContent(postId, 'post');
    } catch (error) {
      setMutationError(toVentureRepositoryError(error).message);
    }
  };

  if (cohortPosts.status === 'loading') return <RouteState title="Loading community" message="Preparing cohort discussions." />;
  if (cohortPosts.status === 'error') return <RouteState title="Community unavailable" message={cohortPosts.error.message} actionLabel="Try again" onAction={reloadCohortPosts} />;

  return (
    <Screen>
      <ScreenHeader bordered eyebrow="Founder network" subtitle="Share evidence, decisions, and questions with your cohort." title="Community" trailing={<IconButton accessibilityLabel="Return to AutoPilot" icon="arrow-left" onPress={() => router.replace('/(tabs)/dashboard')} />} />
      <FlatList
        ListEmptyComponent={<EmptyState />}
        ListHeaderComponent={(
          <View style={styles.composer}>
            <Text style={styles.composerTitle}>Share an update</Text>
            <TextInput accessibilityLabel="Your name" autoCapitalize="words" onChangeText={setAuthorName} placeholder="Your name" placeholderTextColor={colors.textTertiary} style={styles.input} value={authorName} />
            <TextInput accessibilityLabel="Community update" multiline onChangeText={setBody} placeholder="What did you learn, decide, or need help with?" placeholderTextColor={colors.textTertiary} style={[styles.input, styles.bodyInput]} textAlignVertical="top" value={body} />
            {mutationError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{mutationError}</Text> : null}
            <Button disabled={!authorName.trim() || !body.trim()} icon="send-outline" label="Publish update" loading={isPublishing} onPress={publish} />
            <Text style={styles.moderationNote}>Reports are stored locally for this prototype and require moderator review in a connected backend.</Text>
          </View>
        )}
        contentContainerStyle={styles.content}
        data={cohortPosts.data}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => <PostRow post={item} onReport={() => reportPost(item.id)} />}
      />
    </Screen>
  );
}

function PostRow({ post, onReport }: { post: VentureCohortPost; onReport: () => void }) {
  return (
    <View style={styles.postRow}>
      <Pressable accessibilityLabel={`Open discussion by ${post.authorName}`} accessibilityRole="button" onPress={() => router.push(`/venture-os/community/${post.id}`)} style={({ pressed }) => [styles.postTarget, pressed && styles.pressed]}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{post.authorName.charAt(0).toUpperCase()}</Text></View>
        <View style={styles.postCopy}>
          <Text style={styles.author}>{post.authorName}</Text>
          <Text style={styles.postBody}>{post.body}</Text>
          <View style={styles.metaRow}><MaterialCommunityIcons color={colors.textTertiary} name="comment-outline" size={16} /><Text style={styles.meta}>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</Text></View>
        </View>
      </Pressable>
      <IconButton accessibilityLabel={post.isReported ? `Discussion by ${post.authorName} reported` : `Report discussion by ${post.authorName}`} color={post.isReported ? colors.danger : colors.textSecondary} disabled={post.isReported} icon={post.isReported ? 'flag' : 'flag-outline'} onPress={onReport} />
    </View>
  );
}

function EmptyState() {
  return <View style={styles.empty}><MaterialCommunityIcons color={colors.textTertiary} name="forum-outline" size={30} /><Text style={styles.emptyTitle}>Start the first discussion</Text><Text style={styles.emptyMessage}>Share a decision, question, or piece of customer evidence with the cohort.</Text></View>;
}

function RouteState({ title, message, actionLabel, onAction }: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  return <Screen style={styles.state}><Text accessibilityLiveRegion="polite" style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text>{actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}</Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  composer: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, gap: spacing[3], marginBottom: spacing[6], padding: spacing[4] },
  composerTitle: { ...typography.sectionTitle, color: colors.textPrimary },
  input: { ...typography.body, backgroundColor: colors.canvas, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, color: colors.textPrimary, minHeight: 48, paddingHorizontal: spacing[3], paddingVertical: spacing[3] },
  bodyInput: { minHeight: 112 },
  error: { ...typography.supporting, backgroundColor: colors.dangerSoft, borderRadius: radii.small, color: colors.danger, padding: spacing[3] },
  moderationNote: { ...typography.micro, color: colors.textSecondary, lineHeight: 17 },
  postRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', minHeight: 132, paddingVertical: spacing[4] },
  postTarget: { alignItems: 'flex-start', flex: 1, flexDirection: 'row', minWidth: 0, paddingRight: spacing[2] },
  avatar: { alignItems: 'center', backgroundColor: colors.infoSoft, borderRadius: radii.pill, height: 42, justifyContent: 'center', marginRight: spacing[3], width: 42 },
  avatarText: { ...typography.itemTitle, color: colors.info },
  postCopy: { flex: 1, minWidth: 0 },
  author: { ...typography.label, color: colors.textPrimary },
  postBody: { ...typography.body, color: colors.textMuted, lineHeight: 21, marginTop: spacing[1] },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: spacing[1], marginTop: spacing[2] },
  meta: { ...typography.micro, color: colors.textTertiary },
  empty: { alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[5], paddingVertical: spacing[10] },
  emptyTitle: { ...typography.sectionTitle, color: colors.textPrimary, textAlign: 'center' },
  emptyMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
  pressed: { opacity: 0.7 },
});