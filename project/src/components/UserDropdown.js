import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

const UserDropdown = ({ user, wallet, onShowEvents, onLogout, visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownItem}>{user.displayName || "Usuário"}</Text>
          <Text style={styles.dropdownItem}>Carteira: {parseFloat(wallet).toFixed(2)}</Text>
          <TouchableOpacity onPress={onShowEvents}>
            <Text style={styles.dropdownItem}>Meus Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.dropdownItem}>Sair</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-start",
  },
  dropdown: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 140,
    marginRight: 15,
    alignSelf: "flex-end",
    padding: 10,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default UserDropdown;