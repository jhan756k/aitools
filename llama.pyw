import tkinter as tk
from tkinter import scrolledtext
from ollama import chat, ChatResponse  # Updated import statement
import tkinter.font as tkFont  # Import the font module

def on_submit():
    user_input = user_input_text.get("1.0", tk.END).strip()
    if user_input:
        response: ChatResponse = chat(model="llama3.2", messages=[
            {
                'role': 'user',
                'content': user_input,
            },
        ])
        chat_history.config(state=tk.NORMAL)
        chat_history.insert(tk.END, f"You: {user_input}\n\n", "user")
        chat_history.insert(tk.END, f"Llama: {response.message.content}\n\n", "ai")
        
        # Example of inserting formatted text
        chat_history.config(state=tk.DISABLED)
        user_input_text.delete("1.0", tk.END)

# Create the main window
root = tk.Tk()
root.title("Llama 3.2 Chatbot")

# Set the font
font_style = tkFont.Font(family="Open Sans", size=14)

# Create a text area for chat history with increased size and font
chat_history = scrolledtext.ScrolledText(root, state='disabled', width=75, height=25, font=font_style)  # Increased width and height
chat_history.pack(pady=10)

# Define tags for coloring and styles
chat_history.tag_configure("user", foreground="red")  # User text in red
chat_history.tag_configure("ai", foreground="blue")    # AI text in blue
chat_history.tag_configure("bold", font=("Open Sans", 14, "bold"))  # Bold text
chat_history.tag_configure("italic", font=("Open Sans", 14, "italic"))  # Italic text

# Create a text area for user input with increased size and font
user_input_text = tk.Text(root, height=4, font=font_style)  # Increased height
user_input_text.pack(pady=10)

# Create a submit button
submit_button = tk.Button(root, text="Submit", command=on_submit, font=font_style)  # Set font for button
submit_button.pack(pady=5)

# Bind the Enter key to the submit function
user_input_text.bind("<Return>", lambda event: on_submit())

# Start the GUI event loop
root.mainloop()
