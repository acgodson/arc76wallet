import {  LockIcon, ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  password: string;
  showPassword: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShowPassword?: () => void;
}

const EmailPasswordInputGroup: React.FC<Props> = ({
  password,
  showPassword,
  handleInputChange,
  setShowPassword,
}) => {
  return (
    <>
      <InputGroup>
        <InputLeftElement color={"white"}>
          <LockIcon />
        </InputLeftElement>
        <Input
          h="50px"
          name="password"
          border={"0.5px solid #2d3339"}
          focusBorderColor="#9a68e6"
          borderRadius={"25px"}
          placeholder="********"
          color={"white"}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleInputChange}
          autoComplete="current-password"
        />
        <InputRightElement
          color={"white"}
          as={"button"}
          onClick={setShowPassword}
        >
          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
        </InputRightElement>
      </InputGroup>
    </>
  );
};

export default EmailPasswordInputGroup;
