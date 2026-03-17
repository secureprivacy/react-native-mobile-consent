import { Text, TouchableOpacity, View } from 'react-native';
import { SPColors } from '../styles/colors';

interface Props<T> {
  value: T;
  selected: T;
  title: string;
  subtitle?: string;
  onSelect: (value: T) => void;
}

export function SPRadioItem<T>({ value, selected, title, subtitle, onSelect }: Props<T>) {
  return (
    <TouchableOpacity onPress={() => onSelect(value)}>
      <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          width: 20,
          height: 20,
          borderRadius: 120,
          backgroundColor: value === selected ? SPColors.primary : 'grey',
        }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 16,
              height: 16,
              borderRadius: 80,
              backgroundColor: 'white',
            }}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 60,
              backgroundColor: value === selected ? SPColors.primary : 'grey',
            }} />
          </View>
        </View>
        <View>
          <Text>{title}</Text>
          {subtitle && <Text style={{ fontSize: 12, marginRight: 32 }}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
