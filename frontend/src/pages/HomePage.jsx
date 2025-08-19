import React, { useEffect } from 'react'
import { Container, VStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'
import { SimpleGrid } from '@chakra-ui/react'
import ProductCard from '../components/ProductCard'



const HomePage = () => {
  const {fetchProducts, products} = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log("products",products);
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="center">
      <Text
        fontSize="30"
        fontWeight="bold"
        textAlign="center"
        bgGradient="linear(to-r, teal.500, blue.500)"
        bgClip="text">
          Current Products 🛍️
      </Text>

      <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={10}
      w="full"
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}

      </SimpleGrid>

      {products.length === 0 && (
        <Text fontSize="xl" textAlign="center" color="gray.600">
        No Prodects Found 😒 {" "}
        <Link to={"/create"}>
          <Text as="span" color="teal.500" _hover={{ textDecoration: 'underline' }}>
            Create a new product
          </Text>
        </Link>
      </Text>
      )}
      </VStack>
    </Container>
  )
}

export default HomePage