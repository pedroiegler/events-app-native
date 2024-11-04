import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 
import { app, auth } from "../services/firebase"; 
import LoginButton from './LoginButton';
import UserDropdown from './UserDropdown';
import UserEventsModal from './UserEventsModal';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const db = getFirestore(app);

const UserProfile = ({ wallet, setWallet }) => {
  const [user] = useAuthState(auth);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const provider = new GoogleAuthProvider();

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  if (Platform.OS !== 'web') {
    GoogleSignin.configure({
      webClientId: '828525740531-05c13bqpkvmc1t6t2gd6f5fnlqodnrd2.apps.googleusercontent.com', 
    });
  }

  const handleLogin = async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await signInWithPopup(auth, provider);
        console.log("Login bem-sucedido na web:", result);
      } else {
        await GoogleSignin.hasPlayServices();
        const { idToken } = await GoogleSignin.signIn();
        
        const googleCredential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, googleCredential);
        console.log("Login bem-sucedido no mobile!");
      }
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