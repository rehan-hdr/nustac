import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ImageBackground, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {api} from "../../api";
import { useAction } from "convex/react";
import { useLocalSearchParams } from 'expo-router';


export default function SignupScreen() {

  type ErrorsType = {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  const { isReset } = useLocalSearchParams();
  const isResetMode = isReset === 'true'; // Treat string 'true' as boolean
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorsType>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const checkEmail = useAction(api.userRegistration.checkEmail);
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-GB', options);
  type ResponseType = {
    status: number;
    text: string;
  };
  
  let res: ResponseType; // this is used for the response from the emailjs.send function 


  // Predefined array of registered emails
  const registeredEmails = ['sshah.bscs22seecs@seecs.edu.pk', 'charlie.davis@nbs.edu.pk', "henry.clark@nbs.edu.pk",'user3@example.com'];  

  function validateEmail() {
    if (!email.endsWith('.edu.pk')) {
      setErrors(prev => ({ ...prev, email: 'Email must be a valid institutional address' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
      return true;
    }
  }

  function validatePassword() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters, include one capital letter, one number, and one special character' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
      return true;
    }
  }

  function validateConfirmPassword() {
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
      return true;
    }
  }


  const handleSignup = async() => {
    // Run all validations before signup
    if (!validateEmail()) return;
    if (!validatePassword()) return;
    if (!validateConfirmPassword()) return;

    console.log('All validations passed!');

    if (Object.values(errors).some(err => err)) {
      Alert.alert('Form Error', 'Please fix the errors in the form before submitting');
      return;
    }else{
        // Check if email exists in registeredEmails on database
        const result = await checkEmail({ email })
     if (result.success) {
        // Generate 6-digit OTP
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // have to uncomment this code for sending email
        //send email
        // try {
        //     res = await send(
        //       process.env.EXPO_SERVICE_ID, 
        //       process.env.EXPO_TEMPLATE_ID,
        //       {
        //         fullName,
        //         email,
        //         generatedOTP,
        //         formattedDate
        //       },
        //       {
        //         publicKey: process.env.EXPO_PUBLIC_KEY,
        //       }
        //     );
        //     console.log('SUCCESS!',res);
        //   } catch (err) {
        //     if (err instanceof EmailJSResponseStatus) {
        //       console.log('EmailJS Request Failed...', err);
        //     }
        //     console.log('ERROR', err);
        //     Alert.alert("Error in Sending the OTP");
        //   }

        // If email exists, navigate to OTP screen
        // if (res.status === 200 ){ uncomment this line as well
          router.push({
            pathname: '/(auth)/otp',
            params: {generatedOTP, email, password}
          });
        // }                            uncomment this line as well
        
      } else {
        // If email doesn't exist, show an alert
        Alert.alert('Email Not Registered', 'Your email is not registered. Please contact admin.');
      }
    }

    

    console.log({
      email,
      password,
      confirmPassword,
    });

    // Reset the form
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <ImageBackground source={require('../../assets/images/bg.png')} style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/images/nust-logo.png')} style={styles.logo} />
        <Text style={styles.heading}>NUSTAC</Text>
        

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: '' })); }}
          onBlur={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          value={password}
          onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: '' })); }}
          onBlur={validatePassword}
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
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          style={styles.passwordInput}
          value={confirmPassword}
          onChangeText={(text) => { setConfirmPassword(text); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
          onBlur={validateConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>{isResetMode ? 'Update Password' : 'Sign Up'}</Text>

        </TouchableOpacity>

        {!isResetMode && (
          <View style={styles.bottomText}>
            <Text>Already have an account? </Text>
            <Link href="/(auth)" style={styles.link}>Login</Link>
          </View>
        )}
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
  label: {
    marginTop: 15,
    fontSize: 16,
    color: 'white'
  },
  pickerContainer: {
    backgroundColor: 'white',
    width: '100%',
    marginVertical: 8,
    borderRadius: 9,
    overflow: 'hidden', // Ensure border radius is applied
  },
  picker: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 9,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 5,
    fontSize: 12,
    marginBottom: 5
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
  
});
