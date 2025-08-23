// frontend/src/pages/LoginPage.jsx
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  // Call hooks before any conditional logic
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const subtextColor = useColorModeValue("gray.600", "gray.400");

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(formData);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="lg" py={{ base: "12", md: "24" }}>
      <VStack spacing="8">
        <VStack spacing="6" textAlign="center">
          <Heading size="xl" color={textColor}>
            Sign in to your store
          </Heading>
          <Text color={subtextColor}>
            Welcome back! Please sign in to your account.
          </Text>
        </VStack>
        <Box
          py="8"
          px="10"
          bg={bgColor}
          shadow="base"
          rounded="xl"
          w="full"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing="6">
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </form>
          
          <Text mt="6" textAlign="center" color={subtextColor}>
            Don't have an account?{" "}
            <ChakraLink as={Link} to="/register" color="blue.500" fontWeight="medium">
              Sign up
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;