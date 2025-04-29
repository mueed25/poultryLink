import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Text, Title, TextInput, Card, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/types';

type FarmProfileScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FarmProfile'>;

const FarmProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<FarmProfileScreenNavigationProp>();

  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [birdCount, setBirdCount] = useState('');
  const [hasLayer, setHasLayer] = useState(false);
  const [hasBroiler, setHasBroiler] = useState(false);
  const [hasNative, setHasNative] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farmNameError, setFarmNameError] = useState('');
  const [farmLocationError, setFarmLocationError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    if (!farmName) {
      setFarmNameError(t('farm.nameRequired'));
      isValid = false;
    } else {
      setFarmNameError('');
    }

    if (!farmLocation) {
      setFarmLocationError(t('farm.locationRequired'));
      isValid = false;
    } else {
      setFarmLocationError('');
    }

    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // In a real app, you would save this to a backend or local storage
      console.log('Saving farm profile:', {
        farmName,
        farmLocation,
        farmSize,
        birdCount,
        birdTypes: {
          layer: hasLayer,
          broiler: hasBroiler,
          native: hasNative
        }
      });

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the next screen
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error saving farm profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Title style={styles.title}>{t('farm.setupProfile')}</Title>
          <Text style={styles.subtitle}>{t('farm.profileInstructions')}</Text>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>{t('farm.basicInfo')}</Title>
              
              <TextInput
                label={t('farm.name')}
                value={farmName}
                onChangeText={text => setFarmName(text)}
                mode="outlined"
                error={!!farmNameError}
                style={styles.input}
              />
              {farmNameError ? <Text style={styles.errorText}>{farmNameError}</Text> : null}
              
              <TextInput
                label={t('farm.location')}
                value={farmLocation}
                onChangeText={text => setFarmLocation(text)}
                mode="outlined"
                error={!!farmLocationError}
                style={styles.input}
              />
              {farmLocationError ? <Text style={styles.errorText}>{farmLocationError}</Text> : null}
              
              <TextInput
                label={t('farm.size')}
                value={farmSize}
                onChangeText={text => setFarmSize(text)}
                placeholder={t('farm.sizeHint')}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>{t('farm.birdInfo')}</Title>
              
              <TextInput
                label={t('farm.birdCount')}
                value={birdCount}
                onChangeText={text => setBirdCount(text)}
                placeholder={t('farm.birdCountHint')}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              
              <Title style={styles.subsectionTitle}>{t('farm.birdTypes')}</Title>
              
              <View style={styles.switchContainer}>
                <Text>{t('farm.layers')}</Text>
                <Switch
                  value={hasLayer}
                  onValueChange={() => setHasLayer(!hasLayer)}
                  color="#276749"
                />
              </View>
              
              <View style={styles.switchContainer}>
                <Text>{t('farm.broilers')}</Text>
                <Switch
                  value={hasBroiler}
                  onValueChange={() => setHasBroiler(!hasBroiler)}
                  color="#276749"
                />
              </View>
              
              <View style={styles.switchContainer}>
                <Text>{t('farm.native')}</Text>
                <Switch
                  value={hasNative}
                  onValueChange={() => setHasNative(!hasNative)}
                  color="#276749"
                />
              </View>
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              loading={loading}
              disabled={loading}
              style={styles.saveButton}
            >
              {t('common.save')}
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleSkip}
              style={styles.skipButton}
            >
              {t('common.skip')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#276749',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#4A5568',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#276749',
  },
  subsectionTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#E53E3E',
    marginBottom: 8,
    fontSize: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#276749',
  },
  skipButton: {
    paddingVertical: 8,
    borderColor: '#276749',
  },
});

export default FarmProfileScreen; 