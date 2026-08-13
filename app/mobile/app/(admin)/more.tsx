import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from "react-native";
import { router } from "expo-router";
import { authService } from "../../src/services/auth.service";
import { Colors } from "../../src/constants/colors";

function MenuItem({ icon, label, onPress, danger = false }: {
  icon: string; label: string; onPress: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <Text style={[styles.itemLabel, danger && { color: Colors.danger }]}>{label}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function MoreScreen() {
  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất", style: "destructive",
        onPress: async () => {
          await authService.logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Section title="Quản lý nội dung">
        <MenuItem icon="📂" label="Danh mục"        onPress={() => router.push("/(admin)/categories")} />
        <MenuItem icon="📋" label="Đơn hàng"        onPress={() => router.push("/(admin)/orders")} />
        <MenuItem icon="👥" label="Người dùng"      onPress={() => router.push("/(admin)/users")} />
      </Section>

      <Section title="Cài đặt hệ thống">
        <MenuItem icon="⚙️" label="Cài đặt website" onPress={() => router.push("/(admin)/settings")} />
        <MenuItem icon="🔑" label="Tài khoản admin" onPress={() => router.push("/(admin)/settings/accounts")} />
        <MenuItem icon="🛡" label="Phân quyền"      onPress={() => router.push("/(admin)/settings/roles")} />
      </Section>

      <Section title="Tài khoản">
        <MenuItem icon="👤" label="Hồ sơ của tôi"  onPress={() => router.push("/(admin)/profile")} />
        <MenuItem icon="🚪" label="Đăng xuất"       onPress={handleLogout} danger />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  section:      { marginBottom: 4 },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: Colors.sub, marginBottom: 8, textTransform: "uppercase" },
  sectionBody:  { backgroundColor: Colors.white, borderRadius: 12, overflow: "hidden",
                  elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  item:         { flexDirection: "row", alignItems: "center", padding: 14,
                  borderBottomWidth: 1, borderColor: Colors.border + "66" },
  itemIcon:     { fontSize: 20, marginRight: 12 },
  itemLabel:    { flex: 1, fontSize: 15, fontWeight: "600", color: Colors.text },
  arrow:        { fontSize: 20, color: Colors.sub },
});
