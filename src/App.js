import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, [repositories]);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Novo repo ${Date.now()}`,
      url: `https://github.com/raphael/${Date.now()}`,
      techs: ['nodeJS', 'reactJS']
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const repoIndex = repositories.findIndex(repository => repository.id === id);

    if(repoIndex >= 0) {
      const response = await api.delete(`/repositories/${id}`);
      if(response.status === 204) {
        repositories.splice(repoIndex, 1);
      } else {
        console.error("Repo not found");
      }
    } else {
      console.error("Repo not found");
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
      {
        repositories.map(repository => {
          return (<li key={repository.id}>
            {repository.title}

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>) 
        })
      }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
