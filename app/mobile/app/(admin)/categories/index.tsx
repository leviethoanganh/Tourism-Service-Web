import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { categoryAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function CategoriesScreen() {
  const [list,      setList]      = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const fetchList = useCallback(async () => {
    try {
      const data = await categoryAdminService.getList();
      setList(data.categories ?? data.categoryList ?? []);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchList(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchList(); };

  const softDelete = (id: string, name: string) => {
    Alert.alert("Xóa danh mục", `Xóa "${name}"?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: async () => {
        await categoryAdminService.softDelete(id);
        fetchList();
      }},
    ]);
  };

  const Item = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.parent ? `📂 ${item.parent?.name ?? "—"}` : "📂 Root"}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => router.push(`/(admin)/categories/${item._id}`)}>
          <Text style={styles.editTxt}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => softDelete(item._id, item.name)}>
          <Text style={styles.delTxt}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/(admin)/categories/create")}>
          <Text style={styles.btnText}>+ Tạo danh mục</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={list}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => <Item item={item} />}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Không có danh mục nào.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  center:      { flex: 1, justifyContent: "center", alignItems: "center" },
  toolbar:     { padding: 12 },
  btn:         { backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: "center" },
  btnText:     { color: Colors.white, fontWeight: "700", fontSize: 14 },
  item:        { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
                 flexDirection: "row", alignItems: "center", gap: 12,
                 elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  name:        { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  meta:        { fontSize: 12, color: Colors.sub },
  itemActions: { flexDirection: "row", gap: 14 },
  editTxt:     { fontSize: 20 },
  delTxt:      { fontSize: 20 },
  empty:       { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
});
