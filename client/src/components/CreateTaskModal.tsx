import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import type { User, Task } from "../types";
import { createTask } from "../api/task";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  members: User[];
  onCreateSuccess: (newTask: TaskWithUser) => void;
};

type TaskWithUser = Task & { users: User[] | null };

const CreateTaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  teamId,
  members,
  onCreateSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userIds, setUserIds] = useState<number[]>([]);
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setUserIds([]);
    setDeadline("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userIds.length === 0) {
      setError("担当者を1人以上指定してください");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const newTask = await createTask(teamId, {
        title,
        content: content || undefined,
        user_ids: userIds,
        deadline: deadline || undefined,
      });

      onCreateSuccess(newTask);
      handleClose();
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit} noValidate>
          <ModalHeader>新しいタスクを作成</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Text color="red.500" w="full">
                  {error}
                </Text>
              )}

              <FormControl isRequired>
                <FormLabel>タスク名</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>担当者（複数選択可）</FormLabel>
                <Stack
                  spacing={2}
                  p={3}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text fontSize="sm" color="gray.600">
                    {userIds.length === 0
                      ? "選択されていません"
                      : `${userIds.length}人が選択中`}
                  </Text>
                  <Stack
                    direction={["column", "row"]}
                    wrap="wrap"
                    spacing={1}
                    maxH="150px"
                    overflowY="auto"
                  >
                    {members.map((member) => (
                      <Checkbox
                        key={member.id}
                        isChecked={userIds.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserIds([...userIds, member.id]);
                          } else {
                            setUserIds(
                              userIds.filter((id) => id !== member.id)
                            );
                          }
                        }}
                        borderWidth="1px"
                        p={1}
                        borderRadius="md"
                        _checked={{
                          bg: "blue.50",
                          borderColor: "blue.500",
                        }}
                      >
                        {member.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Stack>
              </FormControl>

              <FormControl>
                <FormLabel>詳細</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>期日</FormLabel>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              キャンセル
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              disabled={!title || userIds.length === 0}
            >
              作成する
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateTaskModal;
