import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Input,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { Alert } from "@chakra-ui/alert";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { signUp } from "../api/auth";
import type { SignUpData } from "../types";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isFormValid =
    name !== "" &&
    email !== "" &&
    password !== "" &&
    passwordConfirmation !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    const data: SignUpData = {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      // APIを呼び出す
      await signUp(data);
      alert("登録に成功しました");
      navigate("/");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <Container
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={8}
        w="100%"
        maxW="md"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <form onSubmit={handleSubmit}>
          <VStack gap={6} width="100%">
            <Heading size="lg" textAlign="center">
              新規登録
            </Heading>

            {error && <Alert status="error" color="red.500">{error}</Alert>}

            <FormControl isRequired width="100%">
              <FormLabel
                requiredIndicator={<span style={{ color: "red.500" }}>*</span>}
              >
                名前
              </FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                width="100%"
                size="lg"
                h="50px"
                fontSize="md"
              />
            </FormControl>
            <FormControl isRequired width="100%">
              <FormLabel
                requiredIndicator={<span style={{ color: "red.500" }}>*</span>}
              >
                メールアドレス
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width="100%"
                size="lg"
                h="50px"
                fontSize="md"
              />
            </FormControl>
            <FormControl isRequired width="100%">
              <FormLabel
                requiredIndicator={<span style={{ color: "red.500" }}>*</span>}
              >
                パスワード
              </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                width="100%"
                size="lg"
                h="50px"
                fontSize="md"
              />
            </FormControl>
            <FormControl isRequired width="100%">
              <FormLabel
                requiredIndicator={<span style={{ color: "red.500" }}>*</span>}
              >
                パスワード（確認用）
              </FormLabel>
              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                width="100%"
                size="lg"
                h="50px"
                fontSize="md"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              disabled={!isFormValid}
              _disabled={{
                bg: "gray.300",
                cursor: "not-allowed",
              }}
              size="lg"
              width="full"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
            >
              登録する
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
