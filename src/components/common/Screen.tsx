import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '../../theme/tokens';

interface ScreenProps extends PropsWithChildren {
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, edges = ['top', 'left', 'right'], style }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.canvas,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});