import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PermitNewMobile() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A", padding: 20 }}>
      <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32 }}>Solicitar permiso</Text>
      <Text style={{ color: "#F5F5F580", marginTop: 12 }}>
        TODO: form de permiso de trabajo. 5 tipos · análisis de riesgo · validez ≤ 8h.
      </Text>
      <View style={{ marginTop: 32, backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14 }}>
        <Text style={{ color: "#FF6B1A", fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>EN DESARROLLO</Text>
        <Text style={{ color: "#F5F5F5", marginTop: 6 }}>Sprint 5 del PRD Fase 1.</Text>
      </View>
    </SafeAreaView>
  );
}
