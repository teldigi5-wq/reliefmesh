import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/auth/AuthContext";
import { colors } from "@/theme/colors";
import type { RootStackParamList } from "./types";

import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import CitizenHomeScreen from "@/screens/CitizenHomeScreen";
import SOSScreen from "@/screens/SOSScreen";
import MyReportsScreen from "@/screens/MyReportsScreen";
import IncidentDetailScreen from "@/screens/IncidentDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    text: colors.text,
  },
};

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center" }}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
        {user ? (
          // Citizen-only slice for now. A role-based branch (Responder /
          // Admin stacks) goes here once those are built — see mobile/README.md.
          <>
            <Stack.Screen name="CitizenHome" component={CitizenHomeScreen} options={{ title: "ReliefMesh" }} />
            <Stack.Screen name="SOS" component={SOSScreen} options={{ title: "Report emergency" }} />
            <Stack.Screen name="MyReports" component={MyReportsScreen} options={{ title: "My reports" }} />
            <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ title: "Status" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
