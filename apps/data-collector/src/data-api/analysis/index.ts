import { Analysis, Parcel, Prisma } from "database/generated/prisma-client";
import OpenAI from "openai";
import { ListingPayload } from "packages/database/dist";
import { permittingQuestions } from "./permittingQuestions";
import { OPENAI_API_KEY } from "@monorepo/utils/API_KEY";
import {
  OPENAI_ASSISTANT_ID_CHATTER,
  OPENAI_ASSISTANT_ID_PERMITTER,
  OPENAI_ASSISTANT_ID_SUMMARIZER,
} from "@monorepo/utils/constants";
import { QuestionsMap, QuestionData } from "@monorepo/utils/interfaces";
import { cleanForAI } from "@monorepo/utils/functions";

const analysisBasicData = Prisma.validator<Prisma.AnalysisDefaultArgs>()({
  select: {
    question: true,
    answer: true,
    explanation: true,
    listingId: true,
  },
});

type AnalysisResponse = Prisma.AnalysisGetPayload<typeof analysisBasicData>;

async function analyzeListing(data: ListingPayload) {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const assistant = await openai.beta.assistants.retrieve(
    OPENAI_ASSISTANT_ID_PERMITTER
  );

  try {
    const cleanedData = cleanForAI(data);
    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Here is your data : ${JSON.stringify(
        cleanedData,
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
      assistant_id: assistant.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const content = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant"
      )
      .pop()?.content[0]; //ignore this ts error

    if (content !== undefined && "text" in content) {
      return content.text.value;
    }
  } catch (error) {
    console.error("Error querying OpenAI:", error);
  }
}

async function summarizeListing(data: ListingPayload) {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const assistant = await openai.beta.assistants.retrieve(
    OPENAI_ASSISTANT_ID_SUMMARIZER
  );

  try {
    const cleanedData = cleanForAI(data);
    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Here is your data : ${JSON.stringify(
        cleanedData,
        null,
        0
      )}, please summarize it.`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const content = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant"
      )
      .pop()?.content[0]; //ignore this ts error

    if (content !== undefined && "text" in content) {
      return content.text.value;
    }
  } catch (error) {
    console.error("Error querying OpenAI:", error);
  }
}

export interface AnalysisDataSource {
  generateAnalysis(
    listing: ListingPayload
  ): Promise<AnalysisResponse[] | undefined>;
  generateDescription(listing: ListingPayload): Promise<string | undefined>;
}

export class AnalysisAPIDataSource implements AnalysisDataSource {
  async generateAnalysis(
    listing: ListingPayload
  ): Promise<AnalysisResponse[] | undefined> {
    const result = await analyzeListing(listing);
    if (result === undefined) return undefined;

    const jsonString = result.substring(
      result.indexOf("{"),
      result.lastIndexOf("}") + 1
    );

    let analyses: AnalysisResponse[] = [];

    const analysisJson = JSON.parse(jsonString) as QuestionsMap;
    for (const [q, qdata] of Object.entries(analysisJson)) {
      analyses.push({
        question: q,
        answer: qdata.Answer,
        explanation: qdata.Explanation,
        listingId: listing.id,
      });
    }

    return analyses;
  }
  async generateDescription(
    listing: ListingPayload
  ): Promise<string | undefined> {
    return await summarizeListing(listing);
  }
}
