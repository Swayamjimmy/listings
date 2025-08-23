// frontend/src/pages/CreatePage.jsx
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
  Textarea,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useProductStore } from "../store/product";
import useAuthStore from "../store/auth";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const { createProduct } = useProductStore();
  const { isAuthenticated, user } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();

  // Call hooks before any conditional logic
  const bgColor = useColorModeValue("white", "gray.800");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleAddProduct = async () => {
    const result = await createProduct(newProduct);
    
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewProduct({ name: "", price: "", image: "", description: "" });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error", 
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Add New Product
        </Heading>
        
        <Text textAlign="center" color="gray.500">
          Adding to <Text as="span" fontWeight="bold" color="blue.500">{user?.storeName}</Text>
        </Text>

        <Box
          w={"full"}
          bg={bgColor}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="Enter product name"
                name="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price (₹)</FormLabel>
              <Input
                placeholder="Enter price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="https://example.com/image.jpg"
                name="image"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Enter product description (optional)"
                name="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={4}
              />
            </FormControl>

            <Button 
              colorScheme="blue" 
              onClick={handleAddProduct} 
              w="full" 
              size="lg"
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;