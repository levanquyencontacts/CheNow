import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatAuthor = 'customer' | 'staff';

type JoinChatPayload = {
  roomId: string;
};

type SendChatPayload = {
  roomId: string;
  author: ChatAuthor;
  text: string;
};

type ChatMessage = {
  id: number;
  roomId: string;
  author: ChatAuthor;
  text: string;
  time: string;
};

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit('chat:system', {
      text: 'Socket connected. Emit chat:join to enter a room.',
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`[ChatGateway] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat:join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinChatPayload,
  ) {
    client.join(payload.roomId);

    client.emit('chat:system', {
      text: `Joined room ${payload.roomId}`,
    });
  }

  @SubscribeMessage('chat:send')
  handleSend(@MessageBody() payload: SendChatPayload) {
    const message: ChatMessage = {
      id: Date.now(),
      roomId: payload.roomId,
      author: payload.author,
      text: payload.text,
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this.server.to(payload.roomId).emit('chat:new', message);
  }
}
