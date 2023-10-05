const express = require('express');
const app = express();
const port = 3000;
const _ = require('lodash');
const memoize = require('lodash/memoize')
const { fetchData } = require('./middleware/fetch');
app.use(express.json())
const calculateBlogStatistics = memoize(async () => {
    const blogData = await fetchData();
})
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/api/blog-stats', async (req, res) => {
  try {
    const responseData = await fetchData();
    
    if (!responseData || !responseData.blogs || !Array.isArray(responseData.blogs)) {
      res.status(404).json({ error: 'No valid blog data found' });
      return;
    }
    
    const blogData = responseData.blogs; // Assuming 'blogs' is the key containing the array
    
    // Calculate the number of different (unique) ids
    const uniqueIds = _.uniq(blogData.map((blog) => blog.id));
    const totalUniqueIds = uniqueIds.length;

    const totalBlogs = _.size(blogData);
    const blogWithLongestTitle = _.maxBy(blogData, (blog) => blog.title.length);
    const blogsWithPrivacy = _.filter(blogData, (blog) =>
      blog.title.toLowerCase().includes('privacy')
    );
    const uniqueBlogTitles = _.uniqBy(blogData, 'title');

    console.log('Total number of blogs:', totalBlogs);
    console.log('Blog with the longest title:', blogWithLongestTitle.title);
    console.log('Number of blogs with "privacy" in the title:', blogsWithPrivacy.length);
    console.log('Array of unique blog titles:', uniqueBlogTitles.map((blog) => blog.title));
    console.log('Total unique ids:', totalUniqueIds);

    res.json({
      totalBlogs,
      longestTitle: blogWithLongestTitle.title,
      blogsPrivacyCount: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
      totalUniqueIds,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server error' });
  }
});

app.get('/api/blog-search', async (req,res)=>{
    try {
        const query = req.query.query; // Get the query parameter from the URL
        const blogData = await fetchData();
    
        if (!query || !blogData || !Array.isArray(blogData.blogs) || blogData.blogs.length === 0) {
          
          res.status(400).json({ error: 'Invalid query or no valid blog data found' });
          return;
        }
    
        // Implement search functionality (case-insensitive)
        const matchingBlogs = blogData.blogs.filter((blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase())
        );
    
        res.json({ matchingBlogs });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server error' });
      }
})

app.listen(port, () => {
  console.log('App is listening on port 3000');
});
