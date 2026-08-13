import { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from "react-native";
import { profileAdminService } from "../../src/services/admin.service";
import { Colors } from "../../src/constants/colors";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [tab,     setTab]     = useState<"info" | "password">("info");
  const [info, setInfo] = useState({ fullName: "", email: "", phone: "" });
  const [pw,   setPw]   = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    profileAdminService.getInfo()
      .then((d) => {
        const acc = d.account ?? d.accountAdmin ?? d;
        setInfo({ fullName: acc.fullName ?? "", email: acc.email ?? "", phone: acc.phone ?? "" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveInfo = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(info).forEach(([k, v]) => fd.append(k, v));
      await profileAdminService.update(fd);
      Alert.alert("Thành công", "Đã cập nhật hồ sơ");
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (pw.newPassword !== pw.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp"); return;
    }
    setSaving(true);
    try {
      await profileAdminService.changePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      Alert.alert("Thành công", "Đã đổi mật khẩu");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === "info" && styles.tabActive]}
          onPress={() => setTab("info")}>
          <Text style={[styles.tabTxt, tab === "info" && styles.tabTxtActive]}>Hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === "password" && styles.tabActive]}
          onPress={() => setTab("password")}>
          <Text style={[styles.tabTxt, tab === "password" && styles.tabTxtActive]}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>

      {tab === "info" ? (
        <>
          <Field label="Họ và tên" value={info.fullName} onChangeText={(v) => setInfo((p) => ({ ...p, fullName: v }))} />
          <Field label="Email"     value={info.email}    onChangeText={(v) => setInfo((p) => ({ ...p, email: v }))} keyboardType="email-address" />
          <Field label="SĐT"       value={info.phone}    onChangeText={(v) => setInfo((p) => ({ ...p, phone: v }))} keyboardType="phone-pad" />
          <TouchableOpacity style={styles.saveBtn} onPress={saveInfo} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>💾 Lưu thông tin</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Field label="Mật khẩu hiện tại"   value={pw.currentPassword} onChangeText={(v) => setPw((p) => ({ ...p, currentPassword: v }))} secure />
          <Field label="Mật khẩu mới"         value={pw.newPassword}     onChangeText={(v) => setPw((p) => ({ ...p, newPassword: v }))} secure />
          <Field label="Xác nhận mật khẩu mới" value={pw.confirmPassword} onChangeText={(v) => setPw((p) => ({ ...p, confirmPassword: v }))} secure />
          <TouchableOpacity style={styles.saveBtn} onPress={changePassword} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>🔒 Đổi mật khẩu</Text>}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, keyboardType = "default", secure = false }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        placeholderTextColor={Colors.sub}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  center:       { flex: 1, justifyContent: "center", alignItems: "center" },
  tabs:         { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 10, padding: 4, gap: 4 },
  tab:          { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  tabActive:    { backgroundColor: Colors.primary },
  tabTxt:       { fontWeight: "600", color: Colors.sub, fontSize: 14 },
  tabTxtActive: { color: Colors.white },
  label:        { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:        { backgroundColor: Colors.white, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
                  padding: 12, fontSize: 14, color: Colors.text },
  saveBtn:      { backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  saveTxt:      { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
