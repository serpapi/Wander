import { NextResponse } from "next/server";
import { createUserMessageInThread, createOrFindAssistant, getSessionThread, getThreadMessagesById, submitToolOutputs, getActiveRun, createRun, waitUntilNextStep, deleteThreadById } from "@/app/api/intelligent";
import { createSessionCookie } from "../session";
import { mapSearch } from "../search_api";

export async function POST(request) {
  const payload = await request.json();

  const assistant = await createOrFindAssistant()
  const thread = await getSessionThread()

  const encoder = new TextEncoder()
  const customReadable = new ReadableStream({
    async start(controller) {
      let run = await getActiveRun(thread.id)
      if (!run) {
        await createUserMessageInThread(thread.id, payload.message)
        run = await createRun(assistant.id, thread.id)
        run = await waitUntilNextStep(run, thread.id)
      }

      while (run.required_action && run.required_action.type === "submit_tool_outputs") {
        console.log(run.required_action?.submit_tool_outputs?.tool_calls)
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls
        const toolOutputs = []
        for (let i = 0; i < toolCalls.length; i++) {
          const functionName = toolCalls[i].function.name
          const functionArgs = JSON.parse(toolCalls[i].function.arguments)
          let functionOutput = "{success: true}"
          if (functionName.startsWith("ui_")) {
            const actionReponse = {
              action: functionName.replace("ui_", ""),
              actionArgs: functionArgs
            }
            // All the chunk will combined for some cases, thus not able to parse the JSON
            // <--JSON allow use to split and parse correctly
            controller.enqueue(encoder.encode(`${JSON.stringify(actionReponse)}<--JSON`))
          } else {
            functionOutput = await handleToolCall(functionName, functionArgs)
          }

          toolOutputs.push({
            tool_call_id: toolCalls[i].id,
            output: functionOutput
          })
        }

        const toolOutputRun = await submitToolOutputs(thread.id, run.id, toolOutputs)
        run = await waitUntilNextStep(toolOutputRun, thread.id)
      }
      
      const messages = await getThreadMessagesById(thread.id)
      controller.enqueue(encoder.encode(JSON.stringify({ messages })))
      controller.close()
    }
  })

  return new Response(customReadable, {
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function handleToolCall(functionName, functionArgs) {
  if (functionName === "mapSearch") {
    const results = await mapSearch(functionArgs.query, functionArgs.latitude, functionArgs.longitude)
    return JSON.stringify(results)
  }
}

export async function GET() {
  const thread = await getSessionThread()
  const messages = await getThreadMessagesById(thread.id)
  return NextResponse.json({ messages }, { status: 200 })
}

export async function DELETE() {
  const thread = await getSessionThread()
  await deleteThreadById(thread.id)

  const sessionCookie = await createSessionCookie()
  return new NextResponse("OK", { 
    status: 200,
    headers: { 'Set-Cookie': sessionCookie }
  })
}