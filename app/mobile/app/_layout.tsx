import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { authService } from "../src/services/auth.service";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loggedIn = await authService.isLoggedIn();
      if (!loggedIn) {
        router.replace("/(auth)/login");
      } else {
        const role = await authService.getRole();
        router.replace(role === "admin" ? "/(admin)" : "/(user)");
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(user)" />
    </Stack>
  );
}
