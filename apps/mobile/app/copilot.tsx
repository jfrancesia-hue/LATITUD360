import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { streamCopilot, type ChatMessage } from "../src/lib/copilot";

const SUGGESTIONS = [
  "¿Qué riesgos tengo en mi turno?",
  "¿Mi cuadrilla tiene EPPs vigentes?",
  "Resumime el día en seguridad",
  "¿Hay permisos pendientes?",
];

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hola, soy Latitud Copilot. Tengo acceso a los datos de tu mina en vivo. Preguntame lo que necesites: riesgos del turno, EPPs, permisos, clima del equipo. Funciono mejor con preguntas concretas.",
};

export default function CopilotMobile() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const abortRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => abortRef.current?.();
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || streaming) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text.trim() }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    let acc = "";
    abortRef.current = streamCopilot(
      next,
      (chunk) => {
        acc += chunk;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      },
      () => {
        setStreaming(false);
        abortRef.current = null;
      },
      (err) => {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: `No pude conectarme al backend (${err}). Verificá tu conexión a la red corporativa.`,
          };
          return copy;
        });
        setStreaming(false);
        abortRef.current = null;
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#1F1F1F" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: "#FF6B1A", alignItems: "center", justifyContent: "center",
          }}>
            <Text style={{ color: "#fff", fontSize: 18 }}>✨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 22 }}>
              Latitud Copilot
            </Text>
            <Text style={{ color: "#F5F5F580", fontSize: 11 }}>
              Conectado a Minera360 · Contacto · Datos en vivo
            </Text>
          </View>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: "#FF6B1A", fontSize: 14, fontWeight: "600" }}>Cerrar</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <View key={i} style={{ alignSelf: "flex-end", maxWidth: "85%" }}>
                <View style={{
                  backgroundColor: "#FF6B1A",
                  paddingHorizontal: 14, paddingVertical: 10,
                  borderRadius: 18, borderBottomRightRadius: 4,
                }}>
                  <Text style={{ color: "#fff", fontSize: 15, lineHeight: 21 }}>{m.content}</Text>
                </View>
              </View>
            );
          }
          return (
            <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-end", maxWidth: "90%" }}>
              <View style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: "#1F1F1F", alignItems: "center", justifyContent: "center",
              }}>
                <Text style={{ fontSize: 14 }}>✨</Text>
              </View>
              <View style={{
                flex: 1,
                backgroundColor: "#1F1F1F",
                paddingHorizontal: 14, paddingVertical: 10,
                borderRadius: 18, borderBottomLeftRadius: 4,
              }}>
                {m.content ? (
                  <Text style={{ color: "#F5F5F5", fontSize: 15, lineHeight: 21 }}>
                    {m.content}
                    {streaming && i === messages.length - 1 && (
                      <Text style={{ color: "#FF6B1A" }}> ▍</Text>
                    )}
                  </Text>
                ) : (
                  <ActivityIndicator color="#FF6B1A" size="small" />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ borderTopWidth: 1, borderTopColor: "#1F1F1F" }}
        contentContainerStyle={{ padding: 12, gap: 8 }}
      >
        {SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            onPress={() => send(s)}
            disabled={streaming}
            style={{
              paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 9999, backgroundColor: "#1F1F1F",
              opacity: streaming ? 0.4 : 1,
            }}
          >
            <Text style={{ color: "#F5F5F5", fontSize: 12 }}>{s}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 8, padding: 12, backgroundColor: "#0A0A0A", borderTopWidth: 1, borderTopColor: "#1F1F1F" }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Preguntale al Copilot..."
          placeholderTextColor="#F5F5F540"
          editable={!streaming}
          style={{
            flex: 1,
            backgroundColor: "#1F1F1F",
            color: "#F5F5F5",
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 9999,
            fontSize: 15,
          }}
          onSubmitEditing={() => send(input)}
        />
        <Pressable
          onPress={() => send(input)}
          disabled={streaming || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: input.trim() && !streaming ? "#FF6B1A" : "#1F1F1F",
            alignItems: "center", justifyContent: "center",
          }}
        >
          {streaming ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 18 }}>→</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
