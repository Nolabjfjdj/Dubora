import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";

const COLORS = ["#ffffff", "#ffe082", "#80deea", "#f8bbd0", "#c5e1a5"];
const BACKGROUNDS = ["#000000", "#101114", "#263238", "#311b92", "#0d47a1"];
const SIZES = [20, 24, 28, 32, 36, 42, 48];
const WEIGHTS = ["400", "500", "600", "700", "800"];

export default function App() {
  const { width, height } = useWindowDimensions();
  const [phrase, setPhrase] = useState("");
  const [videoAsset, setVideoAsset] = useState(null);
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState("700");
  const [italic, setItalic] = useState(false);
  const [textColor, setTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.7);
  const [textAlign, setTextAlign] = useState("center");
  const [maxLines, setMaxLines] = useState(3);
  const [shadow, setShadow] = useState(true);
  const [showAppearance, setShowAppearance] = useState(false);
  const isLandscape = width > height;

  async function pickVideo() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
        multiple: false
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setVideoAsset(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Importation impossible", "Dubora n’a pas pu ouvrir le sélecteur vidéo. Réessaie avec une autre vidéo.");
    }
  }

  function comingSoon(feature) {
    Alert.alert("Dubora", feature + " sera reconnecté dans la prochaine étape. Nous validons d'abord l'interface iOS pour éviter de réintroduire le crash de démarrage.");
  }

  function choice(label, value, selected, onPress) {
    return (
      <Pressable key={String(value)} onPress={onPress} style={[styles.choice, selected && styles.choiceActive]}>
        <Text style={[styles.choiceText, selected && styles.choiceTextActive]}>{label}</Text>
      </Pressable>
    );
  }

  const previewStyle = {
    color: textColor,
    fontSize,
    fontWeight,
    fontStyle: italic ? "italic" : "normal",
    textAlign,
    textShadowColor: shadow ? "#000000" : "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: shadow ? 5 : 0
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>D</Text></View>
            <View>
              <Text style={styles.title}>Dubora</Text>
              <Text style={styles.subtitle}>Studio de doublage mobile</Text>
            </View>
          </View>
          <View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusPillText}>Studio prêt</Text></View>
        </View>

        <View style={[styles.workspace, isLandscape && styles.workspaceLandscape]}>
          <View style={[styles.mediaColumn, isLandscape && styles.mediaColumnLandscape]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Aperçu vidéo</Text>
              <Text style={styles.sectionHint}>16:9</Text>
            </View>
            <Pressable style={styles.videoPlaceholder} onPress={pickVideo}>
              <View style={styles.playCircle}><Text style={styles.playIcon}>{videoAsset ? "✓" : "▶"}</Text></View>
              <Text style={styles.placeholderTitle}>{videoAsset ? "Vidéo importée" : "Ajoute ta vidéo"}</Text>
              <Text style={styles.placeholderText}>{videoAsset ? videoAsset.name : "Choisis une vidéo depuis tes fichiers pour préparer ton doublage."}</Text>
              <View style={styles.importButton}><Text style={styles.importButtonText}>{videoAsset ? "↻ Changer la vidéo" : "＋ Importer une vidéo"}</Text></View>
            </Pressable>
            <View style={styles.mediaNote}><Text style={styles.noteIcon}>✦</Text><Text style={styles.mediaNoteText}>Paysage privilégié pour travailler confortablement.</Text></View>
          </View>

          <View style={styles.scriptColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Texte à doubler</Text>
              <Text style={styles.sectionHint}>{phrase.length} caractères</Text>
            </View>
            <View style={[styles.previewCard, { backgroundColor: backgroundColor + (backgroundOpacity < 1 ? Math.round(backgroundOpacity * 255).toString(16).padStart(2, "0") : "") }]}>
              <Text style={previewStyle} numberOfLines={maxLines}>{phrase || "Ta phrase apparaîtra ici"}</Text>
            </View>
            <TextInput
              value={phrase}
              onChangeText={setPhrase}
              multiline
              placeholder="Écris ou colle ton texte ici…"
              placeholderTextColor="#727987"
              style={styles.scriptInput}
              textAlignVertical="top"
            />
            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryButton} onPress={() => setPhrase("")}><Text style={styles.secondaryButtonText}>Effacer</Text></Pressable>
              <Pressable style={styles.recordButton} onPress={() => comingSoon("L'enregistrement vocal")}><Text style={styles.recordButtonText}>●  Enregistrer</Text></Pressable>
            </View>
            <Text style={styles.helperText}>L'enregistrement audio sera activé après validation de cette première interface.</Text>
          </View>
        </View>

        <View style={styles.customHeader}>
          <View style={styles.customTitleWrap}>
            <Text style={styles.sectionTitle}>Apparence du texte</Text>
            <Text style={styles.helperText}>Règle l'affichage pour lire tes répliques clairement.</Text>
          </View>
          <Pressable style={styles.secondaryButton} onPress={() => setShowAppearance(v => !v)}>
            <Text style={styles.secondaryButtonText}>{showAppearance ? "Masquer" : "Personnaliser"}</Text>
          </Pressable>
        </View>

        {showAppearance && (
          <View style={styles.settingsCard}>
            <Text style={styles.settingLabel}>Taille du texte</Text>
            <View style={styles.choices}>{SIZES.map(v => choice(String(v), v, fontSize === v, () => setFontSize(v)))}</View>

            <Text style={styles.settingLabel}>Épaisseur</Text>
            <View style={styles.choices}>{WEIGHTS.map(v => choice(v, v, fontWeight === v, () => setFontWeight(v)))}</View>

            <Text style={styles.settingLabel}>Style et alignement</Text>
            <View style={styles.choices}>
              {choice("Normal", "normal", !italic, () => setItalic(false))}
              {choice("Italique", "italic", italic, () => setItalic(true))}
              {choice("Gauche", "left", textAlign === "left", () => setTextAlign("left"))}
              {choice("Centre", "center", textAlign === "center", () => setTextAlign("center"))}
              {choice("Droite", "right", textAlign === "right", () => setTextAlign("right"))}
            </View>

            <Text style={styles.settingLabel}>Couleur du texte</Text>
            <View style={styles.choices}>{COLORS.map(v => choice("●", v, textColor === v, () => setTextColor(v)))} 
              <TextInput value={textColor} onChangeText={setTextColor} autoCapitalize="none" autoCorrect={false} style={styles.hexInput} placeholder="#ffffff" placeholderTextColor="#727987" />
            </View>

            <Text style={styles.settingLabel}>Fond de l'aperçu</Text>
            <View style={styles.choices}>{BACKGROUNDS.map(v => choice("●", v, backgroundColor === v, () => setBackgroundColor(v)))}
              <TextInput value={backgroundColor} onChangeText={setBackgroundColor} autoCapitalize="none" autoCorrect={false} style={styles.hexInput} placeholder="#000000" placeholderTextColor="#727987" />
            </View>

            <Text style={styles.settingLabel}>Opacité du fond</Text>
            <View style={styles.choices}>{[0.2, 0.4, 0.55, 0.7, 0.85, 1].map(v => choice(Math.round(v * 100) + "%", v, backgroundOpacity === v, () => setBackgroundOpacity(v)))}</View>

            <Text style={styles.settingLabel}>Nombre maximum de lignes</Text>
            <View style={styles.choices}>{[1, 2, 3, 4, 5, 6].map(v => choice(String(v), v, maxLines === v, () => setMaxLines(v)))}</View>

            <Pressable style={[styles.shadowToggle, shadow && styles.shadowToggleActive]} onPress={() => setShadow(v => !v)}>
              <Text style={[styles.shadowToggleText, shadow && styles.shadowToggleTextActive]}>{shadow ? "✓  Ombre du texte activée" : "Ombre du texte désactivée"}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>DUBORA</Text>
          <Text style={styles.footerText}>Studio de doublage gratuit · Version 0.1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0c0e12" },
  page: { padding: 20, paddingBottom: 36, gap: 22 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#b6f36b", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#151a10", fontSize: 28, fontWeight: "900" },
  title: { color: "#f4f6f8", fontSize: 29, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: "#9ba3b2", fontSize: 13, marginTop: 1 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 20, borderWidth: 1, borderColor: "#29313a", paddingHorizontal: 12, paddingVertical: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#b6f36b" },
  statusPillText: { color: "#cbd2dc", fontSize: 12, fontWeight: "700" },
  workspace: { gap: 22 },
  workspaceLandscape: { flexDirection: "row", alignItems: "flex-start" },
  mediaColumn: { gap: 12 },
  mediaColumnLandscape: { flex: 1.1 },
  scriptColumn: { flex: 1, gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  sectionTitle: { color: "#f4f6f8", fontSize: 18, fontWeight: "800" },
  sectionHint: { color: "#8b94a3", fontSize: 12 },
  videoPlaceholder: { minHeight: 230, aspectRatio: 16 / 9, borderRadius: 20, borderWidth: 1, borderColor: "#303640", borderStyle: "dashed", backgroundColor: "#151920", alignItems: "center", justifyContent: "center", padding: 18, gap: 8 },
  playCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#262d35", alignItems: "center", justifyContent: "center" },
  playIcon: { color: "#b6f36b", fontSize: 18, marginLeft: 3 },
  placeholderTitle: { color: "#eef1f5", fontSize: 16, fontWeight: "800" },
  placeholderText: { color: "#929baa", fontSize: 12, textAlign: "center" },
  importButton: { marginTop: 5, backgroundColor: "#b6f36b", borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10 },
  importButtonText: { color: "#151a10", fontSize: 13, fontWeight: "800" },
  mediaNote: { flexDirection: "row", alignItems: "center", gap: 8 },
  noteIcon: { color: "#b6f36b", fontSize: 16 },
  mediaNoteText: { color: "#8f98a7", fontSize: 12, flex: 1 },
  previewCard: { minHeight: 150, borderRadius: 18, borderWidth: 1, borderColor: "#303640", padding: 18, alignItems: "stretch", justifyContent: "center", overflow: "hidden" },
  scriptInput: { minHeight: 105, borderRadius: 15, borderWidth: 1, borderColor: "#303640", backgroundColor: "#151920", color: "#f4f6f8", padding: 14, fontSize: 16, lineHeight: 23 },
  actionRow: { flexDirection: "row", gap: 10 },
  secondaryButton: { minHeight: 44, paddingHorizontal: 15, borderRadius: 12, backgroundColor: "#242a32", alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: "#f4f6f8", fontSize: 13, fontWeight: "800" },
  recordButton: { flex: 1, minHeight: 44, borderRadius: 12, backgroundColor: "#b6f36b", alignItems: "center", justifyContent: "center" },
  recordButtonText: { color: "#151a10", fontSize: 14, fontWeight: "900" },
  helperText: { color: "#858e9c", fontSize: 12, lineHeight: 17 },
  customHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  customTitleWrap: { flex: 1, gap: 4 },
  settingsCard: { borderRadius: 18, borderWidth: 1, borderColor: "#282f38", backgroundColor: "#151920", padding: 16, gap: 12 },
  settingLabel: { color: "#cbd2dc", fontSize: 13, fontWeight: "800", marginTop: 3 },
  choices: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  choice: { minWidth: 40, minHeight: 39, paddingHorizontal: 12, borderRadius: 11, borderWidth: 1, borderColor: "#343b46", backgroundColor: "#20252d", alignItems: "center", justifyContent: "center" },
  choiceActive: { borderColor: "#b6f36b", backgroundColor: "#b6f36b" },
  choiceText: { color: "#e3e7ec", fontSize: 13, fontWeight: "700" },
  choiceTextActive: { color: "#151a10" },
  hexInput: { minWidth: 90, height: 39, borderRadius: 10, borderWidth: 1, borderColor: "#343b46", color: "#f4f6f8", paddingHorizontal: 10 },
  shadowToggle: { minHeight: 43, borderRadius: 12, borderWidth: 1, borderColor: "#343b46", alignItems: "center", justifyContent: "center" },
  shadowToggleActive: { backgroundColor: "#b6f36b", borderColor: "#b6f36b" },
  shadowToggleText: { color: "#cbd2dc", fontWeight: "700" },
  shadowToggleTextActive: { color: "#151a10" },
  footer: { alignItems: "center", gap: 4, paddingTop: 4 },
  footerBrand: { color: "#b6f36b", fontSize: 11, fontWeight: "900", letterSpacing: 3 },
  footerText: { color: "#697282", fontSize: 11 }
});
