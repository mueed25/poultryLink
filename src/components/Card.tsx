import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card as PaperCard, Text, Title } from 'react-native-paper';

interface CardProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
  style?: any;
  [key: string]: any; // Allow any additional props to be passed through
}

export const Card = ({ title, content, children, style, ...props }: CardProps) => {
  return (
    <PaperCard style={[styles.card, style]} {...props}>
      <PaperCard.Content>
        {title && <Title>{title}</Title>}
        {content && <Text>{content}</Text>}
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
}); 