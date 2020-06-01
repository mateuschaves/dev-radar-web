import React, { useEffect, useState } from 'react';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import api from './services/api';

function App() {

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {

      },
      {
        timeout: 30000
      });

    getDevs();
  }, []);


  async function handleAddDev(e) {
    e.preventDefault();

    await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    });

    getDevs();

    setGithubUsername('');
    setTechs('');
  }

  async function getDevs() {
    try {
      const { data } = await api.get('/devs');
      setDevs(data);

    } catch (error) {
      console.log(error);
    }
  }

  function renderDev() {
    return devs.map(({ name, bio, avatar_url, techs, github_username }) => {
      techs = techs.join(', ');
      return (
        <li className="dev-item" key={github_username}>
          <header>
            <img src={avatar_url} alt="Mateus Henrique" />
            <div className="user-info">
              <strong>{name}</strong>
              <span>{techs}</span>
            </div>
          </header>
          <p>{bio}</p>
          <a href={`https://github.com/${github_username}`}>Acessar perfil no github</a>
        </li>
      )
    })
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>

          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input name="github_username" id="username_github" required value={github_username} onChange={e => setGithubUsername(e.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input name="techs" id="techs" required value={techs} onChange={e => setTechs(e.target.value)} />
          </div>

          <div className="input-group">

            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input type="number" name="latitude" id="latitude" required value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input type="number" name="longitude" id="longitude" required value={longitude} onChange={e => setLatitude(e.target.value)} />
            </div>

          </div>

          <button type="submit"> Salvar </button>
        </form>
      </aside>
      <main>

        <ul>
          {renderDev()}
        </ul>
      </main>
    </div>
  );
}

export default App;
