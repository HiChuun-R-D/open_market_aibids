import { useState, useEffect } from 'react';

export default function Models() {
  const [models, setModels] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetch('http://localhost:3000/models')
      .then(res => res.json())
      .then(setModels);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    });
    const data = await res.json();
    if (res.ok) {
      setModels([...models, { id: data.id, title, description }]);
      setTitle('');
      setDescription('');
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Models</h1>
      {token ? (
        <form onSubmit={handleCreate}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <button type="submit">Create</button>
        </form>
      ) : <p>Login to create models</p>}
      <ul>
        {models.map(m => (
          <li key={m.id}>{m.title}</li>
        ))}
      </ul>
    </div>
  );
}
