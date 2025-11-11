import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
  VStack,
  Button,
  Text,
  Spinner,
  Divider,
  Heading,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import { fetchDashboardData } from "../api/dashboard";
import type { Team } from "../types";
type SideMenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoadingTeams(true);
      fetchDashboardData()
        .then((data) => setMyTeams(data.my_teams))
        .catch((e) => console.error("チーム一覧の取得に失敗:", e))
        .finally(() => setLoadingTeams(false));
    }
  }, [isOpen]);

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>メニュー</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" spacing={4}>
            <Button
              as={Link}
              to="/"
              onClick={onClose}
              variant="ghost"
              justifyContent="flex-start"
            >
              ダッシュボード
            </Button>
            <Button
              as={Link}
              to="/profile"
              onClick={onClose}
              variant="ghost"
              justifyContent="flex-start"
            >
              プロフィール設定
            </Button>
            <Divider />
            <Text fontWeight="bold" fontSize="lg">
              所属チーム
            </Text>
            {loadingTeams ? (
              <Spinner />
            ) : (
              <VStack align="stretch" spacing={2}>
                {myTeams.map((team) => (
                  <Button
                    key={team.id}
                    as={Link}
                    to={`/teams/${team.id}`}
                    onClick={onClose}
                    variant="ghost"
                    justifyContent="flex-start"
                  >
                    {team.name}
                  </Button>
                ))}
              </VStack>
            )}
            <Button
              as={Link}
              to="/teams/new"
              onClick={onClose}
              colorScheme="blue"
              variant="outline"
            >
              ＋ 新しいチームを作成
            </Button>
          </VStack>
        </DrawerBody>
        <Box p={4} borderTopWidth="1px">
          <Button colorScheme="red" w="full" onClick={onLogout}>
            ログアウト
          </Button>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

type AppHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    onClose();
    navigate("/login");
  };

  return (
    <>
      <HStack
        bg="white"
        p={4}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex="sticky"
        mb={6}
      >
        <IconButton
          aria-label="メニューを開く"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
        />
        <Heading>{title}</Heading>
        <Spacer />
        {children}
      </HStack>

      <SideMenuDrawer
        isOpen={isOpen}
        onClose={onClose}
        onLogout={handleLogout}
      />
    </>
  );
};

export default AppHeader;
