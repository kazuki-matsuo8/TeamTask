import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Button,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Container,
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { fetchDashboardData } from "../api/dashboard";
import { acceptInvitation, rejectInvitation } from "../api/invitation";
import type { DashboardData, Invitation, UpcomingTask, Team } from "../types";
import AppHeader from "../components/AppHeader";

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Box
    p={{ base: 6, md: 10 }}
    bg="gray.50"
    borderRadius="md"
    textAlign="center"
    color="gray.500"
    border="1px dashed"
    borderColor="gray.200"
  >
    <Text>{message}</Text>
  </Box>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        if (
          e.message.includes("認証トークン") ||
          e.message.includes("Unauthorized")
        ) {
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAccept = async (invitationId: number) => {
    try {
      const team = await acceptInvitation(invitationId);
      toast({
        title: `チーム「${team.name}」に参加しました`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadData();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "招待の承諾に失敗しました",
          description: e.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleReject = async (invitationId: number) => {
    if (!window.confirm("この招待を拒否しますか？")) return;
    try {
      await rejectInvitation(invitationId);
      toast({
        title: "招待を拒否しました",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      loadData();
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "招待の拒否に失敗しました",
          description: e.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <Box
        p={8}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <AppHeader title="TeamTask">
        <Button as={RouterLink} to="/teams/new" colorScheme="blue">
          新しいチームを作成する
        </Button>
      </AppHeader>

      {dashboardData?.pending_invitations &&
        dashboardData.pending_invitations.length > 0 && (
          <Box as="section" mb={10}>
            <Heading size="lg" mb={5}>
              保留中の招待
            </Heading>
            <VStack align="stretch" spacing={4}>
              {dashboardData.pending_invitations.map((inv) => (
                <InvitationCard
                  key={inv.invitation_id}
                  invitation={inv}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </VStack>
          </Box>
        )}

      <Box as="section" mb={10}>
        <Heading size="md" mb={5}>
          所属チーム
        </Heading>
        {dashboardData?.my_teams && dashboardData.my_teams.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {dashboardData.my_teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </SimpleGrid>
        ) : (
          <EmptyState message="所属しているチームはありません。" />
        )}
      </Box>

      <Box as="section">
        <Heading size="md" mb={5}>
          近日締切のタスク (3日以内)
        </Heading>
        {dashboardData?.upcoming_tasks &&
        dashboardData.upcoming_tasks.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {dashboardData.upcoming_tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SimpleGrid>
        ) : (
          <EmptyState message="近日締切のタスクはありません。" />
        )}
      </Box>
    </Container>
  );
};

type InvitationCardProps = {
  invitation: Invitation;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
};

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onReject,
}) => {
  return (
    <Alert
      status="warning"
      variant="left-accent"
      borderRadius="md"
      boxShadow="md"
    >
      <VStack align="start" flex="1">
        <AlertTitle>チーム「{invitation.team.name}」への招待</AlertTitle>
        <AlertDescription>
          {invitation.team.description || "チームの説明はありません。"}
        </AlertDescription>
        <HStack spacing={3} mt={2}>
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => onAccept(invitation.invitation_id)}
          >
            承諾する
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => onReject(invitation.invitation_id)}
          >
            拒否する
          </Button>
        </HStack>
      </VStack>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={() => onReject(invitation.invitation_id)}
      />
    </Alert>
  );
};

type TeamCardProps = {
  team: Team;
};

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <Card
      as={RouterLink}
      to={`/teams/${team.id}`}
      _hover={{ boxShadow: "xl", transform: "translateY(-3px)" }}
      transition="all 0.2s ease-in-out"
      boxShadow="md"
      borderRadius="md"
      variant="outline"
    >
      <CardHeader>
        <Heading size="md">{team.name}</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <Text noOfLines={2} color="gray.600">
          {team.description || "説明がありません"}
        </Text>
      </CardBody>
    </Card>
  );
};

type TaskCardProps = {
  task: UpcomingTask;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const deadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : "未設定";
  const assignees =
    task.users.length > 0 ? task.users.map((u) => u.name).join(", ") : "未割当";

  return (
    <Card
      as={RouterLink}
      to={`/teams/${task.team_id}`}
      _hover={{ boxShadow: "xl", transform: "translateY(-3px)" }}
      transition="all 0.2s ease-in-out"
      boxShadow="md"
      borderRadius="md"
      variant="outline"
    >
      <CardHeader>
        <Heading size="md">{task.title}</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.600">
            <Box as="span" fontWeight="bold" color="gray.700">
              チーム:
            </Box>{" "}
            {task.team.name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <Box as="span" fontWeight="bold" color="gray.700">
              担当:
            </Box>{" "}
            {assignees}
          </Text>
        </VStack>
      </CardBody>
      <CardFooter pt={2}>
        <Text fontSize="sm" color="red.600" fontWeight="bold">
          締切: {deadline}
        </Text>
      </CardFooter>
    </Card>
  );
};

export default Dashboard;
