export interface messageType {
    id?: string; // Optional property for message ID
    type: string; // Message type (e.g., 'MESSAGE', 'USER_TYPING', etc.)
    from: string; // Sender of the message
    content: string | object; // Content of the message (can be text or an object)
    // You can add additional properties as needed
  }
  