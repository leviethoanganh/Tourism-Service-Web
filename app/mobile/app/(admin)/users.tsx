import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { userAdminService } from "../../src/services/admin.service";
import { Colors } from "../../src/constants/colors";

function Avatar({ name }: { name: string }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initial}</Text>
    </View>
  );
}

export default function UsersScreen() {
  const [users,     setUsers]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(true);

  const fetchUsers = useCallback(async (p: number, replace = false) => {
    try {
      const data = await userAdminService.getList({ page: p });
      const list = data.users ?? data.userList ?? [];
      setUsers((prev) => replace ? list : [...prev, ...list]);
      const total = data.pagination?.totalRecord ?? list.length;
      setHasMore(p * (data.pagination?.limitItems ?? 10) < total);
    } catch { setHasMore(false); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchUsers(1, true); }, []);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    setPage(next);
    fetchUsers(next, false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchUsers(1, true);
  };

  const Item = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Avatar name={item.fullName ?? item.email} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.fullName ?? "—"}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.meta}>
          📱 {item.phone ?? "—"} &nbsp;|&nbsp; 📅 {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "—"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && page === 1
        ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color={Colors.primary} />
        : <FlatList
            data={users}
            keyExtractor={(it) => it._id}
            renderItem={({ item }) => <Item item={item} />}
            contentContainerStyle={{ padding: 12, gap: 10 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>Không có người dùng nào.</Text>}
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
  container:  { flex: 1, backgroundColor: Colors.bg },
  item:       { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
                flexDirection: "row", alignItems: "center", gap: 12,
                elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  avatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
                justifyContent: "center", alignItems: "center" },
  avatarText: { color: Colors.white, fontWeight: "800", fontSize: 18 },
  name:       { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 2 },
  email:      { fontSize: 13, color: Colors.primary, marginBottom: 3 },
  meta:       { fontSize: 11, color: Colors.sub },
  empty:      { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
});
