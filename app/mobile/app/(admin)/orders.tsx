import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { orderAdminService } from "../../src/services/admin.service";
import { Colors } from "../../src/constants/colors";

const statusColor: Record<string, string> = {
  active:   Colors.success,
  cancel:   Colors.danger,
  pending:  "#FF9800",
};

export default function OrdersScreen() {
  const [orders,    setOrders]    = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(true);

  const fetchOrders = useCallback(async (p: number, replace = false) => {
    try {
      const data = await orderAdminService.getList({ page: p });
      const list = data.orders ?? data.orderList ?? [];
      setOrders((prev) => replace ? list : [...prev, ...list]);
      const total = data.pagination?.totalRecord ?? list.length;
      setHasMore(p * (data.pagination?.limitItems ?? 8) < total);
    } catch { setHasMore(false); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchOrders(1, true); }, []);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchOrders(next, false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchOrders(1, true);
  };

  const Item = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/(admin)/orders/${item._id}`)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.code} numberOfLines={1}>#{item.code ?? item._id?.slice(-6)}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.info?.fullName ?? "—"}</Text>
        <Text style={styles.meta}>
          💰 {(item.totalPrice ?? 0).toLocaleString()} VND
        </Text>
        <Text style={styles.meta}>📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "—"}</Text>
      </View>
      <Text style={[styles.badge, { borderColor: statusColor[item.status] ?? Colors.border,
                                    color: statusColor[item.status] ?? Colors.sub }]}>
        {item.status ?? "—"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && page === 1
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={Colors.primary} />
        : <FlatList
            data={orders}
            keyExtractor={(it) => it._id}
            renderItem={({ item }) => <Item item={item} />}
            contentContainerStyle={{ padding: 12, gap: 10 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>Không có đơn hàng nào.</Text>}
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
  item:      { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
               flexDirection: "row", alignItems: "center", gap: 12,
               elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  code:      { fontSize: 12, fontWeight: "700", color: Colors.primary, marginBottom: 2 },
  name:      { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  meta:      { fontSize: 12, color: Colors.sub },
  badge:     { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, fontSize: 12, fontWeight: "600" },
  empty:     { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
});
