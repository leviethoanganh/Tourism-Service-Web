import { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { categoryAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function CategoryEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [parents, setParents] = useState<any[]>([]);
  const [form,    setForm]    = useState({ name: "", parentId: "" });

  useEffect(() => {
    Promise.all([
      categoryAdminService.getDetail(id),
      categoryAdminService.getFormData(),
    ]).then(([detail, meta]) => {
      const cat = detail.category ?? detail.categoryDetail ?? detail;
      setForm({ name: cat.name ?? "", parentId: cat.parent?._id ?? cat.parent ?? "" });
      setParents(meta.categories?.filter((c: any) => c._id !== id) ?? []);
    }).catch((e) => Alert.alert("Lỗi", e.message)).finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    if (!form.name.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tên danh mục"); return; }
    setSaving(true);
    try {
      await categoryAdminService.update(id, form);
      Alert.alert("Thành công", "Đã cập nhật", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View>
        <Text style={styles.label}>Tên danh mục *</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
          placeholder="Nhập tên..."
          placeholderTextColor={Colors.sub}
        />
      </View>

      {parents.length > 0 && (
        <View>
          <Text style={styles.label}>Danh mục cha (tuỳ chọn)</Text>
          <View style={styles.parentList}>
            <TouchableOpacity
              style={[styles.parentBtn, !form.parentId && styles.parentBtnActive]}
              onPress={() => setForm((p) => ({ ...p, parentId: "" }))}>
              <Text style={[styles.parentTxt, !form.parentId && styles.parentTxtActive]}>Không có</Text>
            </TouchableOpacity>
            {parents.map((p) => (
              <TouchableOpacity
                key={p._id}
                style={[styles.parentBtn, form.parentId === p._id && styles.parentBtnActive]}
                onPress={() => setForm((f) => ({ ...f, parentId: p._id }))}>
                <Text style={[styles.parentTxt, form.parentId === p._id && styles.parentTxtActive]}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>💾 Lưu</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.bg },
  center:         { flex: 1, justifyContent: "center", alignItems: "center" },
  label:          { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:          { backgroundColor: Colors.white, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
                    padding: 12, fontSize: 14, color: Colors.text },
  parentList:     { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  parentBtn:      { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8,
                    paddingHorizontal: 12, paddingVertical: 8 },
  parentBtnActive:{ borderColor: Colors.primary, backgroundColor: Colors.primary + "15" },
  parentTxt:      { fontSize: 13, color: Colors.sub, fontWeight: "600" },
  parentTxtActive:{ color: Colors.primary },
  saveBtn:        { backgroundColor: Colors.primary, borderRadius: 8, padding: 14,
                    alignItems: "center", marginTop: 8 },
  saveTxt:        { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
