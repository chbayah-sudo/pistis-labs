// Quick script to test Anthropic API and available models
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const modelsToTest = [
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-20241022',
];

console.log('Testing Anthropic API models...\n');

for (const model of modelsToTest) {
  try {
    const response = await client.messages.create({
      model: model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
    console.log(`✅ ${model} - WORKS`);
  } catch (error) {
    if (error.status === 404) {
      console.log(`❌ ${model} - NOT FOUND (404)`);
    } else {
      console.log(`⚠️  ${model} - ERROR: ${error.message}`);
    }
  }
}
