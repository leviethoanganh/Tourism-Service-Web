import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../src/constants/colors";

export default function OrdersScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Orders — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg },
  text:   { color: Colors.sub, fontSize: 16 },
});
