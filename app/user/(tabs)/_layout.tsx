import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { IconSymbol } from "@/src/components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "#3c23d7",
            position: "absolute",
          },
          default: {
            backgroundColor: "#3c23d7",
            paddingTop: 9,
            height: 60,
          },
        }),
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#ffffff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="house.fill" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="calendar.badge.plus" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="figure.run" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="message.fill" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
}
