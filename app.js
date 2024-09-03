const express = require('express');
const axios = require('axios');

const app = express();
const port = 3002;

app.get('/getTimeStories', async (req, res) => {
    try {
        // Fetch the HTML from Time.com
        const response = await axios.get('https://time.com');
        const html = response.data;

        // Extract the latest stories
        const stories = [];
        const regex = /<li class="latest-stories__item">[\s\S]*?<a href="(.*?)">[\s\S]*?<h3 class="latest-stories__item-headline">(.*?)<\/h3>/g;

        let match;
        while ((match = regex.exec(html)) !== null) {
            const link = match[1].trim();
            const title = match[2].trim();
            stories.push({
                title: title,
                link: `https://time.com${link}`
            });

            if (stories.length === 6) break;
        }

        // Send the response as JSON
        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).send('Error fetching stories');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/getTimeStories`);
});
