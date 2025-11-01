import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../api/team";
import type { TeamData } from "../types";

const NewTeam = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isFormValid = name !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data: TeamData = {
      name,
      description,
    };

    try {
      const createdTeam = await createTeam(data);

      alert("チームが作成されました");
      navigate(`/teams/${createdTeam.id}`);
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
              新しいチームを作成
            </Heading>

            {error && (
              <Text color="red" w="full">
                {error}
              </Text>
            )}
            <FormControl isRequired width="100%">
              <FormLabel>チーム名</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="lg"
              />
            </FormControl>
            <FormControl width="100%">
              <FormLabel>説明</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              チームを作成
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};
export default NewTeam;
