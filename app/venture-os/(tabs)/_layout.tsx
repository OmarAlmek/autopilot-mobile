import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '../../../src/theme/tokens';

export default function VentureTabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.textPrimary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 68,
        paddingBottom: 8,
        paddingTop: 6,
      },
    }}>
      <Tabs.Screen name="curriculum" options={{ title: 'Learn', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="book-open-page-variant" size={22} color={color} /> }} />
      <Tabs.Screen name="context" options={{ title: 'Context', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="domain" size={22} color={color} /> }} />
      <Tabs.Screen name="playbook" options={{ title: 'Playbook', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="notebook-edit-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="toolbox" options={{ title: 'Toolbox', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="tools" size={22} color={color} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group-outline" size={22} color={color} /> }} />
    </Tabs>
  );
}