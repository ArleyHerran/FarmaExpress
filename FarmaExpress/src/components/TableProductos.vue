<style>
.v-icon.red--text {
  color: rgb(224, 86, 86);
}

.v-icon.green--text {
  color: rgb(97, 187, 97);
}
</style>

<template>
  <div>
    <v-text-field
      v-model="search"
      label="Buscar por nombre o código"
      variant="outlined"
      append-inner-icon="mdi-magnify"
      density="compact"
      style="max-width: 550px; color:aqua"
      
    />
    <v-btn color="primary" class="mb-5 "  fab dark @click="estados.opnenFormProduto({display:true,f:1,},null)">
      <v-icon>mdi-plus</v-icon>
      Agregar un nuevo producto
    </v-btn>
    <!-- Agregar el diálogo/modal -->
    <formulario></formulario>

    <v-table dense  :sort-by="'Codigo'" :sort-desc="false" theme="dark" style="border: 1px solid #767575;">
      <thead>
        <tr>
          <th class="text-left">Codigo</th>
          <th class="text-left">Nombre</th>
          <th class="text-left">Labs</th>
          <th class="text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in displayedItems" :key="index">
          <td>{{ item.codigo }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.labs }}</td>
         
          <td>
            <v-icon class="mr-2" color="green" @click="estados.opnenFormProduto({display:true,f:2,},item)"
              >mdi-pencil</v-icon
            >
            <v-icon color="red" @click="estados.eliminarProducto(item.codigo)">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="5"
      :ellipsis="null"
      :boundary-links="false"
      @input="changePage"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      style="border: 1px solid #767575; color: aqua;"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch} from 'vue';
import { useAppStore } from "../store/app";
//import { useRouter } from "vue-router";

const estados = useAppStore();
import Formulario from "@/components/FormProduct.vue";

const currentPage = ref(1);
const itemsPerPage = ref(20);
const search = ref('');
const desserts = ref(estados.productos);



const sortedItems = computed(() => {
  return filteredDesserts.value.sort((a, b) => {
    if (a.codigo < b.codigo) {
      return -1;
    }
    if (a.codigo > b.codigo) {
      return 1;
    }
    return 0;
  });
});


const filteredDesserts = computed(() => {
  currentPage.value = 1;
  const regex = new RegExp(search.value, "i");
  return desserts.value.filter(item => regex.test(item.nombre) || regex.test(item.codigo));
});


const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});
const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedItems.value.slice(start, end);
});

const totalItems = computed(() => filteredDesserts.value.length);

function changePage(page) {
  currentPage.value = page;
}



watch(() => estados.productos, (newVal, oldVal) => {
  desserts.value = newVal;
});
</script>
