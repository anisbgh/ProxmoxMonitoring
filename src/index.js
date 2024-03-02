const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

app.get('/getNodesInfo', async (req, res) => {
  try {
    const proxmoxApiUrl = 'ADD YOUR API';

    // Set the HTTP Authorization Header
    const headers = {
      Authorization: 'ADD YOUR PROXMOX TOKEN',
    };

    // Ignore SSL certificate validation (not recommended for production)
    const axiosConfig = {
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      headers,
    };

    const response = await axios.get(proxmoxApiUrl, axiosConfig);
    const data = response.data.data;

    const clusterName = data[0].name; // Assuming the first item contains the cluster name
    const nodes = data.slice(1).map(item => ({ name: item.name, online: item.online }));

    // Send the response back to the client
    res.json({ clusterName, nodes });
  } catch (error) {
    console.error('Error fetching nodes information:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getNodeUptime', async (req, res) => {
  try {
    // Assuming this URL returns the required data
    const proxmoxNodesApiUrl = 'ADD YOUR API';

    // Set the HTTP Authorization Header
    const headers = {
      Authorization: 'ADD YOUR PROXMOX TOKEN',
    };

    // Ignore SSL certificate validation (not recommended for production)
    const axiosConfig = {
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      headers,
    };

    const response = await axios.get(proxmoxNodesApiUrl, axiosConfig);
    const nodesData = response.data.data;

    // Transform the data as needed, ensuring it includes name, online status, and uptime
    const transformedData = nodesData.map(node => ({
      name: node.node,
      online: node.status,
      uptime: node.uptime,
      cpu: node.cpu * 100, // Assuming 'cpu' is a fraction; multiply by 100 to get percentage
      memoryUsage: (node.mem / node.maxmem) * 100 // Calculate memory usage as a percentage
    }));


    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching node uptime:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/vms/:nodeName', async (req, res) => {
  const { nodeName } = req.params;
  const apiUrl = `ADD YOUR API`;

  try {
    const headers = {
      Authorization: 'ADD YOUR PROXMOX TOKEN',
    };

    // Ignore SSL certificate validation (not recommended for production)
    const axiosConfig = {
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      headers,
    };
    const response = await axios.get(apiUrl, axiosConfig);    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching VM data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
