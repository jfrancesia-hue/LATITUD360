import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: "#F5F5F580", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Hola Roberto · Turno noche
        </Text>
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 36, lineHeight: 40 }}>
          Buenas, ¿cómo arrancamos hoy?
        </Text>

        {/* Banner alerta */}
        <View style={{ backgroundColor: "#FF6B1A22", borderColor: "#FF6B1A", borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 24 }}>
          <Text style={{ color: "#FF6B1A", fontWeight: "600", marginBottom: 4 }}>⚠ Alerta HSE</Text>
          <Text style={{ color: "#F5F5F5" }}>
            Permiso espacios confinados pendiente de aprobación. Plataforma 3.
          </Text>
        </View>

        {/* CTA grande Reportar */}
        <Pressable
          onPress={() => router.push("/incident/new")}
          style={{ marginTop: 24, backgroundColor: "#FF6B1A", padding: 24, borderRadius: 20, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>+ Reportar incidente</Text>
          <Text style={{ color: "#fff", opacity: 0.85, marginTop: 4, fontSize: 13 }}>
            En menos de 60 segundos
          </Text>
        </Pressable>

        {/* Secciones */}
        <View style={{ marginTop: 32, gap: 12 }}>
          <Pressable style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14 }}>
            <Text style={{ color: "#F5F5F5", fontSize: 16 }}>📋 Crear parte diario</Text>
          </Pressable>
          <Pressable style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14 }} onPress={() => router.push("/permit/new")}>
            <Text style={{ color: "#F5F5F5", fontSize: 16 }}>🛂 Solicitar permiso</Text>
          </Pressable>
          <Pressable style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14 }}>
            <Text style={{ color: "#F5F5F5", fontSize: 16 }}>🛡 Mis EPPs (3 vencen pronto)</Text>
          </Pressable>
        </View>

        {/* Feed Contacto */}
        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 32, marginBottom: 12 }}>
          Novedades del equipo
        </Text>
        <View style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14 }}>
          <Text style={{ color: "#FF6B1A", fontSize: 11, fontWeight: "600", letterSpacing: 0.5 }}>OFICIAL</Text>
          <Text style={{ color: "#F5F5F5", fontSize: 18, marginTop: 6, fontFamily: "serif", fontStyle: "italic" }}>
            127 días sin accidentes con tiempo perdido
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
