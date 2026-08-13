import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Colors } from "../../src/constants/colors";

const Icon = (e: string) => () => <Text style={{ fontSize: 20 }}>{e}</Text>;

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.sub,
        tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.border },
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index"       options={{ title: "Dashboard", tabBarLabel: "Dashboard", tabBarIcon: Icon("📊") }} />
      <Tabs.Screen name="tours"       options={{ title: "Tours",     tabBarLabel: "Tours",     tabBarIcon: Icon("🗺️") }} />
      <Tabs.Screen name="orders"      options={{ title: "Đơn hàng",  tabBarLabel: "Orders",    tabBarIcon: Icon("📋") }} />
      <Tabs.Screen name="users"       options={{ title: "Users",     tabBarLabel: "Users",     tabBarIcon: Icon("👥") }} />
      <Tabs.Screen name="more"        options={{ title: "Thêm",      tabBarLabel: "More",      tabBarIcon: Icon("⚙️") }} />
      {/* Ẩn các màn hình detail khỏi tab bar */}
      <Tabs.Screen name="tours/create"        options={{ href: null }} />
      <Tabs.Screen name="tours/[id]"          options={{ href: null }} />
      <Tabs.Screen name="tours/trash"         options={{ href: null }} />
      <Tabs.Screen name="categories/index"    options={{ href: null }} />
      <Tabs.Screen name="categories/create"   options={{ href: null }} />
      <Tabs.Screen name="categories/[id]"     options={{ href: null }} />
      <Tabs.Screen name="orders/[id]"         options={{ href: null }} />
      <Tabs.Screen name="settings/index"      options={{ href: null }} />
      <Tabs.Screen name="settings/accounts"   options={{ href: null }} />
      <Tabs.Screen name="settings/roles"      options={{ href: null }} />
      <Tabs.Screen name="profile"             options={{ href: null }} />
    </Tabs>
  );
}
