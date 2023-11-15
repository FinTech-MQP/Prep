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
import {
  QuestionsMap,
  WILLOW_COLOR,
  WILLOW_COLOR_HOVER,
} from "@monorepo/utils";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import OpenAI_API from "../services/APIConsumer";
import { userContext } from "../App";
import { ListingPayload } from "database";

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
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
  },
  downContainer: {
    height: "fit-content",
    width: "100%",
    position: "absolute",
    bottom: "66px",
    display: "flex",
    justifyContent: "center",
  },
};

const DownButton = styled(Button)`
  background-color: ${WILLOW_COLOR};
  border-radius: 50%;
  height: 20px;
  width: 20px;
  min-width: 0;
  opacity: 0.2;
  &:hover {
    opacity: 1;
  }
`;

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

async function conversationAPI(
  threadID: string,
  analysis: QuestionsMap,
  listing: ListingPayload,
  input: string
): Promise<string> {
  try {
    return await OpenAI_API.converse(threadID, analysis, listing, input);
  } catch (e: any) {
    console.log(e);
    return "an error has occured.";
  }
}

const ChatBox = ({ currentPage }: ChatBoxProps) => {
  const user = useContext(userContext);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationID, setConverstionID] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    if (messagesEndRef.current && currentPage)
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  };

  useEffect(() => {
    OpenAI_API.initializeConversation().then((result: string) => {
      setConverstionID(result);
    });
  }, []);

  useEffect(() => {
    scroll();
  }, [messages]);

  const handleInputChange = (data: string) => setInput(data);

  const sendMessage = async (messageInput: string) => {
    const userMessage: Message = { sender: "user", content: messageInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    if (user.currListing)
      try {
        setIsLoading(true);
        setInput("");
        const apiResponse = await conversationAPI(
          conversationID,
          user.currAnalysis,
          user.currListing,
          messageInput
        );
        const apiMessage: Message = { sender: "api", content: apiResponse };
        setMessages((prevMessages) => [...prevMessages, apiMessage]);
      } catch (e: any) {
        console.log(e);
      }

    setIsLoading(false);
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
        {messages.length === 0 ? (
          <>hi</>
        ) : (
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
        )}
      </ListContainer>
      <Box sx={styles.downContainer}>
        <DownButton
          sx={{ height: "40px", width: "40px" }}
          variant="contained"
          onClick={scroll}
        >
          <ArrowDownwardIcon fontSize="small" />
        </DownButton>
      </Box>

      <Box sx={styles.messageBox}>
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
          disabled={isLoading || input.length === 0}
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
