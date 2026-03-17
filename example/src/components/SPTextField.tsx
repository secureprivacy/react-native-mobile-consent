import { View, Text, TextInput } from 'react-native';
import { SPColors } from '../styles/colors';

interface Props {
  label: string;
  placeholder: string;
  onChange: (text: string) => void;
}

const SPTextField = ({ label, placeholder, onChange }: Props) => (
  <View style={{ marginVertical: 6 }}>
    <Text style={{ fontSize: 12 }}>{label}</Text>
    <TextInput
      placeholder={placeholder}
      onChangeText={onChange}
      placeholderTextColor={SPColors.placeholder}
      style={{
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginTop: 4,
        color: SPColors.text
      }}
    />
  </View>
);

export default SPTextField;
