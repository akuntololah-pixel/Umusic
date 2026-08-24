import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '@/components/common/SectionHeader';

interface Props {
  title: string;
  moreTo?: string;
  children: React.ReactNode;
}

export function Shelf({ title, moreTo, children }: Props) {
  return (
    <View style={styles.wrap}>
      <SectionHeader title={title} moreTo={moreTo} />
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 28 },
});
