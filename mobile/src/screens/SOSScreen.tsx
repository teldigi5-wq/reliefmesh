import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createIncident, type IncidentCategory } from "@/api/incidents";
import { ApiError } from "@/api/client";
import { colors } from "@/theme/colors";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SOS">;

const CATEGORIES: { value: IncidentCategory; label: string }[] = [
  { value: "MEDICAL_EMERGENCY", label: "Medical" },
  { value: "FIRE", label: "Fire" },
  { value: "FLOOD", label: "Flood" },
  { value: "LANDSLIDE", label: "Landslide" },
  { value: "ROAD_ACCIDENT", label: "Road accident" },
  { value: "MISSING_PERSON", label: "Missing person" },
  { value: "INFRASTRUCTURE_DAMAGE", label: "Infrastructure" },
  { value: "OTHER", label: "Other" },
];

type LocationState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; latitude: number; longitude: number };

export default function SOSScreen({ navigation }: Props) {
  const [location, setLocation] = useState<LocationState>({ status: "loading" });
  const [category, setCategory] = useState<IncidentCategory>("MEDICAL_EMERGENCY");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation({ status: "denied" });
        return;
      }
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          status: "ready",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch {
        setLocation({
          status: "error",
          message: "Couldn't get a GPS fix. Try moving outdoors or near a window.",
        });
      }
    })();
  }, []);

  async function handleSubmit() {
    if (location.status !== "ready") return;
    setError(null);
    setSubmitting(true);
    try {
      const incident = await createIncident({
        title: `SOS: ${CATEGORIES.find((c) => c.value === category)?.label ?? category}`,
        description: description.trim() || "Emergency reported via mobile SOS button.",
        category,
        severity: "CRITICAL",
        latitude: location.latitude,
        longitude: location.longitude,
      });
      navigation.replace("IncidentDetail", { id: incident.id });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report emergency</Text>

      <Text style={styles.sectionLabel}>Location</Text>
      {location.status === "loading" && (
        <View style={styles.locationBox}>
          <ActivityIndicator color={colors.text} />
          <Text style={styles.locationText}>Getting your GPS position…</Text>
        </View>
      )}
      {location.status === "denied" && (
        <Text style={styles.warning}>
          Location permission denied — enable it in your phone settings so responders can find you.
        </Text>
      )}
      {location.status === "error" && (
        <Text style={styles.warning}>{location.message}</Text>
      )}
      {location.status === "ready" && (
        <Text style={styles.locationText}>
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </Text>
      )}

      <Text style={styles.sectionLabel}>Type</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.value}
            style={[
              styles.categoryChip,
              category === c.value && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(c.value)}
          >
            <Text
              style={[
                styles.categoryChipText,
                category === c.value && styles.categoryChipTextActive,
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Details (optional)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="What's happening? Who needs help?"
        placeholderTextColor={colors.textMuted}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      {error ? <Text style={styles.warning}>{error}</Text> : null}

      <Pressable
        style={[
          styles.submitButton,
          (location.status !== "ready" || submitting) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={location.status !== "ready" || submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.submitButtonText}>Send SOS</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 24 },
  title: { color: colors.text, fontSize: 24, fontWeight: "700", marginBottom: 24 },
  sectionLabel: { color: colors.textMuted, fontSize: 13, marginTop: 20, marginBottom: 8 },
  locationBox: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationText: { color: colors.text },
  warning: { color: colors.danger, fontSize: 13 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { color: colors.textMuted, fontSize: 13 },
  categoryChipTextActive: { color: colors.text, fontWeight: "600" },
  textArea: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    textAlignVertical: "top",
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 28,
  },
  buttonDisabled: { opacity: 0.5 },
  submitButtonText: { color: colors.text, fontWeight: "800", fontSize: 16 },
});
