import { Stack } from 'expo-router';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { WorkspaceProvider } from '../src/context/WorkspaceContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <WorkspaceProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </WorkspaceProvider>
    </SafeAreaProvider>
  );
}