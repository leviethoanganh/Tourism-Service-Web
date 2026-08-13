import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Colors } from "../../src/constants/colors";

const Icon = (e: string) => () => <Text style={{ fontSize: 20 }}>{e}</Text>;

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.sub,
        tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.border },
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index"  options={{ title: "Tours",    tabBarLabel: "Tours",   tabBarIcon: Icon("🗺️") }} />
      <Tabs.Screen name="search" options={{ title: "Tìm kiếm", tabBarLabel: "Tìm",    tabBarIcon: Icon("🔍") }} />
      <Tabs.Screen name="[slug]" options={{ href: null }} />
    </Tabs>
  );
}
