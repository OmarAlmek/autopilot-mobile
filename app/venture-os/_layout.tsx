import { Stack } from 'expo-router';

import { VentureOSProvider } from '../../src/context/VentureOSContext';

export default function VentureOSLayout() {
  return (
    <VentureOSProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </VentureOSProvider>
  );
}