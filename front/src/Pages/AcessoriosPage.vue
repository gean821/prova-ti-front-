<template>
  <v-container class="pa-5">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/">
      Voltar aos veiculos
    </v-btn>

    <h1 class="mt-4">Acessorios</h1>
    <p class="text-grey mb-6">
      Adicionando acessorios ao veiculo:
      <strong>{{ modeloVeiculo }}</strong>
    </p>

    <v-card class="pa-4 mb-6" elevation="2">
      <v-row align="center">
        <v-col cols="12" md="8">
          <v-text-field
            label="Nome do acessorio"
            v-model="nomeAcessorio"
            variant="outlined"
            hide-details
            @keyup.enter="adicionarAcessorio"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            color="success"
            block
            height="56"
            :loading="loading"
            @click="adicionarAcessorio"
          >
            Adicionar
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="2">
      <v-table>
        <thead>
          <tr>
            <th>Nome do acessorio</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in AcessoriosFiltrados" :key="p.id">
            <td>{{ p.nome }}</td>
            <td class="d-flex justify-end ga-3 text-right">
              <v-btn
                color="warning"
                variant="text"
                icon="mdi-pencil"
                @click="abrirModalEditar(p)"
              >
              </v-btn>

              <v-btn
                color="error"
                variant="text"
                icon="mdi-delete"
                @click="removerAcessorio(p.id)"
              >
              </v-btn>
            </td>
          </tr>
          <tr v-if="AcessoriosFiltrados.length === 0">
            <td colspan="2" class="text-center text-grey pa-4">
              Nenhum acessorio neste veiculo.
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialogEdit" max-width="500">
      <v-card>
        <v-card-title class="text-h5 bg-grey-lighten-3 pa-4">
          Editar acessorio
        </v-card-title>

        <v-card-text class="pa-4 mt-2">
          <v-text-field
            label="Novo nome do acessorio"
            v-model="nomeEdit"
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
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { acessorioService } from "../services/acessorioService";
import type { Acessorio } from "../types/types";

const route = useRoute();
const veiculoId = route.query.veiculoId as string;
const modeloVeiculo = (route.query.modelo as string) || "Selecionado";

const service = acessorioService();
const todosAcessorios = ref<Acessorio[]>([]);
const nomeAcessorio = ref("");
const loading = ref(false);

const dialogEdit = ref(false);
const nomeEdit = ref("");
const AcessorioIdEdit = ref("");
const salvarLoading = ref(false);

onMounted(() => {
  carregarDados();
});

const carregarDados = async () => {
  loading.value = true;
  try {
    todosAcessorios.value = await service.findAll();
  } catch (error) {
    console.error("Erro ao buscar acessorios", error);
  } finally {
    loading.value = false;
  }
};

const AcessoriosFiltrados = computed(() => {
  return todosAcessorios.value.filter((p) => p.veiculoId === veiculoId);
});

const adicionarAcessorio = async () => {
  if (!nomeAcessorio.value.trim() || !veiculoId) {
    return;
  }

  loading.value = true;
  try {
    await service.addAcessorio({
      nome: nomeAcessorio.value,
      veiculoId: veiculoId,
    });
    nomeAcessorio.value = "";
    await carregarDados();
  } catch (error) {
    console.error("Erro ao criar acessorio", error);
  } finally {
    loading.value = false;
  }
};

const removerAcessorio = async (id: string) => {
  if (!confirm("Tem certeza que deseja excluir este acessorio?")) {
    return;
  }

  try {
    await service.remove(id);
    await carregarDados();
  } catch (error) {
    console.error("Erro ao remover", error);
  }
};

const abrirModalEditar = (p: Acessorio) => {
  if (!p.id) {
    return;
  }

  AcessorioIdEdit.value = p.id;
  nomeEdit.value = p.nome;
  dialogEdit.value = true;
};

const salvarEdicao = async () => {
  if (!nomeEdit.value.trim() || !AcessorioIdEdit.value) {
    return;
  }

  salvarLoading.value = true;
  try {
    await service.update(AcessorioIdEdit.value, {
      id: AcessorioIdEdit.value,
      nome: nomeEdit.value,
      veiculoId: veiculoId,
    });

    dialogEdit.value = false;
    await carregarDados();
  } catch (error) {
    console.error("Erro ao editar", error);
  } finally {
    salvarLoading.value = false;
  }
};
</script>
