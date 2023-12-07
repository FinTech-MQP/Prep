import { QuestionsMap } from "@monorepo/utils";
import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY";
import {
  OPENAI_ASSISTANT_ID_CHATTER,
  OPENAI_ASSISTANT_ID_PERMITTER,
  permittingQuestions,
} from "@monorepo/utils/constants";
import { ListingPayload } from "database";
import { cleanForAI } from "@monorepo/utils/functions";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const assistant_permits = await openai.beta.assistants.retrieve(
  OPENAI_ASSISTANT_ID_PERMITTER
);

const assistant_chatbox = await openai.beta.assistants.retrieve(
  OPENAI_ASSISTANT_ID_CHATTER
);

export default class OpenAI_API {
  public static async analyze(data: ListingPayload) {
    try {
      const cleanData = cleanForAI(data);
      const thread = await openai.beta.threads.create();

      const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Here is your data: ${JSON.stringify(
          cleanData,
          null,
          0
        )} and here are your questions: ${permittingQuestions}. Ensure to answer EVERY question (do not ommit a single one) and format your response in a JSON with these interfaces: 
        interface QuestionData {
          Answer: string;
          Explanation: string;
        }
        
        interface QuestionsMap {
          [question: string]: QuestionData;
        }.`,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant_permits.id,
      });

      let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      const messages = await openai.beta.threads.messages.list(thread.id);

      return messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop()?.content[0].text.value; //ignore this ts error
    } catch (error) {
      console.error("Error querying OpenAI:", error);
    }
  }

  public static async initializeConversation() {
    try {
      const thread = await openai.beta.threads.create();
      return thread.id;
    } catch (error) {
      console.error("Error initializing conversation with OpenAI:", error);
      return "";
    }
  }

  public static async converse(
    threadID: string,
    analysis: QuestionsMap,
    data: ListingPayload,
    input: string
  ) {
    try {
      const cleanData = cleanForAI(data);
      await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: `Here is data relating to a specific listing: ${JSON.stringify(
          cleanData,
          null,
          0
        )} and here is an analysis of the data in the realm of permitting: ${JSON.stringify(
          analysis,
          null,
          0
        )}. Be prepared to answer any questions or address any concerns to the best of your ability based on the data provided.`,
      });

      const message = await openai.beta.threads.messages.create(threadID, {
        role: "user",
        content: input,
      });

      const run = await openai.beta.threads.runs.create(threadID, {
        assistant_id: assistant_chatbox.id,
      });

      let runStatus = await openai.beta.threads.runs.retrieve(threadID, run.id);

      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 100));
        runStatus = await openai.beta.threads.runs.retrieve(threadID, run.id);
      }

      const messages = await openai.beta.threads.messages.list(threadID);

      return messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop()?.content[0].text.value; //ignore this ts error
    } catch (error) {
      console.error("Error querying OpenAI:", error);
    }
  }
}
