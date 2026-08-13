import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { dashboardService } from "../../src/services/admin.service";
import { Colors } from "../../src/constants/colors";

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.get()
      .then((d) => setData(d.overview ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.grid}>
        <StatCard icon="👤" label="Admin Accounts" value={(data?.totalAdmin ?? 0).toLocaleString()} />
        <StatCard icon="📋" label="Orders"          value={(data?.totalOrder ?? 0).toLocaleString()} />
        <StatCard icon="💰" label="Revenue (VND)"   value={(data?.totalRevenue ?? 0).toLocaleString()} />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>📊 Biểu đồ doanh thu — coming soon</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center:    { flex: 1, justifyContent: "center", alignItems: "center" },
  grid:      { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card:      { flex: 1, minWidth: "45%", backgroundColor: Colors.white, borderRadius: 12,
               padding: 16, alignItems: "center", elevation: 2,
               shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6 },
  cardIcon:  { fontSize: 28, marginBottom: 8 },
  cardValue: { fontSize: 22, fontWeight: "800", color: Colors.text },
  cardLabel: { fontSize: 12, color: Colors.sub, marginTop: 4, textAlign: "center" },
  info:      { backgroundColor: Colors.white, borderRadius: 12, padding: 20,
               alignItems: "center", elevation: 1 },
  infoText:  { color: Colors.sub, fontSize: 14 },
});
