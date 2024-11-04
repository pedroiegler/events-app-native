import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from "react-native";
import { db } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";

const SupportButton = ({ user, wallet, setWallet, event, setEvent, progress }) => {
  const [hasSupported, setHasSupported] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [supportAmount, setSupportAmount] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkIfSupported = async () => {
      if (user && event) {
        const supportDoc = await db
          .collection("users")
          .doc(user.uid)
          .collection("supportedEvents")
          .doc(event.id)
          .get();

        setHasSupported(supportDoc.exists);
      }
    };
    checkIfSupported();
  }, [user, event]);

  const handleSupportClick = () => {
    if (wallet <= 0) {
      setModalVisible(true);
      return;
    }
    
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!supportAmount || isNaN(supportAmount) || supportAmount <= 0) {
      alert("Por favor, insira um valor válido!");
      return;
    }

    if (Number(supportAmount) > wallet) {
      alert("Saldo insuficiente!");
      return;
    }

    const amountNeeded = event.meta - event.meta_current;
    const finalSupportAmount = Math.min(Number(supportAmount), amountNeeded);
    const newWallet = wallet - finalSupportAmount;

    await db.collection("users").doc(user.uid).update({ wallet: newWallet });
    setWallet(newWallet);

    await db.collection("users").doc(user.uid).collection("supportedEvents").doc(event.id).set({ supported: true });

    const newMetaCurrent = event.meta_current + finalSupportAmount;
    setEvent((prevEvent) => ({ ...prevEvent, meta_current: newMetaCurrent }));

    await db.collection("events").doc(event.id).update({ meta_current: newMetaCurrent });

    setHasSupported(true);
    
    setModalVisible(false);
    setSupportAmount("");

    alert(
      finalSupportAmount < Number(supportAmount)
        ? `Apoio realizado com sucesso! Apenas ${finalSupportAmount.toFixed(2)} foi usado para completar a meta.`
        : "Apoio realizado com sucesso!"
    );
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {progress < 100 && (
            <TouchableOpacity style={styles.buttonSupport} onPress={handleSupportClick}>
              <Text style={styles.buttonText}>APOIE</Text>
            </TouchableOpacity>
          )}
          {hasSupported && (
            <TouchableOpacity style={styles.buttonChat} onPress={() => navigation.navigate("Chat", { eventId: event.id })}>
              <Text style={styles.buttonText}>CHAT</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.alertText}>
          Você precisa estar logado para apoiar este evento!
        </Text>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Insira o valor do apoio</Text>
            <TextInput
              placeholder="Valor"
              keyboardType="numeric"
              value={supportAmount}
              onChangeText={setSupportAmount}
              style={styles.textInput}
            />
            <Button title="Enviar" onPress={handleSubmit} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 15,
  },
  buttonSupport: {
    backgroundColor: "#c5eb4a",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    marginRight: 10,
  },
  buttonChat: {
    backgroundColor: "#b2b2b2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  buttonText: {
    color: "#000",
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  alertText: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
});

export default SupportButton;