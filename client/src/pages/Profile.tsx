import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Divider,
} from "@chakra-ui/react";
import { getProfile, updateProfile } from "../api/user";
import AppHeader from "../components/AppHeader";
import type { User } from "../types";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userData = await getProfile();
        setUser(userData);
        setName(userData.name);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const dataToUpdate: {
      name: string;
      password?: string;
      password_confirmation?: string;
    } = {
      name: name,
    };

    if (password) {
      if (password !== passwordConfirmation) {
        toast({
          title: "パスワードが一致しません",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsUpdating(false);
        return;
      }
      dataToUpdate.password = password;
      dataToUpdate.password_confirmation = passwordConfirmation;
    }

    try {
      const updatedUser = await updateProfile(dataToUpdate);

      setUser(updatedUser);
      setName(updatedUser.name);

      toast({
        title: "プロフィールを更新しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setPassword("");
      setPasswordConfirmation("");
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "更新に失敗しました",
          description: e.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8} pt={0}>
        <AppHeader title="プロフィール設定" />
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8} pt={0}>
        <AppHeader title="エラー" />
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} pt={0}>
      <AppHeader title="プロフィール設定" />

      <Container maxW="container.md">
        <Box
          as="form"
          onSubmit={handleSubmit}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="sm"
        >
          <VStack spacing={6}>
            <Heading size="md" w="full">
              プロフィールの更新
            </Heading>

            <FormControl isRequired>
              <FormLabel>名前</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email (変更不可)</FormLabel>
              <Input
                type="email"
                value={user?.email || ""}
                isDisabled
                bg="gray.100"
              />
            </FormControl>

            <Divider />

            <Heading size="sm" w="full">
              パスワードの変更（変更する場合のみ）
            </Heading>

            <FormControl>
              <FormLabel>新しいパスワード</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="変更する場合のみ入力"
              />
            </FormControl>

            <FormControl>
              <FormLabel>新しいパスワード（確認用）</FormLabel>
              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              alignSelf="flex-start"
              isLoading={isUpdating}
            >
              更新する
            </Button>
          </VStack>
        </Box>
      </Container>
    </Container>
  );
};

export default Profile;
