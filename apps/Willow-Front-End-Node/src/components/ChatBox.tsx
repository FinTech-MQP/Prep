import React, { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  styled,
} from "@mui/material";
import { WILLOW_COLOR, WILLOW_COLOR_HOVER } from "@monorepo/utils";

const styles = {
  mainContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  chatText: {
    width: "100%",
  },
  list: {
    marginBottom: "60px",
  },
  messageBox: {
    backgroundColor: "white",
    bottom: "56px",
    position: "fixed",
    display: "flex",
    flexDirection: "row",
  },
};

const WillowButton_Chat = styled(Button)({
  height: "56px",
  borderRadius: 0,
  backgroundColor: WILLOW_COLOR,
  color: "white",
  whiteSpace: "nowrap",
  width: "fit-content",
  padding: "0 25px 0 25px",
  "&:hover": {
    backgroundColor: WILLOW_COLOR_HOVER,
    borderColor: WILLOW_COLOR,
  },
  "& .MuiTouchRipple-root": {
    color: "white",
  },
});

interface Message {
  sender: "user" | "api";
  content: string;
}

async function fetchYourAPI(input: string): Promise<string> {
  // Implement API call here
  // Example: return fetch('your-api-url', { method: 'POST', body: JSON.stringify({ message: input }) })
  // .then(response => response.json())
  // .then(data => data.reply);
  return "API response for: " + input; // Placeholder
}

const ChatBox: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleInputChange = (data: string) => {
    setInput(data);
    sendMessage(input);
  };

  const sendMessage = async (messageInput: string) => {
    const userMessage: Message = { sender: "user", content: messageInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Replace with your API call
    const apiResponse = await fetchYourAPI(messageInput);
    const apiMessage: Message = { sender: "api", content: apiResponse };
    setMessages((prevMessages) => [...prevMessages, apiMessage]);

    setInput("");
  };

  return (
    <Box sx={styles.mainContainer}>
      <List sx={styles.list}>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={message.content}
              secondary={message.sender === "user" ? "You" : "API"}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={styles.messageBox}>
        <TextField
          variant="outlined"
          placeholder="Enter your email"
          value={input}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          sx={styles.chatText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleInputChange((e.target as HTMLInputElement).value);
            }
          }}
        />
        <WillowButton_Chat onClick={sendMessage}>
          Stay Updated
        </WillowButton_Chat>
      </Box>
    </Box>
  );
};

export default ChatBox;
