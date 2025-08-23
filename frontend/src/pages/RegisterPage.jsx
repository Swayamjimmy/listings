// frontend/src/pages/RegisterPage.jsx
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    storeDescription: "",
  });

  const { register, loading, isAuthenticated } = useAuthStore();
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Remove confirmPassword before sending to API
    const registrationData = { ...formData };
    delete registrationData.confirmPassword;
    
    const result = await register(registrationData);
    
    if (result.success) {
      toast({
        title: "Registration Successful",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Registration Failed",
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
            Create your store
          </Heading>
          <Text color={subtextColor}>
            Join us and start building your product catalog!
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
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
                <FormHelperText>
                  This will be your unique store URL: /store/username
                </FormHelperText>
              </FormControl>

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

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Store Name</FormLabel>
                <Input
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Store Description</FormLabel>
                <Textarea
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Describe your store (optional)"
                  rows={3}
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Creating account..."
              >
                Create Account
              </Button>
            </VStack>
          </form>
          
          <Text mt="6" textAlign="center" color={subtextColor}>
            Already have an account?{" "}
            <ChakraLink as={Link} to="/login" color="blue.500" fontWeight="medium">
              Sign in
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default RegisterPage;