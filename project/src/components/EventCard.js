import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const EventCard = ({ event, onClick }) => {
  const progress = event.meta && event.meta_current 
    ? Math.min((event.meta_current / event.meta) * 100, 100) 
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onClick(event.id)}>
      {event.image && (
        <Image
          source={{ uri: event.image }}
          style={styles.image}
        />
      )}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
        {progress === 100 && <Text style={styles.metaAchievedText}>META ATINGIDA</Text>}
      </View>
      <Text style={styles.supportText}>
        {event.meta_current} de {event.meta} 💵
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 28,
    padding: 16,
    width: 180,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    height: 25,
    borderWidth: 1,
    borderColor: '#000',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    transition: 'width 0.3s ease',
    fontSize: 12
  },
  metaAchievedText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 8,
    height: '100%',
    fontSize: 10,
  },
  supportText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,

  },
});

export default EventCard;