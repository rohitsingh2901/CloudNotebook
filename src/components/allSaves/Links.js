import React, { useState } from 'react';
import axios from 'axios';

const Links = () => {
  const [linkData, setLinkData] = useState(null);
  const [inputUrl, setInputUrl] = useState('');

  const fetchLinkPreview = async (url) => {
    try {
      const response = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching link preview:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchLinkPreview(inputUrl);
    setLinkData(data);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Enter URL</label>
          <input
            type="url"
            className="form-control"
            id="url"
            aria-describedby="url"
            placeholder="Enter Url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div>
        {linkData && linkData.data && (
          <div>
            <img className='mt-3 w-50 h-50 rounded-2xl border-solid border-8 border-blue-500' src={linkData.data.image.url} alt="Link Thumbnail" />
            <a href={inputUrl} target="_blank" rel="noopener noreferrer">
              {inputUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
