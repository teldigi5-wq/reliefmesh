import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getIncident, type Incident, type IncidentStatus } from "@/api/incidents";
import { colors } from "@/theme/colors";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "IncidentDetail">;

const STATUS_ORDER: IncidentStatus[] = [
  "REPORTED",
  "UNDER_REVIEW",
  "VERIFIED",
  "ASSIGNED",
  "RESPONDING",
  "RESOLVED",
];

export default function IncidentDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [incident, setIncident] = useState<Incident | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Simple polling instead of a websocket/push setup — good enough for a
    // first slice. 10s keeps the status screen fresh without hammering the
    // API from a phone that might be on a weak connection during a disaster.
    async function poll() {
      try {
        const data = await getIncident(id);
        if (!cancelled) {
          setIncident(data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Couldn't refresh status.");
      }
    }
    poll();
    const interval = setInterval(poll, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  if (!incident) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(incident.status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{incident.title}</Text>
      <Text style={styles.subtitle}>Reported {new Date(incident.createdAt).toLocaleString()}</Text>

      <View style={styles.timeline}>
        {STATUS_ORDER.map((status, i) => (
          <View key={status} style={styles.timelineRow}>
            <View
              style={[
                styles.dot,
                i <= currentIndex && styles.dotActive,
              ]}
            />
            <Text style={[styles.timelineLabel, i <= currentIndex && styles.timelineLabelActive]}>
              {status.replace("_", " ")}
            </Text>
          </View>
        ))}
      </View>

      {error ? <Text style={styles.warning}>{error}</Text> : null}
      <Text style={styles.footerNote}>Status updates automatically.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center" },
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  title: { color: colors.text, fontSize: 22, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 4, marginBottom: 32 },
  timeline: { gap: 20 },
  timelineRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary },
  timelineLabel: { color: colors.textMuted, fontSize: 14 },
  timelineLabelActive: { color: colors.text, fontWeight: "600" },
  warning: { color: colors.danger, marginTop: 20 },
  footerNote: { color: colors.textMuted, fontSize: 12, marginTop: 32, textAlign: "center" },
});
