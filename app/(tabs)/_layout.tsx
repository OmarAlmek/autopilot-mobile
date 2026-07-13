import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 64,
          paddingBottom: 8,
        }
      }}>
        <Tabs.Screen 
          name="dashboard" 
          options={{ title: 'Overview', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-dashboard" size={22} color={color} /> }} 
        />
        {/* ⚡ NEW ACTIONS TAB WITH THUNDERBOLT */}
        <Tabs.Screen 
          name="actions" 
          options={{ title: 'Actions', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="lightning-bolt" size={22} color={color} /> }} 
        />
        {/* 🔄 RENAMED TO ACTIVITY */}
        <Tabs.Screen 
          name="transactions" 
          options={{ title: 'Activity', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="format-list-bulleted" size={22} color={color} /> }} 
        />
        <Tabs.Screen 
          name="chat" 
          options={{ title: 'Chat', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="message-text" size={22} color={color} /> }} 
        />
        <Tabs.Screen 
          name="data" 
          options={{ title: 'Data', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="database" size={22} color={color} /> }} 
        />
      </Tabs>
    </View>
  );
}