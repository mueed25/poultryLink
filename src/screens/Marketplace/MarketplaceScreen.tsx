import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, View, ScrollView, Share, Platform } from 'react-native';
import {
  Text,
  Title,
  Button,
  Divider,
  Searchbar,
  Badge,
  IconButton,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '../../components/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { MarketplaceStackParamList } from '../../navigation/MarketplaceNavigator';
import { useCart } from '../../contexts/CartContext';

// Define navigation type
type MarketplaceScreenNavigationProp = StackNavigationProp<MarketplaceStackParamList, 'MarketplaceHome'>;

// Placeholder data
const CATEGORIES = [
  { id: 'feeds', name: 'Feeds', icon: 'grass' },
  { id: 'medications', name: 'Medications', icon: 'medical-services' },
  { id: 'equipment', name: 'Equipment', icon: 'handyman' },
  { id: 'birds', name: 'Birds', icon: 'pets' },
  { id: 'services', name: 'Services', icon: 'miscellaneous-services' },
];

const PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Layer Feed (25kg)',
    category: 'feeds',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1596458397260-251de8577294?q=80&w=1000',
    rating: 4.5,
    ratingCount: 28,
    seller: 'AgroFeeds Ltd',
    location: 'Lagos',
    isHot: true,
  },
  {
    id: 'p2',
    name: 'Automatic Poultry Drinker (5L)',
    category: 'equipment',
    price: 950,
    image: 'https://images.unsplash.com/photo-1597688013488-b40bf8af3fbe?q=80&w=1000',
    rating: 4.2,
    ratingCount: 15,
    seller: 'FarmEquip',
    location: 'Abuja',
    isHot: false,
  },
  {
    id: 'p3',
    name: 'Newcastle Disease Vaccine (100 doses)',
    category: 'medications',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1576073719676-aa95576db207?q=80&w=1000',
    rating: 4.8,
    ratingCount: 42,
    seller: 'VetSupplies Nigeria',
    location: 'Ibadan',
    isHot: true,
  },
  {
    id: 'p4',
    name: 'Broiler Starter Feed (50kg)',
    category: 'feeds',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?q=80&w=1000',
    rating: 4.3,
    ratingCount: 19,
    seller: 'FarmKing Supplies',
    location: 'Kano',
    isHot: false,
  },
  {
    id: 'p5',
    name: 'Poultry Health Consultation',
    category: 'services',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1000',
    rating: 4.7,
    ratingCount: 31,
    seller: 'Dr. Ade Veterinary Clinic',
    location: 'Lagos',
    isHot: true,
  },
  {
    id: 'p6',
    name: 'Advanced Egg Incubator (60 eggs)',
    category: 'equipment',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?q=80&w=1000',
    rating: 4.9,
    ratingCount: 47,
    seller: 'TechFarm Solutions',
    location: 'Port Harcourt',
    isHot: true,
  },
  {
    id: 'p7',
    name: 'Organic Layer Mash (20kg)',
    category: 'feeds',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000',
    rating: 4.6,
    ratingCount: 36,
    seller: 'Organic Farm Supplies',
    location: 'Enugu',
    isHot: false,
  },
  {
    id: 'p8',
    name: 'Poultry Waterer System (5 units)',
    category: 'equipment',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1551598504-79b2121fc83a?q=80&w=1000',
    rating: 4.4,
    ratingCount: 22,
    seller: 'AgriTech Solutions',
    location: 'Kaduna',
    isHot: true,
  },
  {
    id: 'p9',
    name: 'Day-Old Broiler Chicks (50 birds)',
    category: 'birds',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=1000',
    rating: 4.7,
    ratingCount: 53,
    seller: 'Premium Hatchery',
    location: 'Lagos',
    isHot: true,
  },
  {
    id: 'p10',
    name: 'Poultry Antibiotics Pack',
    category: 'medications',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1000',
    rating: 4.5,
    ratingCount: 29,
    seller: 'MedVet Supplies',
    location: 'Ibadan',
    isHot: false,
  },
];

const MarketplaceScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<MarketplaceScreenNavigationProp>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});
  const { getCartItemCount, addToCart } = useCart();

  // Function to handle translation keys
  const getCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case 'feeds': return 'Feeds';
      case 'medications': return 'Medications';
      case 'equipment': return 'Equipment';
      case 'birds': return 'Birds';
      case 'services': return 'Services';
      default: return categoryId;
    }
  };

  // Filter products based on search and category
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    // Check if user is authenticated
    if (!user) {
      // In a real app, show auth modal
      setShowAuthModal(true);
      console.log('Authentication required to place an order');
    } else {
      // Add to cart
      addToCart(product, 1);
      // Provide feedback to user
      alert('Added to cart!');
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleViewDetails = (product: typeof PRODUCTS[0]) => {
    navigation.navigate('ProductDetailScreen', { product });
  };

  const navigateToCart = () => {
    navigation.navigate('CartScreen');
  };

  const renderCartIcon = () => {
    const cartItemCount = getCartItemCount();
    return (
      <View style={styles.cartIconContainer}>
        <IconButton
          icon="cart"
          size={24}
          onPress={navigateToCart}
          style={styles.cartIcon}
        />
        {cartItemCount > 0 && (
          <Badge style={styles.cartBadge}>
            {cartItemCount}
          </Badge>
        )}
      </View>
    );
  };

  const renderCategoryCard = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(selectedCategory === item.id ? '' : item.id)}
      style={[
        styles.categoryCard,
        selectedCategory === item.id && styles.categoryCardSelected
      ]}
    >
      <View style={styles.categoryContent}>
        <View
          style={[
            styles.categoryIcon,
            selectedCategory === item.id && styles.categoryIconSelected
          ]}
        >
          <MaterialIcons
            name={item.icon as any}
            size={24}
            color={selectedCategory === item.id ? "#FFFFFF" : "#276749"}
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            selectedCategory === item.id && styles.categoryTextSelected
          ]}
        >
          {getCategoryName(item.id)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Add share product function
  const handleShareProduct = async (product: typeof PRODUCTS[0]) => {
    try {
      const result = await Share.share({
        title: product.name,
        message: `Check out ${product.name} for ${formatPrice(product.price)} from ${product.seller} on PoultryLink Marketplace!`,
        url: product.image, // On iOS, this will be used
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(`Shared via ${result.activityType}`);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderProductCard = ({ item }: { item: typeof PRODUCTS[0] }) => {
    const isFavorite = favorites[item.id] || false;
    
    return (
      <View style={styles.productCardContainer}>
        <View style={styles.productCard}>
          {/* Product Image with Badge and Favorite Icon */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            {item.isHot && (
              <Badge style={styles.hotBadge}>
                Hot deal
              </Badge>
            )}
            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              iconColor={isFavorite ? "#E53E3E" : "#FFFFFF"}
              size={20}
              onPress={() => toggleFavorite(item.id)}
              style={styles.favoriteButton}
            />
          </View>
          
          {/* Product Details */}
          <View style={styles.productDetails}>
            <Title style={styles.productTitle}>{item.name}</Title>
            <Text style={styles.sellerName}>{item.seller}</Text>
            
            <View style={styles.priceRatingRow}>
              <Text style={styles.priceText}>
                {formatPrice(item.price)}
              </Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#F6AD55" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <IconButton
                icon="information-outline"
                mode="outlined"
                size={20}
                onPress={() => handleViewDetails(item)}
                style={styles.actionIcon}
                iconColor="#276749"
              />
              <IconButton
                icon="share-variant"
                mode="outlined"
                size={20}
                onPress={() => handleShareProduct(item)}
                style={styles.actionIcon}
                iconColor="#3182CE"
              />
              <IconButton
                icon="cart"
                mode="contained"
                onPress={() => handleAddToCart(item)}
                containerColor="#DD6B20"
                iconColor="#FFFFFF"
                size={20}
                style={styles.cartIconButton}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Title style={styles.appBarTitle}>Marketplace</Title>
        {renderCartIcon()}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t('common.search')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#718096"
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Categories - Removed title but kept the FlatList */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.productsContainer}>
          {selectedCategory && (
            <Title style={styles.sectionTitle}>
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products
            </Title>
          )}
          
          {filteredProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {filteredProducts.map((item) => renderProductCard({ item }))}
            </View>
          ) : (
            <View style={styles.emptyResults}>
              <MaterialIcons name="search-off" size={48} color="#CBD5E0" />
              <Text style={styles.emptyResultsText}>No products found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 8,
  },
  content: {
    padding: 12,
  },
  header: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 2,
  },
  searchContainer: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    borderRadius: 10,
    height: 42,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#276749',
  },
  categoriesList: {
    paddingVertical: 4,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    elevation: 1,
  },
  categoryCardSelected: {
    backgroundColor: '#F0FFF4',
    borderColor: '#276749',
    borderWidth: 1,
  },
  categoryContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    backgroundColor: '#F0FFF4',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  categoryIconSelected: {
    backgroundColor: '#276749',
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  categoryTextSelected: {
    fontWeight: 'bold',
    color: '#276749',
  },
  productsContainer: {
    marginBottom: 12,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 130,
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#276749',
    color: '#FFFFFF',
    fontSize: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  productDetails: {
    padding: 8,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  sellerName: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 4,
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#276749',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#718096',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  actionIcon: {
    margin: 0,
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
  },
  cartIconButton: {
    margin: 0,
    borderRadius: 16,
    width: 32,
    height: 32,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    marginBottom: 8,
  },
  appBarTitle: {
    color: '#276749',
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartIcon: {
    margin: 0,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#DD6B20',
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptyResults: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyResultsText: {
    marginTop: 8,
    color: '#718096',
    textAlign: 'center',
  },
});

export default MarketplaceScreen; 