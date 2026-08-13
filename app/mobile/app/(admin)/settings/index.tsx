import { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from "react-native";
import { settingAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    settingAdminService.getWebsiteInfo()
      .then((d) => {
        const w = d.settingWebsiteInfo ?? d.websiteInfo ?? {};
        setInfo(w);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(info).forEach(([k, v]) => {
        if (typeof v === "string") fd.append(k, v);
      });
      await settingAdminService.updateWebsiteInfo(fd);
      Alert.alert("Thành công", "Đã cập nhật thông tin website");
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  const set = (key: string) => (val: string) => setInfo((p: any) => ({ ...p, [key]: val }));

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Field label="Tên website"  value={info.name ?? ""}    onChangeText={set("name")} />
      <Field label="Phone"        value={info.phone ?? ""}   onChangeText={set("phone")} keyboardType="phone-pad" />
      <Field label="Email"        value={info.email ?? ""}   onChangeText={set("email")} keyboardType="email-address" />
      <Field label="Address"      value={info.address ?? ""} onChangeText={set("address")} />
      <Field label="Copyright"    value={info.copyright ?? ""} onChangeText={set("copyright")} />
      <Field label="Description"  value={info.description ?? ""} onChangeText={set("description")} multiline />

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>💾 Lưu cài đặt</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, keyboardType = "default", multiline = false }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: "top" }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
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
  saveBtn:   { backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  saveTxt:   { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
