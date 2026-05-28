export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, score, profileTitle, profileDescription, profileInvitation } = req.body;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f9f4ec; color: #3a2f28;">
      <h1 style="font-size: 28px; margin-bottom: 8px;">Hola, ${name || 'hola'} 💛</h1>
      <p style="font-size: 15px; color: #6b5d52;">Tu test de autoestima ya tiene resultado.</p>
      <div style="background: white; border-radius: 16px; padding: 24px; margin: 24px 0; border-left: 4px solid #b07560;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #b07560; margin: 0 0 8px;">Tu perfil</p>
        <h2 style="font-size: 22px; margin: 0 0 12px;">${profileTitle}</h2>
        <p style="font-size: 14px; line-height: 1.7; color: #5a4d43;">${profileDescription}</p>
        <p style="font-size: 14px; color: #8a7868;">Puntaje: <strong>${score}/40</strong></p>
      </div>
      <div style="background: #fdf6ed; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #b07560; margin: 0 0 8px;">Tu siguiente paso</p>
        <p style="font-style: italic; font-size: 16px; color: #3a2f28;">${profileInvitation}</p>
      </div>
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e6d6c3; font-size: 12px; color: #9b8b7c;">
        <p>Con cariño,<br/><strong>Lic. Psi. Camila Pizzani</strong><br/>@asesoramientopsi · SanaMente Consulta</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'SanaMente Consulta <hola@sanamenteconsulta.com>',
        to: email,
        subject: `${name ? name + ', tu' : 'Tu'} perfil de autoestima está aquí 💛`,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
