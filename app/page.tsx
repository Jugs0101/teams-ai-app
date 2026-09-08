"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  function renderResponse(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

  async function handleSubmit() {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const result = await fetch("https://jt-ai-api-fbf4gkckfsefctcm.ukwest-01.azurewebsites.net/api/AIQuery/lms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputMessage: question,
          tenantID: "8210EAA9-2D00-47C7-84FA-7BE0E5DD58E3",
          userID: "6CD1FBC7-1145-4D98-98E6-4C9680ABF3F7"
        }),
      });

      const data = await result.json();

      setResponse(data.response || JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("An error occurred whilst calling the AI service.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Intellek Teams AI LMS Assistant
        </h1>

        <p className="text-gray-500 mb-6">
          Ask a question and receive a response from your AI service.
        </p>

        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full h-40 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Thinking..." : "Submit"}
          </button>
        </div>

        <div className="bg-gray-50 border rounded-xl p-4 break-words">
            {response.split("\n").map((line, idx) => (
              <p key={idx} className="mb-2 whitespace-pre-wrap">
                {renderResponse(line)}
              </p>
            ))}
          </div>
      </div>
    </main>
    );
}