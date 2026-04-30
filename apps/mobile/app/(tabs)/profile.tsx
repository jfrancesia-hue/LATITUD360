import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: "#1F1F1F", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#F5F5F5", fontSize: 36, fontFamily: "serif", fontStyle: "italic" }}>RM</Text>
          </View>
          <Text style={{ color: "#F5F5F5", fontSize: 22, marginTop: 12, fontWeight: "600" }}>Roberto Méndez</Text>
          <Text style={{ color: "#F5F5F580", marginTop: 4 }}>Supervisor turno noche</Text>
        </View>

        <View style={{ gap: 1, marginTop: 16 }}>
          <Pressable style={{ padding: 16, backgroundColor: "#1F1F1F" }}>
            <Text style={{ color: "#F5F5F5" }}>Mis EPPs</Text>
          </Pressable>
          <Pressable style={{ padding: 16, backgroundColor: "#1F1F1F" }}>
            <Text style={{ color: "#F5F5F5" }}>Mis vacaciones</Text>
          </Pressable>
          <Pressable style={{ padding: 16, backgroundColor: "#1F1F1F" }}>
            <Text style={{ color: "#F5F5F5" }}>Capacitaciones</Text>
          </Pressable>
          <Pressable style={{ padding: 16, backgroundColor: "#1F1F1F" }}>
            <Text style={{ color: "#F5F5F5" }}>Configuración</Text>
          </Pressable>
          <Pressable style={{ padding: 16, backgroundColor: "#1F1F1F" }}>
            <Text style={{ color: "#E63946" }}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
