"use client";

export default function TestChatButton() {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "Ik wil mijn huis verkopen zonder makelaar, is dat verstandig?",
            },
          ],
          pageContext: {
            pathname: "/",
            pageType: "home",
          },
        }),
      });

      const data = await res.json();
      console.log("CHAT TEST:", data);
      alert(data.reply || data.error || "Geen antwoord ontvangen.");
    } catch (error) {
      console.error("CHAT TEST ERROR:", error);
      alert("Er ging iets mis bij het testen van de chatbot.");
    }
  };

  return (
    <div className="bg-white p-10 text-center">
      <button
        onClick={handleClick}
        className="rounded-xl bg-black px-6 py-3 text-white"
      >
        Test chatbot
      </button>
    </div>
  );
}