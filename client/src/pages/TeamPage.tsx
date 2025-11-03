import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Button,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import InviteMemberDrawer from "../components/InviteMemberDrawer";

const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const teamName = `チーム名`; // チーム名はAPIから取得するまで仮置き

  return (
    <Box p={8}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Heading>{teamName}</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          ＋ メンバーを招待
        </Button>
      </Box>

      <Box as="section">
        <Tabs>
          <TabList>
            <Tab _selected={{ color: "blue.500", borderBottom: "2px solid" }}>
              タスク一覧
            </Tab>
            <Tab _selected={{ color: "blue.500", borderBottom: "2px solid" }}>
              チームチャット
            </Tab>
            <Tab _selected={{ color: "blue.500", borderBottom: "2px solid" }}>
              メンバー管理
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box p={4}>
                <p>ここにタスク一覧のコンポーネント</p>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <p>ここにチームチャットのコンポーネント</p>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <p>ここにメンバー管理のコンポーネント</p>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* 招待用ドロワー */}
      <InviteMemberDrawer isOpen={isOpen} onClose={onClose} teamId={teamId!} />
    </Box>
  );
};

export default TeamPage;
