import { BASE_URL } from "@/libs/api/auth";
import InsertButton from "@/src/components/chat/InsertButton";
import InsertInput from "@/src/components/chat/InsertInput";
import Message from "@/src/components/chat/Message";
import Profile from "@/src/components/chat/Profile";
import RunBeatLogo from "@/src/components/common/RunBeatLogo";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { connectSocket, getSocket } from "@/src/utils/socket";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ChatRoomScreenProps = {
  roomId?: number;
};

type ChatMessage = {
  messageId: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  photoUrl?: string | null;
};

const ChatRoomScreen = ({ roomId: propRoomId }: ChatRoomScreenProps) => {
  const { roomId: queryRoomId } = useLocalSearchParams();
  const chatId = Number(propRoomId ?? queryRoomId);
  const accessToken = useAuthStore((s) => s.accessToken);
  const myAccountId = useAuthStore((s) => s.accountId);

  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [cursor, setCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async () => {
    console.log("📡 fetchMessages 호출됨", { chatId, isLoading, hasMore });
    if (!chatId || isLoading || !hasMore) {
      console.log("요청 조건 불충분으로 fetchMessages 중단됨");
      return;
    }
    setIsLoading(true);

    const query = cursor ? `&cursor=${cursor}` : "";

    try {
      const res = await fetch(
        `${BASE_URL}/chats/messages?roomId=${chatId}${query}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const json = await res.json();
      console.log("🧾 전체 응답 json:", json);
      if (res.ok && json.success) {
        const newMessages: ChatMessage[] = json.data ?? [];
        console.log("newMessages:", newMessages);
        console.log("응답 메시지 개수:", newMessages.length);
        console.log(
          "응답 메시지 ID 목록:",
          newMessages.map((m) => m.messageId)
        );

        setMessages((prev) => [...newMessages.reverse(), ...prev]);

        if (newMessages.length > 0) {
          const oldest = newMessages[newMessages.length - 1];
          console.log("가장 오래된 메시지 ID:", oldest.messageId);
          setCursor(oldest.messageId);
        }

        if (newMessages.length < 20) {
          setHasMore(false);
          console.log("더 불러올 메시지 없음");
        }
      }
    } catch (err) {
      console.error("메시지 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
    console.log("현재 cursor:", cursor);
    console.log(
      "요청 URL:",
      `${BASE_URL}/chats/messages?roomId=${chatId}${
        cursor ? `&cursor=${cursor}` : ""
      }`
    );
  };

  const handleSend = () => {
    const socket = getSocket();
    if (!socket || !inputText.trim() || myAccountId == null) return;

    socket.emit("message.send", {
      chatId,
      content: inputText.trim(),
    });

    setInputText("");
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY <= 0 && hasMore && !isLoading) {
      fetchMessages();
    }
  };

  useEffect(() => {
    connectSocket();
    console.log("useEffect 실행됨, chatId:", chatId);

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.emit("join.room", { chatId });

      socket.on("message.receive", (data: ChatMessage) => {
        if (data.chatId === chatId) {
          setMessages((prev) => [...prev, data]);
        }
      });
    }

    return () => {
      getSocket()?.off("message.receive");
    };
  }, [chatId]);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessageId = messages[messages.length - 1].messageId;
    const socket = getSocket();

    if (socket && chatId && lastMessageId && myAccountId !== null) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== myAccountId) {
        socket.emit("message.read", {
          chatId,
          lastReadMessageId: lastMessageId,
        });

        console.log("읽음 처리 요청:", {
          chatId,
          lastReadMessageId: lastMessageId,
          senderId: lastMessage.senderId,
          myAccountId,
        });
      } else {
        console.log("내가 보낸 메시지라 읽음 처리하지 않음");
      }
    }
  }, [messages, myAccountId]);

  if (!chatId || isNaN(chatId)) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>채팅방 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const getTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <RunBeatLogo />
      </View>

      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollPage}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
          bounces={false}
          overScrollMode="never"
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {isLoading && (
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Text style={{ color: "#999" }}>로딩 중...</Text>
            </View>
          )}

          {(() => {
            let lastDate = "";

            return messages.map((msg, index) => {
              const msgDate = msg.createdAt.split("T")[0];
              const isSelf = msg.senderId === myAccountId;
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const isFirstInGroup =
                !prevMsg || prevMsg.senderId !== msg.senderId;

              const showDateSeparator = msgDate !== lastDate;
              if (showDateSeparator) lastDate = msgDate;

              return (
                <View key={msg.messageId}>
                  {showDateSeparator && (
                    <Text
                      style={{
                        textAlign: "center",
                        marginVertical: 10,
                        color: "#888",
                      }}
                    >
                      {formatDate(msg.createdAt)}
                    </Text>
                  )}

                  <View style={styles.messageRow}>
                    <View
                      style={[
                        styles.userMessage,
                        isSelf ? styles.rightMessage : styles.leftMessage,
                      ]}
                    >
                      {!isSelf && isFirstInGroup ? (
                        <Profile width={40} height={40} uri={msg.photoUrl} />
                      ) : (
                        !isSelf && <View style={{ width: 40 }} />
                      )}

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                      >
                        {isSelf && (
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#888",
                              marginRight: 6,
                              alignSelf: "flex-end",
                            }}
                          >
                            {getTime(msg.createdAt)}
                          </Text>
                        )}

                        <Message content={msg.content} fromSelf={isSelf} />

                        {!isSelf && (
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#888",
                              marginLeft: 6,
                              alignSelf: "flex-end",
                            }}
                          >
                            {getTime(msg.createdAt)}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              );
            });
          })()}
        </ScrollView>

        <View style={styles.insertWrapper}>
          <InsertInput value={inputText} onChangeText={setInputText} />
          <InsertButton onPress={handleSend} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollPage: {
    width: "100%",
    backgroundColor: "#C3D8FF",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  messageRow: {
    width: "100%",
    display: "flex",
  },
  userMessage: {
    maxWidth: "80%",
    gap: 10,
    marginBottom: 13,
    alignItems: "flex-end",
  },
  leftMessage: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  rightMessage: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  insertWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
    paddingBottom: 26,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#C3D8FF",
  },
});

export default ChatRoomScreen;
