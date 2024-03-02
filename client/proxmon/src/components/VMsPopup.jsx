import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VMsPopup = ({ nodeName, onClose }) => {
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const popupRef = useRef(null);

  // Function to fetch VMs data
  useEffect(() => {
    const fetchVMs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/vms/${nodeName}`);
        setVms(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching VMs: ' + err.message);
        setLoading(false);
      }
    };

    fetchVMs();
  }, [nodeName]);

  return (
    <div className="vms-popup-backdrop" onClick={onClose}>
      <div className="vms-popup" ref={popupRef} onClick={(e) => e.stopPropagation()}>
        <div className="popup-close" onClick={onClose}>
          <i className="fas fa-times"></i> {/* Font Awesome Icon */}
        </div>
        <h2>VMs in {nodeName}</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul>
          {vms.map(vm => (
            <li key={vm.id}>{vm.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VMsPopup;
