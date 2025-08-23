// frontend/src/components/ProductCard.jsx
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useProductStore } from "../store/product";

const ProductCard = ({ product, showEditButtons = true }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  
  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProduct = async (pid) => {
    const result = await deleteProduct(pid);
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const result = await updateProduct(pid, updatedProduct);
    onClose();
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
      border="1px"
      borderColor={borderColor}
    >
      <Image 
        src={product.image} 
        alt={product.name} 
        h={48} 
        w="full" 
        objectFit="cover" 
      />

      <Box p={4}>
        <VStack align="stretch" spacing={3}>
          <Heading as="h3" size="md" mb={2}>
            {product.name}
          </Heading>

          {product.description && (
            <Text fontSize="sm" color={textColor} noOfLines={2}>
              {product.description}
            </Text>
          )}

          <HStack justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              ₹{product.price}
            </Text>
            
            {product.owner && (
              <Badge colorScheme="gray" size="sm">
                by {product.owner.username}
              </Badge>
            )}
          </HStack>

          {showEditButtons && (
            <HStack spacing={2}>
              <IconButton
                icon={<FiEdit2 />}
                onClick={onOpen}
                colorScheme="blue"
                variant="outline"
                size="sm"
                flex={1}
                aria-label="Edit product"
              />
              <IconButton
                icon={<FiTrash2 />}
                onClick={() => handleDeleteProduct(product._id)}
                colorScheme="red"
                variant="outline"
                size="sm"
                flex={1}
                aria-label="Delete product"
              />
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Update Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                }
              />
              <Input
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, image: e.target.value })
                }
              />
              <Textarea
                placeholder="Product Description (optional)"
                name="description"
                value={updatedProduct.description || ''}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, description: e.target.value })
                }
                rows={3}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;