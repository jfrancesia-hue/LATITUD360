import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShiftTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32 }}>Mi turno</Text>
        <Text style={{ color: "#F5F5F580", fontSize: 13, marginTop: 4 }}>Noche · 22:00 → 06:00 · Mina Hombre Muerto</Text>

        <View style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14, marginTop: 20 }}>
          <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            Parte diario
          </Text>
          <Text style={{ color: "#F5F5F5" }}>Pendiente de firma — empezar ahora.</Text>
        </View>

        <View style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14, marginTop: 12 }}>
          <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            Permisos activos
          </Text>
          <Text style={{ color: "#F5F5F5" }}>1 trabajo en altura · 2 espacios confinados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
