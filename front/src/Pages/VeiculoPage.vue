<template>
  <v-container class="pa-5">
    <h1 class="text-center mb-6">Gerenciar Veiculos</h1>

    <v-card class="pa-4 mb-6" elevation="2">
      <v-row align="center">
        <v-col cols="12" md="8" class="d-flex flex-column ga-5">
          <v-text-field
            label="modelo do veiculo"
            v-model="veiculoForm.modelo"
            variant="outlined"
            hide-details
            @keyup.enter="create"
          />

          <v-text-field
            label="Ano de fabricação"
            v-model="veiculoForm.anoFabricacao"
            variant="outlined"
            hide-details
            @keyup.enter="create"
          />

          <v-text-field
            label="Placa"
            v-model="veiculoForm.placa"
            variant="outlined"
            hide-details
            @keyup.enter="create"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn color="primary" block height="56" :loading="loading" @click="create">
            Adicionar veiculo
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="2">
      <v-table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>modelo do veiculo</th>
            <th>Ano de fabricação</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in veiculos" :key="c.id">
            <td>{{ c.placa }}</td>
            <td>{{ c.modelo }}</td>
            <td>{{ c.anoFabricacao }}</td>

            <td class="d-flex justify-end ga-3 text-right">
              <v-btn
                color="info"
                variant="flat"
                class="mt-1"
                :to="`/acessorios?veiculoId=${c.id}&modelo=${c.modelo}`"
              >
                Ver Acessórios
              </v-btn>

              <v-btn
                color="warning"
                variant="text"
                icon="mdi-pencil"
                @click="abrirModalEditar(c)"
              >
              </v-btn>

              <v-btn
                color="error"
                variant="text"
                icon="mdi-delete"
                @click="remove(c.id!)"
              >
              </v-btn>
            </td>
          </tr>
          <tr v-if="veiculos.length === 0">
            <td colspan="2" class="text-center text-grey pa-4">
              Nenhum veiculo cadastrado.
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialogEdit" max-width="500">
      <v-card>
        <v-card-title class="text-h5 bg-grey-lighten-3 pa-4">
          Editar veiculo
        </v-card-title>

        <v-card-text class="pa-4 mt-2">
          <v-text-field
            label="Novo modelo do veiculo"
            v-model="veiculoForm.modelo"
            variant="outlined"
            @keyup.enter="salvarEdicao"
          />
        </v-card-text>

        <v-card-text class="pa-4 mt-2">
          <v-text-field
            label="Ano de fabricação do veiculo"
            v-model="veiculoForm.anoFabricacao"
            variant="outlined"
            @keyup.enter="salvarEdicao"
          />
        </v-card-text>

        <v-card-text class="pa-4 mt-2">
          <v-text-field
            label="Nova Placa do Veículo"
            v-model="veiculoForm.placa"
            variant="outlined"
            @keyup.enter="salvarEdicao"
          />
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogEdit = false"> Cancelar </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="salvarLoading"
            @click="salvarEdicao"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { VeiculoService } from "../services/veiculoService";
import type { Veiculo } from "../types/types";

const service = VeiculoService();
const veiculos = ref<Veiculo[]>([]);
const veiculoForm = ref<Veiculo>({
  anoFabricacao: 0,
  modelo: "",
  placa: "",
  acessorios: [],
});
const loading = ref(false);

const dialogEdit = ref(false);
const salvarLoading = ref(false);

onMounted(() => carregarDados());

const carregarDados = async () => {
  loading.value = true;
  try {
    veiculos.value = await service.findAll();
  } catch (error) {
    console.error("Erro ao buscar", error);
  } finally {
    loading.value = false;
  }
};

const create = async () => {
  if (
    !veiculoForm.value.modelo.trim() ||
    !veiculoForm.value.placa ||
    !veiculoForm.value.anoFabricacao
  )
    return;

  loading.value = true;
  try {
    await service.addVeiculo(veiculoForm.value);
    veiculoForm.value.modelo = "";
    veiculoForm.value.anoFabricacao = 0;
    veiculoForm.value.placa = "";
    veiculoForm.value.acessorios = [];

    await carregarDados();
  } catch (error) {
    console.error("Erro ao criar", error);
  } finally {
    loading.value = false;
  }
};

const remove = async (id: string) => {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    await service.remove(id);
    await carregarDados();
  } catch (error) {
    console.error("Erro ao remover", error);
  }
};

const abrirModalEditar = (c: Veiculo) => {
  if (!c.id) {
    return;
  }

  veiculoForm.value.id = c.id;
  veiculoForm.value.modelo = c.modelo;
  veiculoForm.value.anoFabricacao = c.anoFabricacao;
  veiculoForm.value.placa = c.placa;

  dialogEdit.value = true;
};

const salvarEdicao = async () => {
  if (!veiculoForm.value.modelo.trim() || !veiculoForm.value.id) {
    return;
  }

  salvarLoading.value = true;
  try {
    await service.update(veiculoForm.value.id, veiculoForm.value);

    veiculoForm.value.id = "";
    veiculoForm.value.anoFabricacao = 0;
    veiculoForm.value.placa = "";
    veiculoForm.value.modelo = "";

    dialogEdit.value = false;
    await carregarDados();
  } catch (error) {
    console.error("Erro ao editar", error);
  } finally {
    salvarLoading.value = false;
  }
};
</script>
