import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "@/auth/AuthContext";
import { colors } from "@/theme/colors";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "CitizenHome">;

export default function CitizenHomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.email}</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logout}>Log out</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.sosButton}
        onPress={() => navigation.navigate("SOS")}
      >
        <Text style={styles.sosButtonLabel}>SOS</Text>
        <Text style={styles.sosButtonSub}>Report an emergency now</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("MyReports")}
      >
        <Text style={styles.secondaryButtonText}>My reports</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  greeting: { color: colors.textMuted, fontSize: 14 },
  logout: { color: colors.primary, fontSize: 14 },
  sosButton: {
    backgroundColor: colors.danger,
    borderRadius: 24,
    aspectRatio: 1,
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: colors.danger,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  sosButtonLabel: {
    color: colors.text,
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 2,
  },
  sosButtonSub: {
    color: colors.text,
    fontSize: 13,
    marginTop: 8,
    opacity: 0.9,
  },
  secondaryButton: {
    marginTop: 48,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.text, fontWeight: "600" },
});
