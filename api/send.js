export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, score } = req.body;
  console.log("Datos recibidos del test:", { email, name, score });

  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: Bearer ${process.env.MAILERLITE_API_KEY},
      },
      body: JSON.stringify({
        email: email,
        fields: { name: name },
        groups: [187125573679580933],
      }),
    });

    const data = await response.json();
    console.log("Respuesta de Mailerlite:", data);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: 'Error sending to Mailerlite' });
  }
}
