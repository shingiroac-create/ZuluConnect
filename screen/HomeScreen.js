import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoIc}>🦓</Text>
            <Text style={styles.logoTxt}>ZuluConnect</Text>
          </View>
          <Text style={styles.notif}>🔔</Text>
        </View>
        <View style={styles.hero}>
          <Text style={styles.heroLbl}>Solde disponible</Text>
          <Text style={styles.heroBal}>18 750 BIF</Text>
          <Text style={styles.heroSub}>Bonjour, Aimé 👋</Text>
          <View style={styles.heroChips}>
            <View style={styles.chip}><Text style={styles.chipLbl}>EN ATTENTE</Text><Text style={[styles.chipVal,{color:'#FFD166'}]}>4 200</Text></View>
            <View style={styles.chip}><Text style={styles.chipLbl}>VENTES</Text><Text style={[styles.chipVal,{color:'#00E5A0'}]}>28</Text></View>
            <View style={styles.chip}><Text style={styles.chipLbl}>CLICS</Text><Text style={styles.chipVal}>486</Text></View>
          </View>
        </View>
        <View style={styles.actRow}>
          <TouchableOpacity style={styles.actBtn}><Text style={styles.actIc}>📢</Text><Text style={styles.actLbl}>Promouvoir</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actBtn}><Text style={styles.actIc}>🌍</Text><Text style={styles.actLbl}>Impact</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actBtn}><Text style={styles.actIc}>💸</Text><Text style={styles.actLbl}>Wallet</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.cacCard} onPress={() => navigation.navigate('CacHome')}>
          <Text style={styles.cacIc}>🛒</Text>
          <View style={{flex:1}}>
            <Text style={styles.cacTitle}>Achats groupés CAC</Text>
            <Text style={styles.cacSub}>Riz, huile, haricots… moins chers ensemble. Ménages et organisations.</Text>
          </View>
          <Text style={styles.cacGo}>→</Text>
        </TouchableOpacity>
        <View style={styles.section}>
          <Text style={styles.secTitle}>Campagnes actives</Text>
          {[{ic:'📱',name:'Safaricom 5G',earn:'300 BIF'},{ic:'🎓',name:'BujaHub Academy',earn:'500 BIF'},{ic:'💳',name:'Lumicash Pay',earn:'200 BIF'}].map((c,i) => (
            <View key={i} style={styles.camp}>
              <View style={styles.campIc}><Text style={{fontSize:20}}>{c.ic}</Text></View>
              <Text style={styles.campNm}>{c.name}</Text>
              <View style={styles.earnBadge}><Text style={styles.earnTxt}>{c.earn}</Text></View>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Landing')}>
          <Text style={styles.logoutTxt}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#080b12'},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20,paddingTop:16},
  logoRow:{flexDirection:'row',alignItems:'center',gap:8},
  logoIc:{fontSize:22},
  logoTxt:{fontSize:18,fontWeight:'800',color:'#00E5A0'},
  notif:{fontSize:20},
  hero:{margin:16,backgroundColor:'#0a1f18',borderWidth:1,borderColor:'rgba(0,229,160,0.15)',borderRadius:24,padding:22},
  heroLbl:{fontSize:11,color:'rgba(0,229,160,0.6)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:8},
  heroBal:{fontSize:38,fontWeight:'800',color:'#fff',letterSpacing:-1},
  heroSub:{fontSize:12,color:'rgba(255,255,255,0.3)',marginTop:4,marginBottom:16},
  heroChips:{flexDirection:'row',gap:8},
  chip:{flex:1,backgroundColor:'rgba(0,0,0,0.3)',borderRadius:12,padding:10},
  chipLbl:{fontSize:8,color:'rgba(255,255,255,0.3)',marginBottom:3},
  chipVal:{fontSize:14,fontWeight:'700',color:'#fff'},
  actRow:{flexDirection:'row',gap:10,marginHorizontal:16,marginBottom:20},
  actBtn:{flex:1,backgroundColor:'#0f1420',borderWidth:1,borderColor:'rgba(255,255,255,0.07)',borderRadius:16,padding:14,alignItems:'center',gap:6},
  actIc:{fontSize:22},
  actLbl:{fontSize:11,color:'#8890a8'},
  cacCard:{flexDirection:'row',alignItems:'center',gap:12,marginHorizontal:16,marginBottom:20,backgroundColor:'#0a1f18',borderWidth:1,borderColor:'rgba(0,229,160,0.25)',borderRadius:18,padding:16},
  cacIc:{fontSize:28},
  cacTitle:{fontSize:15,fontWeight:'800',color:'#e8eaf0'},
  cacSub:{fontSize:12,color:'#8890a8',marginTop:2,lineHeight:17},
  cacGo:{fontSize:20,color:'#00E5A0',fontWeight:'800'},
  section:{paddingHorizontal:16,marginBottom:20},
  secTitle:{fontSize:16,fontWeight:'700',color:'#e8eaf0',marginBottom:12},
  camp:{backgroundColor:'#0f1420',borderWidth:1,borderColor:'rgba(255,255,255,0.07)',borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',gap:12,marginBottom:10},
  campIc:{width:44,height:44,backgroundColor:'#161c2e',borderRadius:12,alignItems:'center',justifyContent:'center'},
  campNm:{flex:1,fontSize:14,fontWeight:'600',color:'#e8eaf0'},
  earnBadge:{backgroundColor:'rgba(0,229,160,0.1)',borderWidth:1,borderColor:'rgba(0,229,160,0.2)',borderRadius:20,paddingVertical:4,paddingHorizontal:10},
  earnTxt:{fontSize:11,fontWeight:'600',color:'#00E5A0'},
  logout:{margin:16,marginTop:4,padding:16,alignItems:'center'},
  logoutTxt:{color:'#FF5C5C',fontSize:14,fontWeight:'600'},
});