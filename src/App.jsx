import './index.css';
import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGE_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchImages = async () => {
    try {
      if(searchInput.current.value){
        setErrorMsg('');
        const { data } = await axios.get(
        `${API_URL}?query=${
          searchInput.current.value
        }&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`
      );
      setImages(data.results);
      setTotalPages(data.total_pages);
      } 
    } catch (error) {
      setErrorMsg('Error fetching images. Try again later.')
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    if (searchInput.current?.value) {
      fetchImages();
    }
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 when doing new search
    fetchImages();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    setPage(1);
    fetchImages();
  };

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      {errorMsg && <p className='error-msg'> {errorMsg}</p>}
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </form>
      </div>

      <div className="filters">
        {['Nature', 'Birds', 'Cats', 'Shoes'].map((item) => (
          <div key={item} onClick={() => handleSelection(item)}>
            {item}
          </div>
        ))}
      </div>

      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="image"
          />
        ))}
      </div>

      <div className="buttons">
        {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>}
        {page < totalPages && <Button onClick={() => setPage(page + 1)}>Next</Button>}
      </div>
    </div>
  );
}

export default App;
