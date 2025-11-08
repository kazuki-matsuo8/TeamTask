import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Select,
  Input,
  Textarea,
  useToast,
  VStack,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import type { User, Task } from "../types";
import React, { useState, useEffect } from "react";
import { updateTask, deleteTask, getTasks } from "../api/task";

type TaskWithUser = Task & { users: User[] | null };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithUser | null;
  teamId: string;
  members: User[];
  onTaskListUpdated?: (tasks: TaskWithUser[]) => void;
};

const TaskDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  task,
  teamId,
  members,
  onTaskListUpdated,
}) => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<{
    title: string;
    content: string;
    deadline: string;
    status: string;
    user_ids: number[];
  }>({
    title: "",
    content: "",
    deadline: "",
    status: "",
    user_ids: [],
  });

  useEffect(() => {
    if (isEditing && task) {
      setEditedTask({
        title: task.title,
        content: task.content || "",
        deadline: task.deadline?.split("T")[0] || "",
        status: task.status,
        user_ids: task.users?.map((u) => u.id) || [],
      });
    } else if (!isEditing) {
      setEditedTask({
        title: "",
        content: "",
        deadline: "",
        status: "todo",
        user_ids: [],
      });
    }
  }, [isEditing, task]);

  if (!task) {
    return null;
  }

  const assignees =
    task.users && task.users.length > 0
      ? task.users.map((u: User) => u.name).join(", ")
      : "未割当";

  const deadlineText = task.deadline
    ? (() => {
        try {
          return new Date(task.deadline).toLocaleDateString();
        } catch {
          return String(task.deadline);
        }
      })()
    : "未設定";

  const refreshTasks = async () => {
    try {
      const updatedTasks = await getTasks(teamId);
      if (onTaskListUpdated) {
        onTaskListUpdated(updatedTasks);
      }
    } catch (err) {
      console.error("Failed to refresh tasks:", err);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask(teamId, task.id, { status: newStatus });
      toast({
        title: "ステータスを更新しました",
        status: "success",
        duration: 3000,
      });
      await refreshTasks();
    } catch (err) {
      console.error("Status update error:", err);
      toast({
        title: "ステータスの更新に失敗しました",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      const updatedTaskData = await updateTask(teamId, task.id, editedTask);
      task.title = updatedTaskData.title;
      task.content = updatedTaskData.content;
      task.deadline = updatedTaskData.deadline;
      task.status = updatedTaskData.status;
      task.users = updatedTaskData.users;

      setIsEditing(false);
      toast({
        title: "タスクを更新しました",
        status: "success",
        duration: 3000,
      });
      await refreshTasks();
    } catch (err) {
      console.error("Task update error:", err);
      toast({
        title: "タスクの更新に失敗しました",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("このタスクを削除してもよろしいですか？")) {
      try {
        await deleteTask(teamId, task.id);
        await refreshTasks();
        toast({
          title: "タスクを削除しました",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } catch (err) {
        console.error("Task delete error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "タスクの削除に失敗しました";
        toast({
          title: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {isEditing ? (
              <>
                <Input
                  value={editedTask.title}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                  placeholder="タスク名"
                />
                <Box>
                  <Text mb={2}>担当者:</Text>
                  <Stack spacing={2}>
                    {members.map((member) => (
                      <Checkbox
                        key={member.id}
                        isChecked={editedTask.user_ids.includes(member.id)}
                        onChange={(e) => {
                          const newUserIds = e.target.checked
                            ? [...editedTask.user_ids, member.id]
                            : editedTask.user_ids.filter(
                                (id) => id !== member.id
                              );
                          setEditedTask({
                            ...editedTask,
                            user_ids: newUserIds,
                          });
                        }}
                      >
                        {member.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
                <Textarea
                  value={editedTask.content}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, content: e.target.value })
                  }
                  placeholder="タスクの詳細"
                />
                <Input
                  type="date"
                  value={editedTask.deadline || ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, deadline: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <Text>担当者: {assignees}</Text>
                <Box>
                  <Text mb={2}>ステータス:</Text>
                  <Select
                    value={
                      task.status === "todo"
                        ? "未着手"
                        : task.status === "inprogress"
                        ? "進行中"
                        : "完了"
                    }
                    onChange={(e) => {
                      const statusMap: Record<string, Task["status"]> = {
                        未着手: "todo",
                        進行中: "inprogress",
                        完了: "done",
                      };
                      handleStatusChange(statusMap[e.target.value]);
                    }}
                  >
                    <option value="未着手">未着手</option>
                    <option value="進行中">進行中</option>
                    <option value="完了">完了</option>
                  </Select>
                </Box>
                <Text>期限日: {deadlineText}</Text>
                <Box p={2} bg="gray.50" borderRadius="md">
                  <Text>{task.content || "詳細は設定されていません"}</Text>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
            <>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>
                保存
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setIsEditing(true)}
              >
                編集
              </Button>
              <Button colorScheme="red" mr={3} onClick={handleDelete}>
                削除
              </Button>
              <Button variant="ghost" onClick={onClose}>
                閉じる
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
