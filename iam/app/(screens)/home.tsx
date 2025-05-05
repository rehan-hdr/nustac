import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Alert } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import pako from 'pako';
import { fromByteArray } from 'base64-js';
import { useContext } from "react";
import { SessionContext } from "../../context/SessionContext";

export default function HomeScreen() {
  const { logout } = useContext(SessionContext); // Import logout from SessionContext
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  let key:any,Data:any;

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: handleLogout }
      ],
      { cancelable: true }
    );
  };
  

  const handleLogout = async() => {
    await logout();
  };

  const handleAccessHistory = () => {
    router.push("/accessHistory");
  };
  
  useEffect(() => {
    const sendEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      console.log("Email from AsyncStorage:", email);
      const response = await fetch("http://10.7.77.6:3000/encrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    
      if (response.ok) {
        const { encapsulatedKey,encryptedData,username } = await response.json();
        setUsername(username); // Store the username for later use
        key = encapsulatedKey; // Store the encapsulated key for later use
        Data = encryptedData; // Store the encrypted data for later use
        console.log("Encrypted data:", encryptedData, "Encapsulated key:", encapsulatedKey);  
        // Handle the encrypted data
        const payload = [ encapsulatedKey,encryptedData];
      
        const compressed = pako.gzip(JSON.stringify(payload),{ level: 9 });
        console.log("Compressed Data Length:", compressed.length);
        const base64Encoded = fromByteArray(compressed);
        console.log("QR Code Data Length:", base64Encoded.length);

        setQrValue(base64Encoded); // Set QR code content
      } else {
        console.error("Error encrypting data");
      }

      setTimeout(async() => {
        const decryptResponse = await fetch("10.7.77.6:3000/decrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,     // The key you got from /encrypt response
            Data,       // The encryptedData object you got
          }),
        });
        
        if (decryptResponse.ok) {
          const { decryptedData } = await decryptResponse.json();
          console.log("Decrypted Data:", decryptedData);
          // Now you can use the decrypted data
        } else {
          console.error("Error decrypting data");
        }
      },2000)
    }
    sendEmail();

  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/home-bg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/nust-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>NUSTAC</Text>
        </View>
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
      <Text style={styles.title}>{username}</Text>
        <Text style={{ color: "white", fontSize: 16, textAlign: "center",}}>
          Scan your QR code to access facility
        </Text>
        <View style={styles.qrCodePlaceholder}>
        {qrValue ? (
          <QRCode value={qrValue} size={200} />
        ) : (
          <Text style={styles.qrText}>QR Code</Text>
        )}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAccessHistory}>
        <Text style={styles.buttonText}>Access History</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  logoutButton: {
    padding: 5,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrCodePlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    marginTop: 25,
  },
  qrText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    marginHorizontal: 40,
    borderRadius: 30,
    marginBottom: 30,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
