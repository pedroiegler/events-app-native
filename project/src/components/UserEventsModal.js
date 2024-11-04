import React from "react";
import { Modal, View, Text, Image, ScrollView, Button, StyleSheet } from "react-native";

const UserEventsModal = ({ userEvents, visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Meus Eventos</Text>
          
          {userEvents.length === 0 ? (
            <Text style={styles.message}>Nenhum evento encontrado! Você ainda não tem eventos criados.</Text>
          ) : (
            <ScrollView style={styles.eventsList}>
              {userEvents.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text>Categoria: {event.category}</Text>
                  <Text>Meta: {event.meta}</Text>
                  {event.image && (
                    <Image
                      source={{ uri: event.image }}
                      style={styles.eventImage}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    marginVertical: 15,
  },
  eventsList: {
    maxHeight: 300,
  },
  eventItem: {
    marginBottom: 15,
  },
  eventName: {
    fontWeight: "bold",
  },
  eventImage: {
    width: 100,
    height: 100,
    marginTop: 5,
  },
});

export default UserEventsModal;