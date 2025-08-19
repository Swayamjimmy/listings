import { EditIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import React from 'react'
import { Image, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useProductStore } from '../store/product';
import { useToast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { Button, VStack, Input } from '@chakra-ui/react';
import { useState } from 'react';



const ProductCard = ({product}) => {
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
    const bg= useColorModeValue('white', 'gray.700');

    const {deleteProduct, updateProduct} = useProductStore();
    const toast = useToast();

    const {isOpen, onOpen, onClose} = useDisclosure();

    const handleDeleteProduct = async (id) => {
        const {success, message} = await deleteProduct(id);
        if (!success) {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            toast({
                title: 'Success',
                description: message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const handleUpdateProduct = async (id, updatedProduct) => {
        const {success,message} = await updateProduct(id, updatedProduct);
        onClose();
        if (!success) {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            toast({
                title: 'Success',
                description: message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        }
    }

  return (
    <Box
    shadow='lg'
    rounded='lg'
    overflow="hidden"
    transition="all 0.2s ease-in-out"
    _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
    bg={bg}
    >
        <Image
            src={product.image}
            alt={product.name}
            width="100%"
            h={48}
            objectFit="cover"
        />
        <Box p={4}>
            <Heading as='h3' size='md' mb={2}>
                {product.name}
            </Heading>
            <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
                ₹{product.price}
            </Text>

            <HStack spacing={2}>
                <IconButton icon={<EditIcon/>} onClick={onOpen} colorScheme='blue'/>
                <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme='red' />
            </HStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}   >
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
                                onChange={(e) => setUpdatedProduct({...updatedProduct, name: e.target.value})}
                                />
                                <Input
                                placeholder="Product Price"
                                name="price"
                                type="number"
                                value={updatedProduct.price}
                                onChange={(e) => setUpdatedProduct({...updatedProduct, price: e.target.value})}
                                />
                                <Input
                                placeholder="Image URL"
                                name="image"                                        
                                value={updatedProduct.image}
                                onChange={(e) => setUpdatedProduct({...updatedProduct, image: e.target.value})}
                                />
                                </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='green' onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
                        Update
                    </Button>
                    <Button ml={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </Box>
  )
}

export default ProductCard;