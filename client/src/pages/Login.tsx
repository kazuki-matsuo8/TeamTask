import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Alert } from "@chakra-ui/alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { login } from "../api/auth";
import type { LoginData } from "../types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isFormValid: boolean = email !== "" && password !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data: LoginData = {
      email,
      password,
    };

    try {
      // APIを呼び出す
      const response = await login(data);
      // 受け取ったJWTをローカルストレージに保存
      localStorage.setItem("token", response.token);
      alert("ログインに成功しました");
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
              ログイン
            </Heading>

            {error && <Alert status="error">{error}</Alert>}

            <FormControl isRequired width="100%">
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
              />
            </FormControl>
            <FormControl isRequired width="100%">
              <FormLabel>パスワード</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
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
              ログイン
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
