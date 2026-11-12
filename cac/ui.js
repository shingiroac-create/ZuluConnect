// Petits composants partagés par les écrans CAC, dans le style sombre de ZuluConnect.
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const C = {
  bg: '#080b12', card: '#0f1420', card2: '#161c2e', line: 'rgba(255,255,255,0.07)',
  text: '#e8eaf0', mute: '#8890a8', dim: '#606880', green: '#00E5A0', gold: '#FFD166', red: '#FF5C5C',
};

export function Screen({ title, subtitle, onBack, children }) {
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>← Retour</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </SafeAreaView>
  );
}

export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;

export function Btn({ label, onPress, disabled, kind = 'primary', style }) {
  const primary = kind === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[s.btn, primary ? s.btnPrimary : s.btnGhost, disabled && { opacity: 0.4 }, style]}
    >
      <Text style={[s.btnTxt, { color: primary ? '#000' : C.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Segment({ options, value, onChange }) {
  return (
    <View style={s.segment}>
      {options.map((o) => {
        const on = o === value;
        return (
          <TouchableOpacity key={o} style={[s.segItem, on && s.segOn]} onPress={() => onChange(o)}>
            <Text style={[s.segTxt, on && { color: '#000', fontWeight: '800' }]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function Choice({ options, value, onChange }) {
  return (
    <View style={s.choiceRow}>
      {options.map((o) => {
        const on = o === value;
        return (
          <TouchableOpacity key={o} style={[s.choice, on && s.choiceOn]} onPress={() => onChange(o)}>
            <Text style={[s.choiceTxt, on && { color: C.green, fontWeight: '700' }]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function Field({ label, ...props }) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={C.dim}
        {...props}
        style={[s.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Progress({ value, max, marks = [] }) {
  const pct = max ? Math.min(1, value / max) : 0;
  return (
    <View style={s.progWrap}>
      <View style={s.progTrack}>
        <View style={[s.progFill, { width: `${pct * 100}%` }]} />
        {marks.map((m) => (
          <View key={m} style={[s.progMark, { left: `${(m / max) * 100}%` }]} />
        ))}
      </View>
    </View>
  );
}

export const Label = ({ children }) => <Text style={s.sectionTitle}>{children}</Text>;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  back: { color: C.mute, fontSize: 13, marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '800', color: C.text },
  subtitle: { fontSize: 13, color: C.mute, marginTop: 4 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 16, marginBottom: 12 },
  btn: { borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  btnPrimary: { backgroundColor: C.green },
  btnGhost: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  btnTxt: { fontSize: 15, fontWeight: '800' },
  segment: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: C.line },
  segItem: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segOn: { backgroundColor: C.green },
  segTxt: { color: C.mute, fontSize: 13, fontWeight: '600' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  choice: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  choiceOn: { borderColor: 'rgba(0,229,160,0.5)', backgroundColor: 'rgba(0,229,160,0.08)' },
  choiceTxt: { color: C.mute, fontSize: 13 },
  label: { fontSize: 12, color: C.mute, marginBottom: 6, fontWeight: '500' },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 14, color: C.text, fontSize: 14, marginBottom: 16 },
  progWrap: { marginVertical: 10 },
  progTrack: { height: 10, borderRadius: 5, backgroundColor: C.card2 },
  progFill: { height: 10, borderRadius: 5, backgroundColor: C.green },
  progMark: { position: 'absolute', top: -3, width: 2, height: 16, backgroundColor: C.gold, borderRadius: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginTop: 8, marginBottom: 12 },
});
