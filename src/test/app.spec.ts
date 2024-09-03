import { processLargeArray } from "../app";

// Mock the processBatch function
jest.mock('../app.ts', () => ({
  processBatch: jest.fn()
}));

describe('processLargeArray', () => {
  const mockProcessBatch = require("../app").processBatch;

  beforeEach(() => {
    mockProcessBatch.mockClear();
  });

  it('should process the large array in batches', async () => {
    const largeArray = new Array(10000).fill(0).map((_, i) => i);
    const batchSize = 1000;

    // Mock implementation of processBatch to return a resolved promise
    mockProcessBatch.mockImplementation((batch: any[]) => {
      return Promise.resolve(batch.map(item => `Processed item ${item}`));
    });

    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await processLargeArray(largeArray, batchSize);

    // Verify that processBatch was called the correct number of times
    expect(mockProcessBatch).toHaveBeenCalledTimes(10);

    // Verify that console.log was called with correct batch results
    for (let i = 0; i < 10; i++) {
      expect(consoleSpy).toHaveBeenCalledWith(
        `Batch ${i + 1} results:`,
        largeArray.slice(i * batchSize, (i + 1) * batchSize).map(item => `Processed item ${item}`)
      );
    }

    // Restore console.log
    consoleSpy.mockRestore();
  });

  it('should handle errors during batch processing', async () => {
    const largeArray = new Array(1000).fill(0).map((_, i) => i);
    const batchSize = 500;

    // Mock implementation of processBatch to reject on second call
    mockProcessBatch
      .mockImplementationOnce((batch: any[]) => {
        return Promise.resolve(batch.map(item => `Processed item ${item}`));
      })
      .mockImplementationOnce(() => Promise.reject(new Error('Test error')));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await processLargeArray(largeArray, batchSize);

    // Verify that console.error was called with correct error message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error processing batch 2:', new Error('Test error'));

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
