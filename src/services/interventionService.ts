import { CreateInterventionDto, Intervention, UpdateInterventionDto } from '@/types/intervention';
import axios from 'axios';

const API_URL = '/api/v1/interventions';

const interventionService = {
  async getAll() {
    const { data } = await axios.get<Intervention[]>(API_URL);
    return data;
  },
  async getById(id: number) {
    const { data } = await axios.get<Intervention>(`${API_URL}/${id}`);
    return data;
  },
  async create(payload: CreateInterventionDto) {
    const { data } = await axios.post<Intervention>(API_URL, payload);
    return data;
  },
  async update(id: number, payload: UpdateInterventionDto) {
    const { data } = await axios.patch<Intervention>(`${API_URL}/${id}`, payload);
    return data;
  },
  async remove(id: number) {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  },
  async start(id: number) {
    const { data } = await axios.patch<Intervention>(`${API_URL}/${id}/start`);
    return data;
  },
  async terminate(id: number) {
    const { data } = await axios.patch<Intervention>(`${API_URL}/${id}/terminate`);
    return data;
  },
  async restore(id: number) {
    const { data } = await axios.patch<Intervention>(`${API_URL}/${id}/restore`);
    return data;
  },
};

export default interventionService; 