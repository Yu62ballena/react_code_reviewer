import { useState } from "react";
import openai from "./lib/openai";
import geminiOpe from "./lib/gemini";
import Markdown from "react-markdown";
import { Helmet } from "react-helmet";

const prompt = `
  あなたは20年以上のキャリアがあるフルスタックエンジニアです。
  今から渡されるコードの
  ・問題点の指摘
  ・問題点を修正し、より簡潔にしたコード
  ・修正点の説明
  をそれおぞれ別々でMarkdown形式かつ、タイトル部分を###で出力してください。
  問題点の指摘や修正点の説明は、プログラミング初心者にもわかるように、詳しく背景を質問してください。
`;

function App() {
  const [content, setContent] = useState("");
  const [gptResult, setGptResult] = useState("");
  const [geminiResult, setGeminiResult] = useState("");
  const [gptIsLoading, setGptIsLoading] = useState(false);
  const [geminiIsLoading, setGeminiIsLoading] = useState(false);

  const wholePrompt = prompt + content;

  // chatGPT用の処理
  const chatGptReview = async () => {
    const messages = [
      {
        role: "user",
        content: wholePrompt,
      },
    ];

    setGptIsLoading(true);

    try {
      const result = await openai.completion(messages);
      setGptResult(result);
    } catch {
      setGptResult("取得できませんでした。");
    }

    setGptIsLoading(false);
  };

  // Geminiの処理
  const geminiReview = async () => {
    setGeminiIsLoading(true);

    const geminiRes = await geminiOpe(wholePrompt);
    setGeminiResult(geminiRes);

    setGeminiIsLoading(false);
  };

  // chatGPTとGeminiをまとめて実行
  const summaryReview = () => {
    chatGptReview();
    geminiReview();
  };

  return (
    <>
      <Helmet>
        <title>Code Reviewer</title>
      </Helmet>

      {/* <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center"> */}
      <main className="flex flex-col sm:flex-row w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
        <header className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-900">AI Code Reviewer（by Google Gemini）</h1>
        </header>
        <main className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
          <div className="flex flex-col w-1/2 h-full bg-gray-900 overflow-y-auto">
            <div className="flex-1 p-4 text-white">
              <textarea onChange={(e) => setContent(e.target.value)} className="h-full w-full bg-transparent text-white resize-none outline-none" />
            </div>
            <button onClick={summaryReview} disabled={geminiIsLoading && gptIsLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              {geminiIsLoading && gptIsLoading ? "レビュー中・・・" : "レビューする"}
            </button>
          </div>

          {/* chatGPTの返答 */}
          {/* <div className="flex flex-col w-1/2 h-full items-center justify-center">
            <div className="p-4 overflow-y-auto w-full">
              {gptIsLoading ? "レビュー中・・・" : <Markdown className="markdown">{gptResult}</Markdown>}
            </div>
          </div> */}

          {/* Geminiの返答 */}
          <div className="flex flex-col w-1/2 h-full items-center justify-center">
            <div className="p-4 overflow-y-auto w-full">{geminiIsLoading ? "レビュー中・・・" : <Markdown className="markdown">{geminiResult}</Markdown>}</div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
