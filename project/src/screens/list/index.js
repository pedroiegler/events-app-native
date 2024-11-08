import React, { useEffect, useState } from "react";
import { View, ScrollView, ImageBackground } from "react-native";
import { auth, db } from "../../services/firebase";
import fetchEvents from "../../utils/fetchEvents";
import EventCard from "../../components/EventCard";
import Filters from "../../components/Filters";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigation } from '@react-navigation/native';

const Events = () => {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [wallet, setWallet] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      const getUserData = async () => {
        const userDoc = await db.collection("users").doc(user.uid).get();

        if (userDoc.exists && userDoc.data().wallet !== undefined) {
          setWallet(userDoc.data().wallet);
        } else {
          await db.collection("users").doc(user.uid).set(
            {
              email: user.email,
              photoURL: user.photoURL,
              wallet: 50,
            },
            { merge: true }
          );
          setWallet(50);
        }
      };

      getUserData();
    }
  }, [user]);

  useEffect(() => {
    const getEventsData = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    };

    getEventsData();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchesName = event.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesCategory = searchCategory ? event.category.toLowerCase() === searchCategory.toLowerCase() : true;
      const matchesDate = searchDate ? event.date === searchDate : true; // Filtro de data
      return matchesName && matchesDate && matchesCategory;
    });
    setFilteredEvents(filtered);
  }, [searchName, searchDate, searchCategory, events]);

  const handleCardClick = (id) => {
    navigation.navigate('EventDetails', { id });
  };

  return (
    <ImageBackground 
      source={require("../../../assets/images/bg.png")}
      style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, padding: 0, margin: 0 }}>
        <Filters
          searchName={searchName}
          searchDate={searchDate}
          searchCategory={searchCategory}
          onNameChange={setSearchName}
          onDateChange={setSearchDate}
          onCategoryChange={setSearchCategory}
          wallet={wallet} setWallet={setWallet}
        />

        <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={handleCardClick} />
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Events;
