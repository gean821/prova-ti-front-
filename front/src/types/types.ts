export interface Veiculo {
  id: string;
  modelo: string;
  anoFabricacao: number;
  placa: string;
  acessorios?: Acessorio[];
}

export interface Acessorio {
  id: string;
  nome: string;
  veiculoId: string;
}