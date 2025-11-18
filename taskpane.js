Office.onReady(() => {
    document.getElementById("sendBtn").onclick = sendToNotion;
});

async function sendToNotion() {
    const status = document.getElementById("status");

    try {
        const item = Office.context.mailbox.item;

        const subject = item.subject;
        const from = item.from.displayName + " <" + item.from.emailAddress + ">";
        const date = item.dateTimeCreated;

        const body = await item.body.getAsync("text");

        const payload = {
            subject,
            from,
            date,
            body: body.value
        };

        const res = await fetch("https://localhost:3000/api/notion/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        status.innerText = data.success ? "Sent!" : "Failed.";
    } catch (err) {
        status.innerText = "Error: " + err.message;
    }
}
