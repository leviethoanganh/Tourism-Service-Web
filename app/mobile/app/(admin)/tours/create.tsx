import { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { tourAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function TourCreateScreen() {
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({
    name: "", code: "", price: "", priceDiscount: "", stock: "",
    timeStart: "", timeEnd: "", description: "",
  });

  const set = (key: string) => (val: string) => setForm((p) => ({ ...p, [key]: val }));

  const save = async () => {
    if (!form.name.trim()) { Alert.alert("Lỗi", "Vui lòng nhập tên tour"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("status", "active");
      await tourAdminService.create(fd);
      Alert.alert("Thành công", "Đã tạo tour!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Field label="Tên tour *"       value={form.name}          onChangeText={set("name")} />
      <Field label="Mã tour"          value={form.code}          onChangeText={set("code")} />
      <Field label="Giá (VND)"        value={form.price}         onChangeText={set("price")} keyboardType="numeric" />
      <Field label="Giá khuyến mãi"   value={form.priceDiscount} onChangeText={set("priceDiscount")} keyboardType="numeric" />
      <Field label="Số lượng"         value={form.stock}         onChangeText={set("stock")} keyboardType="numeric" />
      <Field label="Ngày khởi hành"   value={form.timeStart}     onChangeText={set("timeStart")} placeholder="YYYY-MM-DD" />
      <Field label="Ngày kết thúc"    value={form.timeEnd}       onChangeText={set("timeEnd")} placeholder="YYYY-MM-DD" />
      <Field label="Mô tả"            value={form.description}   onChangeText={set("description")} multiline />

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>+ Tạo tour</Text>}
      </TouchableOpacity>
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
  label:     { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:     { backgroundColor: Colors.white, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
               padding: 12, fontSize: 14, color: Colors.text },
  saveBtn:   { backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  saveTxt:   { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
