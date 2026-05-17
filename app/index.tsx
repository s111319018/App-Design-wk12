import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "你是一個友善可愛的聊天助手，請用繁體中文回答。",
    },
  ]);

  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: updatedMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };

      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.log("錯誤:", error.response?.data || error.message6);
    }
  };

  const renderItem = ({ item }) => {
    if (item.role === "system") return null;

    return (
      <View
        style={[
          styles.messageBubble,
          item.role === "user" ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>我的聊天室</Text>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        style={styles.chatArea}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="輸入訊息..."
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>送出</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf5",
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: "#ffd6e7",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#e7e7e7",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputArea: {
    flexDirection: "row",
    padding: 30,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#ff8fb1",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
