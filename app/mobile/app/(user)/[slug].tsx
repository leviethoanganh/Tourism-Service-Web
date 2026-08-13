import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Alert, TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { tourClientService, orderClientService } from "../../src/services/client.service";
import { Colors } from "../../src/constants/colors";

export default function TourDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [tour,    setTour]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [form,    setForm]    = useState({ fullName: "", email: "", phone: "" });

  useEffect(() => {
    tourClientService.getDetail(slug)
      .then((d) => setTour(d.tour ?? d))
      .catch((e) => Alert.alert("Lỗi", e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const book = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin"); return;
    }
    setBooking(true);
    try {
      await orderClientService.create({
        tourId: tour._id,
        quantity: 1,
        info: form,
      });
      Alert.alert("Đặt tour thành công", "Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      setForm({ fullName: "", email: "", phone: "" });
    } catch (e: any) {
      Alert.alert("Lỗi", e.response?.data?.message ?? e.message);
    } finally { setBooking(false); }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
  );
  if (!tour) return <View style={styles.center}><Text>Không tìm thấy tour.</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Text style={styles.name}>{tour.name}</Text>

      <View style={styles.meta}>
        <Text style={styles.price}>💰 {(tour.price ?? 0).toLocaleString()} VND</Text>
        {(tour.priceDiscount ?? 0) > 0 && (
          <Text style={styles.discount}>KM: {tour.priceDiscount.toLocaleString()} VND</Text>
        )}
      </View>

      <View style={styles.card}>
        <InfoRow label="Ngày khởi hành" value={tour.timeStart ? new Date(tour.timeStart).toLocaleDateString("vi-VN") : "—"} />
        <InfoRow label="Ngày kết thúc"  value={tour.timeEnd   ? new Date(tour.timeEnd).toLocaleDateString("vi-VN")   : "—"} />
        <InfoRow label="Còn lại"        value={`${tour.stock ?? 0} chỗ`} />
        <InfoRow label="Danh mục"       value={tour.categoryId?.name ?? "—"} />
      </View>

      {!!tour.description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Mô tả</Text>
          <Text style={styles.desc}>{tour.description}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Đặt tour</Text>
        <Field label="Họ tên *" value={form.fullName} onChangeText={(v: string) => setForm((p) => ({ ...p, fullName: v }))} />
        <Field label="Email *"  value={form.email}    onChangeText={(v: string) => setForm((p) => ({ ...p, email: v }))} keyboardType="email-address" />
        <Field label="SĐT *"    value={form.phone}    onChangeText={(v: string) => setForm((p) => ({ ...p, phone: v }))} keyboardType="phone-pad" />
        <TouchableOpacity style={styles.bookBtn} onPress={book} disabled={booking}>
          {booking ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookTxt}>Đặt ngay</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Field({ label, value, onChangeText, keyboardType = "default" }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.sub}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  center:     { flex: 1, justifyContent: "center", alignItems: "center" },
  name:       { fontSize: 20, fontWeight: "800", color: Colors.text, lineHeight: 28 },
  meta:       { flexDirection: "row", gap: 12, alignItems: "center" },
  price:      { fontSize: 17, fontWeight: "800", color: Colors.danger },
  discount:   { fontSize: 13, color: Colors.sub, textDecorationLine: "line-through" },
  card:       { backgroundColor: Colors.white, borderRadius: 12, padding: 16,
                elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  cardTitle:  { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 12 },
  desc:       { fontSize: 14, color: Colors.sub, lineHeight: 22 },
  row:        { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8,
                borderBottomWidth: 1, borderColor: Colors.border + "44" },
  rowLabel:   { fontSize: 13, color: Colors.sub },
  rowValue:   { fontSize: 13, fontWeight: "600", color: Colors.text },
  label:      { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  textInput:  { backgroundColor: Colors.bg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
                padding: 12, fontSize: 14, color: Colors.text },
  bookBtn:    { backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: "center", marginTop: 4 },
  bookTxt:    { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
