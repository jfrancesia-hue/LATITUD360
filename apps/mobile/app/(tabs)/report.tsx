import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { pendingCount, syncPending } from "../../src/lib/api";

const ACTIONS = [
  {
    href: "/incident/new",
    title: "⚠ Incidente / Casi accidente",
    description: "Reportá ahora. Funciona sin internet.",
    bg: "#FF6B1A",
    fg: "#fff",
  },
  {
    href: "/daily-report/new",
    title: "📋 Parte diario",
    description: "Tu registro del turno. Firma electrónica.",
    bg: "#1F1F1F",
    fg: "#F5F5F5",
  },
  {
    href: "/permit/new",
    title: "🛂 Permiso de trabajo",
    description: "Altura, espacio confinado, caliente, eléctrico…",
    bg: "#1F1F1F",
    fg: "#F5F5F5",
  },
  {
    href: "/recognize/new",
    title: "❤ Reconocer a alguien",
    description: "Decir gracias por algo concreto.",
    bg: "#00C2B822",
    fg: "#00C2B8",
    border: "#00C2B8",
  },
] as const;

export default function ReportTab() {
  const router = useRouter();
  const [queued, setQueued] = useState(0);

  useEffect(() => {
    setQueued(pendingCount());
  }, []);

  const drainQueue = async () => {
    const result = await syncPending();
    setQueued(result.remaining);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32, textAlign: "center" }}>
          ¿Qué querés reportar?
        </Text>

        {queued > 0 && (
          <View style={{ marginTop: 16, backgroundColor: "#FFC93C22", borderColor: "#FFC93C", borderWidth: 1, padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 18 }}>📡</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFC93C", fontSize: 13, fontWeight: "600" }}>
                {queued} reporte{queued === 1 ? "" : "s"} pendiente{queued === 1 ? "" : "s"} de sincronizar
              </Text>
              <Text style={{ color: "#F5F5F580", fontSize: 11 }}>
                Los enviamos cuando recuperes señal.
              </Text>
            </View>
            <Pressable onPress={drainQueue} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999, backgroundColor: "#FFC93C" }}>
              <Text style={{ color: "#0A0A0A", fontSize: 12, fontWeight: "700" }}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        <View style={{ marginTop: 28, gap: 12 }}>
          {ACTIONS.map((a) => (
            <Pressable
              key={a.href}
              onPress={() => router.push(a.href as any)}
              style={{
                backgroundColor: a.bg,
                borderWidth: "border" in a && a.border ? 1 : 0,
                borderColor: "border" in a && a.border ? a.border : "transparent",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <Text style={{ color: a.fg, fontSize: 18, fontWeight: "600" }}>{a.title}</Text>
              <Text style={{ color: a.fg, opacity: 0.85, fontSize: 12, marginTop: 4 }}>{a.description}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
