// frontend/src/pages/PublicStorePage.jsx
import {
  Container,
  Text,
  VStack,
  SimpleGrid,
  Box,
  Heading,
  useColorModeValue,
  Icon,
  Badge,
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { FiStore, FiPackage } from "react-icons/fi";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const PublicStorePage = () => {
  const { username } = useParams();
  const { products, storeInfo, fetchProducts, fetchStoreInfo, clearStoreInfo } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true);
      setError(null);
      
      // Clear previous store info
      clearStoreInfo();

      // Fetch store info
      const storeResult = await fetchStoreInfo(username);
      if (!storeResult.success) {
        setError(storeResult.message);
        setLoading(false);
        return;
      }

      // Fetch products
      const productsResult = await fetchProducts(username);
      if (!productsResult.success && productsResult.message !== "User not found") {
        console.warn("Failed to fetch products:", productsResult.message);
      }

      setLoading(false);
    };

    if (username) {
      loadStoreData();
    }

    // Cleanup on unmount
    return () => {
      clearStoreInfo();
    };
  }, [username, fetchProducts, fetchStoreInfo, clearStoreInfo]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={12}>
        <Center minH="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading store...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={12}>
        <Center minH="50vh">
          <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" textAlign="center" height="200px">
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Store Not Found
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              The store "{username}" doesn't exist or has been removed.
            </AlertDescription>
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="stretch">
        {/* Store Header */}
        <Box bg={bgColor} p={8} rounded="xl" border="1px" borderColor={borderColor}>
          <Flex align="center" mb={4}>
            <Icon boxSize={8} color="blue.500" mr={3} />
            <Box>
              <Heading size="xl">
                {storeInfo?.storeName || 'Store'}
              </Heading>
              <Text color="gray.500" fontSize="lg">
                @{storeInfo?.username}
              </Text>
            </Box>
            <Badge colorScheme="green" ml="auto" size="lg">
              Public Store
            </Badge>
          </Flex>
          
          {storeInfo?.storeDescription && (
            <Text color="gray.600" fontSize="lg" mt={4}>
              {storeInfo.storeDescription}
            </Text>
          )}
          
          <Flex align="center" mt={6} gap={6}>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {products.length}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Products
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Products Section */}
        <Box>
          <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
            <Icon  />
            Products
          </Heading>
          
          {products.length === 0 ? (
            <Box bg={bgColor} p={12} rounded="xl" border="1px" borderColor={borderColor}>
              <VStack spacing={4}>
                <Icon boxSize={16} color="gray.400" />
                <Text fontSize="xl" color="gray.500">No products available</Text>
                <Text color="gray.400" textAlign="center">
                  This store hasn't added any products yet. Check back later!
                </Text>
              </VStack>
            </Box>
          ) : (
            <SimpleGrid
              columns={{
                base: 1,
                md: 2,
                lg: 3,
                xl: 4
              }}
              spacing={6}
            >
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  showEditButtons={false} // No edit buttons in public view
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Footer Info */}
        <Box bg={bgColor} p={6} rounded="xl" border="1px" borderColor={borderColor}>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.500">
              This is a public store view. Products are managed by {storeInfo?.username}.
            </Text>
            <Text fontSize="xs" color="gray.400">
              Want to create your own store? Sign up and start building your product catalog!
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default PublicStorePage;