const { Client } = require('pg');

exports.handler = async (event, context) => {
  // CORS headers to allow requests from your frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Necessary for most Neon connections
  });

  try {
    await client.connect();

    if (event.httpMethod === 'GET') {
      const result = await client.query('SELECT * FROM articles ORDER BY created_at DESC');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows),
      };
    }

    if (event.httpMethod === 'POST') {
      const { title, content, image_url, category } = JSON.parse(event.body);
      
      if (!title || !content) {
         return { 
           statusCode: 400, 
           headers, 
           body: JSON.stringify({ error: "Missing title or content" }) 
         };
      }
      
      const query = `
        INSERT INTO articles (title, content, image_url, category, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *;
      `;
      const values = [title, content, image_url, category];
      const result = await client.query(query, values);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(result.rows[0]),
      };
    }

    return { statusCode: 405, headers, body: 'Method Not Allowed' };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database connection failed', details: error.message }),
    };
  } finally {
    await client.end();
  }
};
