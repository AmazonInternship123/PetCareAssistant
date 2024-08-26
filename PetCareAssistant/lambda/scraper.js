const axios = require('axios');
const cheerio = require('cheerio');

const scrapePetCareAdvice = async () => {
    try {
        // URL of the page to scrape
        const url = 'https://www.petmd.com/dog/care';
        
        // Fetch the HTML content from the URL
        const { data } = await axios.get(url);
        
        // Load the HTML into cheerio
        const $ = cheerio.load(data);
        
        // Select and extract the titles of articles
        const articles = [];
        $('.views-row').each((i, element) => {
            const title = $(element).find('h2').text().trim();
            const link = $(element).find('a').attr('href');
            articles.push({ title, link: `https://www.petmd.com${link}` });
        });
        
        return articles;
    } catch (error) {
        console.error('Error scraping pet care advice:', error);
        return [];
    }
};

// Example usage
scrapePetCareAdvice().then((articles) => {
    console.log('Pet Care Advice Articles:', articles);
});
