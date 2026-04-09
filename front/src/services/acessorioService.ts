import { http } from "../http/axios"
import type { Acessorio } from "../types/types"

export const acessorioService = () => {
  const addAcessorio = async (data: Omit<Acessorio, 'id'>): Promise<Acessorio> => {
    const acessorio = await http.post<Acessorio>('/Acessorio/', data);
    return acessorio.data;
  }

  const findAll = async (): Promise<Acessorio[]> => {
    const acessorios = await http.get<Acessorio[]>('/Acessorio');
    return acessorios.data;
  }

  const update = async (
    id: string,
    data: Acessorio): Promise<Acessorio> => {
    const acessorioAtualizado = await http.put<Acessorio>(`/Acessorio/${id}`, data);
    return acessorioAtualizado.data;
  }

  const findById = async (id: string): Promise<Acessorio> => {
    const acessorio = await http.get<Acessorio>(`/Acessorio/${id}`);
    return acessorio.data;
  }

  const remove = async (id: string): Promise<void> => {
    await http.delete<void>(`/Acessorio/${id}`);
  }

  return { addAcessorio, update, findAll, findById, remove }
}