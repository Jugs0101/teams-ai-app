"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [sanitizedResponse, setSanitizedResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSanitizedResponse(DOMPurify.sanitize(response));
  }, [response]);

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
  <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8 text-gray-900">
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

      <h1 className="text-3xl font-bold text-black mb-2">
        Intellek Teams AI LMS Assistant
      </h1>

      <p className="text-gray-900 mb-6">
        Ask a question and receive a response from your AI service.
      </p>

      <div className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything..."
          className="
            w-full
            h-40
            p-4
            border
            rounded-xl
            text-black
            placeholder:text-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Submit"}
        </button>
      </div>

      <div
        className="bg-gray-50 border rounded-xl p-4 break-words text-black mt-6 prose prose-sm max-w-none [&_a]:text-blue-500 [&_a]:hover:underline"
        dangerouslySetInnerHTML={{ __html: sanitizedResponse }}
      />

    </div>
  </main>
);
}