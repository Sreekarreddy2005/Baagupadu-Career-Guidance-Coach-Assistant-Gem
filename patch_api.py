import re

with open("backend/api.py", "r") as f:
    content = f.read()

# Replace the start of the chat function
old_start = """@app.post("/api/chat")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    global agent
    if not agent:
        return {"response": "Error: Agent not initialized properly."}"""

new_start = """@app.post("/api/chat")
async def chat(request: ChatRequest, user_id: str = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    try:
        global agent
        if not agent:
            return {"response": "Error: Agent not initialized properly."}"""

content = content.replace(old_start, new_start)

# Now we need to indent everything from line 126 down to line 188
lines = content.split('\n')
for i in range(125, 188):
    if lines[i].strip():
        lines[i] = "    " + lines[i]

# Replace the exception block at the end
old_except = """    except Exception as e:
        import traceback
        err = traceback.format_exc()
        print(f"Chat Error: {err}")
        return {"response": f"Error processing request: {str(e)}"}"""

new_except = """    except Exception as e:
        import traceback
        err = traceback.format_exc()
        print(f"Chat Error: {err}")
        return {"response": f"Error processing request: {str(err)}"}"""

content = '\n'.join(lines)
content = content.replace(old_except, new_except)

with open("backend/api.py", "w") as f:
    f.write(content)

print("Patched api.py")
