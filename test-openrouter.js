require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || 'test-key',
    baseURL: process.env.OPENROUTER_BASE_URL,
    defaultHeaders: {
        'HTTP-Referer': 'https://github.com/test',
        'X-Title': 'Test',
    },
});

async function testAPI() {
    console.log('\n🧪 Testing OpenRouter API...\n');
    console.log('API Key:', process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Not set');
    console.log('Base URL:', process.env.OPENROUTER_BASE_URL);
    console.log('Model:', process.env.LLM_MODEL);
    console.log();

    try {
        const completion = await client.chat.completions.create({
            model: process.env.LLM_MODEL,
            temperature: 0,
            messages: [
                {
                    role: 'user',
                    content: 'Say "Hello World" and nothing else.',
                },
            ],
        });

        console.log('✅ SUCCESS!');
        console.log('Response:', completion.choices[0]?.message?.content);
        console.log('\nFull response object:');
        console.log(JSON.stringify(completion, null, 2));
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\nFull error:');
        console.log(error);

        if (error.response) {
            console.log('\nAPI Response:');
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testAPI();
