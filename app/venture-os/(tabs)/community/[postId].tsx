import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../../../src/components/common/Button';
import { IconButton } from '../../../../src/components/common/IconButton';
import { Screen } from '../../../../src/components/common/Screen';
import { ScreenHeader } from '../../../../src/components/common/ScreenHeader';
import { useVentureOS } from '../../../../src/context/VentureOSContext';
import { toVentureRepositoryError } from '../../../../src/services/ventureOS/VentureOSRepository';
import { colors, radii, spacing, typography } from '../../../../src/theme/tokens';

export default function CommunityPostScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { addCohortComment, cohortPosts, reportCohortContent } = useVentureOS();
  const [authorName, setAuthorName] = useState('Eden Mea');
  const [body, setBody] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const post = cohortPosts.status === 'ready' ? cohortPosts.data.find((item) => item.id === postId) : undefined;

  if (cohortPosts.status === 'loading') return <RouteState title="Loading discussion" message="Preparing the conversation." />;
  if (cohortPosts.status === 'error') return <RouteState title="Discussion unavailable" message={cohortPosts.error.message} />;
  if (!post) return <RouteState title="Discussion not found" message="This discussion may have been removed or the link is no longer valid." actionLabel="Back to community" onAction={() => router.replace('/venture-os/community')} />;

  const publish = async () => {
    if (!authorName.trim() || !body.trim() || isPublishing) return;
    setIsPublishing(true);
    setMutationError(null);
    try {
      await addCohortComment(post.id, { authorName, body });
      setBody('');
    } catch (error) {
      setMutationError(toVentureRepositoryError(error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  const reportComment = async (commentId: string) => {
    setMutationError(null);
    try {
      await reportCohortContent(commentId, 'comment');
    } catch (error) {
      setMutationError(toVentureRepositoryError(error).message);
    }
  };

  return (
    <Screen>
      <ScreenHeader bordered eyebrow="Cohort discussion" title={post.authorName} trailing={<IconButton accessibilityLabel="Back to community" icon="arrow-left" onPress={() => router.replace('/venture-os/community')} />} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.post}><Text style={styles.postBody}>{post.body}</Text><Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</Text></View>
        <Text style={styles.sectionTitle}>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</Text>
        {post.comments.length === 0 ? <Text style={styles.emptyMessage}>No comments yet. Add the first useful response.</Text> : post.comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.commentHeader}>
              <View style={styles.commentCopy}><Text style={styles.author}>{comment.authorName}</Text><Text style={styles.commentBody}>{comment.body}</Text></View>
              <IconButton accessibilityLabel={comment.isReported ? `Comment by ${comment.authorName} reported` : `Report comment by ${comment.authorName}`} color={comment.isReported ? colors.danger : colors.textSecondary} disabled={comment.isReported} icon={comment.isReported ? 'flag' : 'flag-outline'} onPress={() => reportComment(comment.id)} />
            </View>
          </View>
        ))}
        <View style={styles.composer}>
          <View style={styles.composerHeading}><MaterialCommunityIcons color={colors.info} name="comment-plus-outline" size={22} /><Text style={styles.composerTitle}>Add a comment</Text></View>
          <TextInput accessibilityLabel="Your name" autoCapitalize="words" onChangeText={setAuthorName} placeholder="Your name" placeholderTextColor={colors.textTertiary} style={styles.input} value={authorName} />
          <TextInput accessibilityLabel="Comment" multiline onChangeText={setBody} placeholder="Add evidence, an answer, or a useful question" placeholderTextColor={colors.textTertiary} style={[styles.input, styles.bodyInput]} textAlignVertical="top" value={body} />
          {mutationError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{mutationError}</Text> : null}
          <Button disabled={!authorName.trim() || !body.trim()} icon="send-outline" label="Publish comment" loading={isPublishing} onPress={publish} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function RouteState({ title, message, actionLabel, onAction }: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  return <Screen style={styles.state}><Text accessibilityLiveRegion="polite" style={styles.sectionTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text>{actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}</Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  post: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, padding: spacing[5] },
  postBody: { ...typography.itemTitle, color: colors.textPrimary, lineHeight: 24 },
  timestamp: { ...typography.micro, color: colors.textTertiary, marginTop: spacing[3] },
  sectionTitle: { ...typography.sectionTitle, color: colors.textPrimary },
  comment: { borderBottomColor: colors.border, borderBottomWidth: 1, paddingVertical: spacing[4] },
  commentHeader: { alignItems: 'flex-start', flexDirection: 'row' },
  commentCopy: { flex: 1, minWidth: 0, paddingRight: spacing[2] },
  author: { ...typography.label, color: colors.textPrimary },
  commentBody: { ...typography.body, color: colors.textMuted, lineHeight: 21, marginTop: spacing[1] },
  composer: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, gap: spacing[3], marginTop: spacing[6], padding: spacing[4] },
  composerHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  composerTitle: { ...typography.sectionTitle, color: colors.textPrimary },
  input: { ...typography.body, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, color: colors.textPrimary, minHeight: 48, paddingHorizontal: spacing[3], paddingVertical: spacing[3] },
  bodyInput: { minHeight: 104 },
  error: { ...typography.supporting, backgroundColor: colors.dangerSoft, borderRadius: radii.small, color: colors.danger, padding: spacing[3] },
  emptyMessage: { ...typography.body, color: colors.textSecondary, marginTop: spacing[3], textAlign: 'center' },
  state: { alignItems: 'center', gap: spacing[3], justifyContent: 'center', padding: spacing[6] },
});