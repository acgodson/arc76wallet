import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Center,
  VStack,
  Box,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import EmailPasswordInputGroup from "./inputs";

const SignUpModalFC = ({
  isOpen,
  onClose,
  modalState,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  modalState: string;
  password: string;
  handleInputChange: any;
  onSubmit: (password: string) => void;
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(password);
  };

  const renderContent = () => {
    switch (modalState) {
      case "UNLOCK":
        return (
          <div>
            <EmailPasswordInputGroup
              password={password}
              handleInputChange={(e: any) => setPassword(e.target.value)}
              setShowPassword={() => true}
              showPassword={false}
            />
            <Box w="100%" pt={8}>
              <Button
                h="50px"
                borderRadius={"25px"}
                bgGradient="linear(to-l, #9b67e6, #01a0e1)"
                _hover={{ bg: "linear(to-r, #9b67e6, #001221)" }}
                w="100%"
                bg={"primary"}
                onClick={handleSubmit}
              >
                Unlock Account
              </Button>
              <Center mt={4}>
                <Button
                  variant={"link"}
                  leftIcon={<FaSignOutAlt />}
                  as="button"
                  fontWeight={"semibold"}
                  py={4}
                  color={"#9a68e6"}
                  onClick={onClose}
                >
                  Sign out
                </Button>
              </Center>
            </Box>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent
        pos={"relative"}
        maxW={"container.xs"}
        mt={32}
        w="100%"
        bg={"#1a1b1d"}
        borderRadius={"35px"}
      >
        <ModalHeader
          fontSize="xl"
          fontWeight="light"
          pos={"relative"}
          zIndex={1}
          color={modalState === "ACCOUNT" ? "green.500" : "whitesmoke"}
          textAlign={"center"}
          letterSpacing={"1.25px"}
        >
          <Center w="100%">
            <Box
              h="30px"
              style={{
                scale: 1,
              }}
              w="auto"
              as="img"
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
            />
          </Center>
          Welcome Back
        </ModalHeader>

        <ModalBody bg="#1a1b1d" pos={"relative"} zIndex={1}>
          {renderContent()}
        </ModalBody>

        <ModalFooter
          pos={"relative"}
          zIndex={1}
          display={"flex"}
          gap={8}
          mt={4}
          w="100%"
        />
      </ModalContent>
    </Modal>
  );
};

export default SignUpModalFC;
