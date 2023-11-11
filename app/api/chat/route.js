import { NextResponse } from "next/server";
import { createUserMessageInThread, createOrFindAssistant, getSessionThread, getThreadMessagesById, submitToolOutputs, getActiveRun, createRun, waitUntilNextStep } from "@/app/api/intelligent";

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

      console.log(run.required_action?.submit_tool_outputs?.tool_calls)
      if (run.required_action && run.required_action.type === "submit_tool_outputs") {
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls
        const toolOutputs = []
        for (let i = 0; i < toolCalls.length; i++) {
          if (toolCalls[i].function.name.startsWith("ui_")) {
            const functionName = toolCalls[i].function.name.replace("ui_", "")
            const actionReponse = {
              action: functionName,
              actionArgs: JSON.parse(toolCalls[i].function.arguments)
            }
            controller.enqueue(encoder.encode(JSON.stringify(actionReponse)))
          }

          toolOutputs.push({
            tool_call_id: toolCalls[i].id,
            output: "{success: true}"
          })
        }

        const toolOutputRun = await submitToolOutputs(thread.id, run.id, toolOutputs)
        await waitUntilNextStep(toolOutputRun, thread.id)
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

export async function GET() {
  const thread = await getSessionThread()
  const messages = await getThreadMessagesById(thread.id)
  return NextResponse.json({ messages }, { status: 200 })
}