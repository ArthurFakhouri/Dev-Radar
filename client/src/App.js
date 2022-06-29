import { useEffect, useState } from 'react';
import DevItem from './components/DevItem'
import DevForm from './components/DevForm'
import api from './services/api';
import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

function App() {

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const res = await api.get('/devs');

      setDevs(res.data);
    }
    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const res = await api.post('/devs', data);

    setDevs([...devs, res.data]);
  }

  async function handleDelete(github_username) {
    await api.delete(`/devs/?github_username=${github_username}`)
    let arrayDevs = devs.filter(dev => dev.github_username !== github_username);

    setDevs(arrayDevs);
  }

  return (
    <div id='app'>
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} onDelete={handleDelete}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
