import OpenAI from "openai";
import { getSession } from "./session";

const openai = new OpenAI();

export async function getMessages() {
  const thread = await getSessionThread()
  return getThreadMessagesById(thread.id)
}

export async function addQuestion(question) {
  const assistant = await createOrFindAssistant()
  const thread = await getSessionThread()
  
  await createUserMessageInThread(thread.id, question)
  const run = await runUntilNextStep(assistant.id, thread.id)
  
  return getThreadMessagesById(thread.id)
}

async function getSessionThread() {
  const session = await getSession()
  if (!session) {
    throw new "Session hasn't initiated."
  }
  
  const thread = await getThreadById(session.thread_id)
  if (!thread) {
    throw new "Thread not found."
  }

  return thread
}

async function runUntilNextStep(assistantId, threadId) {
  const run = await openai.beta.threads.runs.create(
    threadId,
    {
      assistant_id: assistantId
    }
  )

  // Check running status
  let lastesRun = await openai.beta.threads.runs.retrieve(threadId, run.id)
  while(lastesRun.status === "queued" || lastesRun.status === "in_progress") {
    lastesRun = await openai.beta.threads.runs.retrieve(threadId, run.id)
  }

  return lastesRun
}

async function createUserMessageInThread(threadId, message) {
  return openai.beta.threads.messages.create(
    threadId,
    {
      role: "user",
      content: message
    }
  )
}

async function getThreadById(id) {
  try {
    return openai.beta.threads.retrieve(id)
  } catch (e) {
    return null
  }
}

async function getThreadMessagesById(threadId) {
  try {
    const { data } = await openai.beta.threads.messages.list(threadId)
    return data
  } catch {
    return []
  }
}

async function createOrFindAssistant() {
  try {
    const { data } = await openai.beta.assistants.list()
    const assistant = data.find(assistant => assistant.metadata?.created_by === "wander")
    if (assistant) return assistant
    return openai.beta.assistants.create({
      name: "Expert Travel Guide",
      instructions: "You are a very experience travel guide who know places all around the world. You can suggest the best places to go in any city. You also can provide detail location like GPS Coordinates that help user to navigate.",
      tools: [{type: "function"}],
      model: "gpt-4-1106-preview",
      description: "Made with Wander",
      metadata: {
        created_by: "wander"
      }
    })
  } catch {
    return null
  }
}