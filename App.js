import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useAudioRecorder, RecordingPresets, setAudioModeAsync } from "expo-audio";
import { VideoView, useVideoPlayer } from "expo-video";

function VideoPreview({ source }) {
  const player = useVideoPlayer(source, player => {
    player.loop = true;
  });

  return <VideoView player={player} style={styles.video} nativeControls />;
}

export default function App() {
  const [video, setVideo] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true
    });
  }, []);

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

  async function toggleRecording() {
    if (recording) {
      await recorder.stop();
      setAudioUri(recorder.uri);
      setRecording(false);
      return;
    }

    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecording(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dubora</Text>
        <Text style={styles.subtitle}>Studio de doublage mobile</Text>

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

        <Pressable style={styles.primaryButton} onPress={pickVideo}>
          <Text style={styles.primaryText}>Importer une vidéo</Text>
        </Pressable>

        {video ? (
          <Pressable style={[styles.recordButton, recording && styles.recordingButton]} onPress={toggleRecording}>
            <Text style={styles.recordText}>{recording ? "Arrêter l'enregistrement" : "Enregistrer le doublage"}</Text>
          </Pressable>
        ) : null}

        {audioUri ? (
          <View style={styles.status}>
            <Text style={styles.statusTitle}>Prise enregistrée</Text>
            <Text style={styles.statusText}>La piste audio est prête pour la prochaine étape du montage.</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dubora 0.1.0</Text>
          <Text style={styles.cardText}>Import vidéo et première capture vocale.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#101114"
  },
  container: {
    padding: 20,
    gap: 16
  },
  title: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800"
  },
  subtitle: {
    color: "#aeb4c0",
    fontSize: 17,
    marginTop: -10
  },
  previewContainer: {
    gap: 10
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
    borderRadius: 16
  },
  fileName: {
    color: "#d7dbe2",
    fontSize: 14
  },
  empty: {
    minHeight: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2b2f37",
    backgroundColor: "#17191e",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700"
  },
  emptyText: {
    color: "#aeb4c0",
    textAlign: "center",
    fontSize: 15,
    marginTop: 8
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  recordButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: "#303640",
    justifyContent: "center",
    alignItems: "center"
  },
  recordingButton: {
    backgroundColor: "#8f2934"
  },
  primaryText: {
    color: "#101114",
    fontSize: 16,
    fontWeight: "700"
  },
  recordText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  status: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#1a211d"
  },
  statusTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  statusText: {
    color: "#b8c0ba",
    fontSize: 14,
    marginTop: 5
  },
  card: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: "#17191e"
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  cardText: {
    color: "#aeb4c0",
    marginTop: 5
  }
});
