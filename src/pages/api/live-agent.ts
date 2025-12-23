import { NextApiRequest, NextApiResponse } from 'next';
import { StreamClient } from '@stream-io/node-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { meetingId, agentId } = req.body;

  if (!meetingId || !agentId) {
    return res.status(400).json({ message: 'Missing meetingId or agentId' });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ message: 'Stream API key or secret not set' });
    }

    const client = new StreamClient(apiKey, apiSecret);

    // Create a user for the agent
    const agentUser = {
      id: agentId,
      name: 'AI Agent',
      role: 'bot',
    };
    await client.upsertUsers([agentUser]);

    // Add the agent to the call
    const call = client.video.call('default', meetingId);
    await call.goLive(agentId);

    res.status(200).json({ message: 'Agent joined successfully' });
  } catch (error) {
    console.error('Error joining agent to call:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
