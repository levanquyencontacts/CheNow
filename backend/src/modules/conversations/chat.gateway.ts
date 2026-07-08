import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
};

type SendMessagePayload = {
  sender?: string;
  text?: string;
};

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly messages: ChatMessage[] = [];

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('chat:history', this.messages);
  }

  @SubscribeMessage('send')
  handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    const text = payload.text?.trim();

    if (!text) {
      client.emit('chat:error', 'Tin nhan khong duoc de trong.');
      return;
    }

    const message: ChatMessage = {
      id: `${Date.now()}-${client.id}`,
      sender: payload.sender?.trim() || client.id,
      text,
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this.messages.push(message);

    if (this.messages.length > 20) {
      this.messages.shift();
    }

    // Broadcast cho tat ca client dang ket noi, bao gom ca nguoi vua gui.
    this.server.emit('chat:message', message);
  }
}
