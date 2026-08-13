import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { authService } from "../../src/services/auth.service";
import { Colors } from "../../src/constants/colors";

export default function ProfileScreen() {
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    authService.checkAuth()
      .then((d) => { if (d.code === "success") setAccount(d.account); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
  };

  if (!account) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{account.fullName?.[0]?.toUpperCase() ?? "A"}</Text>
      </View>
      <Text style={styles.name}>{account.fullName}</Text>
      <Text style={styles.email}>{account.email}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center:      { flex: 1, justifyContent: "center", alignItems: "center" },
  container:   { flex: 1, backgroundColor: Colors.bg, alignItems: "center", padding: 32 },
  avatar:      { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
                 justifyContent: "center", alignItems: "center", marginTop: 40, marginBottom: 16 },
  avatarText:  { color: Colors.white, fontSize: 32, fontWeight: "700" },
  name:        { fontSize: 20, fontWeight: "700", color: Colors.text, marginBottom: 4 },
  email:       { fontSize: 14, color: Colors.sub, marginBottom: 40 },
  logoutBtn:   { backgroundColor: Colors.danger, borderRadius: 10, paddingHorizontal: 40,
                 paddingVertical: 14 },
  logoutText:  { color: Colors.white, fontWeight: "700", fontSize: 16 },
});
