import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAction } from "convex/react";
import { api } from "../../api";

const OTPScreen = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('black');
  const [timer, setTimer] = useState(300); // 5 minutes
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const sendMessage = useAction(api.userRegistration.sendMessage);
  const { 
    generatedOTP, 
    email, 
    password, 
   
  } = useLocalSearchParams<{
    generatedOTP: string;
    email: string;
    password: string;
  }>();
  useEffect(() => {
    if (timer === 0) {
      Alert.alert('Timeout', 'OTP expired. Please try again.', [
        { text: 'OK', onPress: () => router.replace('/(auth)') },
      ]);
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    if (text.length > 1) {
      // If user pastes full text manually into one box, ignore
      return;
    }
    newOtp[index] = text;
    setOtp(newOtp);

    if (text) {
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else {
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text.length === 6) {
      setOtp(text.split(''));
    }
  };

  const handleVerify = () => {
    setMessage('');
    setTimeout(async() => {
        // Check OTP after 1 second delay so already present warning message is removed and user knows he again entered a wrong OTP
        const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setMessage('Please enter complete 6-digit OTP');
      setMessageColor('black');
      return;
    }

    if (enteredOtp === generatedOTP) {
      setMessage('Registration successful!');
      setMessageColor('green');
      await sendMessage({ email, password});
      setTimeout(() => {
        router.replace('/(auth)');
      }, 2000);
    } else {
      setMessage('Invalid OTP. Try again!');
      setMessageColor('red');
    }
    }, 300);
    
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP {generatedOTP}</Text>
      <Text style={styles.timer}>Expires in {formatTime(timer)}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.pasteButton} onPress={handlePasteFromClipboard}>
        <Text style={styles.pasteText}>Paste from Clipboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify</Text>
      </TouchableOpacity>

      {/* Show message below Verify button */}
      {message !== '' && <Text style={[styles.message, { color: messageColor }]}>{message}</Text>}
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timer: {
    fontSize: 16,
    color: 'red',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8,
  },
  pasteButton: {
    marginBottom: 20,
  },
  pasteText: {
    color: '#007bff',
    fontSize: 16,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  verifyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
