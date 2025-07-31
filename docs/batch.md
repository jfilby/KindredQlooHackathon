# Batch

This is a broad overview of the batch, see the code in nextjs/batch/index.ts
for full details.


## Events that spawn batch jobs

- User text interests saved:
  - Text -> entity interests

- Every 15m:
  - Group and find similar interests
  - Get any missing Qloo entities
  - Try the social media pipeline per site (only every 6h)

