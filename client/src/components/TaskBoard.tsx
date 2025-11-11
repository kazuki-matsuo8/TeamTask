import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Button,
  useDisclosure,
  SimpleGrid,
  HStack,
  Spacer,
  Tag,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { getTasks, updateTask } from "../api/task";
import type { Task, User, TaskStatus } from "../types";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

type TaskWithUser = Task & { users: User[] | null };

type Props = {
  teamId: string;
  members: User[];
};

const TaskBoard: React.FC<Props> = ({ teamId, members }) => {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isDetailsModalOpen,
    onOpen: onDetailsModalOpen,
    onClose: onDetailsModalClose,
  } = useDisclosure();

  const [selectedTask, setSelectedTask] = useState<TaskWithUser | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getTasks(teamId);
        setTasks(tasksData);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [teamId]);

  const handleUpdateStatus = async (
    taskToUpdate: TaskWithUser,
    newStatus: TaskStatus
  ) => {
    try {
      const updatedTaskData = await updateTask(teamId, taskToUpdate.id, {
        status: newStatus,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskData.id
            ? { ...task, ...updatedTaskData }
            : task
        )
      );

      toast({
        title: `タスク「${updatedTaskData.title}」を「${
          newStatus === "inprogress" ? "作業中" : "完了"
        }」に移動しました。`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "ステータスの更新に失敗しました",
          description: e.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  };

  const getApiStatus = (displayStatus: string): Task["status"] => {
    const reverseMap: Record<string, Task["status"]> = {
      未着手: "todo",
      進行中: "inprogress",
      完了: "done",
    };
    return reverseMap[displayStatus] || "todo";
  };

  const filterTasksByStatus = (
    displayStatus: "未着手" | "進行中" | "完了"
  ): TaskWithUser[] => {
    const apiStatus = getApiStatus(displayStatus);
    return tasks.filter((task) => task.status === apiStatus);
  };

  const todoTasks = filterTasksByStatus("未着手");
  const inprogressTasks = filterTasksByStatus("進行中");
  const doneTasks = filterTasksByStatus("完了");

  const handleTaskCreated = (newTask: TaskWithUser) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskClick = (task: TaskWithUser) => {
    setSelectedTask(task);
    onDetailsModalOpen();
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box>
      <Box mb={6}>
        <Button colorScheme="green" onClick={onCreateModalOpen}>
          ＋ 新しいタスクを追加
        </Button>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <TaskColumn
          title="未着手"
          tasks={todoTasks}
          onTaskClick={handleTaskClick}
          onUpdateTaskStatus={handleUpdateStatus}
          nextStatus="inprogress"
        />
        <TaskColumn
          title="作業中"
          tasks={inprogressTasks}
          onTaskClick={handleTaskClick}
          onUpdateTaskStatus={handleUpdateStatus}
          nextStatus="done"
        />
        <TaskColumn
          title="完了"
          tasks={doneTasks}
          onTaskClick={handleTaskClick}
          onUpdateTaskStatus={handleUpdateStatus}
          nextStatus={null}
        />
      </SimpleGrid>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        teamId={teamId}
        members={members}
        onCreateSuccess={handleTaskCreated}
      />
      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={onDetailsModalClose}
        task={selectedTask}
        teamId={teamId}
        members={members}
        onTaskListUpdated={setTasks}
      />
    </Box>
  );
};

type TaskColumnProps = {
  title: string;
  tasks: TaskWithUser[];
  onTaskClick: (task: TaskWithUser) => void;
  onUpdateTaskStatus: (task: TaskWithUser, newStatus: TaskStatus) => void;
  nextStatus: TaskStatus | null;
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onTaskClick,
  onUpdateTaskStatus,
  nextStatus,
}) => {
  const handleNextStatusClick = (e: React.MouseEvent, task: TaskWithUser) => {
    e.stopPropagation();
    if (nextStatus) {
      onUpdateTaskStatus(task, nextStatus);
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) {
      return <Tag size="sm">期日未設定</Tag>;
    }

    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return <Tag size="sm">期日不明</Tag>;
      }
      return (
        <Tag size="sm" colorScheme="gray">
          {date.toLocaleDateString()}
        </Tag>
      );
    } catch {
      return <Tag size="sm">期日不明</Tag>;
    }
  };

  return (
    <Box bg="gray.100" p={4} borderRadius="md" w="100%" minH="500px">
      <Heading size="md" mb={4}>
        {title} ({tasks.length})
      </Heading>
      <VStack align="start" spacing={3}>
        {tasks.map((task) => (
          <Box
            key={task.id}
            bg="white"
            p={3}
            borderRadius="md"
            w="full"
            boxShadow="sm"
            onClick={() => onTaskClick(task)}
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
          >
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold" noOfLines={2} flex="1">
                {task.title}
              </Text>

              {nextStatus && (
                <IconButton
                  aria-label="次のステータスへ"
                  icon={<ArrowRightIcon />}
                  size="xs"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={(e) => handleNextStatusClick(e, task)}
                  ml={2}
                />
              )}
            </HStack>

            <HStack mb={2} spacing={3}>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                担当:{" "}
                {task.users && task.users.length > 0
                  ? task.users.map((u) => u.name).join(", ")
                  : "未割り当て"}
              </Text>
              <Spacer />
              {formatDeadline(task.deadline)}
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TaskBoard;
