const axios = require('axios');

async function fetchData() {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch blog data ${error.message}`);
  }
}

module.exports = {
  fetchData
};
