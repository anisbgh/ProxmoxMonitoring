import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/nodesInfo.css';
import GaugeChart from '/gaugeChart.jsx';
import VMsPopup from '/VMsPopup.jsx';

const NodesInfo = () => {
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNode, setSelectedNode] = useState('');

  // Function to format uptime from seconds to a readable format
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${sec}s`;
  };

  const handleShowVMsClick = (nodeName) => {
    setSelectedNode(nodeName);
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchNodeData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getNodeUptime');
        const fetchedNodes = response.data
          .map(node => ({
            ...node,
            initialUptime: node.uptime,
            startTime: Date.now()
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sorting the nodes by name
  
        setNodes(fetchedNodes);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      }
    };
  
    fetchNodeData();
    const interval = setInterval(fetchNodeData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(currentNodes => currentNodes.map(node => ({
        ...node,
        uptime: node.initialUptime + Math.floor((Date.now() - node.startTime) / 1000)
      })));
    }, 1000); // Update every second
  
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="nodes-container">
      <h1 className="nodes-title">Proxmox Cluster Status</h1>
      {error && <p className="error-message">{error}</p>}
      <ul>
      {nodes.map(node => (
  <div key={node.name} className="node-item">
    <strong>Node Name:</strong> {node.name} <br/>
    <strong>Online: </strong> 
    {node.online 
      ? <i className="bi bi-check-circle-fill text-success"></i>
      : <i className="bi bi-x-circle-fill text-danger"></i>
    } <br/>
    <strong>Uptime:</strong> {formatUptime(node.uptime)} <br/>
    <div className="charts-row">
      <div className="chart-container">
        <GaugeChart value={node.cpu} label="CPU Usage" />
      </div>
      <div className="chart-container">
        <GaugeChart value={node.memoryUsage} label="Memory Usage" />
      </div>
    </div>
    <button type="button" class="btn btn-outline-primary" onClick={() => handleShowVMsClick(node.name)}>Show VMs</button>
    {showPopup ? (
        <VMsPopup nodeName={selectedNode} onClose={() => setShowPopup(false)} />
      ) : null}
  </div>
))}
      </ul>
    </div>
  );
};

export default NodesInfo;
