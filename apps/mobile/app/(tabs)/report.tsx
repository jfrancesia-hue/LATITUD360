import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportTab() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A", justifyContent: "center", padding: 24 }}>
      <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32, textAlign: "center" }}>
        ¿Qué querés reportar?
      </Text>
      <View style={{ marginTop: 32, gap: 12 }}>
        <Pressable
          onPress={() => router.push("/incident/new")}
          style={{ backgroundColor: "#FF6B1A", padding: 20, borderRadius: 16 }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>⚠ Incidente / Casi accidente</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/permit/new")}
          style={{ backgroundColor: "#1F1F1F", padding: 20, borderRadius: 16 }}>
          <Text style={{ color: "#F5F5F5", fontSize: 18, fontWeight: "500" }}>🛂 Permiso de trabajo</Text>
        </Pressable>
        <Pressable style={{ backgroundColor: "#1F1F1F", padding: 20, borderRadius: 16 }}>
          <Text style={{ color: "#F5F5F5", fontSize: 18, fontWeight: "500" }}>📋 Parte diario</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
