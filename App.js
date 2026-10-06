import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useAudioRecorder, RecordingPresets, setAudioModeAsync } from "expo-audio";
import * as ScreenOrientation from "expo-screen-orientation";
import { VideoView, useVideoPlayer } from "expo-video";

const DEFAULT_SETTINGS = {
  fontSize: 28,
  fontWeight: "700",
  fontStyle: "normal",
  textColor: "#ffffff",
  textAlign: "center",
  backgroundColor: "#000000",
  backgroundOpacity: 0.55,
  shadow: true,
  maxLines: 3
};

function VideoPreview({ source }) {
  const player = useVideoPlayer(source, player => {
    player.loop = true;
  });
  return <VideoView player={player} style={styles.video} nativeControls />;
}

function RecorderControls({ onRecorded }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recording, setRecording] = useState(false);

  async function toggleRecording() {
    try {
      if (recording) {
        await recorder.stop();
        onRecorded(recorder.uri);
        setRecording(false);
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  }

  return (
    <Pressable style={[styles.recordButton, recording && styles.recordingButton]} onPress={toggleRecording}>
      <Text style={styles.recordText}>{recording ? "Arrêter" : "Enregistrer"}</Text>
    </Pressable>
  );
}

async function setWorkspaceOrientation(value) {
  await ScreenOrientation.lockAsync(
    value === "landscape"
      ? ScreenOrientation.OrientationLock.LANDSCAPE
      : ScreenOrientation.OrientationLock.PORTRAIT
  );
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const [video, setVideo] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [orientation, setOrientation] = useState("landscape");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showAppearance, setShowAppearance] = useState(false);
  const [phrase, setPhrase] = useState("Votre phrase de doublage apparaîtra ici.");
  const isLandscape = width >= height;

  async function pickVideo() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
      multiple: false
    });
    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  }

  async function changeOrientation(value) {
    setOrientation(value);
    await setWorkspaceOrientation(value);
  }

  function updateSetting(key, value) {
    setSettings(current => ({ ...current, [key]: value }));
  }

  const phraseStyle = {
    color: settings.textColor,
    fontSize: settings.fontSize,
    fontWeight: settings.fontWeight,
    fontStyle: settings.fontStyle,
    textAlign: settings.textAlign,
    textShadowColor: settings.shadow ? "#000000" : "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: settings.shadow ? 4 : 0
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dubora</Text>
            <Text style={styles.subtitle}>Studio de doublage mobile</Text>
          </View>
          <View style={styles.orientationRow}>
            <Pressable style={[styles.modeButton, isLandscape && styles.modeButtonActive]} onPress={() => changeOrientation("landscape")}>
              <Text style={[styles.modeText, isLandscape && styles.modeTextActive]}>Paysage</Text>
            </Pressable>
            <Pressable style={[styles.modeButton, !isLandscape && styles.modeButtonActive]} onPress={() => changeOrientation("portrait")}>
              <Text style={[styles.modeText, !isLandscape && styles.modeTextActive]}>Portrait</Text>
            </Pressable>
          </View>
        </View>

        {isLandscape ? (
          <View style={styles.workspace}>
            <View style={styles.mediaColumn}>
              {video ? (
                <View style={styles.previewContainer}>
                  <VideoPreview source={video.uri} />
                  <Text style={styles.fileName}>{video.name}</Text>
                </View>
              ) : (
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>Aucune vidéo</Text>
                  <Text style={styles.emptyText}>Importe une vidéo pour commencer un projet de doublage.</Text>
                </View>
              )}
            </View>
            <View style={styles.scriptColumn}>
              <Text style={styles.sectionTitle}>Phrase à lire</Text>
              <View style={[styles.phraseCard, { backgroundColor: settings.backgroundColor, opacity: settings.backgroundOpacity }]}>
                <Text style={phraseStyle} numberOfLines={settings.maxLines}>{phrase}</Text>
              </View>
              <TextInput value={phrase} onChangeText={setPhrase} multiline placeholder="Texte à lire" placeholderTextColor="#6f7682" style={styles.phraseInput} />
              <View style={styles.controlsRow}>
                <Pressable style={styles.primaryButton} onPress={pickVideo}>
                  <Text style={styles.primaryText}>Importer</Text>
                </Pressable>
                {video ? <RecorderControls onRecorded={setAudioUri} /> : null}
              </View>
              {audioUri ? <View style={styles.status}><Text style={styles.statusTitle}>Prise enregistrée</Text><Text style={styles.statusText}>La piste audio est prête pour la suite du montage.</Text></View> : null}
            </View>
          </View>
        ) : (
          <>
            {video ? (
              <View style={styles.previewContainer}>
                <VideoPreview source={video.uri} />
                <Text style={styles.fileName}>{video.name}</Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Aucune vidéo</Text>
                <Text style={styles.emptyText}>Importe une vidéo pour commencer un projet de doublage.</Text>
              </View>
            )}
            <View style={[styles.phraseCard, { backgroundColor: settings.backgroundColor, opacity: settings.backgroundOpacity }]}>
              <Text style={phraseStyle} numberOfLines={settings.maxLines}>{phrase}</Text>
            </View>
            <TextInput value={phrase} onChangeText={setPhrase} multiline placeholder="Texte à lire" placeholderTextColor="#6f7682" style={styles.phraseInput} />
            <Pressable style={styles.primaryButton} onPress={pickVideo}><Text style={styles.primaryText}>Importer une vidéo</Text></Pressable>
            {video ? <RecorderControls onRecorded={setAudioUri} /> : null}
          </>
        )}

        <View style={styles.appearanceHeader}>
          <View>
            <Text style={styles.sectionTitle}>Personnalisation</Text>
            <Text style={styles.helper}>Configure l'apparence de la phrase affichée pendant le doublage.</Text>
          </View>
          <Pressable style={styles.secondaryButton} onPress={() => setShowAppearance(value => !value)}>
            <Text style={styles.secondaryText}>{showAppearance ? "Masquer" : "Personnaliser"}</Text>
          </Pressable>
        </View>

        {showAppearance ? (
          <View style={styles.settingsCard}>
            <Text style={styles.settingLabel}>Taille</Text>
            <View style={styles.chips}>{[20, 24, 28, 32, 36, 42].map(value => <Pressable key={value} style={[styles.chip, settings.fontSize === value && styles.chipActive]} onPress={() => updateSetting("fontSize", value)}><Text style={styles.chipText}>{value}</Text></Pressable>)}</View>

            <Text style={styles.settingLabel}>Épaisseur</Text>
            <View style={styles.chips}>{["400", "500", "600", "700", "800"].map(value => <Pressable key={value} style={[styles.chip, settings.fontWeight === value && styles.chipActive]} onPress={() => updateSetting("fontWeight", value)}><Text style={styles.chipText}>{value}</Text></Pressable>)}</View>

            <Text style={styles.settingLabel}>Style</Text>
            <View style={styles.chips}>
              <Pressable style={[styles.chip, settings.fontStyle === "normal" && styles.chipActive]} onPress={() => updateSetting("fontStyle", "normal")}><Text style={styles.chipText}>Normal</Text></Pressable>
              <Pressable style={[styles.chip, settings.fontStyle === "italic" && styles.chipActive]} onPress={() => updateSetting("fontStyle", "italic")}><Text style={styles.chipText}>Italique</Text></Pressable>
            </View>

            <Text style={styles.settingLabel}>Alignement</Text>
            <View style={styles.chips}>{["left", "center", "right"].map(value => <Pressable key={value} style={[styles.chip, settings.textAlign === value && styles.chipActive]} onPress={() => updateSetting("textAlign", value)}><Text style={styles.chipText}>{value}</Text></Pressable>)}</View>

            <Text style={styles.settingLabel}>Couleur du texte</Text>
            <TextInput value={settings.textColor} onChangeText={value => updateSetting("textColor", value)} autoCapitalize="none" style={styles.colorInput} />

            <Text style={styles.settingLabel}>Couleur du fond</Text>
            <TextInput value={settings.backgroundColor} onChangeText={value => updateSetting("backgroundColor", value)} autoCapitalize="none" style={styles.colorInput} />

            <Text style={styles.settingLabel}>Opacité du fond</Text>
            <View style={styles.chips}>{[0.2, 0.4, 0.55, 0.7, 0.85].map(value => <Pressable key={value} style={[styles.chip, settings.backgroundOpacity === value && styles.chipActive]} onPress={() => updateSetting("backgroundOpacity", value)}><Text style={styles.chipText}>{Math.round(value * 100)}%</Text></Pressable>)}</View>

            <Text style={styles.settingLabel}>Lignes maximum</Text>
            <View style={styles.chips}>{[1, 2, 3, 4, 5].map(value => <Pressable key={value} style={[styles.chip, settings.maxLines === value && styles.chipActive]} onPress={() => updateSetting("maxLines", value)}><Text style={styles.chipText}>{value}</Text></Pressable>)}</View>

            <Pressable style={[styles.toggle, settings.shadow && styles.toggleActive]} onPress={() => updateSetting("shadow", !settings.shadow)}>
              <Text style={styles.toggleText}>{settings.shadow ? "Ombre activée" : "Ombre désactivée"}</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dubora 0.1.0</Text>
          <Text style={styles.cardText}>Paysage privilégié pour le doublage, portrait disponible et affichage configurable.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101114" },
  container: { padding: 20, gap: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16 },
  title: { color: "#ffffff", fontSize: 36, fontWeight: "800" },
  subtitle: { color: "#aeb4c0", fontSize: 17, marginTop: -10 },
  orientationRow: { flexDirection: "row", gap: 8 },
  modeButton: { minHeight: 42, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#20242b", justifyContent: "center" },
  modeButtonActive: { backgroundColor: "#ffffff" },
  modeText: { color: "#ffffff", fontWeight: "700" },
  modeTextActive: { color: "#101114" },
  workspace: { flexDirection: "row", gap: 18, alignItems: "stretch" },
  mediaColumn: { flex: 1.35 },
  scriptColumn: { flex: 1, gap: 12 },
  previewContainer: { gap: 10 },
  video: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000000", borderRadius: 16 },
  fileName: { color: "#d7dbe2", fontSize: 14 },
  empty: { minHeight: 220, borderRadius: 18, borderWidth: 1, borderColor: "#2b2f37", backgroundColor: "#17191e", justifyContent: "center", alignItems: "center", padding: 24 },
  emptyTitle: { color: "#ffffff", fontSize: 22, fontWeight: "700" },
  emptyText: { color: "#aeb4c0", textAlign: "center", fontSize: 15, marginTop: 8 },
  sectionTitle: { color: "#ffffff", fontSize: 19, fontWeight: "800" },
  phraseCard: { minHeight: 150, borderRadius: 18, borderWidth: 1, borderColor: "#2b2f37", padding: 18, justifyContent: "center", overflow: "hidden" },
  phraseInput: { minHeight: 84, borderRadius: 14, borderWidth: 1, borderColor: "#2b2f37", backgroundColor: "#17191e", color: "#ffffff", padding: 14, textAlignVertical: "top" },
  controlsRow: { flexDirection: "row", gap: 10 },
  primaryButton: { minHeight: 52, flex: 1, borderRadius: 14, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center", paddingHorizontal: 14 },
  recordButton: { minHeight: 52, flex: 1, borderRadius: 14, backgroundColor: "#303640", justifyContent: "center", alignItems: "center", paddingHorizontal: 14 },
  recordingButton: { backgroundColor: "#8f2934" },
  primaryText: { color: "#101114", fontSize: 16, fontWeight: "700" },
  recordText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  status: { borderRadius: 14, padding: 16, backgroundColor: "#1a211d" },
  statusTitle: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  statusText: { color: "#b8c0ba", fontSize: 14, marginTop: 5 },
  appearanceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  helper: { color: "#7f8794", marginTop: 4, maxWidth: 520 },
  secondaryButton: { minHeight: 44, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#20242b", justifyContent: "center", alignItems: "center" },
  secondaryText: { color: "#ffffff", fontWeight: "700" },
  settingsCard: { borderRadius: 18, padding: 18, backgroundColor: "#17191e", gap: 10 },
  settingLabel: { color: "#dfe3ea", fontSize: 14, fontWeight: "700" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: { minHeight: 40, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "#252a32", justifyContent: "center" },
  chipActive: { backgroundColor: "#ffffff" },
  chipText: { color: "#ffffff", fontWeight: "600" },
  colorInput: { minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: "#2b2f37", backgroundColor: "#101114", color: "#ffffff", paddingHorizontal: 12 },
  toggle: { minHeight: 42, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#252a32", justifyContent: "center", alignItems: "center" },
  toggleActive: { backgroundColor: "#ffffff" },
  toggleText: { color: "#ffffff", fontWeight: "700" },
  card: { borderRadius: 14, padding: 16, backgroundColor: "#17191e" },
  cardTitle: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  cardText: { color: "#aeb4c0", marginTop: 5 }
});