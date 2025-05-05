import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Link,useRouter } from 'expo-router'; // or use navigation if you're using react-navigation
import { useState,useContext } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAction } from "convex/react";
import { api } from "../../api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionContext } from "../../context/SessionContext"; // Import SessionContext


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); 
  const [errorVisible, setErrorVisible] = useState(false);

  const loginMutation = useAction(api.userLogin.userLogin);
  const router = useRouter();
  const { login } = useContext(SessionContext); // Use login from SessionContext

  const handleLogin = async () => {
    try {
      const result = await loginMutation({ email, password });
      if (result.success) {
        setErrorVisible(false); 
        await login(email);
        // On successful login, navigate to the home screen
        router.replace("/(screens)/home");
      }else {
        setError('Invalid email or password');
        setErrorVisible(false); // Hide the error temporarily before showing again
        setTimeout(() => {
          setErrorVisible(true); // Show the error after 300ms delay
        }, 300);
      }
    } catch (error: unknown) {
      // Narrow the error type to Error to access message property
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        setError('Invalid email or password');
        setErrorVisible(false); // Hide the error temporarily before showing again
        setTimeout(() => {
          setErrorVisible(true); // Show the error after 300ms delay
        }, 300); // Show error message if login fails
      } else {
        // If it's not an instance of Error, log a generic message
        console.error("Login failed: An unknown error occurred");
        alert("Login failed: An unknown error occurred");
      }
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg.png')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/images/nust-logo.png')} style={styles.logo} />
        <Text style={styles.heading}>NUSTAC</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
        </View>

        {/* Conditionally render error message */}
        {errorVisible && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
 

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.bottomText}>
          <Text>Don't have an account? </Text>
          <Link href="/signup" style={styles.link}>Sign Up</Link>
        </View>
        
      <TouchableOpacity onPress={() => router.push({ pathname: '/signup', params: { isReset: 'true' } })}>
        <Text style={[styles.link, { marginTop: 10 }]}>Forgot Password?</Text>
      </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  logo: {
    width: 100, height: 100, marginBottom: 10
  },
  heading: {
    fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: 'white'
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8
  },
  button: {
    backgroundColor: '#0066cc',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white', fontWeight: 'bold'
  },
  bottomText: {
    flexDirection: 'row',
    marginTop: 20
  },
  link: {
    color: 'blue'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    height: 46,
  },
  eyeIcon: {
    paddingHorizontal: 8,

  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 5,
  },
});
