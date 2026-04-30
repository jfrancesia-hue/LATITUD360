import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { INCIDENT_TYPE_LABELS, SEVERITY_META } from "@latitud360/shared";

const TYPES = Object.keys(INCIDENT_TYPE_LABELS) as (keyof typeof INCIDENT_TYPE_LABELS)[];
const SEVS = ["low", "medium", "high", "critical"] as const;

export default function NewIncidentMobile() {
  const router = useRouter();
  const [type, setType] = useState<typeof TYPES[number]>("near_miss");
  const [severity, setSeverity] = useState<typeof SEVS[number]>("medium");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim() || desc.length < 10) {
      Alert.alert("Faltan datos", "Completá título y al menos 10 caracteres en la descripción");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: POST a /v1/incidents (offline queue si no hay red)
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert("Reportado ✓", "Tu supervisor lo recibió. Vamos a contactarte si necesitamos más info.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32 }}>¿Qué pasó?</Text>
        <Text style={{ color: "#F5F5F580", fontSize: 13, marginTop: 4 }}>
          Reportá ahora. Funciona sin internet — se sincroniza al recuperar señal.
        </Text>

        {/* Tipo */}
        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 12 }}>Tipo</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {TYPES.map((t) => (
            <Pressable key={t} onPress={() => setType(t)}
              style={{
                paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9999,
                backgroundColor: type === t ? "#FF6B1A" : "#1F1F1F",
              }}>
              <Text style={{ color: type === t ? "#fff" : "#F5F5F5", fontSize: 13 }}>{INCIDENT_TYPE_LABELS[t]}</Text>
            </Pressable>
          ))}
        </View>

        {/* Severidad */}
        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 12 }}>Severidad</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {SEVS.map((s) => {
            const meta = SEVERITY_META[s];
            const active = severity === s;
            return (
              <Pressable key={s} onPress={() => setSeverity(s)}
                style={{
                  flex: 1, padding: 16, borderRadius: 14,
                  backgroundColor: active ? `${meta.color}33` : "#1F1F1F",
                  borderWidth: 2, borderColor: active ? meta.color : "transparent",
                  alignItems: "center",
                }}>
                <Text style={{ fontSize: 28 }}>{meta.emoji}</Text>
                <Text style={{ color: active ? meta.color : "#F5F5F5", fontSize: 12, marginTop: 4, fontWeight: "600" }}>{meta.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Título */}
        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 8 }}>Título corto</Text>
        <TextInput
          value={title} onChangeText={setTitle} maxLength={200}
          placeholder="Ej: Caída de roca cerca pasarela planta"
          placeholderTextColor="#F5F5F540"
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 16 }}
        />

        {/* Descripción */}
        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>Contá qué pasó</Text>
        <TextInput
          value={desc} onChangeText={setDesc} multiline numberOfLines={6} maxLength={4000}
          placeholder="Dónde, cuándo, qué hiciste, hubo heridos…"
          placeholderTextColor="#F5F5F540"
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 16, minHeight: 140, textAlignVertical: "top" }}
        />
      </ScrollView>

      {/* CTA sticky */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#0A0A0A", borderTopWidth: 1, borderTopColor: "#1F1F1F" }}>
        <Pressable
          onPress={submit} disabled={submitting}
          style={{ backgroundColor: "#FF6B1A", padding: 18, borderRadius: 9999, alignItems: "center", opacity: submitting ? 0.6 : 1 }}>
          {submitting ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Reportar ahora</Text>
          )}
        </Pressable>
        <Text style={{ color: "#F5F5F580", fontSize: 11, marginTop: 8, textAlign: "center" }}>
          Se enviará al supervisor de tu turno
        </Text>
      </View>
    </SafeAreaView>
  );
}
