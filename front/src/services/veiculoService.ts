import { http } from "../http/axios"
import type { Veiculo } from "../types/types"

export const VeiculoService = () => {
  const addVeiculo = async (data: Veiculo): Promise<Veiculo> => {
    const veiculo = await http.post<Veiculo>('/Veiculo/', data);
    return veiculo.data;
  }

  const findAll = async (): Promise<Veiculo[]> => {
    const veiculos = await http.get<Veiculo[]>('/Veiculo');
    return veiculos.data;
  }

  const update = async (
    id: string,
    data: Veiculo): Promise<Veiculo> => {
    const veiculoAtualizado = await http.put<Veiculo>(`/Veiculo/${id}`, data);
    return veiculoAtualizado.data;
  }

  const findById = async (id: string): Promise<Veiculo> => {
    const veiculo = await http.get<Veiculo>(`/Veiculo/${id}`);
    return veiculo.data;
  }
  
  const remove = async (id: string): Promise<void> => {
    await http.delete(`/Veiculo/${id}`);  
  }

  return { addVeiculo, update, findAll, findById, remove }
}