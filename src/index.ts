import { Server } from './server/Server';

let app = new Server().getApp();
export { app };