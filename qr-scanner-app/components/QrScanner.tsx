import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { toByteArray } from 'base64-js';
import pako from 'pako';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../src/types/navigation';

type QrScannerRouteProp = RouteProp<RootStackParamList, 'QrScanner'>;

interface QrScannerProps {
  route: QrScannerRouteProp;
}

export default function QrScanner({route}: QrScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const {selectedDept, selectedRoom} = route.params;

  const cameraRef = useRef<CameraView | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Function to handle scanned QR data
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    setIsScanning(false);

    try {
      console.log('QR Code found:', data);

      console.log('i am here');

      // Decompress and parse the QR code data
      const decodedBytes = toByteArray(data);
      console.log('decodedBytes');
      const decompressed = pako.ungzip(decodedBytes, { to: 'string' });

      console.log(decompressed);

      const parsed = JSON.parse(decompressed);
      const [key, Data] = parsed;

      if (!key || !Data) {
        throw new Error("QR payload missing 'key' or 'Data'");
      }
      console.log("GOT IT");

      const response = await fetch('http://10.7.77.6:3000/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, Data, location: `${selectedDept}-${selectedRoom}` }),
      });

      console.log("YAHHH");
      console.log(response.headers + "byebye");
      const result = await response.json();
      console.log(result)

      console.log('Chosen Location:', selectedDept, selectedRoom);

      if (result.status !== "Entry Granted") {
        Alert.alert("Access Denied", result.status || "Unknown error");
      } else {
        Alert.alert("Success", "Entry Granted");
      }
      

      setScannedData(result.decryptedData);
      Alert.alert('Success', 'Decryption successful');

    } catch (err) {
      console.error('Error processing QR:', err);
      Alert.alert('Error', 'Failed to scan or decrypt QR');
    }

    // Re-enable scanning after a short delay
    setTimeout(() => setIsScanning(true), 3000);
  };

  // Check if permissions have been granted
  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      {/* Camera component */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {scannedData && <Text style={styles.result}>{String(scannedData)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  result: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
