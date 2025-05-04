import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import axios from "axios";
import DataTable from "react-data-table-component";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [catFact, setCatFact] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [history, setHistory] = useState([]);
  const columns = [
    {
      name: "Fecha",
      selector: row => row.fechaBusqueda,
      sortable: true,
      maxWidth: "200px",
    },
    {
      name: "Texto completo",
      selector: row => row.catFact,
      sortable: true,
      maxWidth: "500px",
    },
    {
      name: "Palabras busqueda",
      sortable: true,
      selector: row => row.paramSearch
    },
    {
      name: "URL del GIF",
      cell: row => (
        <a href={row.urlGif} target="_blank" rel="noopener noreferrer">
          Ver GIF
        </a>
      )
    },
  ]
  useEffect(() => {
    fetchData();
    consultHitory();
  }, []);

  const fetchCatFact = async () => {
    const res = await axios.get("https://localhost:7274/api/fact");
    return res.data.fact;
  };
  const fetchHistory = async () => {
    const res = await axios.get(`https://localhost:7274/api/BackendGifs`)
    return res.data
  }

  const fetchGif = async (queryWords) => {
    //const apiKey = "voaNIOg1u7ONPbckzWK71C48YqCOkhVP";
    const query = queryWords;
    const res = await axios.get(
      `https://localhost:7274/api/gif?query=${queryWords}`
    );
    return res.data.gif;
  };
  
  const consultHitory = async () => {
    const history = await fetchHistory();
    setHistory(history)
  }
  const fetchData = async () => {
    const fact = await fetchCatFact();
    //const queryWords = fact.split(" ").slice(0, 3);
    const gif = await fetchGif(fact);
    const history = await fetchHistory();

    setCatFact(fact);
    setGifUrl(gif);
    setHistory(history)
  };

  const refreshGifOnly = async (catFact) => {
    //const fact1 = await fetchCatFact();
    //const queryWords = fact1.split(" ").slice(0, 3);
    const gif = await fetchGif(catFact);
    const history = await fetchHistory();
    //setCatFact(catFact);
    setGifUrl(gif);
    setHistory(history)
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)}>
        <Tab label="Resultado actual" />
        <Tab label="Historial de búsquedas" />
      </Tabs>

      {activeTab === 0 && (
        <div>
          <div class="d-flex justify-content-center">
            <img src={gifUrl} alt="GIF" className="w-64 h-64 object-contain"/>
          </div>
          <div class="d-flex justify-content-center">
            <p className="text-lg mb-4">{catFact}</p>
            </div>
          <div class="d-flex justify-content-center">
            <button variant="primary" className="px-4 py-2 rounded-pill shadow btn-gif" onClick={() => refreshGifOnly(catFact)}>
              Refrescar solo GIF
            </button>
          </div>
        </div>
      )}
      {activeTab === 1 &&(
        <div style={{ width: 'calc(100% - 20px)'}}>
          <DataTable 
          title="Historial de Gifs"
          columns={columns} data={history} 
          selectableRows 
          pagination 
          fixedHeader/>
        </div>
      )} 
    </div>
  );
};

export default App;
