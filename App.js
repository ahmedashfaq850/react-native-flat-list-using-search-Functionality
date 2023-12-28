import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const App = () => {
  const url = "https://dummyjson.com/users";
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetchData(url);
  }, []);

  useEffect(() => {
    handleFilteredData();
  }, [searchInput, data]); // Adding 'data' to the dependencies array

  const fetchData = async (url) => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await axios.get(url);
      setData(response.data.users);
    } catch (error) {
      setErr(true);
    } finally {
      setLoading(false); // Set loading to false after data fetching completes (success or failure)
    }
  };

  const handleData = (text) => {
    setSearchInput(text);
  };

  const handleFilteredData = () => {
    const updatedData = data.filter((item) => {
      const textData = searchInput.toLowerCase();
      const { firstName, lastName, email } = item;
      const itemData = `${firstName.toLowerCase()} ${lastName.toLowerCase()} ${email.toLowerCase()}`;
      return itemData.includes(textData);
    });
    setFilteredData(updatedData);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <TextInput
            style={styles.textInput}
            onChangeText={handleData}
            value={searchInput}
            placeholder="Search"
          />
          <Ionicons
            style={{ color: "gray" }}
            name="close-circle-outline"
            size={20}
          />
        </View>
        {loading &&
          data.length === 0 && ( // Show loader only if data is being fetched for the first time
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          )}
        {!loading &&
          filteredData.length === 0 && ( // Show message if no results found
            <Text>No results found</Text>
          )}
        <FlatList
          style={{ marginTop: 30 }}
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.ListRow}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <View>
                  <Text style={styles.mainTitle}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.subTitle}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    marginTop: 30,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
    alignItems: "center",
    padding: 7,
    borderWidth: 1,
    borderColor: "gray",
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    paddingRight: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  ListRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    color: "gray",
  },
});

export default App;
