import { sealData, unsealData } from 'iron-session/edge';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const password = "rPmm9zQ6yPsuoECHmD21Bj4BBFKfnBjtI6js"

export async function createSessionCookie() {
  const openai = new OpenAI();
  const thread = await openai.beta.threads.create()
  const session = await sealData({ thread_id: thread.id }, { password })
  return `wander_session=${session}`
}

export async function getSession() {
  const cookieStore = cookies();
  const encryptedSession = cookieStore.get('wander_session')?.value;
  if (!encryptedSession) return null
  
  const session = await unsealData(encryptedSession, { password })
  return session
}