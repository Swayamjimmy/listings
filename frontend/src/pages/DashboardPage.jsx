// frontend/src/pages/DashboardPage.jsx
import {
  Container,
  Text,
  VStack,
  SimpleGrid,
  Box,
  Heading,
  Button,
  Badge,
  useColorModeValue,
  Flex,
  Icon,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiExternalLink, FiPackage } from "react-icons/fi";
import { useProductStore } from "../store/product";
import useAuthStore from "../store/auth";
import ProductCard from "../components/ProductCard";

const DashboardPage = () => {
  const { products, fetchProducts } = useProductStore();
  const { user } = useAuthStore();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const result = await fetchProducts();
      if (!result.success && result.message) {
        toast({
          title: "Error",
          description: result.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    };

    if (user) {
      loadProducts();
    }
  }, [fetchProducts, user, toast]);

  const publicStoreUrl = `${window.location.origin}/store/${user?.username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicStoreUrl);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Store URL copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error(err);
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openPublicStore = () => {
    window.open(publicStoreUrl, '_blank');
  };

  if (!user) {
    return (
      <Container maxW="container.xl" py={12}>
        <Text>Please log in to access your dashboard.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Flex justify="space-between" align="start" mb={4} direction={{ base: "column", md: "row" }}>
            <Box>
              <Heading size="xl" mb={2}>
                Welcome back, {user.username}! 👋
              </Heading>
              <Text color="gray.500" fontSize="lg">
                {user.storeName}
              </Text>
              {user.storeDescription && (
                <Text color="gray.400" mt={1}>
                  {user.storeDescription}
                </Text>
              )}
            </Box>
            <Button
              as={Link}
              to="/create"
              colorScheme="blue"
              leftIcon={<Icon as={FiPlus} />}
              size="lg"
              mt={{ base: 4, md: 0 }}
            >
              Add Product
            </Button>
          </Flex>
        </Box>

        {/* Store Stats & Share */}
        <Box bg={bgColor} p={6} rounded="xl" border="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center" direction={{ base: "column", md: "row" }} gap={4}>
            <Box>
              <Heading size="md" mb={2}>Your Store Statistics</Heading>
              <Flex gap={6}>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {products.length}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Total Products
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
                    Active
                  </Badge>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Store Status
                  </Text>
                </Box>
              </Flex>
            </Box>
            
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.500">Share your store:</Text>
              <Flex gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? 'Copied!' : 'Copy URL'}
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={FiExternalLink} />}
                  onClick={openPublicStore}
                >
                  View Store
                </Button>
              </Flex>
            </VStack>
          </Flex>
        </Box>

        {/* Store URL Alert */}
        <Alert status="info" variant="left-accent">
          <AlertIcon />
          <Box>
            <AlertTitle>Public Store URL</AlertTitle>
            <AlertDescription>
              <ChakraLink href={publicStoreUrl} isExternal color="blue.500">
                {publicStoreUrl}
              </ChakraLink>
              <Text fontSize="sm" mt={1}>
                Anyone can visit this URL to view your products, but only you can edit them.
              </Text>
            </AlertDescription>
          </Box>
        </Alert>

        {/* Products Grid */}
        <Box>
          <Heading size="lg" mb={6} display="flex" alignItems="center" gap={2}>
            <Icon as={FiPackage} />
            Your Products
          </Heading>
          
          {loading ? (
            <Text>Loading products...</Text>
          ) : products.length === 0 ? (
            <VStack spacing={4} py={12}>
              <Icon as={FiPackage} boxSize={16} color="gray.400" />
              <Text fontSize="xl" color="gray.500">No products found</Text>
              <Text color="gray.400" textAlign="center">
                Start building your store by adding your first product
              </Text>
              <Button
                as={Link}
                to="/create"
                colorScheme="blue"
                leftIcon={<Icon as={FiPlus} />}
                size="lg"
              >
                Add Your First Product
              </Button>
            </VStack>
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
                  showEditButtons={true}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default DashboardPage;