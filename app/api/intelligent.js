import OpenAI from "openai";
import { getSession } from "./session";

const openai = new OpenAI();

export async function getSessionThread() {
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

export async function createRun(assistantId, threadId) {
  return await openai.beta.threads.runs.create(
    threadId,
    {
      assistant_id: assistantId
    }
  )
}

export async function waitUntilNextStep(run, threadId) {
  // Check running status
  let lastesRun = await openai.beta.threads.runs.retrieve(threadId, run.id)
  while(lastesRun.status === "queued" || lastesRun.status === "in_progress") {
    lastesRun = await openai.beta.threads.runs.retrieve(threadId, run.id)
  }

  return lastesRun
}

export async function submitToolOutputs(threadId, runId, outputs) {
  return openai.beta.threads.runs.submitToolOutputs(
    threadId,
    runId,
    {
      tool_outputs: outputs
    }
  )
}

export async function getActiveRun(threadId) {
  try {
    const { data } = await openai.beta.threads.runs.list(threadId)
    return data.find(run => run.status === "requires_action" || run.status === "queued" || run.status === "in_progress" || run.status === "cancelling")
  } catch {
    return null
  }
}

export async function createUserMessageInThread(threadId, message) {
  return openai.beta.threads.messages.create(
    threadId,
    {
      role: "user",
      content: message
    }
  )
}

export async function getThreadById(id) {
  try {
    return openai.beta.threads.retrieve(id)
  } catch (e) {
    return null
  }
}

export async function deleteThreadById(threadId) {
  return await openai.beta.threads.del(threadId)
}

export async function getThreadMessagesById(threadId) {
  try {
    const { data } = await openai.beta.threads.messages.list(threadId)
    return data
  } catch {
    return []
  }
}

export async function createOrFindAssistant() {
  try {
    const { data } = await openai.beta.assistants.list()
    const assistant = data.find(assistant => assistant.metadata?.created_by === "wander")
    if (assistant) return assistant
    return openai.beta.assistants.create({
      name: "Expert Travel Guide",
      instructions: "You are a very experience travel guide who know places all around the world. You can suggest the best places to go in any city. You also can provide detail location like GPS Coordinates that help user to navigate.",
      tools: [
        {
          type: "function",
          function: {
            name: "ui_addMapMarkers",
            description: "Set the marker on the map. It can accept single entry or multiple entries.",
            parameters: {
              type: "object",
              properties: {
                markers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      latitude: {type: "number", description: "Latitude of the location or place"},
                      longitude: {type: "number", description: "Longitude of the location or place"},
                    },
                    required: ["latitude", "longitude"]
                  }
                }
              },
            },
          }
        },
        {
          type: "function",
          function: {
            name: "ui_addBusinessMapMarkers",
            description: "Set the marker on the map for local businesses, e.g. restaurants, cafes, workshops, fitness centre and many more. It can accept single entry or multiple entries.",
            parameters: {
              type: "object",
              properties: {
                markers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      place_id: {type: "string", description: "The id of the business"},
                      title: {type: "string", description: "The name of the business"},
                      thumbnail: {type: "string", description: "URL to the thumbnail of the business"},
                      latitude: {type: "number", description: "Latitude of the location or place"},
                      longitude: {type: "number", description: "Longitude of the location or place"},
                    },
                    required: ["place_id", "title", "thumbnail", "latitude", "longitude"]
                  }
                }
              },
            },
          }
        },
        {
          type: "function",
          function: {
            name: "mapSearch",
            description: "Able to search nearby businesses by query. Example query like restaurants nearby Texas Capitol",
            parameters: {
              type: "object",
              properties: {
                query: {type: "string", description: "Search query"},
                latitude: {type: "number", description: "Latitude of the location or place"},
                longitude: {type: "number", description: "Longitude of the location or place"},
              },
              required: ["query"]
            },
          }
        }
      ],
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