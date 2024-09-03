// Create a large array with 1 million elements
const largeArray = new Array(1e6).fill(0).map((_, i) => i);

// Define an asynchronous batch processing function
export const processBatch = async (batch: any[]) => {
  const promises = batch.map(item => {
    return new Promise((resolve, reject) => {
      // Simulate async operation with setTimeout
      setTimeout(() => {
        resolve(`Processed item ${item}`);
      }, 100);
    });
  });
  return Promise.all(promises);
}; 

// Define a function to process the large array in batches
export const processLargeArray = async (array: any[], batchSize: number) => {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    try {
      const results = await processBatch(batch);
      console.log(`Batch ${i / batchSize + 1} results:`, results);
    } catch (error) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, error);
    }
  }
};

// Define the batch size and start processing
const batchSize = 1000; // Adjust batch size as needed
processLargeArray(largeArray, batchSize);