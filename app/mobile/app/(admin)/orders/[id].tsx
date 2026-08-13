import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { orderAdminService } from "../../../src/services/admin.service";
import { Colors } from "../../../src/constants/colors";

const STATUS_OPTIONS = ["pending", "active", "cancel"];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order,   setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    orderAdminService.getDetail(id)
      .then((d) => setOrder(d.order ?? d.orderDetail ?? d))
      .catch((e) => Alert.alert("Lỗi", e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (status: string) => {
    setSaving(true);
    try {
      await orderAdminService.update(id, { status });
      setOrder((o: any) => ({ ...o, status }));
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );
  if (!order) return <View style={styles.center}><Text>Không tìm thấy đơn hàng.</Text></View>;

  const info = order.info ?? {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      {/* Header */}
      <View style={styles.card}>
        <Row label="Mã đơn"       value={`#${order.code ?? order._id?.slice(-6)}`} />
        <Row label="Trạng thái"   value={order.status} highlight />
        <Row label="Tổng tiền"    value={`${(order.totalPrice ?? 0).toLocaleString()} VND`} />
        <Row label="Ngày đặt"     value={order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"} />
      </View>

      {/* Customer info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👤 Thông tin khách hàng</Text>
        <Row label="Họ tên"  value={info.fullName ?? "—"} />
        <Row label="Email"   value={info.email    ?? "—"} />
        <Row label="SĐT"     value={info.phone    ?? "—"} />
      </View>

      {/* Items */}
      {(order.items ?? []).length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🗺 Tours đặt</Text>
          {(order.items ?? []).map((it: any, i: number) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemName}>{it.tourId?.name ?? "—"}</Text>
              <Text style={styles.itemMeta}>x{it.quantity} — {(it.price ?? 0).toLocaleString()} VND</Text>
            </View>
          ))}
        </View>
      )}

      {/* Status change */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📝 Cập nhật trạng thái</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusBtn,
                order.status === s && styles.statusBtnActive]}
              onPress={() => changeStatus(s)}
              disabled={saving}
            >
              <Text style={[styles.statusTxt, order.status === s && styles.statusTxtActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && { color: Colors.primary, fontWeight: "700" }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  center:       { flex: 1, justifyContent: "center", alignItems: "center" },
  card:         { backgroundColor: Colors.white, borderRadius: 12, padding: 16,
                  elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 12 },
  row:          { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6,
                  borderBottomWidth: 1, borderColor: Colors.border + "44" },
  rowLabel:     { fontSize: 13, color: Colors.sub },
  rowValue:     { fontSize: 13, color: Colors.text, fontWeight: "600", maxWidth: "60%", textAlign: "right" },
  itemRow:      { paddingVertical: 8, borderBottomWidth: 1, borderColor: Colors.border + "44" },
  itemName:     { fontSize: 13, fontWeight: "600", color: Colors.text },
  itemMeta:     { fontSize: 12, color: Colors.sub },
  statusRow:    { flexDirection: "row", gap: 8 },
  statusBtn:    { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8,
                  padding: 10, alignItems: "center" },
  statusBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + "15" },
  statusTxt:    { fontSize: 12, fontWeight: "600", color: Colors.sub },
  statusTxtActive: { color: Colors.primary },
});
