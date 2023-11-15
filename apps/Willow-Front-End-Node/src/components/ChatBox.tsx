import { useContext, useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  styled,
  CircularProgress,
} from "@mui/material";
import { WILLOW_COLOR, WILLOW_COLOR_HOVER } from "@monorepo/utils";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import OpenAI_API from "../services/APIConsumer";
import { userContext } from "../App";

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
    height: "fit-content",
  },
  messageBox: {
    width: "100%",
    backgroundColor: "white",
    bottom: 0,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
  },
  scroller: {
    width: "100%",
    height: 0,
  },
  loadingBox: {
    width: "100%",
    height: "calc(100% - 200px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
  },
};

const ListContainer = styled(Box)({
  height: "calc(100% - 56px)",
  overflowY: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: `${WILLOW_COLOR}`,
  "&::-webkit-scrollbar": {
    width: "2px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: `${WILLOW_COLOR}`,
    borderRadius: "20px",
    border: "none",
  },
});

interface Message {
  sender: "user" | "api";
  content: string;
}

interface ChatBoxProps {
  currentPage: boolean;
}

const ChatBox = ({ currentPage }: ChatBoxProps) => {
  const user = useContext(userContext);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationID, setConverstionID] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    OpenAI_API.initializeConversation().then((result: string) => {
      setConverstionID(result);
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && currentPage)
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [messages]);

  const handleInputChange = (data: string) => setInput(data);

  async function conversationAPI(input: string): Promise<string> {
    try {
      if (user.currListing)
        OpenAI_API.converse(
          conversationID,
          user.currAnalysis,
          user.currListing,
          input
        ).then((result: string) => {
          return result;
        });
    } catch (e: any) {
      console.log(e);
    }
    return "I'm sorry, I can't answer that right now.";
  }

  const sendMessage = async (messageInput: string) => {
    const userMessage: Message = { sender: "user", content: messageInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      setIsLoading(true);
      const apiResponse = await conversationAPI(messageInput);
      const apiMessage: Message = { sender: "api", content: apiResponse };
      setMessages((prevMessages) => [...prevMessages, apiMessage]);
    } catch (e: any) {
      console.log(e);
    }

    setIsLoading(false);

    setInput("");
  };

  const WillowButton_Chat = styled(Button)(({ disabled }) => ({
    height: "56px",
    borderRadius: 0,
    backgroundColor: disabled ? "#ccc" : WILLOW_COLOR,
    color: "white",
    whiteSpace: "nowrap",
    width: "fit-content",
    padding: "0 25px 0 25px",

    "&:hover": {
      backgroundColor: disabled ? "#ccc" : WILLOW_COLOR_HOVER,
      borderColor: WILLOW_COLOR,
    },
    "& .MuiTouchRipple-root": {
      color: "white",
    },
  }));

  return (
    <Box sx={styles.mainContainer}>
      <ListContainer>
        <List sx={styles.list}>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.sender === "user" ? "You" : "Willow [AI]"}
                secondary={message.content}
              />
            </ListItem>
          ))}
          <Box sx={styles.scroller} ref={messagesEndRef} />
        </List>
      </ListContainer>

      <Box sx={styles.messageBox}>
        <Button variant="contained" color="primary">
          <ArrowDownwardIcon fontSize="large" />
          Downward
        </Button>

        <TextField
          variant="outlined"
          placeholder="Chat with Willow [AI]"
          value={input}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          sx={styles.chatText}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              sendMessage(input);
            }
          }}
        />
        <WillowButton_Chat
          onClick={() => {
            sendMessage(input);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Box sx={styles.loadingBox}>
              <CircularProgress />
            </Box>
          ) : (
            "Send"
          )}
        </WillowButton_Chat>
      </Box>
    </Box>
  );
};

export default ChatBox;
