"use client";
import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "../../src/services/auth.service";
import { Colors } from "../../src/constants/colors";

export default function LoginScreen() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleAdminLogin = async () => {
    if (!email || !password) { setError("Vui lòng nhập email và mật khẩu."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await authService.loginAdmin(email, password);
      if (res.code === "success") {
        router.replace("/(admin)");
      } else {
        setError(res.message ?? "Đăng nhập thất bại");
      }
    } catch {
      setError("Không kết nối được server. Kiểm tra lại mạng.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    router.replace("/(user)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>28<Text style={styles.logoBlue}>Tours</Text></Text>
          <Text style={styles.tagline}>Tourism Management App</Text>
        </View>

        {/* Admin Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Đăng nhập Admin</Text>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="admin@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleAdminLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Đăng nhập</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Guest button */}
        <TouchableOpacity style={styles.guestButton} onPress={handleGuestAccess}>
          <Text style={styles.guestText}>🌍 Xem tour không cần đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  scroll:      { flexGrow: 1, padding: 24, justifyContent: "center" },
  header:      { alignItems: "center", marginBottom: 32 },
  logo:        { fontSize: 36, fontWeight: "800", color: Colors.text },
  logoBlue:    { color: Colors.primary },
  tagline:     { fontSize: 14, color: Colors.sub, marginTop: 4 },
  card:        { backgroundColor: Colors.white, borderRadius: 16, padding: 24,
                 elevation: 3, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10 },
  cardTitle:   { fontSize: 17, fontWeight: "700", color: Colors.text, marginBottom: 20 },
  error:       { backgroundColor: "#fff0f0", color: Colors.danger, borderRadius: 8,
                 padding: 12, marginBottom: 16, fontSize: 13, fontWeight: "600" },
  label:       { fontSize: 13, fontWeight: "600", color: Colors.sub, marginBottom: 6 },
  input:       { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 12,
                 fontSize: 15, color: Colors.text, marginBottom: 14 },
  button:      { backgroundColor: Colors.primary, borderRadius: 8, padding: 14,
                 alignItems: "center", marginTop: 4 },
  buttonText:  { color: Colors.white, fontWeight: "700", fontSize: 16 },
  divider:     { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 12, color: Colors.sub, fontSize: 13 },
  guestButton: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10,
                 padding: 14, alignItems: "center" },
  guestText:   { color: Colors.primary, fontWeight: "700", fontSize: 15 },
});
