import React, { useState } from 'react';
import axios from 'axios';

const Links = () => {
  const [linkData, setLinkData] = useState([]);
  const [inputUrl, setInputUrl] = useState('');

  const fetchLinkPreview = async (url) => {
    try {
      const response = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = response.data;
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching link preview:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchLinkPreview(inputUrl);
    console.log(data)
     const sendData = {
      url: data.data.url,
      imgurl: data.data.image.url,
      title: data.data.title,
     }
     fetch('http://localhost:5000/get-links',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData) 
    }).then((res)=>{
      console.log(res)
      fetchLinks()
    }).catch((error)=>{
      console.log(error);
    });
    
;  };

    const deleteLink = (id)=>{
      const index = linkData[id]._id;
      fetch(`http://localhost:5000/get-links/${index}`,{
      method:"DELETE",
    }).then((res)=>{
      fetchLinks()
    }).catch((error)=>{
      console.log(error)
    })
    }

  const fetchLinks = ()=>{
    fetch('http://localhost:5000/get-links',{
      method:"GET",
    }).then(async (res)=>{
      setLinkData(await res.json())
    }).catch((error)=>{
      console.log(error)
    })
  }

  React.useEffect(() => {
    fetchLinks();
  }, [])
  

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Enter URL</label>
          <input
          required
          title='Please enter any url here'
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
          Add
        </button>
      </form>
      <div>
        {/* {linkData && linkData.data && (
          <div>
            <img className='mt-3 rounded-2xl border-solid border-8 border-blue-500' src={linkData.data.image.url} alt="Link Thumbnail" />
            <a href={inputUrl} target="_blank" rel="noopener noreferrer">
              {inputUrl}
            </a>
          </div>
        )} */}
        <div>
          <h1 className='text-center my-3'>Your Links</h1>
          <div className='flex justify-between flex-wrap'>
            {
              linkData.length!==0 && linkData.map((link,id)=>{
                return (
                  <div key={id}>
                    <div id='imgDiv'>
                      <h5>{link.title.length>30 ? link.title.substr(0,30)+'...':link.title}</h5>
                      <img className='w-100 h-100' src={link.imgurl} alt='imgUrl'/>
                      <div className='flex justify-evenly items-center'>
                      <p className="font-bold"><a target='_blank' rel="noopener noreferrer" href={link.url}>Link</a></p>
                      <p><i
                  onClick={() => {deleteLink(id)}}
                  className="fa-solid fa-trash-can"
                  style={{
                    color: "#ff0000",
                  }}
                ></i></p>
                      </div>
                      
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;
