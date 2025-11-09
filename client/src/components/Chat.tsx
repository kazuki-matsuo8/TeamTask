import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Spinner,
  FormControl,
  FormErrorMessage,
  HStack,
} from "@chakra-ui/react";
import { createCableConsumer } from "../utils/cable";
import { fetchMessages, createMessage } from "../api/chat";
import type { Message } from "../types";
import { jwtDecode } from "jwt-decode";

type Props = {
  teamId: string;
};

type JwtPayload = {
  user_id: number;
};

const Chat: React.FC<Props> = ({ teamId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setCurrentUserId(decoded.user_id);
      } catch (e) {
        console.error("JWTデコードエラー:", e);
      }
    }

    const loadMessages = async () => {
      try {
        setLoading(true);
        const history = await fetchMessages(teamId);
        setMessages(history.reverse());
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    const cleanup = createCableConsumer(teamId, {
      onReceived: (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      },
    });

    return () => {
      cleanup();
    };
  }, [teamId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      // POSTリクエストでメッセージを送信
      // （成功すると、バックエンドが全員にブロードキャストしてくれる）
      await createMessage(teamId, newMessage);
      setNewMessage(""); // 送信フォームをクリア
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box>
      <VStack
        spacing={4}
        align="stretch"
        p={4}
        borderWidth={1}
        borderRadius="md"
        h="60vh"
        overflowY="auto"
        bg="white"
      >
        {messages.map((msg) => {
          const isMyMessage = currentUserId === msg.user.id;

          return (
            <Box
              key={msg.id}
              alignSelf={isMyMessage ? "flex-end" : "flex-start"}
              bg={isMyMessage ? "blue.100" : "gray.100"}
              p={2}
              borderRadius="lg"
              maxWidth="70%"
              boxShadow="sm"
            >
              <Text
                fontSize="sm"
                color="gray.600"
                textAlign={isMyMessage ? "right" : "left"}
              >
                {msg.user.name} -{" "}
                {new Date(msg.created_at).toLocaleTimeString("ja-JP")}
              </Text>
              <Text textAlign={isMyMessage ? "right" : "left"}>
                {msg.content}
              </Text>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </VStack>

      {error && (
        <Text color="red.500" w="full">
          {error}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <HStack mt={4}>
          <FormControl isInvalid={!!error}>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力..."
              bg="white"
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            送信
          </Button>
        </HStack>
      </form>
    </Box>
  );
};

export default Chat;
