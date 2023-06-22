<style>
.v-icon.red--text {
  color: rgb(224, 86, 86);
}

.v-icon.green--text {
  color: rgb(97, 187, 97);
}

.flex-conta {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
}
.f {
  border: 3px solid #767575;
  margin: 5px;
  padding: 0px 4px;
  border-radius: 10px;
  color:rgb(220, 220, 220)
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
.f:hover {
  border: 3px solid rgb(255, 102, 59);
}
</style>

<template>
  <div style="overflow: hidden;">
    <div style="">
      <v-row>
        <v-col cols="12" sm="4">
      <h2 class="mb-0" style="color: #bdbcba">
        Utilidades:<span style="color: rgb(81, 213, 98)">{{
          estados.dataUser.utilidades_caja.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })
        }}</span>
      </h2>
    </v-col>
    <v-col cols="12" sm="4">
      <h2 class="mb-0" style="color: #bdbcba">
        Capital:<span style="color: rgb(218, 82, 75)">{{
          estados.dataUser.capital_caja.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })
        }}</span>
      </h2>
    </v-col>
    <v-col cols="12" sm="12">
      <v-btn
        class="mb-6 bg-indigo-lighten-1"
        fab
        @click="estados.formGasto = true"
      >
        <v-icon>mdi-plus</v-icon>
        Agregar salida
      </v-btn>
    </v-col>
    </v-row>
    </div>

   
    <div style="max-width: 100%; color: aqua;" class="flex-conta" >
    <v-row>
      
      <v-col cols="12" sm="4">
        <div class="flex-conta">
          <v-row>
            <v-col cols="12" sm="6">
              <span>Desde:</span><input type="date" class="f" v-model="filtrof.fechai" />
       
            </v-col>
            <v-col cols="12" sm="6">
              <span>Hasta:</span><input type="date" class="f" v-model="filtrof.fechaf" />
            </v-col>
       
      </v-row>
      </div>
    </v-col>
      <v-col cols="12" sm="4">
        <v-btn
        prepend-icon="mdi-filter"
        small
        class="m-auto mb-4 bg-indigo-lighten-1"

        @click="filtrara()"
      >
        <template v-slot:prepend>
          <v-icon color="white"></v-icon>
        </template>

        Filtrar

        <template v-slot:append> </template>
      </v-btn>
      </v-col>
    </v-row>
   </div>
  

    <!-- Agregar el diálogo/modal -->
    <FormularioB></FormularioB>

    <v-table
      dense
      :sort-by="'Codigo'"
      :sort-desc="false"
      theme="dark"
      style="border: 1px solid #767575"
    >
      <thead>
        <tr>
          <th class="text-left">Descripcion</th>
          <th class="text-left">Fecha</th>
          <th class="text-left">Valor</th>
          <th class="text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in displayedItems" :key="index">
          <td>{{ item.descripcion }}</td>
          <td>{{ item.fecha }}</td>
          <td>
            {{
              item.valor.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })
            }}
          </td>
          <td>
            <v-btn
              prepend-icon="mdi-delete"
              class="bg-red-darken-3"
              small
              @click="estados.eliminarGasto(item)"
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              Elinimar

              <template v-slot:append> </template>
            </v-btn>
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
      style="border: 1px solid #767575; color: aqua"
    />
  </div>

  <div style="display: flex">
    <h2 style="width: 160px; color: #bdbcba">
      Total:<span style="color: rgb(245, 167, 71)">{{
        (estados.cierre.compras+estados.cierre.gastos).toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        })
      }}</span>
    </h2>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useAppStore } from "../store/app";
//import { useRouter } from "vue-router";
const estados = useAppStore();
import FormularioB from "@/components/Formg.vue";
const currentPage = ref(1);
const itemsPerPage = ref(20);
const search = ref("");
const desserts = ref(estados.gastos);

const filtrof = ref({
  fechai: "",
  fechaf: "",
});

function filtrara() {
  if (!esMismoMes(filtrof.value.fechai, filtrof.value.fechaf)) {
    alert("Solo puedes filtrar el contenido de un solo mes en especifico");
    return;
  }
  console.log(filtrof.value.fechai + "/" + filtrof.value.fechaf);
  if (filtrof.value.fechai > filtrof.value.fechaf) {
    alert(
      "Rango de fecha invalido: quizas la fecha final es inferior a la fecha inicial"
    );
    return;
  }
  estados.getGastos(filtrof.value.fechai, filtrof.value.fechaf);
}

function esMismoMes(fecha1, fecha2) {
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);
  console.log(date1.getMonth());

  return (
    date1.getFullYear() === date2.getFullYear() &&
    fecha1.slice(5, 7) == fecha2.slice(5, 7)
  );
}
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
  return desserts.value.filter(
    (item) => regex.test(item.nombre) || regex.test(item.codigo)
  );
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

watch(
  () => estados.gastos,
  (newVal, oldVal) => {
    desserts.value = newVal;
  }
);

filtrof.value.fechai = estados.hoy();
filtrof.value.fechaf = estados.hoy();
</script>
