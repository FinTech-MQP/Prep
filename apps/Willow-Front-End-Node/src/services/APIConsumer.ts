import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY";
import {
  OPENAI_ASSISTANT_ID,
  permittingQuestions,
} from "@monorepo/utils/constants";
import { ListingPayload } from "database";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const assistant = await openai.beta.assistants.retrieve(
  "asst_XHOPVJFngzpWKcY7XOFamIsA" //Permitter
);

export default class OpenAI_API {
  public static async generateDesc(data: ListingPayload) {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const assistant =
      await openai.beta.assistants.retrieve(OPENAI_ASSISTANT_ID);

    try {
      const thread = await openai.beta.threads.create();

      const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Here is your data : ${JSON.stringify(
          data,
          null,
          0
        )} and here are your questions: ${permittingQuestions}`,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
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
}
