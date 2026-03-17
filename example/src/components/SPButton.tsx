import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SPColors } from '../styles/colors';

interface Props {
  label: string;
  onPress: () => Promise<void> | void;
}

const SPButton = ({ label, onPress }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await onPress();
    setLoading(false);
  };

  return (
    <TouchableOpacity onPress={handlePress}
                      style={{
                        backgroundColor: SPColors.primary,
                        padding: 14,
                        borderRadius: 8,
                        marginVertical: 6,
                        alignItems: 'center',
                      }}
    >
      {loading ? (
        <ActivityIndicator color={SPColors.onPrimary} />
      ) : (
        <Text style={{ color: SPColors.onPrimary }}>
          {label.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SPButton;
