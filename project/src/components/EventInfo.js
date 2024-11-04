import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EventInfo = ({ event }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.detail}><strong>Data e Hora:</strong> {new Date(event.datetime).toLocaleString()}</Text>
      <Text style={styles.detail}><strong>Meta:</strong> {event.meta} apoios</Text>
      <Text style={styles.detail}><strong>Apoios atuais:</strong> {event.meta_current} apoios</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 13,
  },
  detail: {
    fontSize: 15,
    marginBottom: 6,
  },
});

export default EventInfo;