
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getSheepCommentary = async (status: 'lost' | 'start' | 'stuck') => {
  try {
    const prompt = status === 'lost' 
      ? "玩家在探险中氧气耗尽（输了）。给一句幽默感十足的、带点科技感的嘲讽。使用深海相关的谐音梗。"
      : status === 'start'
      ? "玩家开始了深海遗迹探索。用冷酷的AI语调提醒他们成功回收遗迹的概率不到0.1%。"
      : "玩家卡住了。给一个充满神秘感的探测提示。";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "你是一个名为'深蓝'的遗迹探索助手AI。你说话冷静但带有一丝毒舌和幽默，喜欢用潜水术语和数据分析的语气。",
        temperature: 0.9,
      }
    });

    return response.text?.trim() || "系统已就绪，探测深度：10,000米。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "由于电磁干扰，语音系统异常。请专注回收遗迹。";
  }
};
