import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import fetchEvents from "../../utils/fetchEvents";
import LoadingScreen from "../../components/LoadingScreen";
import EventInfo from "../../components/EventInfo";
import ProgressSection from "../../components/ProgressSection";
import SupportButton from "../../components/SupportButton";
import { useRoute } from "@react-navigation/native";

const EventDetails = () => {
  const route = useRoute();
  const { id } = route.params;
  const [user] = useAuthState(auth);
  const [event, setEvent] = useState(null);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    if (user) {
      const getUserData = async () => {
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          setWallet(userDoc.data().wallet || 50);
        }
      };
      getUserData();
    }
  }, [user]);

  useEffect(() => {
    const fetchEventData = async () => {
      const eventsData = await fetchEvents();
      const selectedEvent = eventsData.find((event) => event.id === id);
      setEvent(selectedEvent);
    };
    fetchEventData();
  }, [id]);

  if (!event) return <LoadingScreen />;

  const progress = event.meta && event.meta_current
    ? Math.min((event.meta_current / event.meta) * 100, 100)
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: event.image || "path/to/default-image.jpg" }} 
        style={styles.image} 
        accessibilityLabel={event.name} 
      />
      <View style={styles.content}>
        <EventInfo event={event} />
        <ProgressSection event={event} progress={progress} />
        <SupportButton 
          user={user} 
          wallet={wallet} 
          setWallet={setWallet} 
          eventId={event.id} 
          event={event} 
          setEvent={setEvent} 
          progress={progress} 
        />
      </View>
    </ScrollView>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: 400,
    maxHeight: 500,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 20,
  },
  content: {
    flexDirection: 'column',
    gap: 20,
    width: '80%',
  },
});