import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type Post = {
  id: string;
  type: "announcement" | "recognition" | "event" | "news";
  title?: string;
  content: string;
  author: string;
  authorRole?: string;
  daysAgo: number;
  reads?: number;
  reactions?: number;
  requiresAck?: boolean;
  acknowledged?: boolean;
};

const FEED: Post[] = [
  {
    id: "1",
    type: "announcement",
    title: "Nueva política de turnos rotativos 7×7 a partir de junio",
    content: "Se viene un cambio importante. Lee la comunicación oficial completa y confirmá que la entendiste.",
    author: "Carlos Aguirre",
    authorRole: "HSE Manager",
    daysAgo: 1,
    reads: 218,
    requiresAck: true,
    acknowledged: false,
  },
  {
    id: "2",
    type: "recognition",
    content: "Mariana Salas reconoció a Roberto Méndez por «Trabajo en equipo»: «Te quedaste 4hs extra cuando faltó reemplazo. Gracias».",
    author: "Mariana Salas",
    daysAgo: 2,
    reactions: 31,
  },
  {
    id: "3",
    type: "event",
    title: "Capacitación obligatoria: nueva matriz de riesgos 2026",
    content: "Viernes 5 mayo, 09:00 — Sala de capacitación. Confirmar asistencia con tu supervisor.",
    author: "Coordinación HSE",
    daysAgo: 3,
    reads: 187,
  },
  {
    id: "4",
    type: "news",
    title: "127 días sin accidentes con tiempo perdido",
    content: "Marca histórica. Gracias a todos los que hacen seguridad cada día.",
    author: "Latitud360 · Mina Hombre Muerto",
    daysAgo: 4,
    reactions: 87,
  },
];

const TYPE_META: Record<Post["type"], { label: string; tint: string; emoji: string }> = {
  announcement: { label: "OFICIAL",       tint: "#FF6B1A", emoji: "📢" },
  recognition:  { label: "RECONOCIMIENTO", tint: "#00C2B8", emoji: "❤" },
  event:        { label: "EVENTO",         tint: "#D4AF37", emoji: "📅" },
  news:         { label: "NOVEDAD",        tint: "#F5F5F5", emoji: "📰" },
};

export default function FeedTab() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: "#F5F5F580", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Contacto
        </Text>
        <Text style={{ color: "#F5F5F5", fontFamily: "serif", fontStyle: "italic", fontSize: 32 }}>
          Lo que está pasando hoy
        </Text>

        <Pressable
          onPress={() => router.push("/recognize/new")}
          style={{ marginTop: 20, backgroundColor: "#00C2B822", borderColor: "#00C2B8", borderWidth: 1, padding: 16, borderRadius: 16 }}
        >
          <Text style={{ color: "#00C2B8", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>RÁPIDO</Text>
          <Text style={{ color: "#F5F5F5", fontSize: 16, marginTop: 4 }}>+ Reconocer a alguien</Text>
          <Text style={{ color: "#F5F5F580", fontSize: 12, marginTop: 2 }}>
            En 30 segundos. Funciona sin internet.
          </Text>
        </Pressable>

        <View style={{ marginTop: 24, gap: 12 }}>
          {FEED.map((p) => {
            const meta = TYPE_META[p.type];
            return (
              <View key={p.id} style={{ backgroundColor: "#1F1F1F", padding: 16, borderRadius: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14 }}>{meta.emoji}</Text>
                  <Text style={{ color: meta.tint, fontSize: 11, fontWeight: "700", letterSpacing: 0.6 }}>
                    {meta.label}
                  </Text>
                  <Text style={{ color: "#F5F5F540", fontSize: 11, marginLeft: "auto" }}>
                    hace {p.daysAgo}d
                  </Text>
                </View>

                {p.title && (
                  <Text style={{ color: "#F5F5F5", fontSize: 17, fontFamily: "serif", fontStyle: "italic", marginTop: 8, lineHeight: 22 }}>
                    {p.title}
                  </Text>
                )}
                <Text style={{ color: "#F5F5F5CC", fontSize: 14, marginTop: 6, lineHeight: 20 }}>
                  {p.content}
                </Text>

                <Text style={{ color: "#F5F5F560", fontSize: 11, marginTop: 10 }}>
                  por {p.author}{p.authorRole ? ` · ${p.authorRole}` : ""}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 12 }}>
                  {p.reads !== undefined && (
                    <Text style={{ color: "#F5F5F560", fontSize: 12 }}>👁 {p.reads} leyeron</Text>
                  )}
                  {p.reactions !== undefined && (
                    <Text style={{ color: "#F5F5F560", fontSize: 12 }}>👏 {p.reactions} reacciones</Text>
                  )}

                  {p.requiresAck && (
                    <Pressable
                      style={{
                        marginLeft: "auto",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 9999,
                        backgroundColor: p.acknowledged ? "#00B86B22" : "#FF6B1A",
                      }}
                    >
                      <Text style={{ color: p.acknowledged ? "#00B86B" : "#fff", fontSize: 12, fontWeight: "700" }}>
                        {p.acknowledged ? "✓ Confirmaste" : "Confirmar lectura"}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
