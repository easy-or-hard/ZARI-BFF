import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SignInGateway {
  @WebSocketServer()
  server: Server;

  public clients: Map<string, Socket> = new Map();
  async handleConnection(client: Socket) {
    const state = uuidv4();
    this.clients.set(state, client);
    client.emit('state', state);
  }

  // TODO, 아직 고민중...
  handleDisconnect(client: Socket) {
    console.log('disconnect');
    // 연결 끊어지면 이벤트 처리
  }

  async authSuccess(state: any) {
    this.clients.get(state).emit('authSuccess', 'true');
  }

  async alreadyHaveAccount(state: any) {
    this.clients.get(state).emit('alreadyHaveAccount', 'true');
  }

  async newAccount(state: any) {
    this.clients.get(state).emit('newAccount', 'true');
  }
}
