
const axios=require('axios')

const  sampleSearch=async(query)=> {
    const response = await axios.get(
      `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`
    );
    return response.data;
  }

  module.exports={sampleSearch}