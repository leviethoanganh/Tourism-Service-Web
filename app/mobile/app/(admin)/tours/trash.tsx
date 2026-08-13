import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { tourAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function TourTrashScreen() {
  const [tours,     setTours]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const fetchTrash = async () => {
    try {
      const data = await tourAdminService.getTrash();
      setTours(data.tours ?? data.tourList ?? []);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchTrash(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchTrash(); };

  const restore = (id: string, name: string) => {
    Alert.alert("Khôi phục", `Khôi phục tour "${name}"?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Khôi phục", onPress: async () => {
        await tourAdminService.restore(id);
        fetchTrash();
      }},
    ]);
  };

  const destroy = (id: string, name: string) => {
    Alert.alert("Xóa vĩnh viễn", `Xóa vĩnh viễn tour "${name}"? Không thể hoàn tác!`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => {
        await tourAdminService.destroy(id);
        fetchTrash();
      }},
    ]);
  };

  const Item = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.meta}>🏷 {item.code ?? "—"}</Text>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.restoreBtn} onPress={() => restore(item._id, item.name)}>
          <Text style={styles.restoreTxt}>♻️ Khôi phục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.destroyBtn} onPress={() => destroy(item._id, item.name)}>
          <Text style={styles.destroyTxt}>🗑 Xóa vĩnh viễn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <FlatList
      style={styles.container}
      data={tours}
      keyExtractor={(it) => it._id}
      renderItem={({ item }) => <Item item={item} />}
      contentContainerStyle={{ padding: 12, gap: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<Text style={styles.empty}>Thùng rác trống.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  center:     { flex: 1, justifyContent: "center", alignItems: "center" },
  item:       { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
                elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  name:       { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  meta:       { fontSize: 12, color: Colors.sub, marginBottom: 10 },
  itemActions:{ flexDirection: "row", gap: 8 },
  restoreBtn: { flex: 1, backgroundColor: Colors.success + "1A", borderRadius: 8, padding: 10, alignItems: "center" },
  restoreTxt: { color: Colors.success, fontWeight: "700", fontSize: 13 },
  destroyBtn: { flex: 1, backgroundColor: Colors.danger + "1A", borderRadius: 8, padding: 10, alignItems: "center" },
  destroyTxt: { color: Colors.danger, fontWeight: "700", fontSize: 13 },
  empty:      { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
});
