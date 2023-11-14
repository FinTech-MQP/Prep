import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY";
import { ListingPayload } from "database";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const assistant = await openai.beta.assistants.retrieve(
  "asst_LkIZXhCrOK5qaG2APJQJMFbM"
);

interface CriteriaChecklistItem {
  question: string;
}

interface AnswerOutput {
  [question: string]: {
    answer: string | null;
    reason: string;
    summary: string;
  };
}

export default class OpenAI_API {
  /*
  public static async testAPI(data: ListingPayload) {
    try {
      const thread = await openai.beta.threads.create();

      const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Here is your data : ${JSON.stringify(
          data,
          null,
          0
        )}, please summarize it.`,
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      while (runStatus.status !== "completed") {
        console.log("not done yet");
        await new Promise((resolve) => setTimeout(resolve, 100));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      const messages = await openai.beta.threads.messages.list(thread.id);

      console.log(
        messages.data
          .filter(
            (message) =>
              message.run_id === run.id && message.role === "assistant"
          )
          .pop()?.content[0].text.value //ignore this ts error
      );
    } catch (error) {
      console.error("Error querying OpenAI:", error);
    }
  }*/

  public static async getAnswersAndExplanations(
    dataObject: ListingPayload,
    criteriaChecklist: CriteriaChecklistItem[]
  ): Promise<AnswerOutput> {
    const results: AnswerOutput = {};

    for (const item of criteriaChecklist) {
      const dataString = JSON.stringify(dataObject);

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: ``,
            },
          ],
        });

        if (response.choices[0]?.message.content) {
          const parsedResponse =
            response.choices[0]?.message.content.split("Reason:");
          const answerPart = parsedResponse[0];
          const reasonAndSummary = parsedResponse[1]?.split("Summary:");
          const reason = reasonAndSummary[0]?.trim();
          const summary = reasonAndSummary[1]?.trim();

          results[item.question] = {
            answer: answerPart.trim(),
            reason,
            summary,
          };
        }
      } catch (error) {
        console.error("Error querying OpenAI:", error);
        results[item.question] = {
          answer: "Error",
          reason: "An error occurred while querying the OpenAI API.",
          summary: "",
        };
      }
    }

    return results;
  }
}
