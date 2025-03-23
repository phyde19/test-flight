curl -N -X POST http://localhost:8000/completion/stream \
  -H "Content-Type: application/json" \
  -d '{
    "system_prompt": "You are a helpful assistant.",
    "conversation": [
      {
        "role": "user",
        "content": "When would I prefer Drizzle? When would I prefer pydantic?"
      }
    ],
    "assistant": "basic"
  }'