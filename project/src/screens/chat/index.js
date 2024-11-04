import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TextInput, Button, StyleSheet } from "react-native";
import { db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";

const Chat = ({ route }) => {
  const { eventId } = route.params;
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(eventId)
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    return () => unsubscribe();
  }, [eventId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      await db.collection("chats").doc(eventId).collection("messages").add({
        userId: user.uid,
        displayName: user.displayName || user.email,
        message: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.userId === user.uid ? styles.sent : styles.received]}>
            <Text style={styles.displayName}>{item.displayName}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem"
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: "80%",
  },
  sent: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  displayName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  messageText: {
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
});

export default Chat;