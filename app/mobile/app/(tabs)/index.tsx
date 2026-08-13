import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, Image, RefreshControl,
} from "react-native";
import { tourService } from "../../src/services/tour.service";
import { Colors } from "../../src/constants/colors";

export default function ToursScreen() {
  const [tours,      setTours]      = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState("");

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError("");
    try {
      const data = await tourService.getList({ page: 1 });
      setTours(data.tourList ?? []);
    } catch {
      setError("Cannot load tours. Check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={error ? [] : tours}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
      }
      ListEmptyComponent={
        <Text style={styles.empty}>{error || "No tours found"}</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.price}>
              {(item.priceNewAdult ?? item.priceAdult ?? 0).toLocaleString()} ₫
            </Text>
            <View style={[
              styles.badge,
              { backgroundColor: item.status === "active" ? "#e8f5e9" : "#fdecea" },
            ]}>
              <Text style={{ fontSize: 11, fontWeight: "700",
                color: item.status === "active" ? Colors.success : Colors.danger }}>
                {item.status === "active" ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center:           { flex: 1, justifyContent: "center", alignItems: "center" },
  list:             { padding: 16, gap: 12 },
  empty:            { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 15 },
  card:             { backgroundColor: Colors.white, borderRadius: 12, flexDirection: "row",
                      overflow: "hidden", elevation: 2,
                      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6 },
  image:            { width: 100, height: 90 },
  imagePlaceholder: { backgroundColor: Colors.border },
  info:             { flex: 1, padding: 12, gap: 4 },
  name:             { fontSize: 14, fontWeight: "700", color: Colors.text },
  price:            { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  badge:            { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
});
