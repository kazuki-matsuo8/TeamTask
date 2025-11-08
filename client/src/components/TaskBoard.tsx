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
import type { Task, TaskStatus, User } from "../types";
import CreateTaskModal from "./CreateTaskModal"; 

type TaskWithUser = Task & { users: User[] | null };

type Props = {
  teamId: string;
  members: User[];
};

const TaskBoard: React.FC<Props> = ({ teamId, members }) => {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getTasks(teamId); // ⬅️ TaskWithUser[] が返ってくる
        setTasks(tasksData); // ⬅️ そのままセット
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [teamId]);
  
  const filterTasksByStatus = (
    status: TaskStatus
  ): (Task & { users: User[] | null })[] => {
    return tasks.filter((task) => task.status === status);
  };

  const todoTasks = filterTasksByStatus("todo");
  const inprogressTasks = filterTasksByStatus("inprogress");
  const doneTasks = filterTasksByStatus("done");

  const handleTaskCreated = (newTask: TaskWithUser) => {
    setTasks(prevTasks => [...prevTasks, newTask]); 
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box>
      <Box mb={6}>
        <Button colorScheme="green" onClick={onOpen}>
          ＋ 新しいタスクを追加
        </Button>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <TaskColumn title="未着手" tasks={todoTasks} />
        <TaskColumn title="作業中" tasks={inprogressTasks} />
        <TaskColumn title="完了" tasks={doneTasks} />
      </SimpleGrid>

      <CreateTaskModal
        isOpen={isOpen}
        onClose={onClose}
        teamId={teamId}
        members={members}
        onCreateSuccess={handleTaskCreated} 
      />
    </Box>
  );
};

// --- カラム表示用のサブコンポーネント ---
type TaskColumnProps = {
  title: string;
  tasks: TaskWithUser[];
};

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks }) => {
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
          >
            <Text fontWeight="bold">{task.title}</Text>
            <Text fontSize="sm" color="gray.500">
              担当: {task.users && task.users.length > 0 ? task.users.map(u => u.name).join(', ') : '未割り当て'}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TaskBoard;
