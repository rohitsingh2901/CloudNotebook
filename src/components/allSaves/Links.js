import React, { useState } from 'react';
import axios from 'axios';

const Links = () => {
  const [linkData, setLinkData] = useState([]);
  const [inputUrl, setInputUrl] = useState('');
  const [loader, setloader] = useState(false)

  const fetchLinkPreview = async (url) => {
    try {
      const response = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = response.data;
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching link preview:', error);
      return null;
    } finally{
      setloader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true);
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
          <div className="flex justify-center flex-wrap">
            {
              linkData.length!==0 && loader===false ? (linkData.map((link,id)=>{
                return (
                  <div className='mx-6' key={id}>
                    <div id='imgDiv'>
                      <h5>{link.title.length>30 ? link.title.substr(0,30)+'...':link.title}</h5>
                      <img className='w-100 h-100 rounded-2xl border-double border-4 border-black' src={link.imgurl} alt='imgUrl'/>
                      <div className='flex justify-evenly items-center'>
                      <p className="font-bold"><a target='_blank' rel="noopener noreferrer" href={link.url}>Link<i class="fa-solid fa-up-right-from-square fa-sm"></i></a></p>
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
              })):(linkData.length!==0 ? (<div className="flex flex-col justify-center items-center my-4">
              <div className="loader "></div>
              <h5>Please Wait</h5>
              </div>):(<h6 className='text-center font-bold'>Add your first link</h6>))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;
