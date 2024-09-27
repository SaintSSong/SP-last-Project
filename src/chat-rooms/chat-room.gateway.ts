import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room.service';
import { Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from 'src/common/sockets/gateway';
import { UserService } from 'src/users/user.service';
import { MessageType } from './types/message.type';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' }, transports: ['websocket'] })
export class ChatRoomGateway extends SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ChatRoomService))
    private readonly chatRoomService: ChatRoomService,
    private readonly userService: UserService,
    jwtService: JwtService,
  ) {
    super({ jwtService, name: 'chat' });
  }
  async handleConnection(@ConnectedSocket() socket: Socket, server: Server) {
    const decoded = this.parseToken(socket);
    if (!decoded) {
      return;
    }

    const userNickname = await this.userService.findNicknameByUserId(decoded.userId);
    socket.data = { userId: decoded.userId, nickname: userNickname };

    this.logger.log(
      `[채팅 서버 연결] 소켓 ID : ${socket.id} / 소켓 유저 ID : ${socket.data.userId} / 소켓 유저 닉네임 : ${socket.data.nickname}`,
    );
  }

  @SubscribeMessage('join')
  async handleJoinChatRoom(
    @MessageBody() data: { roomId: number; joinCheck: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, joinCheck } = data;

    await this.chatRoomService.isUserInChatRoom(socket.data.userId, roomId);
    if (!joinCheck) {
      socket.join(roomId.toString());

      this.server.to(roomId.toString()).emit('join', { roomId, nickname: await socket.data.nickname });
      this.logger.log(`${await socket.data.nickname}님께서 ${roomId}번 방에 입장했습니다.`);
    }
  }

  @SubscribeMessage('requestHistory')
  async handleRequestHistory(@MessageBody() data: { roomId: number }, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    const messages = await this.chatRoomService.getRoomMessage(roomId);
    const checkHistory = true;

    this.server.to(roomId.toString()).emit('history', { messages, roomId, checkHistory });
  }

  @SubscribeMessage('exit')
  async handleExitChatRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    socket.leave(roomId.toString());
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { roomId: number; content: string; type: MessageType },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, content, type } = data;
    this.logger.log(`데이터: ${data}`);
    await this.chatRoomService.saveMessage({ userId: socket.data.userId, roomId, content, type });
    this.logger.log(`데이터 저장 성공: true`);
    this.server.to(roomId.toString()).emit('message', { nickname: await socket.data.nickname, content });
    this.logger.log(`방번호:${roomId}번 / ${await socket.data.nickname}:${content}`);
  }
}
