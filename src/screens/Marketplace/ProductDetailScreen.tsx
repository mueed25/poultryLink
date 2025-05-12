import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Image, Dimensions } from 'react-native';
import { Text, Title, Button, Badge, IconButton, Snackbar } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { MarketplaceStackParamList } from '../../navigation/MarketplaceNavigator';

// This would be defined in your navigation types file
type MarketplaceStackParamList = {
  MarketplaceScreen: undefined;
  ProductDetailScreen: {
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      seller: string;
      rating: number;
      ratingCount: number;
      isHot: boolean;
      description?: string;
      features?: string[];
      category: string;
    }
  };
};

type ProductDetailScreenRouteProp = RouteProp<MarketplaceStackParamList, 'ProductDetailScreen'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<MarketplaceStackParamList, 'ProductDetailScreen'>;

type Props = {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const { product } = route.params;
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Mock data for the product description if not provided
  const description = product.description || 
    "This premium product is a comfortable, adjustable solution designed for relaxation. It features stunning aesthetic details combined with UV protection for lasting durability. Perfect for poultry farming operations of any size.";
  
  const features = product.features || [
    "Premium quality materials",
    "Durable and long-lasting",
    "Easy to clean and maintain",
    "Perfect for poultry farms"
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBuyNow = () => {
    // Add to cart and navigate to checkout
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller
    });
    navigation.navigate('CartScreen');
  };

  const handleAddToCart = () => {
    // Add to cart and show feedback
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller
    });
    setSnackbarVisible(true);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            size={24}
            iconColor={isFavorite ? "#E53E3E" : "#333333"}
            onPress={toggleFavorite}
            style={styles.favoriteButton}
          />
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.isHot && (
            <Badge style={styles.hotBadge}>
              Hot deal
            </Badge>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Title style={styles.productTitle}>{product.name}</Title>
          
          <View style={styles.sellerRow}>
            <Text style={styles.sellerName}>{product.seller}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#F6AD55" />
              <Text style={styles.ratingText}>{product.rating} ({product.ratingCount})</Text>
            </View>
          </View>

          <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
          
          <View style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Product Details</Title>
          <Text style={styles.descriptionText}>{description}</Text>
          
          <Title style={styles.sectionTitle}>Features</Title>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <MaterialIcons name="check-circle" size={18} color="#276749" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}

          {/* Add quantity selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <IconButton 
                icon="minus" 
                size={20} 
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
                style={styles.quantityButton}
              />
              <Text style={styles.quantityText}>{quantity}</Text>
              <IconButton 
                icon="plus" 
                size={20} 
                onPress={increaseQuantity}
                style={styles.quantityButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <Button
          mode="outlined"
          style={styles.cartButton}
          icon="cart"
          onPress={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          mode="contained"
          style={styles.buyButton}
          onPress={handleBuyNow}
        >
          Buy Now
        </Button>
      </View>

      {/* Feedback Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {product.name} added to cart!
      </Snackbar>
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
    justifyContent: 'space-between',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 8,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 8,
  },
  imageContainer: {
    position: 'relative',
    height: width * 0.8,
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#276749',
    color: '#FFFFFF',
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  sellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerName: {
    fontSize: 14,
    color: '#718096',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#718096',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A5568',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  cartButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#276749',
  },
  buyButton: {
    flex: 2,
    backgroundColor: '#DD6B20',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  quantityButton: {
    margin: 0,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  snackbar: {
    backgroundColor: '#276749',
  },
});

export default ProductDetailScreen; 