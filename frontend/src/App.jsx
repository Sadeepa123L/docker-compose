import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming the backend is running locally on port 3000
      const response = await fetch('http://localhost:3000/api/data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json && json.length > 0) {
        setData(json[0].text);
      } else {
        setData('No data found in database.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Docker Study</h1>
        <p className="subtitle">React Frontend + Express Backend + MySQL</p>
      </div>
      
      <div className="data-card">
        {loading ? (
          <div className="data-text data-loading">
            <div className="spinner"></div> Fetching Data...
          </div>
        ) : error ? (
          <p className="data-text data-error">{error}</p>
        ) : (
          <p className="data-text">{data}</p>
        )}
      </div>

      <button className="btn-refresh" onClick={fetchData}>
        Refresh Data
      </button>
    </div>
  )
}

export default App
