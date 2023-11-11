import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY";
import { ListingPayload } from "database";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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
  public static async testAPI(data: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: data,
          },
        ],
      });

      console.log(response);
    } catch (error) {
      console.error("Error querying OpenAI:", error);
    }
  }

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
