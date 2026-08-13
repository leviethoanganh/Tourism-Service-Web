import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, Alert, RefreshControl, ScrollView, Switch,
} from "react-native";
import { settingAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

const PERMISSIONS = [
  { label: "Xem tour",           value: "tour-view" },
  { label: "Tạo/sửa tour",       value: "tour-edit" },
  { label: "Xóa tour",           value: "tour-delete" },
  { label: "Xem đơn hàng",       value: "order-view" },
  { label: "Sửa đơn hàng",       value: "order-edit" },
  { label: "Xem danh mục",       value: "category-view" },
  { label: "Sửa danh mục",       value: "category-edit" },
  { label: "Xem người dùng",     value: "user-view" },
  { label: "Quản lý cài đặt",    value: "setting-view" },
];

export default function RolesScreen() {
  const [roles,     setRoles]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [modal,     setModal]     = useState(false);
  const [editRole,  setEditRole]  = useState<any | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState({ title: "", description: "", permissions: [] as string[] });

  const fetch = async () => {
    try {
      const d = await settingAdminService.getRoles();
      setRoles(d.roles ?? d.roleList ?? []);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetch(); }, []);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  const openCreate = () => {
    setEditRole(null);
    setForm({ title: "", description: "", permissions: [] });
    setModal(true);
  };

  const openEdit = async (role: any) => {
    setEditRole(role);
    setForm({ title: role.title, description: role.description ?? "", permissions: role.permissions ?? [] });
    setModal(true);
  };

  const togglePerm = (perm: string) => {
    setForm((p) => ({
      ...p,
      permissions: p.permissions.includes(perm)
        ? p.permissions.filter((x) => x !== perm)
        : [...p.permissions, perm],
    }));
  };

  const save = async () => {
    if (!form.title.trim()) { Alert.alert("Lỗi", "Nhập tên role"); return; }
    setSaving(true);
    try {
      if (editRole) {
        await settingAdminService.updateRole(editRole._id, form);
      } else {
        await settingAdminService.createRole(form);
      }
      setModal(false);
      fetch();
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  const Item = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => openEdit(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{(item.permissions ?? []).length} quyền</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.btn} onPress={openCreate}>
          <Text style={styles.btnTxt}>+ Tạo role</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={roles}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => <Item item={item} />}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có role nào.</Text>}
      />

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.overlay}>
          <ScrollView style={styles.sheet} contentContainerStyle={{ gap: 14 }}>
            <Text style={styles.sheetTitle}>{editRole ? "Sửa role" : "Tạo role mới"}</Text>

            <View>
              <Text style={styles.label}>Tên role *</Text>
              <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
                placeholderTextColor={Colors.sub}
              />
            </View>

            <View>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={styles.input}
                value={form.description}
                onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
                placeholderTextColor={Colors.sub}
              />
            </View>

            <View>
              <Text style={styles.label}>Quyền hạn</Text>
              {PERMISSIONS.map((p) => (
                <View key={p.value} style={styles.permRow}>
                  <Text style={styles.permLabel}>{p.label}</Text>
                  <Switch
                    value={form.permissions.includes(p.value)}
                    onValueChange={() => togglePerm(p.value)}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.sheetActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModal(false)}>
                <Text style={styles.cancelTxt}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Lưu</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  title:        { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  meta:         { fontSize: 12, color: Colors.sub },
  arrow:        { fontSize: 20, color: Colors.sub },
  empty:        { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14 },
  overlay:      { flex: 1, backgroundColor: "#00000055", justifyContent: "flex-end" },
  sheet:        { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                  padding: 24, maxHeight: "90%" },
  sheetTitle:   { fontSize: 17, fontWeight: "700", color: Colors.text, marginBottom: 8 },
  sheetActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn:    { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8, padding: 12, alignItems: "center" },
  cancelTxt:    { color: Colors.sub, fontWeight: "600" },
  saveBtn:      { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: "center" },
  saveTxt:      { color: Colors.white, fontWeight: "700" },
  label:        { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:        { backgroundColor: Colors.bg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
                  padding: 12, fontSize: 14, color: Colors.text },
  permRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.border + "44" },
  permLabel:    { fontSize: 14, color: Colors.text },
});
