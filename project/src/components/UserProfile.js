import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 
import { app, auth } from "../services/firebase"; 
import LoginButton from './LoginButton';
import UserDropdown from './UserDropdown';
import UserEventsModal from './UserEventsModal';

const db = getFirestore(app);

const UserProfile = ({ wallet, setWallet }) => {
  const [user] = useAuthState(auth);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const provider = new GoogleAuthProvider();

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setDropdownVisible(false);
  };

  const fetchUserEvents = async () => {
    if (user) {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserEvents(eventsList);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, [user]);

  if (!user) {
    return <LoginButton onPress={handleLogin} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown}>
        <Image 
          source={{ uri: user.photoURL }} 
          style={styles.profileImage} 
        />
      </TouchableOpacity>
      
      <UserDropdown 
        user={user} 
        wallet={wallet} 
        visible={dropdownVisible} 
        onShowEvents={() => UserEventsModal(userEvents)} 
        onLogout={handleLogout} 
        onClose={() => setDropdownVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 22.5,
  },
});

export default UserProfile;