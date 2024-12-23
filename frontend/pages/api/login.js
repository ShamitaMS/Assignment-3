export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      const error = await response.json();
      return res.status(400).json({ message: error.detail });
    }
  }
}
  