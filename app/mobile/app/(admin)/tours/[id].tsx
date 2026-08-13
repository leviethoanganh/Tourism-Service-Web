import { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Switch,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { tourAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function TourEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [form,    setForm]      = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [cities,     setCities]     = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      tourAdminService.getDetail(id),
      tourAdminService.getFormData(),
    ]).then(([detail, meta]) => {
      const tour = detail.tour ?? detail;
      setForm({
        name:           tour.name ?? "",
        code:           tour.code ?? "",
        price:          String(tour.price ?? ""),
        priceDiscount:  String(tour.priceDiscount ?? ""),
        stock:          String(tour.stock ?? ""),
        timeStart:      tour.timeStart ?? "",
        timeEnd:        tour.timeEnd ?? "",
        description:    tour.description ?? "",
        status:         tour.status ?? "active",
        categoryId:     tour.categoryId?._id ?? tour.categoryId ?? "",
        cityId:         tour.cityId?._id ?? tour.cityId ?? "",
      });
      setCategories(meta.categories ?? []);
      setCities(meta.cities ?? []);
    }).catch((e) => Alert.alert("Lỗi", e.message)).finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      await tourAdminService.update(id, fd);
      Alert.alert("Thành công", "Đã cập nhật tour", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  const softDelete = () => {
    Alert.alert("Xóa tạm thời", "Chuyển tour vào thùng rác?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa", style: "destructive",
        onPress: async () => {
          await tourAdminService.softDelete(id);
          router.back();
        },
      },
    ]);
  };

  const set = (key: string) => (val: string) => setForm((p: any) => ({ ...p, [key]: val }));

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Field label="Tên tour"        value={form.name}          onChangeText={set("name")} />
      <Field label="Mã tour"         value={form.code}          onChangeText={set("code")} />
      <Field label="Giá (VND)"       value={form.price}         onChangeText={set("price")} keyboardType="numeric" />
      <Field label="Giá khuyến mãi"  value={form.priceDiscount} onChangeText={set("priceDiscount")} keyboardType="numeric" />
      <Field label="Số lượng"        value={form.stock}         onChangeText={set("stock")} keyboardType="numeric" />
      <Field label="Ngày khởi hành"  value={form.timeStart}     onChangeText={set("timeStart")} placeholder="YYYY-MM-DD" />
      <Field label="Ngày kết thúc"   value={form.timeEnd}       onChangeText={set("timeEnd")} placeholder="YYYY-MM-DD" />
      <Field label="Mô tả"           value={form.description}   onChangeText={set("description")} multiline />

      {/* Status toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Trạng thái active</Text>
        <Switch
          value={form.status === "active"}
          onValueChange={(v) => setForm((p: any) => ({ ...p, status: v ? "active" : "inactive" }))}
          trackColor={{ false: Colors.border, true: Colors.primary }}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>💾 Lưu</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={softDelete}>
          <Text style={styles.delTxt}>🗑 Xóa tạm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, keyboardType = "default", multiline = false, placeholder }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 90, textAlignVertical: "top" }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={Colors.sub}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center:    { flex: 1, justifyContent: "center", alignItems: "center" },
  label:     { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:     { backgroundColor: Colors.white, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
               padding: 12, fontSize: 14, color: Colors.text },
  row:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
               backgroundColor: Colors.white, borderRadius: 8, padding: 14 },
  actions:   { flexDirection: "row", gap: 10, marginTop: 8 },
  saveBtn:   { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: "center" },
  saveTxt:   { color: Colors.white, fontWeight: "700", fontSize: 15 },
  delBtn:    { flex: 1, backgroundColor: Colors.white, borderRadius: 8, borderWidth: 1.5,
               borderColor: Colors.danger, padding: 14, alignItems: "center" },
  delTxt:    { color: Colors.danger, fontWeight: "700", fontSize: 15 },
});
