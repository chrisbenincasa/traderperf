import axios from 'axios';
import { ExecutionJson } from '../model';

export default class TraderPerfApiClient {
  async getExecutions() {
    return await axios.get('/api/executions');
  }

  async saveExecutions(executions: ExecutionJson[]) {
    return await axios.post('/api/executions', { data: executions });
  }
}
