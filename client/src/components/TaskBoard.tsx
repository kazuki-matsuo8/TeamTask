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
} from "@chakra-ui/react";
import { getTasks } from "../api/task";
import type { Task, User } from "../types";
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
        />
        <TaskColumn
          title="作業中"
          tasks={inprogressTasks}
          onTaskClick={handleTaskClick}
        />
        <TaskColumn
          title="完了"
          tasks={doneTasks}
          onTaskClick={handleTaskClick}
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

// --- カラム表示用のサブコンポーネント ---
type TaskColumnProps = {
  title: string;
  tasks: TaskWithUser[];
  onTaskClick: (task: TaskWithUser) => void;
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onTaskClick,
}) => {
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
            <Text fontWeight="bold">{task.title}</Text>
            <Text fontSize="sm" color="gray.500">
              担当:{" "}
              {task.users && task.users.length > 0
                ? task.users.map((u) => u.name).join(", ")
                : "未割り当て"}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TaskBoard;
