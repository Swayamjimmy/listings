// frontend/src/pages/HomePage.jsx
import {
  Container,
  VStack,
  Text,
  Heading,
  Box,
  Button,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Center,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiUsers, FiGlobe, FiArrowRight } from "react-icons/fi";

const HomePage = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const features = [
    {
      icon: FiShoppingBag,
      title: "Create Your Store",
      description: "Build and manage your product catalog with ease.",
    },
    {
      icon: FiGlobe,
      title: "Share Your Products",
      description: "Get a public URL to share your store with anyone.",
    },
    {
      icon: FiUsers,
      title: "Manage Everything",
      description: "Full control over your products - only you can edit.",
    },
  ];

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={16} align="stretch">
        {/* Hero Section */}
        <Center>
          <VStack spacing={8} textAlign="center" maxW="2xl">
            <Heading
              fontSize={{ base: "3xl", md: "5xl" }}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Build Your Product Store
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.500"
              lineHeight="tall"
            >
              Create a beautiful product catalog, share it with the world, and 
              manage everything from your personal dashboard. No coding required.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                as={Link}
                to="/register"
                colorScheme="blue"
                size="lg"
                rightIcon={<FiArrowRight />}
                _hover={{ transform: "translateY(-2px)" }}
              >
                Get Started Free
              </Button>
              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="lg"
                _hover={{ transform: "translateY(-2px)" }}
              >
                Sign In
              </Button>
            </HStack>
          </VStack>
        </Center>

        {/* Features Section */}
        <Box>
          <Heading textAlign="center" mb={12} size="xl">
            Everything you need to showcase your products
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {features.map((feature, index) => (
              <Box
                key={index}
                bg={bgColor}
                p={8}
                rounded="xl"
                border="1px"
                borderColor={borderColor}
                textAlign="center"
                _hover={{ 
                  transform: "translateY(-4px)",
                  shadow: "xl"
                }}
                transition="all 0.3s"
              >
                <Icon
                  as={feature.icon}
                  boxSize={12}
                  color="blue.500"
                  mb={4}
                />
                <Heading size="md" mb={4}>
                  {feature.title}
                </Heading>
                <Text color="gray.500" lineHeight="tall">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* CTA Section */}
        <Box 
          bg="blue.50" 
          _dark={{ bg: "blue.900" }}
          py={16}
          px={8}
          rounded="2xl"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="xl">
              Ready to start building?
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.300" }}>
              Join thousands of creators who trust us with their product catalogs.
            </Text>
            <Button
              as={Link}
              to="/register"
              colorScheme="blue"
              size="lg"
              rightIcon={<FiArrowRight />}
            >
              Create Your Store Now
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage;