import { useState } from "react";
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { tourClientService } from "../../src/services/client.service";
import { Colors } from "../../src/constants/colors";

export default function SearchScreen() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched,setSearched]= useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await tourClientService.search({ keyword: query });
      setResults(data.tours ?? data.tourList ?? []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm tour..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
          placeholderTextColor={Colors.sub}
        />
        <TouchableOpacity style={styles.btn} onPress={search}>
          <Text style={styles.btnTxt}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />}

      {!loading && searched && results.length === 0 && (
        <Text style={styles.empty}>Không tìm thấy kết quả cho "{query}"</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => router.push(`/(user)/${item.slug ?? item._id}`)}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.price}>💰 {(item.price ?? 0).toLocaleString()} VND</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 12, gap: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  searchBar: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: Colors.white,
               borderBottomWidth: 1, borderColor: Colors.border },
  input:     { flex: 1, backgroundColor: Colors.bg, borderRadius: 8, padding: 10,
               fontSize: 14, color: Colors.text },
  btn:       { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, justifyContent: "center" },
  btnTxt:    { color: Colors.white, fontWeight: "700" },
  item:      { backgroundColor: Colors.white, borderRadius: 12, padding: 14,
               elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  name:      { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  price:     { fontSize: 13, fontWeight: "700", color: Colors.danger },
  empty:     { textAlign: "center", color: Colors.sub, marginTop: 60, fontSize: 14, paddingHorizontal: 24 },
});
