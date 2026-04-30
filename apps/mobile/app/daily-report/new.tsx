import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiMutation } from "../../src/lib/api";

const SHIFTS = [
  { id: "morning",    label: "Mañana", emoji: "🌅", time: "06:00 – 14:00" },
  { id: "afternoon",  label: "Tarde",  emoji: "🌇", time: "14:00 – 22:00" },
  { id: "night",      label: "Noche",  emoji: "🌙", time: "22:00 – 06:00" },
] as const;

const SUGGESTED_AREAS = [
  { id: "a-tajo",    name: "Tajo principal" },
  { id: "a-planta",  name: "Planta de procesamiento" },
  { id: "a-taller",  name: "Taller mecánico" },
  { id: "a-salar3",  name: "Salar 3" },
  { id: "a-tanques", name: "Tanques de salmuera" },
];

const WEATHER_CHIPS = [
  "Despejado",
  "Parcialmente nublado",
  "Nublado",
  "Lluvia leve",
  "Lluvia fuerte",
  "Viento >40km/h",
  "Frío extremo",
];

export default function NewDailyReportMobile() {
  const router = useRouter();
  const [shift, setShift] = useState<typeof SHIFTS[number]["id"]>("morning");
  const [area, setArea] = useState<typeof SUGGESTED_AREAS[number] | null>(SUGGESTED_AREAS[0]);
  const [weather, setWeather] = useState<string>("");
  const [observations, setObservations] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!area) {
      Alert.alert("Faltan datos", "Elegí el área del turno");
      return;
    }
    setSubmitting(true);
    try {
      const result = await apiMutation("POST", "/api/daily-reports", {
        siteId: "00000000-0000-0000-0000-000000000000",
        areaId: area.id,
        shift,
        reportDate: new Date().toISOString(),
        weatherCondition: weather || undefined,
        observations: observations.trim() || undefined,
        photoUrls: [],
      });
      if (result.ok && result.offline) {
        Alert.alert("Sin señal — guardado", "El parte queda en cola y se envía al recuperar red.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else if (result.ok) {
        Alert.alert("✓ Parte registrado", "Quedó listo para que tu gerente lo firme.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32 }}>Parte diario</Text>
        <Text style={{ color: "#F5F5F580", fontSize: 13, marginTop: 4 }}>
          Tu registro del turno. Funciona sin internet.
        </Text>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 12 }}>
          Turno
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {SHIFTS.map((s) => {
            const active = shift === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setShift(s.id)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 14,
                  backgroundColor: active ? "#FF6B1A22" : "#1F1F1F",
                  borderWidth: 2,
                  borderColor: active ? "#FF6B1A" : "transparent",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                <Text style={{ color: active ? "#FF6B1A" : "#F5F5F5", fontSize: 13, marginTop: 4, fontWeight: "600" }}>
                  {s.label}
                </Text>
                <Text style={{ color: "#F5F5F560", fontSize: 10, marginTop: 2 }}>{s.time}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 12 }}>
          Área
        </Text>
        <View style={{ gap: 8 }}>
          {SUGGESTED_AREAS.map((a) => {
            const active = area?.id === a.id;
            return (
              <Pressable
                key={a.id}
                onPress={() => setArea(a)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: active ? "#FF6B1A22" : "#1F1F1F",
                  borderWidth: 2,
                  borderColor: active ? "#FF6B1A" : "transparent",
                }}
              >
                <Text style={{ color: "#F5F5F5", fontSize: 15 }}>{a.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 12 }}>
          Clima
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {WEATHER_CHIPS.map((w) => {
            const active = weather === w;
            return (
              <Pressable
                key={w}
                onPress={() => setWeather(active ? "" : w)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  backgroundColor: active ? "#F5F5F5" : "#1F1F1F",
                }}
              >
                <Text style={{ color: active ? "#0A0A0A" : "#F5F5F5", fontSize: 12 }}>{w}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 8 }}>
          Observaciones
        </Text>
        <TextInput
          value={observations}
          onChangeText={setObservations}
          multiline
          numberOfLines={5}
          maxLength={4000}
          placeholder="Resumí lo más importante del turno: producción, eventos, mantenimiento, observaciones de seguridad."
          placeholderTextColor="#F5F5F540"
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 15, minHeight: 140, textAlignVertical: "top" }}
        />
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#0A0A0A", borderTopWidth: 1, borderTopColor: "#1F1F1F" }}>
        <Pressable
          onPress={submit}
          disabled={submitting}
          style={{ backgroundColor: "#FF6B1A", padding: 18, borderRadius: 9999, alignItems: "center", opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Registrar parte</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
