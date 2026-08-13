import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, Alert, RefreshControl, ScrollView,
} from "react-native";
import { settingAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

export default function AccountsScreen() {
  const [accounts,  setAccounts]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [roles,     setRoles]     = useState<any[]>([]);
  const [modal,     setModal]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState({ fullName: "", email: "", password: "", roleId: "" });

  const fetch = async () => {
    try {
      const [accs, rls] = await Promise.all([settingAdminService.getAccounts(), settingAdminService.getRoles()]);
      setAccounts(accs.accountAdminList ?? accs.accountList ?? []);
      setRoles(rls.roles ?? rls.roleList ?? []);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetch(); }, []);

  const onRefresh = () => { setRefreshing(true); fetch(); };

  const createAccount = async () => {
    if (!form.fullName || !form.email || !form.password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin"); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      await settingAdminService.createAccount(fd);
      setModal(false);
      setForm({ fullName: "", email: "", password: "", roleId: "" });
      fetch();
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  const Item = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTxt}>{item.fullName?.charAt(0)?.toUpperCase() ?? "?"}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.meta}>🛡 {item.roleId?.title ?? "Không có role"}</Text>
      </View>
    </View>
  );

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.btn} onPress={() => setModal(true)}>
          <Text style={styles.btnTxt}>+ Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => <Item item={item} />}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có tài khoản nào.</Text>}
      />

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.overlay}>
          <ScrollView style={styles.sheet} contentContainerStyle={{ gap: 14 }}>
            <Text style={styles.sheetTitle}>Tạo tài khoản admin</Text>
            <Field label="Họ tên *"  value={form.fullName} onChangeText={(v: string) => setForm((p) => ({ ...p, fullName: v }))} />
            <Field label="Email *"   value={form.email}    onChangeText={(v: string) => setForm((p) => ({ ...p, email: v }))} keyboardType="email-address" />
            <Field label="Mật khẩu *" value={form.password} onChangeText={(v: string) => setForm((p) => ({ ...p, password: v }))} secure />

            {roles.length > 0 && (
              <View>
                <Text style={styles.label}>Role</Text>
                <View style={styles.roleList}>
                  {roles.map((r) => (
                    <TouchableOpacity
                      key={r._id}
                      style={[styles.roleBtn, form.roleId === r._id && styles.roleBtnActive]}
                      onPress={() => setForm((p) => ({ ...p, roleId: r._id }))}>
                      <Text style={[styles.roleTxt, form.roleId === r._id && styles.roleTxtActive]}>{r.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.sheetActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModal(false)}>
                <Text style={styles.cancelTxt}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={createAccount} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Tạo</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  toolbar:      { padding: 12 },
  btn:          { backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: "center" },
  btnTxt:       { color: Colors.white, fontWeight: "700", fontSize: 14 },
  item:         { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
                  flexDirection: "row", alignItems: "center", gap: 12,
                  elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  avatar:       { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
                  justifyContent: "center", alignItems: "center" },
  avatarTxt:    { color: Colors.white, fontWeight: "800", fontSize: 18 },
  name:         { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 2 },
  email:        { fontSize: 13, color: Colors.primary, marginBottom: 2 },
  meta:         { fontSize: 11, color: Colors.sub },
  empty:        { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
  overlay:      { flex: 1, backgroundColor: "#00000055", justifyContent: "flex-end" },
  sheet:        { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                  padding: 24, maxHeight: "85%" },
  sheetTitle:   { fontSize: 17, fontWeight: "700", color: Colors.text, marginBottom: 8 },
  sheetActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn:    { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8, padding: 12, alignItems: "center" },
  cancelTxt:    { color: Colors.sub, fontWeight: "600" },
  saveBtn:      { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: "center" },
  saveTxt:      { color: Colors.white, fontWeight: "700" },
  label:        { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:        { backgroundColor: Colors.bg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
                  padding: 12, fontSize: 14, color: Colors.text },
  roleList:     { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roleBtn:      { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  roleBtnActive:{ borderColor: Colors.primary, backgroundColor: Colors.primary + "15" },
  roleTxt:      { fontSize: 13, color: Colors.sub, fontWeight: "600" },
  roleTxtActive:{ color: Colors.primary },
});
