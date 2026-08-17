export interface IRealtimeNotifier {
  emitToRoom(room: string, event: string, payload: any): void;
  emitToUser(userId: string, event: string, payload: any): void;
}
