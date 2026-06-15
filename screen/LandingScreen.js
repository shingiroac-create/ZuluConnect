import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glow1} />
      <View style={styles.content}>
        <Text style={styles.logo}>🦓</Text>
        <Text style={styles.brand}>ZuluConnect</Text>
        <Text style={styles.tagline}>Gagne de l'argent en partageant{'\n'}ce que tu aimes ✨</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statValue}>2 400+</Text><Text style={styles.statLabel}>Promoteurs</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statValue}>15M BIF</Text><Text style={styles.statLabel}>Versés</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statValue}>98%</Text><Text style={styles.statLabel}>Satisfaction</Text></View>
        </View>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnPrimaryText}>🚀 Créer mon compte gratuit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnSecondaryText}>J'ai déjà un compte</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>© 2026 Zera Group · Made with ❤️ for Africa</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#080b12'},
  glow1:{position:'absolute',width:300,height:300,borderRadius:150,backgroundColor:'rgba(0,229,160,0.06)',top:-80,right:-80},
  content:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:28},
  logo:{fontSize:80,marginBottom:8},
  brand:{fontWeight:'800',fontSize:36,color:'#00E5A0',marginBottom:12},
  tagline:{fontSize:15,color:'#8890a8',textAlign:'center',lineHeight:24,marginBottom:40},
  statsRow:{flexDirection:'row',alignItems:'center',backgroundColor:'#0f1420',borderRadius:16,borderWidth:1,borderColor:'rgba(255,255,255,0.07)',paddingVertical:16,paddingHorizontal:20,marginBottom:40,width:'100%'},
  stat:{flex:1,alignItems:'center'},
  statValue:{fontSize:18,fontWeight:'800',color:'#00E5A0',marginBottom:2},
  statLabel:{fontSize:10,color:'#606880'},
  statDivider:{width:1,height:32,backgroundColor:'rgba(255,255,255,0.07)'},
  btnPrimary:{backgroundColor:'#00E5A0',borderRadius:16,paddingVertical:16,width:'100%',alignItems:'center',marginBottom:12},
  btnPrimaryText:{color:'#000',fontSize:15,fontWeight:'800'},
  btnSecondary:{backgroundColor:'#0f1420',borderRadius:16,paddingVertical:16,width:'100%',alignItems:'center',borderWidth:1,borderColor:'rgba(255,255,255,0.07)',marginBottom:40},
  btnSecondaryText:{color:'#e8eaf0',fontSize:15,fontWeight:'600'},
  footer:{fontSize:11,color:'#606880',textAlign:'center'},
});