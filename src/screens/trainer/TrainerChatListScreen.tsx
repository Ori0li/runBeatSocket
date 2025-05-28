import { BASE_URL } from "@/libs/api/auth";
import Profile from "@/src/components/chat/Profile";
import RunBeatLogo from "@/src/components/common/RunBeatLogo";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { getSocket } from "@/src/utils/socket";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ChatRoom = {
  chatId: number;
  userId: number;
  userName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  photoUrl: string | null;
};

const TrainerChatListScreen = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  useEffect(() => {
    console.log("🧾 토큰 시작");
    const socket = getSocket();
    if (!socket) return;

    const handleRoomListUpdate = (updatedRooms: ChatRoom[]) => {
      setRooms(updatedRooms);
    };

    socket.on("roomList.update", handleRoomListUpdate);
    console.log("🧾 토큰 끝");
    return () => {
      socket.off("roomList.update", handleRoomListUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chats/rooms`, {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
        });

        const json: {
          success: boolean;
          message: string;
          data: ChatRoom[];
        } = await res.json();

        if (res.ok && json.success) {
          setRooms(json.data);
        } else {
          console.error("채팅방 목록 불러오기 실패:", json.message);
        }
      } catch (error) {
        console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>
      <View style={{ padding: 20 }}>
        <RunBeatLogo />
      </View>
      <ScrollView>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.chatId}
            onPress={() =>
              router.push({
                pathname: "/trainer/TrainerChat",
                params: { roomId: room.chatId.toString() },
              })
            }
          >
            <View style={styles.chatContainer}>
              <View style={styles.chatList}>
                <Profile width={64} height={64} uri={room.photoUrl} />
                <View>
                  <Text style={styles.userTitle}>{room.userName}</Text>
                  <Text style={styles.contentText}>
                    {room.lastMessage ?? "(메시지 없음)"}
                  </Text>
                </View>
              </View>
              <View>
                {room.unreadCount > 0 && (
                  <View style={styles.leadbox}>
                    <Text style={styles.leadboxText}>
                      {room.unreadCount > 0 ? room.unreadCount : ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: -1,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  chatList: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  userTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
  },
  contentText: {
    color: "#A3A3A3",
  },
  leadbox: {
    color: "#FFF",
    backgroundColor: "#000541",
    borderRadius: 999,
    fontWeight: "bold",
    width: 24,
    height: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  leadboxText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default TrainerChatListScreen;
