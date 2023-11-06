import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY"; //cannot be uploaded to github
import { Listing } from "database/generated/prisma-client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
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

export default async function getAnswersAndExplanations(
  dataObject: Listing,
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
            content: `Given the following data: ${dataString}\n\nQuestion: ${item.question}\n\nAnswer the question and provide a reason for your answer, followed by a brief summary of the relevant data that led to this answer. Mark each section with either 'Answer:', 'Reason:', or 'Summary:'.`,
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

/* Example usage:
(async () => {
  const data = {

  };
  const checklist: CriteriaChecklistItem[] = [
    { question: "What is the impact of X on Y?" },
    // ...more questions
  ];

  const answers = await getAnswersAndExplanations(data, checklist);
  console.log(answers);
})();*/
