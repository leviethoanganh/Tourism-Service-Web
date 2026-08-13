import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, TextInput, RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { tourAdminService } from "../../src/services/admin.service";
import { Colors } from "../../src/constants/colors";

const statusColor: Record<string, string> = {
  active:   Colors.success,
  inactive: Colors.danger,
};

export default function ToursScreen() {
  const [tours,     setTours]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(true);

  const fetchTours = useCallback(async (q: string, p: number, replace = false) => {
    try {
      const data = await tourAdminService.getList({ page: p, keyword: q });
      const list = data.tours ?? data.tourList ?? [];
      setTours((prev) => replace ? list : [...prev, ...list]);
      const total = data.pagination?.totalRecord ?? list.length;
      setHasMore(p * (data.pagination?.limitItems ?? 8) < total);
    } catch { setHasMore(false); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchTours(search, 1, true);
  }, [search]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchTours(search, next, false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchTours(search, 1, true);
  };

  const Item = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/(admin)/tours/${item._id}`)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.meta}>🏷 {item.code ?? "—"}</Text>
        <Text style={styles.meta}>
          💰 {(item.price ?? 0).toLocaleString()} VND
        </Text>
      </View>
      <Text style={[styles.badge, { borderColor: statusColor[item.status] ?? Colors.border,
                                    color: statusColor[item.status] ?? Colors.sub }]}>
        {item.status ?? "—"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Tìm tên tour..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/(admin)/tours/create")}>
          <Text style={styles.btnText}>+ Tạo tour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]}
          onPress={() => router.push("/(admin)/tours/trash")}>
          <Text style={[styles.btnText, { color: Colors.danger }]}>🗑 Thùng rác</Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={Colors.primary} />
        : <FlatList
            data={tours}
            keyExtractor={(it) => it._id}
            renderItem={({ item }) => <Item item={item} />}
            contentContainerStyle={{ padding: 12, gap: 10 }}
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
  container:   { flex: 1, backgroundColor: Colors.bg },
  searchBox:   { padding: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.border },
  searchInput: { backgroundColor: Colors.bg, borderRadius: 8, padding: 10, fontSize: 14, color: Colors.text },
  toolbar:     { flexDirection: "row", gap: 10, padding: 12 },
  btn:         { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, padding: 10, alignItems: "center" },
  btnSecondary:{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.danger },
  btnText:     { color: Colors.white, fontWeight: "700", fontSize: 13 },
  item:        { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
                 flexDirection: "row", alignItems: "center", gap: 12,
                 elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  name:        { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  meta:        { fontSize: 12, color: Colors.sub },
  badge:       { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, fontSize: 12, fontWeight: "600" },
  empty:       { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
});
