// frontend/src/components/Navbar.jsx
import {
  Container,
  Flex,
  HStack,
  Text,
  Button,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Box,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiExternalLink } from "react-icons/fi";
import useAuthStore from "../store/auth";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const publicStoreUrl = user ? `/store/${user.username}` : "";

  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        {/* Logo */}
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            Product Store 🛒
          </Link>
        </Text>

        {/* Navigation */}
        <HStack spacing={2} alignItems={"center"}>
          {/* Color Mode Toggle */}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />

          {isAuthenticated ? (
            // Authenticated User Menu
            <>
              <Button
                as={Link}
                to="/create"
                variant="outline"
                colorScheme="blue"
                size="sm"
                leftIcon={<FiPlus fontSize="16" />}
                display={{ base: "none", md: "flex" }}
              >
                Add Product
              </Button>

              <Menu>
                <MenuButton as={Button} variant="ghost" size="sm">
                  <HStack spacing={2}>
                    <Avatar size="sm" name={user?.username} bg="blue.500" />
                    <Text display={{ base: "none", md: "block" }}>
                      {user?.username}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <Box px={3} py={2}>
                    <Text fontWeight="bold">{user?.username}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {user?.storeName}
                    </Text>
                  </Box>
                  <MenuDivider />
                  
                  <MenuItem 
                    as={Link} 
                    to="/dashboard" 
                    icon={<FiHome />}
                  >
                    Dashboard
                  </MenuItem>
                  
                  <MenuItem 
                    as={Link} 
                    to="/create" 
                    icon={<FiPlus />}
                  >
                    Add Product
                  </MenuItem>

                  {publicStoreUrl && (
                    <MenuItem 
                      as={Link} 
                      to={publicStoreUrl}
                      icon={<FiExternalLink />}
                    >
                      View Public Store
                    </MenuItem>
                  )}
                  
                  <MenuDivider />
                  
                  <MenuItem 
                    onClick={handleLogout} 
                    icon={<FiLogOut />}
                    color="red.400"
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            // Guest User Buttons
            <HStack spacing={2}>
              <Button
                as={Link}
                to="/login"
                variant="ghost"
                size="sm"
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                colorScheme="blue"
                size="sm"
              >
                Sign Up
              </Button>
            </HStack>
          )}
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;