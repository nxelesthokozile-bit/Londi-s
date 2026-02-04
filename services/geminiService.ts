
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";

// Always use process.env.API_KEY directly when initializing GoogleGenAI.
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
};

export const generateMarketInsights = async (prompt: string): Promise<{ text: string, sources: any[] }> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    // Use gemini-3-pro-preview for complex reasoning and grounding tasks.
    model: 'gemini-3-pro-preview',
    contents: `Research current market trends, competitors, and audience sentiment for this business idea: "${prompt}". Provide a strategic summary.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text || '',
    sources: sources.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri)
  };
};

export const generateCampaignText = async (prompt: string, insights: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a senior content strategist. Based on the seed idea: "${prompt}" and these market insights: "${insights}", create a comprehensive blog post and a social media strategy. Output the response in Markdown format.`,
    config: {
      temperature: 0.7,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  return response.text || '';
};

export const generatePitchScript = async (prompt: string, insights: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a compelling 2-minute elevator pitch and a technical showcase script for a marketing campaign based on: "${prompt}". 
    The pitch should highlight the unique value proposition and the insights used: "${insights}". 
    Structure it for a professional presentation.`,
    config: {
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  return response.text || '';
};

export const generateCampaignImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `High-quality commercial marketing visual for: ${prompt}. Professional lighting, 4k, studio quality, sleek design.` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const generateCampaignAudio = async (text: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say with a professional and welcoming brand voice: ${text.substring(0, 300)}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
};

export const generateCampaignVideo = async (prompt: string, onProgress: (msg: string) => void): Promise<string> => {
  // Creating a new GoogleGenAI instance right before making an API call ensures it uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  onProgress("Initializing cinematic engine...");
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Professional cinematic brand commercial for: ${prompt}. Slow pan, 4k resolution feel, marketing aesthetic.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    onProgress("Synthesizing motion frames...");
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed at output stage");
  
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const decodePCM = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodePCM = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
