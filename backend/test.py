from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

def stream_chat_completion(prompt):
    # Create a streaming chat completion
    stream = client.chat.completions.create(
        model="gpt-4o",  # or "gpt-4" if you have access
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        stream=True  # Enable streaming
    )
    
    # Iterate through the streaming response
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            # Print each chunk as it arrives without adding newlines
            print(chunk.choices[0].delta.content, end="", flush=True)
    print()  # Add a newline at the end

# Example usage
if __name__ == "__main__":
    try:
        user_prompt = "Tell me a short story about a curious robot"
        stream_chat_completion(user_prompt)
    except Exception as e:
        print(f"An error occurred: {e}")





