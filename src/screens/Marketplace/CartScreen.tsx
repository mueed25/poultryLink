import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text, Title, Button, TextInput, Divider, Card, IconButton, Checkbox } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { MarketplaceStackParamList } from '../../navigation/MarketplaceNavigator';
import { useCart } from '../../contexts/CartContext';

type CartNavigationProp = StackNavigationProp<MarketplaceStackParamList, 'CartScreen'>;

const CartScreen = () => {
  const navigation = useNavigation<CartNavigationProp>();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [termsChecked, setTermsChecked] = useState(false);
  const [returnsChecked, setReturnsChecked] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Calculate delivery fee based on selected option
  const deliveryFee = deliveryOption === 'express' ? 1000 : deliveryOption === 'standard' ? 500 : 0;

  // Update totals whenever cart items or delivery option changes
  useEffect(() => {
    const newSubtotal = getCartTotal();
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + deliveryFee);
  }, [items, deliveryFee, getCartTotal]);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleQuantityChange = (id: string, change: number) => {
    updateQuantity(id, change);
    // Price will update automatically through the useEffect
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    // In a real app, this would handle the payment process
    console.log('Processing checkout for:', items);
    console.log('Delivery address:', address);
    console.log('Total amount:', total);

    // Show order confirmation
    alert('Order placed successfully!');
    // Navigate back to marketplace
    navigation.navigate('MarketplaceHome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Title style={styles.headerTitle}>Check out</Title>
        <View style={{ width: 40 }} />
      </View>

      {items.length === 0 ? (
        <Card style={styles.emptyCartCard}>
          <Card.Content style={styles.emptyCartContent}>
            <MaterialIcons name="shopping-cart" size={64} color="#CBD5E0" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Button 
              mode="contained" 
              style={styles.shopButton}
              onPress={() => navigation.navigate('MarketplaceHome')}
            >
              Continue Shopping
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.cartItemCard}>
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Title style={styles.itemTitle}>{item.name}</Title>
                  <Text style={styles.itemSeller}>{item.seller}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <IconButton 
                      icon="minus" 
                      size={16} 
                      onPress={() => handleQuantityChange(item.id, -1)}
                      style={styles.quantityButton}
                      disabled={item.quantity <= 1}
                    />
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <IconButton 
                      icon="plus" 
                      size={16} 
                      onPress={() => handleQuantityChange(item.id, 1)}
                      style={styles.quantityButton}
                    />
                    <TouchableOpacity 
                      onPress={() => handleRemoveItem(item.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          )}
          ListHeaderComponent={() => (
            <View>
              {/* Address Section */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Title style={styles.sectionTitle}>Address</Title>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    placeholder="Enter your full address"
                    style={styles.addressInput}
                    outlineColor="#E2E8F0"
                    activeOutlineColor="#276749"
                  />
                </Card.Content>
              </Card>

              {/* Delivery Options */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Title style={styles.sectionTitle}>Delivery method</Title>
                  
                  <TouchableOpacity 
                    style={[
                      styles.deliveryOption,
                      deliveryOption === 'local' && styles.selectedDeliveryOption
                    ]}
                    onPress={() => setDeliveryOption('local')}
                  >
                    <View style={styles.deliveryOptionContent}>
                      <MaterialIcons 
                        name="store" 
                        size={24} 
                        color={deliveryOption === 'local' ? '#276749' : '#718096'} 
                      />
                      <View style={styles.deliveryOptionDetails}>
                        <Text style={styles.deliveryOptionTitle}>Local Pickup</Text>
                        <Text style={styles.deliveryOptionDescription}>Pick up from our store</Text>
                      </View>
                    </View>
                    <Text style={styles.deliveryOptionPrice}>{formatPrice(0)}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.deliveryOption,
                      deliveryOption === 'standard' && styles.selectedDeliveryOption
                    ]}
                    onPress={() => setDeliveryOption('standard')}
                  >
                    <View style={styles.deliveryOptionContent}>
                      <MaterialIcons 
                        name="local-shipping" 
                        size={24} 
                        color={deliveryOption === 'standard' ? '#276749' : '#718096'} 
                      />
                      <View style={styles.deliveryOptionDetails}>
                        <Text style={styles.deliveryOptionTitle}>Standard Delivery</Text>
                        <Text style={styles.deliveryOptionDescription}>3-5 business days</Text>
                      </View>
                    </View>
                    <Text style={styles.deliveryOptionPrice}>{formatPrice(500)}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.deliveryOption,
                      deliveryOption === 'express' && styles.selectedDeliveryOption
                    ]}
                    onPress={() => setDeliveryOption('express')}
                  >
                    <View style={styles.deliveryOptionContent}>
                      <MaterialIcons 
                        name="directions-run" 
                        size={24} 
                        color={deliveryOption === 'express' ? '#276749' : '#718096'} 
                      />
                      <View style={styles.deliveryOptionDetails}>
                        <Text style={styles.deliveryOptionTitle}>Express Delivery</Text>
                        <Text style={styles.deliveryOptionDescription}>1-2 business days</Text>
                      </View>
                    </View>
                    <Text style={styles.deliveryOptionPrice}>{formatPrice(1000)}</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            </View>
          )}
          ListFooterComponent={() => (
            <View>
              {/* Order Summary */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Title style={styles.sectionTitle}>Order summary</Title>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery fee</Text>
                    <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
                  </View>
                  
                  <Divider style={styles.summaryDivider} />
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                  </View>
                </Card.Content>
              </Card>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    status={termsChecked ? 'checked' : 'unchecked'}
                    onPress={() => setTermsChecked(!termsChecked)}
                    color="#276749"
                  />
                  <Text style={styles.termsText}>
                    I have read and understood the terms and conditions
                  </Text>
                </View>
                
                <View style={styles.checkboxRow}>
                  <Checkbox
                    status={returnsChecked ? 'checked' : 'unchecked'}
                    onPress={() => setReturnsChecked(!returnsChecked)}
                    color="#276749"
                  />
                  <Text style={styles.termsText}>
                    I have read and understood the returns policy
                  </Text>
                </View>
              </View>

              {/* Complete Order Button */}
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleCheckout}
                  style={styles.checkoutButton}
                  disabled={!termsChecked || !returnsChecked || !address}
                >
                  Complete Order
                </Button>
              </View>
            </View>
          )}
          contentContainerStyle={styles.content}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  cartItemCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSeller: {
    fontSize: 14,
    color: '#718096',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#276749',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    margin: 0,
    backgroundColor: '#F0FFF4',
  },
  quantityText: {
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  removeButton: {
    marginLeft: 'auto',
  },
  removeText: {
    color: '#E53E3E',
    fontSize: 14,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  addressInput: {
    backgroundColor: '#FFFFFF',
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedDeliveryOption: {
    borderColor: '#276749',
    backgroundColor: '#F0FFF4',
  },
  deliveryOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryOptionDetails: {
    marginLeft: 12,
  },
  deliveryOptionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  deliveryOptionDescription: {
    color: '#718096',
    fontSize: 12,
  },
  deliveryOptionPrice: {
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#718096',
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  summaryDivider: {
    marginVertical: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#276749',
  },
  termsContainer: {
    marginBottom: 80,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  checkoutButton: {
    backgroundColor: '#276749',
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyCartCard: {
    marginBottom: 16,
    elevation: 2,
    padding: 16,
  },
  emptyCartContent: {
    alignItems: 'center',
    padding: 24,
  },
  emptyCartText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    color: '#718096',
  },
  shopButton: {
    backgroundColor: '#276749',
  },
});

export default CartScreen; 