import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Remplis tous les champs'); return; }
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.navigate('Home');
    } catch (e) {
      const msg = e.code === 'auth/wrong-password' ? 'Mot de passe incorrect'
        : e.code === 'auth/user-not-found' ? 'Email introuvable'
        : e.code === 'auth/email-already-in-use' ? 'Email déjà utilisé'
        : e.code === 'auth/weak-password' ? 'Mot de passe trop court (6 car. min)'
        : e.code === 'auth/invalid-credential' ? 'Email ou mot de passe incorrect'
        : e.message;
      Alert.alert('Erreur', msg);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isSignup ? 'Créer un compte 🦓' : 'Bon retour 👋'}</Text>
        <Text style={styles.sub}>{isSignup ? 'Rejoins ZuluConnect gratuitement' : 'Connecte-toi à ton compte'}</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="toi@email.com" placeholderTextColor="#606880" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}/>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#606880" secureTextEntry value={password} onChangeText={setPassword}/>
        <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
          {loading ? <ActivityIndicator color="#000"/> : <Text style={styles.btnText}>{isSignup ? 'Créer mon compte →' : 'Se connecter →'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.switch}>{isSignup ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop:20}} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.demo}>Accès démo investisseurs →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#080b12'},
  content:{flex:1,paddingHorizontal:28,paddingTop:60},
  back:{color:'#8890a8',fontSize:13,marginBottom:32},
  title:{fontSize:28,fontWeight:'800',color:'#e8eaf0',marginBottom:8},
  sub:{fontSize:13,color:'#8890a8',marginBottom:32},
  label:{fontSize:12,color:'#8890a8',marginBottom:6,fontWeight:'500'},
  input:{backgroundColor:'#0f1420',borderWidth:1,borderColor:'rgba(255,255,255,0.07)',borderRadius:12,padding:14,color:'#e8eaf0',fontSize:14,marginBottom:16},
  btn:{backgroundColor:'#00E5A0',borderRadius:16,paddingVertical:16,alignItems:'center',marginTop:8,marginBottom:16},
  btnText:{color:'#000',fontSize:15,fontWeight:'800'},
  switch:{color:'#8890a8',fontSize:13,textAlign:'center'},
  demo:{color:'#00E5A0',fontSize:13,textAlign:'center',fontWeight:'600'},
});