import Turbopuffer from '@turbopuffer/turbopuffer';

const client = new Turbopuffer({
  apiKey: 'tpuf_wvCA9WBvfBKuD8SUrbfwHFapijZH8DH6',
  region: 'gcp-us-central1',
  logLevel: 'debug',
});

const ns = client.namespace('sonicmemoir-debug-test');

try {
  console.log('WRITING');
  const writeRes = await ns.write({
    upsert_rows: [
      {
        id: 'test-1',
        title: 'debug row',
        mood: 'cinematic',
        text: 'the night we danced in the rain in Paris, 2019',
      },
    ],
  });
  console.log('WRITE RESULT', JSON.stringify(writeRes, null, 2));

  console.log('QUERYING');
  const queryRes = await ns.query({
    top_k: 5,
    rank_by: ['text', 'BM25', 'rain Paris cinematic'],
    include_attributes: ['title', 'mood', 'text'],
  });
  console.log('QUERY RESULT', JSON.stringify(queryRes, null, 2));
} catch (error) {
  console.error('TPUF TEST ERROR');
  console.error(error);
  process.exit(1);
}
