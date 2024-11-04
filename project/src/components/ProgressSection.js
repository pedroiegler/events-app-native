import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProgressSection = ({ event, progress }) => (
  <View style={styles.container}>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      {progress === 100 && (
        <Text style={styles.metaAchievedText}>META ATINGIDA</Text>
      )}
    </View>
    <Text style={styles.progressText}>
      {progress.toFixed(2)}% ({event.meta_current} de {event.meta} apoios)
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 25,
    borderColor: "#000",
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 8,
    transition: "width 0.3s ease",
  },
  metaAchievedText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    height: "100%",
    fontSize: 10,
  },
  progressText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});

export default ProgressSection;