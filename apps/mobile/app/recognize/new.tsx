import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiMutation } from "../../src/lib/api";

const VALUES = [
  { id: "seguridad",     label: "Seguridad ante todo",  emoji: "🛡" },
  { id: "trabajo_equipo", label: "Trabajo en equipo",   emoji: "🤝" },
  { id: "excelencia",    label: "Excelencia operativa",  emoji: "🏆" },
  { id: "iniciativa",    label: "Iniciativa",            emoji: "💡" },
  { id: "respeto",       label: "Respeto y cuidado",     emoji: "❤" },
] as const;

const SUGGESTED_PEERS = [
  { id: "u-roberto", fullName: "Roberto Méndez",       jobTitle: "Supervisor turno mañana" },
  { id: "u-mariana", fullName: "Mariana Salas",        jobTitle: "Coordinadora HSE" },
  { id: "u-juan",    fullName: "Juan Carlos Quispe",   jobTitle: "Operario chofer CAT 793" },
  { id: "u-ana",     fullName: "Ana Castro",           jobTitle: "Operadora planta" },
  { id: "u-diego",   fullName: "Diego Ramírez",        jobTitle: "Mecánico mantenimiento" },
];

export default function NewRecognitionMobile() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [recipient, setRecipient] = useState<typeof SUGGESTED_PEERS[number] | null>(null);
  const [value, setValue] = useState<typeof VALUES[number]["id"]>("seguridad");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = search
    ? SUGGESTED_PEERS.filter((p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.jobTitle.toLowerCase().includes(search.toLowerCase()),
      )
    : SUGGESTED_PEERS;

  const submit = async () => {
    if (!recipient) {
      Alert.alert("Falta destinatario", "Elegí a quién querés reconocer");
      return;
    }
    if (message.trim().length < 5) {
      Alert.alert("Falta mensaje", "Contale qué hizo bien (mínimo 5 caracteres)");
      return;
    }
    setSubmitting(true);
    try {
      const result = await apiMutation("POST", "/api/recognitions", {
        toUserId: recipient.id,
        value,
        message: message.trim(),
        isPublic: true,
      });
      if (result.ok && result.offline) {
        Alert.alert("Sin señal — guardado", "Lo enviamos cuando recuperes red.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else if (result.ok) {
        Alert.alert(`✓ Reconocimiento enviado`, `${recipient.fullName} lo va a recibir como notificación.`, [
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
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32 }}>
          Reconocer a un compañero
        </Text>
        <Text style={{ color: "#F5F5F580", fontSize: 13, marginTop: 4 }}>
          Decir gracias por algo concreto fortalece la cultura del equipo.
        </Text>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 8 }}>
          ¿A quién?
        </Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre o puesto..."
          placeholderTextColor="#F5F5F540"
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 15 }}
        />
        <View style={{ marginTop: 12, gap: 8 }}>
          {filtered.map((p) => {
            const active = recipient?.id === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setRecipient(p)}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: active ? "#00C2B822" : "#1F1F1F",
                  borderWidth: 2,
                  borderColor: active ? "#00C2B8" : "transparent",
                }}
              >
                <Text style={{ color: "#F5F5F5", fontSize: 15, fontWeight: "500" }}>{p.fullName}</Text>
                <Text style={{ color: "#F5F5F580", fontSize: 12, marginTop: 2 }}>{p.jobTitle}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 12 }}>
          ¿Por qué valor?
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {VALUES.map((v) => {
            const active = value === v.id;
            return (
              <Pressable
                key={v.id}
                onPress={() => setValue(v.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 9999,
                  backgroundColor: active ? "#00C2B8" : "#1F1F1F",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text style={{ fontSize: 14 }}>{v.emoji}</Text>
                <Text style={{ color: active ? "#0A0A0A" : "#F5F5F5", fontSize: 13, fontWeight: active ? "700" : "400" }}>
                  {v.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 24, marginBottom: 8 }}>
          ¿Qué te gustaría decirle?
        </Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Sé específico. Algo concreto que hizo y que te llegó."
          placeholderTextColor="#F5F5F540"
          multiline
          numberOfLines={5}
          maxLength={1000}
          style={{ backgroundColor: "#1F1F1F", color: "#F5F5F5", padding: 14, borderRadius: 12, fontSize: 15, minHeight: 120, textAlignVertical: "top" }}
        />
        <Text style={{ color: "#F5F5F580", fontSize: 11, marginTop: 4, textAlign: "right" }}>
          {message.length}/1000
        </Text>
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#0A0A0A", borderTopWidth: 1, borderTopColor: "#1F1F1F" }}>
        <Pressable
          onPress={submit}
          disabled={submitting}
          style={{ backgroundColor: "#00C2B8", padding: 18, borderRadius: 9999, alignItems: "center", opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? <ActivityIndicator color="#0A0A0A" /> : (
            <Text style={{ color: "#0A0A0A", fontSize: 16, fontWeight: "700" }}>Enviar reconocimiento</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
