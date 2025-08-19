import { Container, HStack } from '@chakra-ui/react'
import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { PlusSquareIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import { IoMoon } from 'react-icons/io5'
import { LuSun } from 'react-icons/lu'



const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Container maxW={"1140px"} px={4}> 
        <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexDir={{
            base: 'column',
            sm: 'row'
        }}>

        <Text
        fontSize={{base: "22", sm: "28"}}
        fontweight="bold"
        textTransform="uppercase"
        textAlign="center"
        bgGradient="linear(to-r, teal.500, green.500)"
        bgClip="text"
        >
            <Link to={"/"}>Product Store 🛒</Link>

        </Text>

        <HStack spacing={2} alignItems={"center"} justifyContent="center">
            <Link to={"/create"}>
            <Button>
                <PlusSquareIcon fontSize={20}/>
            </Button>
            </Link>
            <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <IoMoon/>: <LuSun size="20"/>}
            </Button>
        </HStack>

        </Flex>
    </Container>
  )
}

export default Navbar