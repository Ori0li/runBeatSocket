import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  content: string;
  fromSelf?: boolean; // 본인이 보낸 메시지 여부
};

const Message = ({ content, fromSelf = false }: Props) => {
  return (
    <View
      style={[
        styles.messageBubble,
        fromSelf ? styles.selfBubble : styles.otherBubble,
      ]}
    >
      <Text style={fromSelf ? styles.selfText : styles.otherText}>
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    position: "relative",
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  selfBubble: {
    backgroundColor: "#FFF176", // 노란색 말풍선
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: "#ffffff", // 하얀색 말풍선
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  selfText: {
    color: "#000",
    textAlign: "left",
  },
  otherText: {
    color: "#000",
    textAlign: "left",
  },
});

export default Message;
