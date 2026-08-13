import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { tourClientService } from "../../src/services/client.service";
import { Colors } from "../../src/constants/colors";

export default function TourListScreen() {
  const [tours,     setTours]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(true);

  const fetchTours = useCallback(async (p: number, replace = false) => {
    try {
      const data = await tourClientService.getList({ page: p });
      const list = data.tours ?? data.tourList ?? [];
      setTours((prev) => replace ? list : [...prev, ...list]);
      const total = data.pagination?.totalRecord ?? list.length;
      setHasMore(p * (data.pagination?.limitItems ?? 8) < total);
    } catch { setHasMore(false); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchTours(1, true); }, []);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchTours(next, false);
  };

  const onRefresh = () => { setRefreshing(true); setPage(1); fetchTours(1, true); };

  const Item = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/(user)/${item.slug ?? item._id}`)}>
      <View style={styles.badge}>
        <Text style={styles.badgeTxt}>{item.category?.name ?? "Tour"}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>💰 {(item.price ?? 0).toLocaleString()} VND</Text>
        <Text style={styles.time}>📅 {item.timeStart ? new Date(item.timeStart).toLocaleDateString("vi-VN") : "—"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && page === 1
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={Colors.primary} />
        : <FlatList
            data={tours}
            keyExtractor={(it) => it._id}
            renderItem={({ item }) => <Item item={item} />}
            contentContainerStyle={{ padding: 12, gap: 12 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>Không có tour nào.</Text>}
            ListFooterComponent={
              hasMore && page > 1
                ? <ActivityIndicator color={Colors.primary} style={{ margin: 16 }} />
                : null
            }
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  card:      { backgroundColor: Colors.white, borderRadius: 14, padding: 16,
               elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8 },
  badge:     { alignSelf: "flex-start", backgroundColor: Colors.primary + "1A",
               borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  badgeTxt:  { fontSize: 11, fontWeight: "700", color: Colors.primary },
  name:      { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 10, lineHeight: 22 },
  footer:    { flexDirection: "row", justifyContent: "space-between" },
  price:     { fontSize: 13, fontWeight: "700", color: Colors.danger },
  time:      { fontSize: 12, color: Colors.sub },
  empty:     { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
});
