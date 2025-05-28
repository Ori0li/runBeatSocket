import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TrainerTabLayout() {
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
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="note.text" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
}
